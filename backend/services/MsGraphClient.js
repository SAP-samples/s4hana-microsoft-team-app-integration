/**
 * GraphClient.js provides a class offering features for retrieving Microsoft Graph data
 *
 * This class provides calls to the Microsoft Graph API, like requesting a user's profile or photo.
 * Authentication itself is not handled in this class but makes use of the AuthClient.js
 *
 */

const { Client } = require("@microsoft/microsoft-graph-client");
const axios = require("axios");
const uuid = require("uuid");
require("isomorphic-fetch");

class MsGraphClient {
  constructor(token) {
    if (!token || !token.trim()) {
      throw new Error("GraphClient: Invalid token received.");
    }

    this._token = token;

    // Get an Authenticated Microsoft Graph client using the token issued to the user.
    this.graphClient = Client.init({
      authProvider: (done) => {
        done(null, this._token); // First parameter takes an error if you can't get an access token.
      },
    });
  }

  // Get current user's profile
  async getProfile() {
    try {
      return await this.graphClient.api("/me").get();
    } catch (error) {
      return {};
    }
  }

  // Gets current user's photo
  async getPhoto() {
    const graphPhotoEndpoint =
      "https://graph.microsoft.com/v1.0/me/photo/$value";
    const graphRequestParams = {
      method: "GET",
      headers: {
        "Content-Type": "image/png",
        authorization: "bearer " + this._token,
      },
    };

    const response = await fetch(graphPhotoEndpoint, graphRequestParams).catch(
      this.unhandledFetchError
    );

    if (!response || !response.ok) {
      console.error("User Image Not Found!!");
      // Return a Sample Image
      return "https://adaptivecards.io/content/cats/1.png";
    }
    const imageBuffer = await response
      .arrayBuffer()
      .catch(this.unhandledFetchError); // Get image data as raw binary data

    // Convert binary data to an image URL and set the url in state
    const imageUri =
      "data:image/png;base64," + Buffer.from(imageBuffer).toString("base64");
    return imageUri;
  }

  // Get profile details of an Azure AD user via userId (email or graph user id)
  async getUserProfile(userId) {
    return new Promise(async (resolve, reject) => {
      await axios
        .get("https://graph.microsoft.com/v1.0/users/" + userId, {
          headers: {
            "Content-type": "application/json",
            Authorization: "bearer " + this._token,
          },
        })
        .then((response) => {
          // console.log("receiver detais ", response.data.displayName);
          resolve({
            teamsId: response.data.id,
            fullName: response.data.displayName,
            mail: response.data.mail,
            title: response.data.jobTitle,
          });
        })
        .catch((error) => {
          console.log("Error while fetching receiver: ", error);
          if (error.response.status == 404) {
            resolve(null);
          } else {
            reject(error);
          }
        });
    });
  }

  // Get profile details of an Azure AD user via userId (email or graph user id)
  async createChat(user1Email, user2Email) {
    const chat = {
      chatType: "oneOnOne",
      members: [
        {
          "@odata.type": "#microsoft.graph.aadUserConversationMember",
          roles: ["owner"],
          "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${user1Email}')`,
        },
        {
          "@odata.type": "#microsoft.graph.aadUserConversationMember",
          roles: ["owner"],
          "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${user2Email}')`,
        },
      ],
    };

    return await this.graphClient.api("/chats").post(chat);
  }

  async sendMessage(chatId, objData, url, title, boId) {
    const descriptiveFields = [];
    const fieldsToDisplay = ["CreatedBy", "Creation Date", "Priority"];
    for (const i in fieldsToDisplay) {
      let key = fieldsToDisplay[i];
      // if there is no space in a display field b/w words, add it
      const displayField =
        key.indexOf(" ") === -1 ? key.replace(/([A-Z])/g, " $1").trim() : key;
      descriptiveFields.push({
        type: "TextBlock",
        text: `**${displayField}**: ${objData[key]}`,
        wrap: true,
        size: "Medium",
        spacing: "None",
      });
    }

    const newUrl = new URL(url);
    const params = new URLSearchParams(newUrl.search);

    const boUrl = objData.origSysManagementAppURL.replace('objectId', boId.toString());
    params.append("viewMoreDetails", true);
    newUrl.search = params.toString();

    const card = {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.0",
      body: [
        {
          type: "ColumnSet",
          separator: true,
          columns: [
            {
              type: "Column",
              width: "auto",
              items: [
                {
                  type: "ImageSet",
                  images: [
                    {
                      type: "Image",
                      width: "Auto",
                      height: "16px",
                      url:
                        process.env.configServerUrl +
                        "/frontend/images/approved.png",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "TextBlock",
          size: "Large",
          wrap: true,
          weight: "Bolder",
          text: title,
        },
        ...descriptiveFields,
      ],
      actions: [
        {
          type: "Action.OpenUrl",
          title: `Go to ${objData.BusinessObjectName}`,
          url: boUrl,
          data: {
            msteams: {
              type: "task/fetch",
            },
            goToUrl: newUrl,
          },
        },
      ],
    };

    const adaptiveCardId = uuid.v4();
    const chatMessage = {
      subject: null,
      body: {
        contentType: "html",
        content: `<attachment id=${adaptiveCardId}></attachment>`,
      },
      attachments: [
        {
          id: adaptiveCardId,
          contentType: "application/vnd.microsoft.card.adaptive",
          contentUrl: null,
          content: JSON.stringify(card),
          name: null,
          thumbnailUrl: null,
        },
      ],
    };

    try {
      await this.graphClient.api(`/chats/${chatId}/messages`).post(chatMessage);
    } catch (error) {
      console.log("\nError in sending message: ", error, "\n");
    }
  }

  // Get photo of an Azure AD user via userId (email or graph user id)
  async getUserPhoto(userId) {
    const graphPhotoEndpoint = `https://graph.microsoft.com/v1.0/users/${userId}/photos/48x48/$value`;

    const graphRequestParams = {
      method: "GET",
      headers: {
        "Content-Type": "image/jpeg",
        authorization: "bearer " + this._token,
      },
    };

    const response = await fetch(graphPhotoEndpoint, graphRequestParams).catch(
      this.unhandledFetchError
    );

    if (!response || !response.ok) {
      console.error("User Image Not Found!!");
      // Return a Sample Image
      return "";
    }

    // Get image data as raw binary data
    const imageBuffer = await response
      .arrayBuffer()
      .catch(this.unhandledFetchError);

    // Convert binary data to an image URL and set the url in state
    const imageUri =
      "data:image/png;base64," + Buffer.from(imageBuffer).toString("base64");
    return imageUri;
  }

  /**
   * Gets the meeting transcript for the passed meeting Id.
   * @param {string} meetingId Id of the meeting
   * @returns Transcript of meeting if any therwise return empty string.
   */
  async GetMeetingTranscriptionsAsync(meetingId) {
    try {
      var getAllTranscriptsEndpoint = `${process.env.GraphApiEndpoint}/users/${process.env.UserId}/onlineMeetings/${meetingId}/transcripts`;
      const getAllTranscriptsConfig = {
        method: "get",
        url: getAllTranscriptsEndpoint,
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
      };

      var transcripts = (await axios(getAllTranscriptsConfig)).data.value;

      if (transcripts.length > 0 && transcripts != null) {
        var getTranscriptEndpoint = `${getAllTranscriptsEndpoint}/${transcripts[0].id}/content?$format=text/vtt`;
        const getTranscriptConfig = {
          method: "get",
          url: getTranscriptEndpoint,
          headers: {
            Authorization: `Bearer ${this._token}`,
          },
        };

        var transcript = (await axios(getTranscriptConfig)).data;

        return transcript;
      } else {
        return "";
      }
    } catch (ex) {
      console.log(ex);
      return "";
    }
  }
}

module.exports.MsGraphClient = MsGraphClient;

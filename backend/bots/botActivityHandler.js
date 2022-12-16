const {
  TeamsActivityHandler,
  TeamsInfo,
  UserState,
  ConversationState,
  TurnContext,
  CardFactory,
  MessageFactory,
} = require("botbuilder");

const { BlobsStorage } = require("botbuilder-azure-blobs");
const { TokenExchangeHelper } = require("./helpers/TokenExchangeHelper.js");
const AuthManager = require("../services/authManager.js");
const { MsGraphClient } = require("../services/MsGraphClient.js");

require("dotenv").config();
const vttToPlainText = require("../helpers/webVttToPlainText");
const env = process.env;
const adaptivecard = require("./adaptiveCardsHelper");
const helper = require("./botActivityHelper");
const transcriptSummary = require("../helpers/transcriptSummary");

// User Configuration property name
const USER_CONFIGURATION = "userConfigurationProperty";
const conversationReferencesStoragePropertyName = "conversationReferences";
class BotActivityHandler extends TeamsActivityHandler {
  /**
   *
   * @param {UserState} User state to persist configuration settings
   */
  constructor(userState, conversationState, storage, conversationReferences) {
    super();

    if (!conversationState)
      throw new Error(
        "[Notification Bot]: Missing parameter. conversationState is required"
      );
    if (!userState)
      throw new Error(
        "[Notification Bot]: Missing parameter. userState is required"
      );

    if (!conversationReferences)
      throw new Error(
        "[Notification Bot]: Missing parameter. dialog is required"
      );

    this.userConfigurationProperty =
      userState.createProperty(USER_CONFIGURATION);

    // Azure connection name
    this.connectionName = env.connectionName;

    // User and converstaion states
    this.conversationState = conversationState;
    this.userState = userState;
    this.conversationState = conversationState;

    // Azure blob storage
    this._botStorage = storage;

    // converstation references
    this.conversationReferences = conversationReferences;

    this._ssoOAuthHelperGraph = new TokenExchangeHelper(
      env.connectionName,
      storage
    );

    // Azure blob storage
    this._botStorage = storage;

    // Conversation references
    this.conversationReferences = conversationReferences;
    this.onMessage(async (context, next) => {
      await next();
    });

    this.onTurn(async (context, next) => {
      await next();
    });

    /**
     * Handler once the bot is added by a new user sending out a welcome message
     */
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id !== context.activity.recipient.id) {
          // Send out Welcome card
          const welcomeCard = CardFactory.adaptiveCard(
            adaptivecard.welcomeCard()
          );
          await context.sendActivity({ attachments: [welcomeCard] });
          this.addConversationReference(context.activity);
        }
      }
      await next();
    });

    /**
     * Save to conversation reference once the conversation is updated
     * The latest conversation reference is required by the bot to send notifications to the correct receipient
     */
    this.onConversationUpdate(async (context, next) => {
      const conversationReference = TurnContext.getConversationReference(
        context.activity
      );
      const userId = conversationReference.user?.aadObjectId;
      if (userId) {
        try {
          // conversation reference is stored in blob storage container if not yet available
          const storeItems = await this._botStorage.read([
            conversationReferencesStoragePropertyName,
          ]);
          if (!storeItems[conversationReferencesStoragePropertyName]) {
            storeItems[conversationReferencesStoragePropertyName] = {};
          }

          const conversationReferences =
            storeItems[conversationReferencesStoragePropertyName];
          conversationReferences[userId] = conversationReference;

          await this._botStorage.write(storeItems);
          this.addConversationReference(context.activity);
        } catch (error) {
          console.log("conversation update error: ", error);
        }
      }
      await next();
    });

    // Activity handler for meeting end event.
    this.onTeamsMeetingEndEvent(async (meeting, context, next) => {
      if (process.env.TranscriptSummaryEnabled) {
        var meetingDetails = await TeamsInfo.getMeetingInfo(context);
        const token = await AuthManager.getAccessTokenForApplication();
        const client = new MsGraphClient(token);
        var result = await client.GetMeetingTranscriptionsAsync(
          meetingDetails.details.msGraphResourceId
        );

        if (result != "") {
          result = vttToPlainText(String(result));
          var foundIndex = transcriptsDictionary.findIndex(
            (x) => x.id === meetingDetails.details.msGraphResourceId
          );

          if (foundIndex != -1) {
            transcriptsDictionary[foundIndex].data = result;
          } else {
            transcriptsDictionary.push({
              id: meetingDetails.details.msGraphResourceId,
              data: result,
            });
          }

          var summary = await transcriptSummary(result);
          var cardJson = adaptivecard.createTranscriptSummaryCard(
            summary,
            meetingDetails.details.msGraphResourceId,
            process.env.frontendUrl
          );

          await context.sendActivity({
            attachments: [CardFactory.adaptiveCard(cardJson)],
          });
        } else {
          var notFoundCardJson = adaptivecard.createTranscriptNotFoundCard();

          await context.sendActivity({
            attachments: [CardFactory.adaptiveCard(notFoundCardJson)],
          });
        }
      }
    });
  }

  async addConversationReference(activity) {
    const conversationReference =
      TurnContext.getConversationReference(activity);
    this.conversationReferences[conversationReference.user.aadObjectId] =
      conversationReference;
  }

  /**
   * Method allows to retreive a user's conversation reference from the BlogStorage container
   */
  async getConversationReference(userId) {
    try {
      const storeItems = await this._botStorage.read([
        conversationReferencesStoragePropertyName,
      ]);
      if (!storeItems[conversationReferencesStoragePropertyName]) {
        return null;
      }
      const conversationReferences =
        storeItems[conversationReferencesStoragePropertyName];
      const conversationReference = conversationReferences[userId];
      return conversationReference;
    } catch (error) {
      console.log("Error while getting conversation reference: ", error);
      return null;
    }
  }

  async run(context) {
    await super.run(context);

    // Save any state changes. The load hapened during the execution of the dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }

  // Overloaded function. Receives invoke activities with the name 'composeExtension/fetchTask'
  async handleTeamsMessagingExtensionFetchTask(context, action) {
    // Check if the bot is a part of the current conversation
    try {
      await TeamsInfo.getMember(context, context.activity.from.id);
    } catch (error) {
      if (
        error.code === "ServiceError" ||
        error.code === "BotNotInConversationRoster"
      ) {
        return {
          task: {
            type: "continue",
            value: {
              title: "App Installation",
              card: adaptivecard.createJustInTimeInstallCard(),
            },
          },
        };
      }
      throw error;
    }

    if (!context.activity.from.aadObjectId) throw new Error("unknown user");
    if (!action.commandId) throw new Error("unknown command");

    // BANANA: double check this part, but I think its good - same
    // as "launchApp", based on manifest i think
    if (action.commandId === "showDialog") {
      return {
        task: {
          type: "continue",
          value: {
            width: "medium",
            height: "medium",
            title: "Bridge Framework",
            url: env.frontendUrl,
            fallbackUrl: env.frontendFallbackUrl,
          },
        },
      };
    }

    // BANANA: does not exist in manifest
    if (action.commandId === "SignOutCommand") {
      const adapter = context.adapter;
      await adapter.signOutUser(context, this.connectionName);
      return adaptivecard.showSignOutCard();
    }

    return null;
  }

  // BANANA: examine behavior before making changes - its not clear to me what should be modified/added
  async handleTeamsMessagingExtensionSubmitAction(context, action) {
    const data = action.data;

    // default workflow
    if (data.hasOwnProperty("objData")) {
      const botId = process.env.MicrosoftAppId;
      const businessObjectCard = adaptivecard.createBusinessObjectCard(
        data.url,
        botId,
        data.objData,
        data.title
      );

      const attachment = {
        contentType: businessObjectCard.contentType,
        content: businessObjectCard.content,
        preview: businessObjectCard,
      };

      const responseActivity = {
        type: "message",
        attachments: [attachment],
        channelData: {
          onBehalfOf: [
            {
              itemId: 0,
              mentionType: "person",
              mri: context.activity.from.id,
              displayname: context.activity.from.name,
            },
          ],
        },
      };
      await context.sendActivity(responseActivity);
    }

    if (action.data.msteams && action.data.msteams.justInTimeInstall === true) {
      return this.handleTeamsMessagingExtensionFetchTask(context, action);
    }

    if (data.hasOwnProperty("signOut") && data.signOut) {
      const adapter = context.adapter;
      await adapter.signOutUser(context, this.connectionName);
      return adaptivecard.showSignOutCard();
    }

    return {};
  }

  /**
   * Override the TeamsActivityHandler.handleTeamsTaskModuleFetch() method which allows us to handle extension
   * use-cases in which a the botActvitiyHandler is used to provide the content of a custom task module.
   *
   * Avoid local data storage if possible
   */
  async handleTeamsTaskModuleFetch(context, action) {
    let url = "";
    console.log("Data in task module fetch", action.data);
    const data = action.data;

    if (data.getStarted) {
      url = data.goToUrl;
      return {
        task: {
          type: "continue",
          value: {
            width: "medium",
            height: "medium",
            title: "Bridge Framework",
            url: url,
            fallbackUrl: url,
          },
        },
      };
    } else {
      url = this._getTaskModuleUrl(context.activity.replyToId, action);
      return {
        task: {
          type: "continue",
          value: {
            width: "medium",
            height: "medium",
            title: "Action Center",
            url: url,
            fallbackUrl: url,
          },
        },
      };
    }
    // let url = this._getTaskModuleUrl(context.activity.replyToId, action);
  }

  async handleTeamsTaskModuleSubmit(context, action) {
    const data = action.data;

    // default workflow
    if (data.hasOwnProperty("objData")) {
      if (Object.keys(data["objData"]).length === 0) {
        return null;
      }

      const botId = process.env.MicrosoftAppId;
      const businessObjectCard = adaptivecard.createBusinessObjectCard(
        data.url,
        botId,
        data.objData,
        data.title
      );

      const attachment = {
        contentType: businessObjectCard.contentType,
        content: businessObjectCard.content,
        preview: businessObjectCard,
      };

      const responseActivity = {
        type: "message",
        attachments: [attachment],
        channelData: {
          onBehalfOf: [
            {
              itemId: 0,
              mentionType: "person",
              mri: context.activity.from.id,
              displayname: context.activity.from.name,
            },
          ],
        },
      };
      await context.sendActivity(responseActivity);
    } else {
      // approval workflow
      if (data.taskType) {
        if (
          data.taskType ===
          `${data.dataStore.BusinessObjectName.toLowerCase()}Decision`
        ) {
          if (data.taskAction !== "discuss" && data.taskAction !== "close") {
            const cardData = data.dataStore;
            const url = data.dataStore.URL;
            const approvalStatus = data.dataStore.ApprovalStatus;
            const notificationCard = CardFactory.adaptiveCard(
              adaptivecard.NotificationCard(cardData, url, approvalStatus)
            );

            let message = MessageFactory.attachment(notificationCard);
            message.id = data.replyToId;

            await context.updateActivity(message);
          }

          // Sending business object card to the creator
          if (data.taskAction === "discuss") {
            const token = await AuthManager.getAccessToken(data.clientToken);
            const client = new MsGraphClient(token);
            const me = await client.getProfile();
            const chat = await client.createChat(
              me.mail,
              data.dataStore.Forward
            );

            if (data.hasOwnProperty("taskAction")) {
              await client.sendMessage(
                chat.id,
                data.dataStore,
                data.dataStore.URL,
                data.dataStore.TITLE,
                data.dataStore.ObjectId
              );

              await context.sendActivity(
                `A card has been sent to ${data.dataStore.CreatedBy}.`
              );
            }

            return null;
          }

          return null;
        }
      }
      return await super.handleTeamsTaskModuleSubmit(
        context,
        this.handleTeamsTaskModuleSubmit
      );
    }
  }

  /**
   * Override the TeamsActivityHandler.onInvokeActivity() according to Microsoft Teams samples for Single Sign On
   */
  async onInvokeActivity(context) {
    const valueObj = context.activity.value;
    if (valueObj.authentication) {
      const authObj = valueObj.authentication;
      if (authObj.token) {
        // if the token is NOT exchangeable, then do NOT deduplicate requests
        if (await this.tokenIsExchangeable(context)) {
          return await super.onInvokeActivity(context);
        } else {
          const response = {
            status: 412,
          };
          return response;
        }
      }
    }
    return await super.onInvokeActivity(context);
  }

  /**
   * Helper method to get the url for loading the task module
   */
  _getTaskModuleUrl(replyToId, action) {
    const taskType = action.data.origin;
    const payloadData = action.data.dataStore;
    let url = action.data.goToUrl;

    // checking to make sure we don't keep growing url
    let params = new URLSearchParams(url);

    // approval workflow - add on fields if needed
    // also check to make sure url hasn't been made already (i.e. already rejected)
    if (!params.has("taskType") && !params.has("replyToId")) {
      if (payloadData) {
        if (replyToId) {
          url += `&replyToId=${encodeURIComponent(replyToId)}`;
        }

        if (taskType) {
          url += `&taskType=${encodeURIComponent(taskType)}`;
        }

        for (const [key, value] of Object.entries(payloadData)) {
          if (key === "Others") {
            for (const [k, v] of Object.entries(payloadData["Others"])) {
              url += `&${k}=${encodeURIComponent(v)}`;
            }
          } else if (key !== "ReceiverEmailList") {
            // these emails not needed at the moment
            url += `&${key}=${encodeURIComponent(value)}`;
          }
        }
      }
    }

    return url;
  }

  /**
   * Override the TeamsActivityHandler.tokenIsExchangeable() according to Microsoft Teams samples for Single Sign On
   */
  async tokenIsExchangeable(context) {
    let tokenExchangeResponse = null;
    try {
      const valueObj = context.activity.value;
      const tokenExchangeRequest = valueObj.authentication;
      tokenExchangeResponse = await context.adapter.exchangeToken(
        context,
        this.connectionName,
        context.activity.from.id,
        { token: tokenExchangeRequest.token }
      );
    } catch (error) {
      // Ignore exceptions
      // If the token exchange failed for any reason, tokenExchangeResponse above stays null,
      // and hence we send back a failure invoke response to the caller
      console.log("tokenExchange error: ", error);
    }
    if (!tokenExchangeResponse || !tokenExchangeResponse.token) {
      return false;
    }
    return true;
  }

  handleTeamsMessagingExtensionCardButtonClicked(context, cardData) {
    return {};
  }
}

// Initializing Azure blob storage
const storage = new BlobsStorage(
  process.env.MICROSOFT_BLOB_CONNECTION_STRING,
  process.env.MICROSOFT_BLOB_CONTAINER_NAME
);

// Create a new ConversationState instance providing the blobStorage instance
const conversationState = new ConversationState(storage);

// Create a new UserState instance providing the botStorage instance
const userState = new UserState(storage);

const conversationReferences = {};

module.exports = new BotActivityHandler(
  userState,
  conversationState,
  storage,
  conversationReferences
);

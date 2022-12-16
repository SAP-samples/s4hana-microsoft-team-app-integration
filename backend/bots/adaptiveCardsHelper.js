const { CardFactory } = require("botbuilder");
const env = process.env;

class AdaptiveCardsHelper {
  showSignOutCard() {
    const card = CardFactory.adaptiveCard({
      version: "1.0.0",
      type: "AdaptiveCard",
      body: [
        {
          type: "TextBlock",
          text: "You have been signed out.",
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Close",
          data: {
            key: "Close",
          },
        },
      ],
    });

    return {
      task: {
        type: "continue",
        value: {
          card: card,
          heigth: 200,
          width: 400,
          title: "Signout",
        },
      },
    };
  }

  showCardThenClose(title, text) {
    const card = CardFactory.adaptiveCard({
      version: "1.0.0",
      type: "AdaptiveCard",
      body: [
        {
          type: "TextBlock",
          text: text,
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Close",
          data: {
            key: "Close",
          },
        },
      ],
    });

    return {
      task: {
        type: "continue",
        value: {
          card: card,
          heigth: 200,
          width: 400,
          title: title,
        },
      },
    };
  }

  showActionNotSupportedCard() {
    const card = CardFactory.adaptiveCard({
      version: "1.0.0",
      type: "AdaptiveCard",
      body: [
        {
          type: "TextBlock",
          text: "This action is not supported yet.",
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Close",
          data: {
            key: "Close",
          },
        },
      ],
    });

    return {
      task: {
        type: "continue",
        value: {
          card: card,
          heigth: 200,
          width: 400,
          title: "Not Supported",
        },
      },
    };
  }

  createJustInTimeInstallCard = () => {
    return {
      contentType: "application/vnd.microsoft.card.adaptive",
      content: {
        type: "AdaptiveCard",
        version: "1.0",
        body: [
          {
            type: "TextBlock",
            text: "Please click **Continue** to install the app in this conversation",
            wrap: true,
          },
        ],
        actions: [
          {
            type: "Action.Submit",
            title: "Continue",
            data: { msteams: { justInTimeInstall: true } },
          },
        ],
      },
    };
  };

  createBusinessObjectCard = (url, botId, objData, title) => {
    const column1 = [];
    const column2 = [];
    let i = 1;
    for (const property in objData) {
      const textBlock = [
        {
          type: "TextBlock",
          text: property + ":",
          wrap: true,
          weight: "Bolder",
        },
        {
          type: "TextBlock",
          text: objData[property],
          wrap: true,
          spacing: "None",
        },
      ];
      if (i % 2 === 1) {
        column1.push(...textBlock);
      } else {
        column2.push(...textBlock);
      }
      i += 1;
    }

    const newUrl = new URL(url);
    const params = new URLSearchParams(newUrl.search);
    params.append("viewMoreDetails", true);
    newUrl.search = params.toString();

    const card = CardFactory.adaptiveCard({
      type: "AdaptiveCard",
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
                  type: "Image",
                  url: env.configServerUrl + "/frontend/images/bridge-logo.png",
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
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: column1,
            },
            {
              type: "Column",
              width: "stretch",
              items: column2,
            },
          ],
        },
      ],
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.4",
      actions: [
        {
          type: "Action.Submit",
          title: "View More Details",
          data: {
            msteams: {
              type: "task/fetch",
            },
            goToUrl: newUrl,
          },
        },
      ],
    });
    return card;
  };

  createTranscriptSummaryCard = (summary, meetingId, frontendUrl) => {
    var summaryCardJson = {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.4",
      type: "AdaptiveCard",
      body: [
        {
          type: "TextBlock",
          text: "Here is a summary of the latest meeting:",
          weight: "Bolder",
          size: "Large",
        },
        {
          type: "TextBlock",
          text: summary,
          size: "Medium",
          wrap: true,
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "View Full Transcript",
          data: {
            msteams: {
              type: "task/fetch",
            },
            goToUrl: `${frontendUrl}/transcript?meetingId=${meetingId}`,
          },
        },
      ],
    };
    return summaryCardJson;
  };

  createTranscriptNotFoundCard = () => {
    var notFoundCardJson = {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.5",
      type: "AdaptiveCard",
      body: [
        {
          type: "TextBlock",
          text: "Transcript not found for this meeting.",
          weight: "Bolder",
          size: "Large",
        },
      ],
    };
    return notFoundCardJson;
  };

  async getTicketDetailCard(ticket) {
    const adaptive = CardFactory.adaptiveCard({
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.3",
      body: [
        {
          type: "TextBlock",
          text: ticket.Name,
          size: "large",
        },
        {
          type: "TextBlock",
          text: "ID: " + ticket.ID,
        },
        {
          type: "TextBlock",
          text: "Buyer Name: " + ticket.BuyerMainContactPartyName,
        },
      ],

      actions: [
        {
          type: "Action.OpenUrl",
          title: "Open Ticket",
          url: env.c4cTenantUrl,
        },
      ],
    });
    return adaptive;
  }

  welcomeCard = function () {
    return {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.0",
      body: [
        {
          type: "Container",
          height: "stretch",
          verticalContentAlignment: "top",
          items: [
            {
              type: "Image",
              url: env.configServerUrl + "/frontend/images/bridge-logo.png",
            },
            {
              type: "TextBlock",
              spacing: "medium",
              size: "large",
              weight: "bolder",
              text: "Hi there! Welcome to the Bridge Framework.",
              wrap: true,
              maxLines: 0,
            },
          ],
        },
        {
          type: "Container",
          items: [],
        },
        {
          type: "Container",
          height: "stretch",
          verticalContentAlignment: "center",
          items: [
            {
              type: "TextBlock",
              spacing: "medium",
              size: "default",
              text: "- This **_read-only_** bot is your personal space to receive notifications from **SAP**. \r- You can launch Bridge Framework from the list of messaging extensions in any of your chats.",
              wrap: true,
              maxLines: 0,
            },
          ],
        },
        {
          type: "Container",
          items: [],
        },
        {
          type: "Container",
          height: "stretch",
          verticalContentAlignment: "center",
          items: [
            {
              type: "TextBlock",
              spacing: "medium",
              size: "medium",
              weight: "bolder",
              text: "Key Features:",
              wrap: true,
              maxLines: 0,
            },
            {
              type: "TextBlock",
              spacing: "medium",
              size: "default",
              text: "- Bring SAP business objects into Teams for collaboration. \r- Bring SAP approval workflows into Teams.",
              wrap: true,
              maxLines: 0,
            },
          ],
        },
        {
          type: "Container",
          items: [],
        },
        {
          type: "Container",
          height: "stretch",
          verticalContentAlignment: "bottom",
          items: [
            {
              type: "TextBlock",
              spacing: "medium",
              size: "medium",
              weight: "bolder",
              text: "Get started:",
              wrap: true,
              maxLines: 0,
            },
            {
              type: "TextBlock",
              spacing: "medium",
              size: "default",
              text: "To take a quick peek, use **Get Started** button below.",
              wrap: true,
              maxLines: 0,
            },
          ],
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Get Started",
          data: {
            msteams: {
              type: "task/fetch",
            },
            getStarted: true,
            goToUrl: env.frontendUrl,
          },
        },
      ],
    };
  };

  NotificationCard = function (cardData, url, approvalStatus) {
    const newUrl = new URL(url);
    const params = new URLSearchParams(newUrl.search);

    if (!params.has("notification")) {
      params.append("notification", true);
    }
    newUrl.search = params.toString();

    let actions = [
      {
        type: "Action.Submit",
        title: "View More Details",
        data: {
          msteams: {
            type: "task/fetch",
          },
          origin: `${cardData.BusinessObjectName.toLowerCase()}Decision`,
          action: "viewDetails",
          dataStore: cardData,
          goToUrl: newUrl,
        },
      },
    ];

    let otherFields = [];

    // we lose the "Others" field in url storage - need to re-create it
    if (cardData.Others === undefined) {
      cardData.Others = {
        "Creation Date": cardData["Creation Date"],
        Priority: cardData["Priority"],
      };
    }
    for (let key in cardData.Others) {
      otherFields.push({
        type: "TextBlock",
        text: `**${key}:** ${cardData.Others[key]}`,
        size: "Medium",
        wrap: true,
        spacing: "None",
      });
    }

    return {
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.0",
      body: [
        {
          type: "TextBlock",
          text: `${cardData.BusinessObjectName}# ${cardData.ObjectId}`,
          weight: "Bolder",
          size: "ExtraLarge",
          isVisible:
            approvalStatus !== "0001" && approvalStatus !== "0002"
              ? true
              : false,
        },
        {
          type: "ColumnSet",
          isVisible: approvalStatus === "0001" ? true : false,
          columns: [
            {
              type: "Column",
              verticalContentAlignment: "Center",
              width: "auto",
              items: [
                {
                  type: "Image",
                  url: env.configServerUrl + "/frontend/images/approved.png",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: `${cardData.BusinessObjectName}# ${cardData.ObjectId} Approved`,
                  wrap: true,
                  weight: "Bolder",
                  size: "ExtraLarge",
                },
              ],
            },
          ],
        },
        {
          type: "ColumnSet",
          isVisible: approvalStatus === "0002" ? true : false,
          columns: [
            {
              type: "Column",
              verticalContentAlignment: "Center",
              width: "auto",
              items: [
                {
                  type: "Image",
                  url: env.configServerUrl + "/frontend/images/rejected.png",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: `${cardData.BusinessObjectName}# ${cardData.ObjectId} Rejected`,
                  wrap: true,
                  weight: "Bolder",
                  size: "ExtraLarge",
                },
              ],
            },
          ],
        },
        {
          type: "TextBlock",
          text: `**Description:** ${cardData.Description}`,
          size: "Medium",
          wrap: true,
        },
        {
          type: "TextBlock",
          text: "**Created By** : " + cardData.CreatedBy,
          size: "Medium",
          wrap: true,
          spacing: "None",
        },
        ...otherFields,
      ],
      actions: actions,
    };
  };
}

module.exports = new AdaptiveCardsHelper();

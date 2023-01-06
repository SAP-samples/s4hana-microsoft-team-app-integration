const Router = require("express");

const { MsGraphClient } = require("../services/MsGraphClient");
const AuthManager = require("../services/authManager");
const { MessageFactory, CardFactory } = require("botbuilder");

const adaptivecard = require("../bots/adaptiveCardsHelper.js");
const botActivityHandler = require("../bots/botActivityHandler");
const botAdapter = require("../bots/botAdapter");
const ConfigInterface = require("../helpers/configInterface");

const notificationRouter = Router();

// Push notification endpoint
notificationRouter.post("/notifyUser", async (req, res) => {
  console.log("\nData received for notification:\n", req.body);

  // TODO: Modify the ABAP job to send the USER_EMAIL as a list of emails rather than string!
  let eventData = { ...req.body };
  eventData["USER_EMAIL"] = eventData["USER_EMAIL"].split(",");
  console.log("modified evenet data:", eventData);

  // Obtaining notification config from the config server
  const notificationConfig = await ConfigInterface.getInterfaceMappingConfig(
    "/notification/notificationConfig.json",
    req.logger
  );

  // Obtaining ObjectScreenConfig/detail screen config

  const frontendPageConfig = await ConfigInterface.getInterfaceMappingConfig(
    notificationConfig.DetailScreenConfig,
    req.logger
  );

  // Obtaining app level token to fetch user details
  const token = await AuthManager.getAccessTokenForApplication();
  const client = new MsGraphClient(token);

  // Delivering notification to all recepients in the notification config

  // TODO: Modify the ABAP job to send the USER_EMAIL as a list of emails rather than string!
  for (email of eventData[notificationConfig.fields.ReceiverEmailList]) {
    // Get user profile
    const receiver = await client.getUserProfile(email);

    if (!receiver) {
      console.error(`Email ${email} not found in Azure AD!`);
    }

    // Get conversation reference for the user
    const conversationReference =
      await botActivityHandler.getConversationReference(receiver.teamsId);

    console.log("Conversation reference: ", conversationReference);
    if (conversationReference) {
      // Refine all the fields of the event
      let cardData = { Others: {} };
      cardData["BusinessObjectName"] = notificationConfig.BusinessObjectName;

      for (let key in notificationConfig.fields) {
        if (key === "Others") {
          // get all the optional notification data
          for (let oth in notificationConfig.fields["Others"]) {
            if (
              req.body.hasOwnProperty(notificationConfig.fields["Others"][oth])
            ) {
              cardData.Others[oth] =
                req.body[notificationConfig.fields["Others"][oth]];
            }
          }
        } else {
          // get all the required notification data
          // TODO: Error handling for required fields
          cardData[key] = req.body[notificationConfig.fields[key]];
          cardData["origSysManagementAppURL"] = notificationConfig.origSysManagementAppURL;
        }
      }

      cardData["Forward"] = req.body.FORWARD;

      const detailPageUrl =
        process.env.frontendUrl +
        `/${frontendPageConfig.system}/${frontendPageConfig.interface}/${frontendPageConfig.businessObject}Object?${frontendPageConfig.businessObject}=${cardData.ObjectId}`;

      await botAdapter.continueConversation(
        conversationReference,
        async (turnContext) => {
          const notificationCard = CardFactory.adaptiveCard(
            adaptivecard.NotificationCard(cardData, detailPageUrl, "0000")
          );
          try {
            await turnContext.sendActivity(
              MessageFactory.attachment(notificationCard)
            );
          } catch (error) {
            console.log("\nTurn context error: ", error);
          }
        }
      );

      res.status(200).send("Notification sent!");
    } else {
      res
        .status(404)
        .send("\nNo ConversationReference found for user " + receiver.fullName);
    }
  }
});

module.exports = notificationRouter;

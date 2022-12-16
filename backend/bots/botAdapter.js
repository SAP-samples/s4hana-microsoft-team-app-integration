const { BotFrameworkAdapter } = require('botbuilder');

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const botAdapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

botAdapter.onTurnError = async (context, error) => {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights. See https://aka.ms/bottelemetry for telemetry
  //       configuration instructions.
  console.error(`\n [onTurnError] unhandled error: ${error}`);
  console.log('Error is', error);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    'OnTurnError Trace',
    `${error}`,
    'https://www.botframework.com/schemas/error',
    'TurnError'
  );

  if (error.code === 'BadRequest') {
    await context.sendActivity('This can be used in a one-on-one chat [excluding chat with a bot] or a group chat. Please try exporting your messages again or contact your administrator.');
  } else {
    await context.sendActivity('Messaging extension encountered an error or bug. To continue to run this messaging extension, please contact your administrator.');
  }
};

module.exports = botAdapter;
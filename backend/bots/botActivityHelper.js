class BotActivityHelper {
  async checkToken(context, action, connection) {
    const magicCode =
      action.state && Number.isInteger(Number(action.state))
        ? action.state
        : "";

    const tokenResponse = await context.adapter.getUserToken(
      context,
      connection,
      magicCode
    );
    return tokenResponse;
  }
}

module.exports = new BotActivityHelper();

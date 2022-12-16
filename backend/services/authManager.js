require("dotenv").config();
const env = process.env;
const msal = require("@azure/msal-node");
const axios = require("axios");

class AuthManager {
  constructor() {
    // Azure Active Directory tenant id
    this.aadTenantId = env.MicrosoftTenantId;

    // Application registration id and secret
    this.appId = env.MicrosoftAppId;
    this.appSecret = env.MicrosoftAppPassword;
  }

  /**-------------------Principal Propagation----------------------- */

  getBtpAccessTokenWithTeamsAuthToken(teamsAuthToken) {
    return this.getAzureAdAccessTokenForBtpSamlAssertion(teamsAuthToken)
      .then((azureAdAccessToken) =>
        this.getSamlAssertionOnBehalfOfSapBtp(azureAdAccessToken)
      )
      .then((samlAssertion) => this.getAccessTokenFromSapBtp(samlAssertion));
  }

  getBtpXsuaaAccessTokenWithTeamsAuthToken(teamsAuthToken) {
    console.log("Teams token received in auth manager", teamsAuthToken);
    return this.getAzureAdAccessTokenForBtpSamlAssertion(teamsAuthToken)
      .then((azureAdAccessToken) =>
        this.getSamlAssertionOnBehalfOfSapBtp(azureAdAccessToken)
      )
      .then((samlAssertion) =>
        this.getAccessTokenFromSapBtpXsuaa(samlAssertion)
      );
  }

  getGraphAccessTokenWithTeamsAuthToken(teamsAuthToken) {
    return this.getAzureAdAccessTokenForBtpSamlAssertion(teamsAuthToken)
      .then((azureAdAccessToken) =>
        this.getSamlAssertionOnBehalfOfSapBtp(azureAdAccessToken)
      )
      .then((samlAssertion) => this.getAccessTokenFromSapGraph(samlAssertion));
  }

  getAzureAdAccessTokenForBtpSamlAssertion(teamsAuthToken) {
    console.log(
      "Teams token in getAzureAdAccessTokenForBtpSamlAssertion",
      teamsAuthToken
    );
    console.log(
      "App details:",
      process.env.MicrosoftTenantId,
      process.env.MicrosoftAppId,
      process.env.MicrosoftAppPassword
    );
    return new Promise((resolve, reject) => {
      const url = `https://login.microsoftonline.com/${process.env.MicrosoftTenantId}/oauth2/v2.0/token`;
      const params = new URLSearchParams({
        client_id: process.env.MicrosoftAppId,
        client_secret: process.env.MicrosoftAppPassword,
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: teamsAuthToken,
        requested_token_use: "on_behalf_of",
        scope: process.env.samlScope,
      });
      const httpConfig = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log("getAzureAdAccessTokenForBtpSamlAssertion error", error);
          reject(error);
        });
    });
  }

  getSamlAssertionOnBehalfOfSapBtp(accessToken) {
    return new Promise((resolve, reject) => {
      const url = `https://login.microsoftonline.com/${process.env.MicrosoftTenantId}/oauth2/token`;
      const params = new URLSearchParams({
        client_id: process.env.MicrosoftAppId,
        client_secret: process.env.MicrosoftAppPassword,
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: accessToken,
        requested_token_use: "on_behalf_of",
        requested_token_type: "urn:ietf:params:oauth:token-type:saml2",
        resource: process.env.samlResourceUrl,
      });
      const httpConfig = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log("getSamlAssertionOnBehalfOfSapBtp", error);
          reject(error);
        });
    });
  }

  getAccessTokenFromSapBtp(samlAssertion) {
    return new Promise((resolve, reject) => {
      const url = `${process.env.samlResourceUrl}/oauth/token/alias/${process.env.samlAlias}`;
      const params = new URLSearchParams({
        assertion: samlAssertion,
        grant_type: "urn:ietf:params:oauth:grant-type:saml2-bearer",
      });
      const httpConfig = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: process.env.iFlowClientId,
          password: process.env.iFlowClientSecret,
        },
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log("getAccessTokenFromSapBtp error", error);
          reject(error);
        });
    });
  }

  getAccessTokenFromSapBtpXsuaa(samlAssertion) {
    return new Promise((resolve, reject) => {
      const url = `${process.env.samlResourceUrl}/oauth/token/alias/${process.env.samlAlias}`;
      const params = new URLSearchParams({
        assertion: samlAssertion,
        grant_type: "urn:ietf:params:oauth:grant-type:saml2-bearer",
      });
      const httpConfig = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: process.env.xsuaaClientId,
          password: process.env.xsuaaClientSecret,
        },
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log("getAccessTokenFromSapBtpXsuaa error", error);
          reject(error);
        });
    });
  }

  getAccessTokenFromSapGraph(samlAssertion) {
    return new Promise((resolve, reject) => {
      const url = `${process.env.samlResourceUrl}/oauth/token/alias/${process.env.samlAlias}`;
      const params = new URLSearchParams({
        assertion: samlAssertion,
        grant_type: "urn:ietf:params:oauth:grant-type:saml2-bearer",
      });
      const httpConfig = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: process.env.graphClientId,
          password: process.env.graphClientSecret,
        },
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log("getAccessTokenFromSapGraph error", error);
          reject(error);
        });
    });
  }

  /**-------------------Teams Auth----------------------- */

  /**
   * This method allows to request an OAuth token for Microsoft Graph access using application permissions
   *
   * It allows us to obtain an applicaton access token with application permissions. Therefor no
   * user context or Microsoft Teams session context is required but the resulting OAuth token contains the
   * Microsoft Graph permissions granted on appliation level. This is required for scenarios in which a user
   * context is not available e.g. when a notification arrives and the Azure Id of the receiver and
   * sender need to be read from Microsoft Graph by the application before sending out the notification.
   * Whereas delegate permissions should be preferred wherever possible, in this case no alternative
   * approach can be used.
   *
   */
  async getAccessTokenForApplication() {
    const data = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://graph.microsoft.com/.default",
      client_id: this.appId,
      client_secret: this.appSecret,
    });

    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          "https://login.microsoftonline.com/" +
            this.aadTenantId +
            "/oauth2/v2.0/token",
          data,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getAccessToken = async (req) => {
    // console.log("client token in get access token: ", req);

    const token = req;
    const msalClient = new msal.ConfidentialClientApplication({
      auth: {
        clientId: this.appId,
        clientSecret: this.appSecret,
      },
    });

    return new Promise((resolve, reject) => {
      const scopes = [
        "https://graph.microsoft.com/User.Read email offline_access openid profile Chat.Create Chat.ReadWrite Chat.Read",
      ];
      msalClient
        .acquireTokenOnBehalfOf({
          authority: `https://login.microsoftonline.com/${this.aadTenantId}`,
          oboAssertion: token,
          scopes: scopes,
          skipCache: true,
        })
        .then((result) => {
          console.log("auth token received");
          resolve(result.accessToken);
        })
        .catch((error) => {
          console.log("\nerror in getAccessToken: ", error, "\n");
          reject({ error: error.errorCode });
        });
    });
  };

  async getAccessTokenForGraphAccess(req) {
    return new Promise((resolve, reject) => {
      const token = "";
      const scopes = [
        "User.Read",
        "email",
        "offline_access",
        "openid",
        "profile",
        "User.ReadBasicAll",
      ];
      const url = `https://login.microsoftonline.com/${this.aadTenantId}/oauth2/v2.0/token`;
      const params = {
        client_id: this.appId,
        client_secret: this.appSecret,
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: token,
        requested_token_use: "on_behalf_of",
        scope: scopes.join(" "),
      };

      fetch(url, {
        method: "POST",
        body: new URLSearchParams(params),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((result) => {
        if (result.status !== 200) {
          result.json().then((json) => {
            reject({ error: json.error });
          });
        } else {
          result.json().then(async (json) => {
            resolve(json.access_token);
          });
        }
      });
    });
  }
}
module.exports = new AuthManager();

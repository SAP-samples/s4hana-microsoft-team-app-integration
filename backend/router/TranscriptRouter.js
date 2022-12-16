const Router = require("express");

const { MsGraphClient } = require("../services/MsGraphClient");
const vttToPlainText = require("../helpers/webVttToPlainText");
const AuthManager = require("../services/authManager");

const transcriptRouter = Router();

transcriptRouter.get("/", async (req, res) => {
  const token = await AuthManager.getAccessTokenForApplication();
  const client = new MsGraphClient(token);
  var transcript = "Transcript not found.";
  if (req.query?.meetingId) {
    var foundIndex = transcriptsDictionary.findIndex(
      (x) => x.id === req.query?.meetingId
    );

    if (foundIndex != -1) {
      transcript = transcriptsDictionary[foundIndex].data;
    } else {
      var result = await client.GetMeetingTranscriptionsAsync(
        req.query?.meetingId
      );
      if (result != "") {
        result = vttToPlainText(result);
        transcriptsDictionary.push({
          id: req.query?.meetingId,
          data: result,
        });

        transcript = result;
      }
    }
  }
  res.send(JSON.stringify({ result: transcript }));
});

module.exports = transcriptRouter;

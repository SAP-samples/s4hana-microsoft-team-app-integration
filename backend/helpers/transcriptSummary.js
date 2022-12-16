const transcriptSummary = async (data) => {
  try {
    const response = await fetch(process.env.TranscriptSummaryModelEndpoint, {
      headers: {
        Authorization: `Bearer ${process.env.TranscriptSummaryModelAPIKey}`,
      },
      method: "POST",
      body: JSON.stringify({ inputs: data }),
    });
    const result = await response.json();
    return result[0].summary_text;
  } catch (error) {
    console.error(error);
    return "There was a problem generating your summary.";
  }
};

module.exports = transcriptSummary;

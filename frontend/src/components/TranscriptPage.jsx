import { Box, Text, Segment, Flex } from "@fluentui/react-northstar";
import { useEffect, useState } from "react";
import * as helper from "./helpers";
import Loader from "./Loader";

const TranscriptPage = (props) => {
  const [transcript, setTranscript] = useState("No Transcript Found");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;
    const url = `${props.baseBackendUrl}/transcript?${searchParams.toString()}`;
    helper.getData(url, props.authToken).then((data) => {
      if (data.result !== "") {
        setTranscript(data.result);
      }
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Box
        styles={{
          position: "sticky",
          top: "0",
          zIndex: "1",
          boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Segment styles={{ padding: "5px" }}>
          <Flex gap="gap.small" vAlign="center" hAlign="start">
            <Text
              styles={{ paddingLeft: "15px" }}
              size="large"
              weight="bold"
              content="Your Meeting Transcript"
            />
          </Flex>
        </Segment>
      </Box>
      {loading ? (
        <Loader headerHeight={0} />
      ) : (
        <Box styles={{ padding: "30px" }}>
          <Text
            styles={{ whiteSpace: "pre-line", lineHeight: "200%" }}
            content={transcript}
          />
        </Box>
      )}
    </>
  );
};

export default TranscriptPage;

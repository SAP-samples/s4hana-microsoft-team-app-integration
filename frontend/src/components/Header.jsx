import {
  Button,
  Box,
  ChevronStartIcon,
  Flex,
  Text,
  Segment,
} from "@fluentui/react-northstar";
import { useNavigate } from "react-router-dom";
import { useRef, forwardRef } from "react";

/**
 * The Header component automatically appears on all object and table pages. It
 * contains a title and optionally (depending on the viewMoreDetails query
 * parameter) a back button. The back button functions like the back button on a
 * browser, so it will not work on the first page that is opened. 
 */

const Header = forwardRef((props, ref) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const searchParams = useRef(new URLSearchParams(window.location.search));

  /**
   * The query parameter viewMoreDetails will be set to true when the task
   * module is opened by clicking the "View More Details" button on an adaptive
   * card. When this query parameter is true it will prevent the back button
   * from appearing in the task module's header. This will prevent users from
   * unintentionally navigating away from the object they are intending to
   * review.
   **/
  return (
    <Box
      styles={{
        position: "sticky",
        top: "0",
        zIndex: "1",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
      }}
      ref={ref}
    >
      <Segment styles={{ padding: "5px" }}>
        {searchParams.current.get("viewMoreDetails") === "true" || searchParams.current.get("notification") === "true" ? (
          <Flex gap="gap.small" vAlign="center" hAlign="start">
            <Text
              styles={{ paddingLeft: "15px" }}
              size="large"
              weight="bold"
              content={props.title}
            />
          </Flex>
        ) : (
          <Flex gap="gap.small" vAlign="center" hAlign="start">
            <Box styles={{ width: "80px" }}>
              <Button
                text
                fluid
                id="ArrowLeftIcon"
                icon={<ChevronStartIcon />}
                content={
                  <Text size="medium" weight="regular" content="Back"></Text>
                }
                onClick={handleBackClick}
              />
            </Box>
            <Text size="medium" content="|" />
            <Text size="large" weight="bold" content={props.title} />
          </Flex>
        )}
      </Segment>
    </Box>
  );
});

export default Header;

import { Box, Button as MSButton } from "@fluentui/react-northstar";

const Button = (props) => {
  const onClick = () => {
    switch (props.action.type) {
      case "OpenURL":
        const finalUrl = props.replaceWithConfigState(props.action.url);
        window.open(finalUrl);
        break;
      default:
        console.log("Unsupported action");
        break;
    }
  };

  return (
    <Box styles={{ padding: "30px" }}>
      <MSButton
        primary
        content={props.content}
        onClick={onClick}
      />
    </Box>
  );
};

export default Button;

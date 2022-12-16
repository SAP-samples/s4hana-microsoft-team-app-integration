import { Loader as MSLoader, Box, Text } from "@fluentui/react-northstar";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";

/**
 * This loader component shades the entire page, as such it is not appropriate
 * for all loading situations. The fluentui loader should be used in situations
 * that don't need the entire page to reflect a loading state.
 */

const Loader = (props) => {
  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }));

  const classes = useStyles();

  return (
    <Box>
      <Box>
        <Backdrop
          className={classes.backdrop}
          open={true}
          style={{ marginTop: props.headerHeight ?? 0 }}
        >
          <MSLoader label="Loading" />
        </Backdrop>
      </Box>
    </Box>
  );
};

export default Loader;

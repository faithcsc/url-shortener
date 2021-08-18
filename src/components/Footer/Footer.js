import React from "react";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

function Footer() {
  return (
    <Box m={2}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"© "}
        <Link color="inherit" href="https://faithchia.me">
          Faith Chia
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}

export default Footer;

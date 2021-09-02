import React from "react";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

function Footer() {
  return (
    <Box m={2}>
      <Typography variant="body1" color="textSecondary" align="center">
        {"© "}
        <Link color="inherit" href="https://faithchia.me">
          Faith Chia
        </Link>{" "}
        {new Date().getFullYear()}
        {" | "}{" "}
        <Link color="inherit" href="https://linkedin.com/in/faithchiasuchi">
          LinkedIn
        </Link>
        {" | "}{" "}
        <Link color="inherit" href="https://github.com/faithcsc">
          Github
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;

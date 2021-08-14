import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { slide as Menu } from "react-burger-menu";
import AuthButton from "./AuthButton";
import LinksButton from "./LinksButton";
import config from "../../shared/config";
import "../../index.css";

const { isMobile } = config;
const totalWidth = 12;
const logoWidth = isMobile ? 10 : 6;
const sideWidth = (totalWidth - logoWidth) * 0.5;
const headerHeight = "6rem";

function Header() {
  return (
    <Box p={2} height={headerHeight}>
      <Grid container>
        <Grid item xs={totalWidth} sm={sideWidth} className="text left"></Grid>
        <Grid item xs={totalWidth} sm={logoWidth}>
          <Logo />
        </Grid>
        <Grid item xs={totalWidth} sm={sideWidth} height={headerHeight}>
          <MenuDesktop />
          <MenuMobile />
        </Grid>
      </Grid>
    </Box>
  );
}

function MenuDesktop() {
  if (!isMobile) {
    return (
      <Grid container className="text right">
        <LinksButton />
        <AuthButton />
      </Grid>
    );
  }
  return "";
}

class MenuMobile extends React.Component {
  showSettings(event) {
    event.preventDefault();
  }

  render() {
    if (isMobile) {
      return (
        <Menu right width="200px">
          <AuthButton />
          <LinksButton />
        </Menu>
      );
    }
    return "";
  }
}

function Logo() {
  return (
    <Grid>
      <Typography className="text center" variant="h5">
        <Link
          color="inherit"
          href={window.location.origin}
          style={{ textDecoration: "none" }}
        >
          🔗 URL shortener
        </Link>
      </Typography>
      <Typography className="text center">
        Make short, totally not suspicious links.
      </Typography>
    </Grid>
  );
}

export default Header;

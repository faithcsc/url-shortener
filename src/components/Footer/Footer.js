import React from "react";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

function Footer() {
  return (
    <Box m={2}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"© "}
        <Link color="inherit" href={window.location.origin}>
          Faith Chia
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    </Box>
    // <footer class="page-footer font-small blue footer">
    //   <div class="footer-copyright text-center py-3">
    //     Made with ❤ by
    //     <a
    //       href="https://about.me/adewaletoluwani"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="author"
    //     >
    //       {" "}
    //       Toluwani Adewale
    //     </a>
    //   </div>
    // </footer>
  );
}

export default Footer;

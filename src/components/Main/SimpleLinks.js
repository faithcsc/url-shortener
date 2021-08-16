import React from "react";
import { withAuth0 } from "@auth0/auth0-react";

import {
  requestDeleteShortUrl,
  onSuccessfulLogin,
  retrieveUserLinks,
} from "../../shared/requests";

import Loading from "./Loading";

import { DataGrid } from "@material-ui/data-grid";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

import DeleteButton from "./DeleteButton";
import LinkWithCopy from "./LinkWithCopy";
import SearchBar from "material-ui-search-bar";
import config from "../../shared/config";
import "../../index.css";
const { isMobile } = config;

// DISPLAY & FORMATTING
const linkDateDisplayOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const formatUserlinks = (rawlinkdata) => {
  const rows = rawlinkdata.map((item, index) => {
    const id = index;
    const shortUrl = item.short;
    const displayShortUrl = window.location.origin + "/" + item.short;
    const longUrl = item.long;
    const displayLongUrl = longUrl.startsWith("//")
      ? longUrl.substr(2)
      : longUrl;
    const numClicks = item.analytics.length;
    const originalDate = item.createdOn;
    const formattedDate = new Date(item.createdOn).toLocaleDateString(
      undefined,
      linkDateDisplayOptions
    );
    return {
      id,
      shortUrl,
      displayShortUrl,
      longUrl,
      displayLongUrl,
      numClicks,
      formattedDate,
      originalDate,
    };
  });

  rows.sort((a, b) => {
    if (a.originalDate > b.originalDate) return -1;
    if (a.originalDate < b.originalDate) return 1;
    return 0;
  });

  return rows;
};

const truncateLink = (url) =>
  url.length > 15 ? url.substring(0, 5) + "..." + url.slice(-7) : url;

class SimpleLinks extends React.Component {
  constructor() {
    super();
    this.deleteShortlink = this.deleteShortlink.bind(this);
    this.TableMobile = this.TableMobile.bind(this);
    this.state = {
      userlinks: [],
      cookies: {},
      formattedUserlinks: undefined,
      formattedFilteredUserlinks: undefined,
      searched: "",
      columns: [
        {
          field: "shortUrl",
          minWidth: 200,
          flex: 0.3,
          headerName: "Short URL",
          renderCell: (params) => {
            const displayShortUrl = params.row.displayShortUrl;
            const truncatedUrl = isMobile
              ? truncateLink(displayShortUrl)
              : displayShortUrl;
            return (
              <LinkWithCopy
                displayLink={displayShortUrl}
                actualLink={displayShortUrl}
                truncatedLink={truncatedUrl}
              />
            );
          },
        },
        {
          field: "longUrl",
          minWidth: 200,
          flex: 0.3,
          headerName: "Original",
          renderCell: (params) => {
            const displayLongUrl = params.row.displayLongUrl;
            const longUrl = params.row.longUrl;
            const truncatedUrl = isMobile
              ? truncateLink(displayLongUrl)
              : displayLongUrl;
            return (
              <LinkWithCopy
                displayLink={displayLongUrl}
                actualLink={longUrl}
                truncatedLink={truncatedUrl}
              />
            );
          },
        },
        {
          field: "numClicks",
          headerName: "Clicks",
          minWidth: 100,
          renderCell: (params) => (
            <Grid item className="text left">
              {params.row.numClicks}
            </Grid>
          ),
        },
        {
          field: "formattedDate",
          headerName: "Date created",
          flex: 0.15,
          renderCell: (params) => (
            <Grid container className="text left">
              {params.row.formattedDate}
            </Grid>
          ),
          sortComparator: (v1, v2, param1, param2) =>
            param1.api.getRow(param1.id).originalDate -
            param2.api.getRow(param2.id).originalDate,
        },
        {
          field: "action",
          headerName: "Action",
          flex: 0.1,
          renderCell: (params) => {
            const displayShortUrl = params.row.displayShortUrl;
            return (
              <DeleteButton
                handleClick={this.deleteShortlink}
                displayShortUrl={displayShortUrl}
              />
            );
          },
        },
      ],
    };
  }

  async componentDidMount() {
    const { auth0 } = this.props;

    const cookies = await onSuccessfulLogin(auth0);
    this.setState({ cookies });

    const userlinks = await retrieveUserLinks(cookies);
    this.setState({ userlinks });

    const formattedUserlinks = formatUserlinks(userlinks);
    this.setState({ formattedUserlinks });
    this.setState({ formattedFilteredUserlinks: formattedUserlinks });
  }

  async deleteShortlink(displayShortUrl) {
    const item = this.state.formattedUserlinks.filter(
      (item) => item.displayShortUrl === displayShortUrl
    )[0];
    const shortUrl = item.shortUrl;
    const cookies = this.state.cookies;
    const userid = cookies.userid;
    console.log(`userid: ${userid}`);
    await requestDeleteShortUrl(shortUrl, userid);

    const formattedUserlinks = this.state.formattedUserlinks.filter(
      (item) => item.shortUrl !== shortUrl
    );
    this.setState({ formattedUserlinks });

    const formattedFilteredUserlinks =
      this.state.formattedFilteredUserlinks.filter(
        (item) => item.shortUrl !== shortUrl
      );
    this.setState({ formattedFilteredUserlinks });
  }

  requestSearch(searchVal) {
    this.setState({ searched: searchVal });
    const searchValLowerCase = String(searchVal).toLowerCase();
    const formattedFilteredUserlinks = this.state.formattedUserlinks.filter(
      (item) => {
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            if (String(item[key]).toLowerCase().includes(searchValLowerCase)) {
              return true;
            }
          }
        }
        return false;
      }
    );
    this.setState({ formattedFilteredUserlinks });
  }

  TableMobile(rows, columns) {
    if (rows === undefined) {
      return "";
    }

    return (
      <List dense>
        {rows.map((item, index) => (
          <List dense>
            <Grid container spacing={12}>
              {columns.map((col, colIndex) => (
                <ListItem>
                  <Grid item xs={4}>
                    <b>{col.headerName}</b>
                  </Grid>
                  <Grid item xs={8}>
                    {col.renderCell({ row: item })}
                  </Grid>
                </ListItem>
              ))}
            </Grid>
            <ListItem />
            <ListItem />
            <Divider />
          </List>
        ))}
      </List>
    );
  }

  render() {
    const columns = this.state.columns;
    const rows = this.state.formattedFilteredUserlinks;
    const allrows = this.state.formattedUserlinks;
    const tableMobile = this.TableMobile(rows, columns);

    return (
      <Box mt={2}>
        <Container maxWidth="lg" className="text center">
          {rows === undefined || allrows === undefined ? (
            <Loading />
          ) : allrows.length === 0 ? (
            <UserNoLinks />
          ) : (
            <Container maxWidth="lg" className="text center">
              <Paper>
                <SearchBar
                  value={this.state.searched}
                  onChange={(searchVal) => this.requestSearch(searchVal)}
                  // onCancelSearch={() => cancelSearch()}
                />
                {isMobile ? (
                  tableMobile
                ) : (
                  <TableDesktop rows={rows} columns={columns} />
                )}
              </Paper>
            </Container>
          )}
        </Container>
      </Box>
    );
  }
}

function UserNoLinks() {
  return (
    <Box>
      <h2>You don't have any links!</h2>
      <h5>
        Why not <a href={window.location.origin}>make one</a>?
      </h5>
    </Box>
  );
}

function TableDesktop(props) {
  const { rows, columns } = props;
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      disableColumnMenu
      disableColumnSelector
      pageSize={25}
    />
  );
}

export default withAuth0(SimpleLinks);

import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import * as constants from './constants'

const allowedChars = constants.ALLOWED_CHARS_IN_SHORT_URL

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(0, 'auto', 0),
        height: '40px',
        display: 'flex',
        size: 'small'
    },
    copyString: {
        margin: theme.spacing(-1, 1, 0),
        color: "#a9a9a9"
    }
});

const validUrl = (string) => {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

async function postData(url = '', data = {}, contentType = "", postMethod) {

    const postBody = {
        "method": postMethod, // *GET, POST, PUT, DELETE, etc.
        "mode": 'cors', // no-cors, *cors, same-origin
        "cache": 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        "credentials": 'same-origin', // include, *same-origin, omit
        "redirect": 'follow', // manual, *follow, error
        "referrerPolicy": 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        "body": JSON.stringify(data) // body data type must match "Content-Type" header
    }
    if (contentType !== "") {
        postBody["headers"] = {
            'Content-Type': contentType
        }
    }

    // Default options are marked with *
    let response = await fetch(url, postBody)
        .then(response => response.json())
        .catch(err => console.log(err))
    console.log(response)

    if (JSON.stringify(response) === "undefined") {
        response = {}
    } else {
        response = JSON.parse(response)
    }

    return response
}

async function postShortUrl(LongUrl, ShortUrl) {
    const data = {
        LongUrl: LongUrl,
        ShortUrl: ShortUrl
    }
    const response = await postData(constants.AWS_ENDPOINT, data, "application/json", "PUT")
    return response
}

function createShortUrl() {
    let result = '';
    for (let i = 6; i > 0; --i) {
        result += allowedChars[Math.floor(Math.random() * allowedChars.length)]
    }
    return result;
}

class Urlform extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isInvalid: false,
            error: "",
            status: "",
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCopy = this.handleCopy.bind(this)
    }

    handleChange(e) {
        this.setState({
            userInput: e.target.value,
        })
        if (!validUrl(e.target.value)) {
            this.setState({
                isInvalid: true,
                error: "Invalid URL",
                userInput: e.target.value,
            })
        } else {
            this.setState({
                isInvalid: false,
                error: "",
                userInput: e.target.value,
            })
        }
    }

    async handleSubmit(e) {
        e.preventDefault()
        if (!this.state.isInvalid) {
            const longUrl = this.state.userInput
            let shortUrl
            let response = {}
            let retries = 0
            while (retries < constants.MAX_RETRIES && !(constants.SHORT_URL_KEY in response)) {
                shortUrl = createShortUrl()
                response = await postShortUrl(longUrl, shortUrl)
                retries += 1
            }

            console.log(response)

            if ("Error" in response) {
                this.setState({
                    shorturl: "",
                    status: response["Error"]
                })
            } else if (constants.SHORT_URL_KEY in response) {
                // TODO better way to generate valid url
                shortUrl = window.location.protocol + "//" + constants.HOSTNAME + "/" + response[constants.SHORT_URL_KEY]
                this.setState({
                    shorturl: shortUrl,
                    status: ""
                })
            }
        }
    }

    handleCopy(e) {
        e.preventDefault()
        const textToCopy = this.state.shorturl
        if (navigator.clipboard && window.isSecureContext) {
            // navigator clipboard api method'
            navigator.clipboard.writeText(textToCopy).then(()=> {
                this.setState({ status: "Copied!" })
            }, (err)=> {
                this.setState({ status: "Error copying :(" })
            })
        } else {
            let textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            // make the textarea out of viewport
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                // here the magic happens
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }

    }

    render() {
        const { classes } = this.props;
        let textFieldDisabled = false;
        let submitButtonText = 'Shorten'
        if (validUrl(this.state.shorturl)) {
            textFieldDisabled = true
            submitButtonText = 'Copy'
        }

        return (
            < Container component='main' maxWidth='xs' >
                <CssBaseline />
                <Box height="20vh">
                    <div className={classes.paper}>

                        <form className={classes.form}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        variant='outlined'
                                        size='small'
                                        required
                                        fullWidth
                                        autoFocus
                                        disabled={textFieldDisabled}
                                        value={textFieldDisabled ? this.state.shorturl : this.state.userInput}
                                        onChange={this.handleChange}
                                        {...this.state.isInvalid ? "error" : ""}
                                        helperText={this.state.isInvalid ? this.state.error : ""}
                                        height="40px"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        className={classes.submit}
                                        onClick={textFieldDisabled ? this.handleCopy : this.handleSubmit}
                                    >
                                        {submitButtonText}
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='subtitle1' className={classes.copyString} >
                                        {this.state.status}
                                    </Typography>
                                </Grid>

                            </Grid>
                        </form>
                    </div>
                </Box>
            </Container >
        )
    }
}

export default withStyles(styles, {})(Urlform)
import * as constants from './constants'

function getLongUrl(ShortUrl) {
    let xmlHttp = new XMLHttpRequest();
    const getEndpoint = constants.AWS_ENDPOINT + "/" + ShortUrl
    xmlHttp.open("GET", getEndpoint, false); // false for synchronous request
    xmlHttp.send(null);
    let response = xmlHttp.responseText
    response = JSON.parse(response)
    return response
}

function ShortUrlRedirect(props) {
    let shorturl = props.location.pathname
    shorturl = shorturl.substr(1, shorturl.length)
    let longurl = getLongUrl(shorturl)
    if ("Item" in longurl && constants.LONG_URL_KEY in longurl["Item"]) {
        window.location = longurl["Item"][constants.LONG_URL_KEY]
    } else {
        window.location = window.location.origin + "/404"
    }
}

export default ShortUrlRedirect
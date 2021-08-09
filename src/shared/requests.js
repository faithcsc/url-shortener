import Cookies from 'js-cookie'
import config from './config'

function isDict(v) {
  return (
    typeof v === 'object' &&
    v !== null &&
    !(v instanceof Array) &&
    !(v instanceof Date)
  )
}

async function makeRequest(url, data = {}, contentType = '', postMethod) {
  const postBody = {
    method: postMethod, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
    headers: {},
  }

  if (contentType !== '') {
    postBody.headers['Content-Type'] = contentType
  } else if (isDict(data)) {
    postBody.headers['Content-Type'] = 'application/json'
  }

  if (postMethod === 'GET') {
    delete postBody.body
    delete postBody.headers['Content-Type']
  }

  // Default options are marked with *
  const result = await fetch(url, postBody)
    .then((response) => {
      return response.json()
    })
    .catch((err) => {})

  return result
}

// AUTHENTICATION

async function requestAuthToken(userData) {
  const sendUserData = {
    name: userData.name,
    email: userData.email,
    password: userData.sub,
    userid: userData.sub,
  }

  const response = await makeRequest(
    config.DB_ENDPOINTS.newuser,
    sendUserData,
    'application/json',
    'POST'
  )
  const idKey = 'id'
  if (idKey in response) {
    // user is in database
    Cookies.set('userid', response[idKey])
    const authToken = makeRequest(
      config.DB_ENDPOINTS.userauth,
      sendUserData,
      'application/json',
      'POST'
    )
    return authToken
  }
  return {}
}

const saveDictToCookie = (dict) => {
  Object.keys(dict).forEach((e) => Cookies.set(e, dict[e]))
}

const cookieExpiryDays = 1

async function onSuccessfulLogin(auth0data) {
  const { user } = auth0data
  user.datetime = Date.now()
  Cookies.set('user', user, {
    expires: cookieExpiryDays,
  })
  const authToken = await requestAuthToken(user)
  saveDictToCookie(authToken)
  return Cookies.get()
}

async function retrieveUserLinks(cookiesUser) {
  const { userid } = cookiesUser
  const userlinks = await makeRequest(
    config.DB_ENDPOINTS.userlinks + userid,
    {},
    '',
    'GET'
  )
  return userlinks
}

async function requestDeleteShortUrl(shortlink, userid) {
  await makeRequest(
    config.DB_ENDPOINTS.link,
    {
      short: shortlink,
      userId: userid,
    },
    'application/json',
    'DELETE'
  )
}

async function postShortUrl(LongUrl, ShortUrl, userid = '') {
  const data = {
    long: LongUrl,
    short: ShortUrl,
    user: userid,
  }
  const response = await makeRequest(
    config.DB_ENDPOINTS.link,
    data,
    'application/json',
    'POST'
  )
  return response
}

export {
  postShortUrl,
  makeRequest,
  requestAuthToken,
  saveDictToCookie,
  onSuccessfulLogin,
  retrieveUserLinks,
  requestDeleteShortUrl,
}

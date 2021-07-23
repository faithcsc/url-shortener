function isDict(v) {
  return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
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
  };

  if (contentType !== '') {
    postBody.headers['Content-Type'] = contentType;
  } else if (isDict(data)) {
    postBody.headers['Content-Type'] = 'application/json';
  }

  if (postMethod === 'GET') {
    delete postBody.body;
    delete postBody.headers['Content-Type'];
  }

  // Default options are marked with *
  const result = await fetch(url, postBody)
    .then((response) => response.json())
    .then((response) => {
      if (JSON.stringify(response) !== '{}') {
        return response;
      }
      return {};
    });

  return result;
}

export default makeRequest;

import axios from 'axios';
function dataAction(method, url, params = null, header, deleteWithBody) {
  const headers = {
    contentType: 'application/json',
    cacheControl: 'no-cache',
    pragma: 'no-cache',
    ...header,
  };
  return {
    url,
    method,
    params: (method === 'get') && !deleteWithBody ? params : null,
    data: method === 'post' || deleteWithBody ? params : null,
    headers,
  };
}

export function getDataAction(url, params = null, headers) {
  const request = dataAction('get', url, params, headers);
  return axios(request);
}

export function postDataAction(url, params = null, headers) {
  const request = dataAction('post', url, params, headers);
  return axios(request);
}

/** response successful
 *  @param {any} body - Body of the response
 * */

export function success(body, status = 200) {
  return buildResponse(status, body)
}

/** Response failure
 *  @param {any} body - Body of the response
 * */

export function failure(body, status = 403) {
  return buildResponse(status, body)
}

/** Build the response
 *  @param {string} statusCode - status code from the API
 *   @param {any} body - Body of the response
 * */

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  }
}

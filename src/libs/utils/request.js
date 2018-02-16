import has from 'lodash.has'

/** check event has include in the qs
 *  @param {any} event - Requesting event
 *  @param {any} include - The include to check for
 *  @return bool
 * */

export function hasInclude(event, include) {
  return has(event, 'queryStringParameters.include') &&
    event.queryStringParameters.include.split(',').includes(include)
}

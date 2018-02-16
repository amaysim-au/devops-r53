import { success, failure } from './libs/utils/response'
import requestContext from '@amaysim/lambda-utils/build/requestContext'
import logger from '@amaysim/lambda-utils/build/logger'

export const greet = async (event, context, callback) => {
  try {
    requestContext.set('event', event)
    requestContext.set('context', context)

    callback(null, success({ status: 200 }))
  }
  catch(e) {
    logger().error(e.message)

    callback(null, failure({ status: false, error: e.message }, e.status))
  }
}

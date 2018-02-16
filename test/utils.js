import axios from '@amaysim/lambda-utils/build/ayxios'

export const generateIdpToken = () =>{
  const opts = {
      method: 'POST',
      url: `${process.env.IDP_SERVICE_URL}/identity/oauth/token`,
      data: {
        grant_type: 'password',
        username: process.env.IDP_TEST_USERNAME,
        password: process.env.IDP_TEST_PASSWORD
      },
      headers: {
        'X-Client-Id': process.env.IDP_UID,
        'X-Client-Secret': process.env.IDP_SECRET
      }
    }
    console.log(`generateIdpToken.opts:${JSON.stringify(opts)}`)
    return axios(opts)
    .then(response => response.data)
    .then(response => response.access_token)
  }

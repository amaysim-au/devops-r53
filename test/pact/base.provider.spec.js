
const verifier = require('pact').Verifier
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)
const {
  server,
  importData,
  devicesRepository
} = require('../../mock-services/provider.js')


server.get('/states', (req, res) => {
  res.json({
    "my-devices": ['I Have a valid token']
  })
})

server.post('/setup', (req, res) => {
  const state = req.body.state
    devicesRepository.clear()
  switch (state) {
    case 'Has nothing':
      // do nothing
      break
    default:
      importData()
  }

  res.end()
})

server.listen(8081, () => {
  console.log('Profile Service listening on http://localhost:8081')
})

// Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
  it('should validate the expectations of devices service', function() { // lexical binding required here
    this.timeout(60000)

    let opts = {
      providerBaseUrl: 'http://localhost:8081',
      providerStatesUrl: 'http://localhost:8081/states',
      providerStatesSetupUrl: 'http://localhost:8081/setup',
      pactUrls: [ process.env.PACT_BROKER_URL+'/pacts/provider/devices-api/consumer/my-devices/latest' ],
      //pactUrls: [path.resolve(process.cwd(), './pacts/public-pact.json')], // IF YOU want to test a local pact then point to it here
      pactBroker: process.env.PACT_BROKER_URL,
      pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
      pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
      publishVerificationResult: true,
      providerVersion: '1.0.1'
    }

    return verifier.verifyProvider(opts)
      .then(output => {
        console.log('Pact Verification Complete!')
        console.log(output)
      })
  })
})

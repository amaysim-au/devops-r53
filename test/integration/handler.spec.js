import { expect } from 'chai'
import { match, sandbox } from 'sinon'

import { greet } from '../../src/greet.js'
import MockContext from '../contexts/mock.lambda.context'

describe('default.handler', () => {
    const sbox = sandbox.create()
    const context = new MockContext()
    const event = {
        headers:{
        }
    }

    afterEach(()=>{
        sbox.restore()
    })

    describe('with a valid request', () => {
        it('should return a 200', (done) => {
            greet(event, context, (err, response) => {
                expect(response.statusCode).to.eq(200)
                done()
            })
        })
    })

    describe('with an invalid body', () => {
        it('should return a 403', (done) => {
           greet(event, context, (err, response) => {
                expect(response.statusCode).to.eq(403)
                done()
            })
        })
    })

    describe('when there\'s a transport error', () => {
        it('should return a 403', (done) => {
           greet(event, context, (err, response) => {
                expect(response.statusCode).to.eq(403)
                done()
            })
        })
    })
})


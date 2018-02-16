
/**
 *
 * Testing our devices endpoint
 */

const expect = require('chai').expect
    , should = require('chai').should
    , utils = require('../../../src/libs/utils/response')


describe('Response utilities tests', function() {

    describe('should have a function called success', () => {

        it('has a function defined', () => {
            expect(utils.success()).to.exist;
        });

        it('is returning a successful response', () => {
           expect(utils.success({status: true})).to.contain({ statusCode: 200 })
        });

    })

    describe('should have a function called failure', () => {

        it('has a function defined', () => {
            expect(utils.failure()).to.exist;
        });

        it('is returning a failure response', () => {
            expect(utils.failure({status: false})).to.contain({ statusCode: 403 })
        });

    })

});

const expect = require('chai').expect
, should = require('chai').should
, utils = require('../../../src/libs/utils/request')

const event = (include) => ({
  queryStringParameters: {
    include
  }
})

describe('Request utilities tests', function() {

  describe('should have a function called hasInclude', () => {

    it('has a function defined', () => {
      expect(utils.hasInclude).to.exist;
    })

    it('returns true when the include exists', () => {
      expect(utils.hasInclude(event('foo'), 'foo')).to.be.true
    })

    it('returns true when the multiple include exists', () => {
      expect(utils.hasInclude(event('foo,bar'), 'foo')).to.be.true
      expect(utils.hasInclude(event('bar,foo'), 'foo')).to.be.true
    })

    it('returns false when qs not set', () => {
      expect(utils.hasInclude({}, 'foo')).to.be.false
    })

    it('returns false when include set but missing', () => {
      expect(utils.hasInclude(event('foo'), 'bar')).to.be.false
    })

  })

})

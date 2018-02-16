
/**
 *
 * Mocks out the lambda context required to return a result
 */


const sinon = require('sinon');

module.exports = function() {
    let _this = this;
    this.succeed = sinon.stub(),
    this.failure = sinon.stub(),
    this.reset = function() {
        _this.succeed.reset();
        _this.failure.reset();
    };
    this.functionName = "mockContextFunctionName"
};
function TestGroup (name, fn) {
  this.name = name
  this.fn = fn
  this.tests = []
}

TestGroup.prototype.testCount = function () {
  return this.tests.length
}

TestGroup.prototype.failureCount = function () {
  return this.tests
    .filter(_ => _.state === 'failed')
    .length
}

module.exports = TestGroup

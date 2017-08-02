const chalk = require('chalk')

let currentTest = null

process.on('uncaughtException', (err) => {
  if (currentTest) {
    currentTest.failTest(err.message)
  }
});

function Test (name, fn) {
  this.name = name
  this.fn = fn
}

Test.prototype.run = function() {
  return new Promise((resolve, reject) => {
    this.resolvePromise = () => resolve(this)
    currentTest = this
    try {
      const testTimer = setTimeout(() => {
        this.failTest('Test Timed out after 2 seconds')
      }, 2000)
      const done = () => {
        clearTimeout(testTimer)
        this.state = 'passed'
        currentTest = null
        this.resolvePromise()
      }
      this.fn(done)
    } catch(err) {
      this.failTest(err.message)
    }
  })
}

Test.prototype.failTest = function(failureMsg) {
  this.state = 'failed'
  this.failureMsg = failureMsg
  currentTest = null
  this.resolvePromise()
}

Test.prototype.toString = function() {
  let msg = `it ${this.name}`
  if (this.state === 'failed') {
    msg = chalk.red(msg + ' -- ' + this.failureMsg)
  } else {
    msg = chalk.green(msg)
  }
  return msg
}

module.exports = Test

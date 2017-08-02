const Promise = require('bluebird')
const chalk = require('chalk')

const testGroups = []

function describe (name, fn) {
  const group = new TestGroup(name, fn)
  testGroups.push(group)
  fn()
}

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

function it (name, fn) {
  const test = new Test(name, fn)
  testGroups[testGroups.length - 1].tests.push(test)
}

function Test (name, fn) {
  this.name = name
  this.fn = fn
}

Test.prototype.run = function() {
  return new Promise((resolve, reject) => {
    try {
      const done = () => {
        this.state = 'passed'
        resolve(this)
      }
      this.fn(done)
    } catch(err) {
      this.state = 'failed'
      this.failureMsg = err.message
      resolve(this)
    }
  })
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

function run () {
  Promise.mapSeries(testGroups, group => {
    console.log('Describe', group.name)
    const promises = group.tests.map(test => test.run())
    return Promise.mapSeries(promises, test => {
      console.log('  ' + test.toString())
    }).then(() => {
      console.log('')
    })
  })
  .then(() => {
    const totalTestCount = testGroups.map(group => group.testCount()).reduce((a,b) => a + b, 0)
    const totalFailureCount = testGroups.map(group => group.failureCount()).reduce((a,b) => a + b, 0)
    console.log(`Ran ${totalTestCount} tests. ${totalFailureCount} failed.`)
  })
}

module.exports = {describe, it, run}

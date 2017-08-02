const Promise = require('bluebird')
const chalk = require('chalk')

let testGroups = []

function it(name, fn) {
  testGroups[testGroups.length - 1].tests.push(new Test(name, fn))
}

function describe(name, fn) {
  testGroups.push(new TestGroup(name, fn))
  fn()
}

function run () {
  return Promise.mapSeries(testGroups, _ => _.run())
  .then(() => {
    const testCount = testGroups.map(_ => _.testCount()).reduce((a,b) => a + b, 0)
    const failureCount = testGroups.map(_ => _.failureCount()).reduce((a,b) => a + b, 0)
    console.log('-- SUMMARY --')
    console.log('Ran', testCount, 'test(s) and had', failureCount, 'failure(s)\n')
  })
}

function Test (name, fn) {
  this.name = name
  this.fn = fn
  this.state = 'pending'
}

Test.prototype.run = function (i) {
  this.number = i
  return new Promise((resolve, reject) => {
    try {
      const done = () => {
        this.state = 'passed'
        resolve()
      }
      this.fn(done)
    } catch (err) {
      this.state = 'failed'
      this.failureMessage = err.message
      resolve()
    }
  })
}

Test.prototype.toString = function () {
  const msg = `it ${this.name}`
  return (
    this.state === 'passed' ? chalk.green(msg) :
    this.state === 'failed' ? chalk.red(msg + ' -- ' + this.failureMessage) :
                              msg
  )
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
  return this.tests.filter(t => t.state === 'failed').length
}

TestGroup.prototype.run = function () {
  return Promise.mapSeries(this.tests, t => t.run())
    .then(() => {
      console.log(`Describe: ${this.name}`)
      this.tests.forEach(t => {
        console.log('  ', t.toString())
      })
      console.log('')
    })
}

module.exports = { it, run, describe }

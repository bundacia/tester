const Promise = require('bluebird')
const Test = require('./test')
const TestGroup = require('./test_group')

const testGroups = []

function describe (name, fn) {
  const group = new TestGroup(name, fn)
  testGroups.push(group)
  fn()
}

function it (name, fn) {
  const test = new Test(name, fn)
  testGroups[testGroups.length - 1].tests.push(test)
}

function run () {
  Promise.mapSeries(testGroups, group => {
    console.log('Describe', group.name)
    return Promise.mapSeries(
      group.tests,
      test => test.run().then(() => console.log('  ' + test.toString()))
    ).then(() => {
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

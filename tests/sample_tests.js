const {describe, it, run} = require('../tester')
const {expect} = require('chai')

describe('hamster', function () {
  it('eats', function (done) {
    done()
  })
})

describe('dog', function () {
  it('eats', function (done) {
    done()
  })

  it('flies', function (done) {
    setTimeout(function () {
      expect(4).to.eq('cheese')
      done()
    }, 100)
  })

  it('times out after 2 seconds', function (done) {
    setTimeout(function () {
      expect(4).to.eq(4)
      done()
    }, 100000)
  })

})

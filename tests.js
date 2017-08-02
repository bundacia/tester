const {describe, it, run} = require('./it')
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
    expect(4).to.eq('cheese')
    done()
  })
})

run()

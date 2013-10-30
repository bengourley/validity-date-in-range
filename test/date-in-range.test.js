var createValidator = require('../')
  , assert = require('assert')

/* global describe, it */

describe('Date in range validator', function () {

  it('should callback with an error message if the input is not a date', function (done) {
    createValidator(new Date(), new Date())('date', 'date', { date: 100 }, function (err, message) {
      assert(!err)
      assert.equal('date must be a date', message)
      done()
    })
  })

  it('should callback with an error message if the input date is before the earliest date', function (done) {
    createValidator(new Date(2013, 1, 1))('date', 'date', { date: new Date(2013, 1, 0) }, function (err, message) {
      assert(!err)
      assert.equal('date must be after 01 February 2013', message)
      done()
    })
  })

  it('should callback with no message if the input date is equal to the earliest date', function (done) {
    createValidator(new Date(2013, 1, 1))('date', 'date', { date: new Date(2013, 1, 1) }, function (err, message) {
      assert(!err)
      assert(!message)
      done()
    })
  })

  it('should callback with no message if the input date is equal to the latest date', function (done) {
    createValidator(null, new Date(2013, 1, 1))('date', 'date', { date: new Date(2013, 1, 1) }, function (err, message) {
      assert(!err)
      assert(!message)
      done()
    })
  })

  it('should callback with no message if the input date is after the earliest date', function (done) {
    createValidator(new Date(2013, 1, 1))('date', 'date', { date: new Date(2014, 3, 3) }, function (err, message) {
      assert(!err)
      assert(!message)
      done()
    })
  })

  it('should callback with no message if the input date is between both provided dates', function (done) {
    createValidator(new Date(2013, 1, 1), new Date(2014, 3, 3))('date', 'date', { date: new Date(2014, 1, 2) }, function (err, message) {
      assert(!err)
      assert(!message)
      done()
    })
  })

  it('should callback with no message if the input date precedes the latest date', function (done) {
    createValidator(null, new Date(2013, 1, 1))('date', 'date', { date: new Date(2012, 4, 13) }, function (err, message) {
      assert(!err)
      assert(!message)
      done()
    })
  })

  it('should callback with an error message if the input date is after the latest date', function (done) {
    createValidator(null, new Date(2013, 1, 1))('date', 'date', { date: new Date(2015, 4, 13) }, function (err, message) {
      assert(!err)
      assert.equal('date must be before 01 February 2013', message)
      done()
    })
  })

  it('should accept a function as the earliest argument', function (done) {
    function earliest() {
      assert(true) // Make sure the function gets run
      return new Date(2011, 3, 4)
    }

    createValidator(earliest)('date', 'date', { date: new Date(2010, 4, 13) }, function (err, message) {

      assert(!err)
      assert.equal('date must be after 04 April 2011', message)

      createValidator(earliest)('date', 'date', { date: new Date(2015, 4, 13) }, function (err, message) {
        assert(!err)
        assert(!message)
        done()
      })

    })

  })

  it('should accept a function as the latest argument', function (done) {

    function latest() {
      assert(true) // Make sure the function gets run
      return new Date(2011, 3, 4)
    }

    createValidator(null, latest)('date', 'date', { date: new Date(2013, 4, 13) }, function (err, message) {

      assert(!err)
      assert.equal('date must be before 04 April 2011', message)

      createValidator(null, latest)('date', 'date', { date: new Date(2010, 4, 13) }, function (err, message) {
        assert(!err)
        assert(!message)
        done()
      })

    })

  })

  it('should accept functions both arguments', function (done) {

    function earliest() {
      assert(true) // Make sure the function gets run
      return new Date(2011, 3, 4)
    }

    function latest() {
      assert(true) // Make sure the function gets run
      return new Date(2012, 3, 4)
    }

    createValidator(earliest, latest)('date', 'date', { date: new Date(2013, 4, 13) }, function (err, message) {

      assert(!err)
      assert.equal('date must be before 04 April 2012', message)

      createValidator(earliest, latest)('date', 'date', { date: new Date(2010, 4, 13) }, function (err, message) {

        assert(!err)
        assert.equal('date must be after 04 April 2011', message)

        createValidator(earliest, latest)('date', 'date', { date: new Date(2011, 5, 3) }, function (err, message) {
          assert(!err)
          assert(!message)
          done()
        })

      })

    })

  })

  it('should error with an invalid date', function (done) {
    createValidator(new Date(), new Date())('date', 'date', { date: new Date('xyz') }, function (err, message) {
      assert(!err)
      assert.equal('date must be a valid date', message)
      done()
    })
  })

})
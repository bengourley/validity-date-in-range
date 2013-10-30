module.exports = createValidator

var moment = require('moment')

function createValidator(earliest, latest, options) {

  options = options || {}
  options.dateFormat = options.dateFormat || 'DD MMMM YYYY'

  function format(d) {
    return moment(d).format(options.dateFormat)
  }

  var getEarliest
    , getLatest

  if (typeof earliest === 'function') {
    getEarliest = earliest
  } else {
    getEarliest = function() { return earliest }
  }

  if (typeof latest === 'function') {
    getLatest = latest
  } else {
    getLatest = function() { return latest }
  }

  function validate(key, keyDisplayName, object, callback) {

    var date = object[key]

    // date is not a Date
    if (!(date instanceof Date)) return callback(null, keyDisplayName + ' must be a date')

    // 'Invalid Date' is a Date, but not valid
    if (!moment(date).isValid()) return callback(null, keyDisplayName + ' must be a valid date')

    // date precedes `earliest`
    if (earliest && date < getEarliest()) return callback(null, keyDisplayName + ' must be after ' + format(getEarliest()))

    // date is after than `latest`
    if (latest && date > getLatest()) return callback(null, keyDisplayName + ' must be before ' + format(getLatest()))

    // date is a Date between `earliest` and `latest`. Success!
    return callback(null, undefined)

  }

  return validate

}
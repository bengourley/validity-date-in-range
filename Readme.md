# validity-date-in-range

Validity style validator to ensure a property is a date within a given range.

## Installation

      npm install validity-date-in-range

## Usage

Below is a simple example for usage with schemata:

```js
var validity = require('validity')
  , schemata = require('schemata')
  , createRangeValidator = require('validity-date-in-range')

var ninetiesHitsSchema = schemata(
    { releaseDate:
      { type: Date
      , validators:
        { all:
          [ createDateValidator(new Date(1990, 0, 0), new Date(1999, 11, 31))
          ]
        }
      }
    })

ninetiesHitsSchema.validate({ releaseDate: new Date(1965, 2, 12) }, function (error, errorMessage) {
  console.log(errorMessage) //-> 'releaseDate must be after '
})

ninetiesHitsSchema.validate({ releaseDate: 20 }, function (error, errorMessage) {
  console.log(errorMessage) //-> undefined
})
```

You can also pass in a function that returns a Date which will get called at validation time.
This is useful in case the validity of a given date changes over time, e.g. a person with the
date of birth 25 Jan 1996 cannot legally buy alcohol in the UK at the time of writing
(30 Oct 2013 – age 17), however next year (25 Jan 2014 onwards – after they turn 18) they can.

```
var schema = schemata(
    { age:
      { type: Date
      , validators: { all: [ createDateValidator(new Date(''), new Date('')) ] }
      }
    })
```

## API

### var validate = createRangeValidator(Date/Function:earliest, Date/Funtion:latest)

Pass in the earliest and latest dates allowed. These are inclusive – i.e. if a date is equal
to the `earliest` or `latest`, it is considered valid. Both `earliest` and `latest` are optional,
but at least one value is required, othewise your validation will consider *all* dates as valid!

### validate(String:key, String:keyDisplayName, Object:object, Function:cb)

This is a [validity](https://npmjs.org/package/validity) compatible function, which in turn is
used by [schemata](https://npmjs.org/package/schemata) for schema validation.

The callback signature `cb(err, errorMessage)`.
- `err` is an `Error` object if something bad happened and `null` otherwise.
- `errorMessage` is a `String` if a validation error happened and `undefined` otherwise.

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
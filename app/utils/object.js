'use strict'

// Creates an object composed of the picked object properties.
function pick(object, keys) {
  const picked = keys.reduce((obj, key) => {
    if (object[key] != undefined) {
      obj[key] = object[key]
    }
    return obj
  }, {})
  return picked
}

module.exports.pick = pick

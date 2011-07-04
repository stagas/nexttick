//
// nextTick
// by stagas
//
// process.nextTick() common functions
//

exports = module.exports = function () {
  var args = [].slice.call(arguments)
    , fn = args.shift()
  process.nextTick(function () {
    fn.apply(this, args)
  })
}

exports.nextTick = exports.tick = module.exports

exports.loop = function (fn, times) {
  var next = function () {}
    , chain = { then: function (fn) { next = fn } }
    , exit = false
  ;(function loop() {
    process.nextTick(function () {
      fn(function () { exit = true })
      'undefined' !== typeof times
        ? --times && !exit && loop() || next()
        : !exit && loop() || next()
    })
    return true
  }())
  return chain
}

exports.while = function (truth, fn) {
  var next = function () {}
    , chain = { then: function (fn) { next = fn } }
    , exit = false
  ;(function loop() {
    process.nextTick(function () {
      fn(function () { exit = true })
      truth() && !exit && loop() || next()
    })
    return true
  }())
  return chain
}

exports.forEach = function (array, fn) {
  var next = function () {}
    , chain = { then: function (fn) { next = fn } }
    , exit = false
    , length = array.length
    , index = 0
  ;(function loop() {
    process.nextTick(function () {
      fn(array[index], index++, array, function () { exit = true })
      index < length && !exit && loop() || next()
    })
    return true
  }())
  return chain
}

exports.in = function (hash, fn) {
  var next = function () {}
    , chain = { then: function (fn) { next = fn } }
    , exit = false
    , keys = Object.keys(hash)
    , key
  ;(function loop() {
    process.nextTick(function () {
      key = keys.shift()
      fn(hash[key], key, hash, function () { exit = true })
      keys.length && !exit && loop() || next()
    })
    return true
  }())
  return chain
}
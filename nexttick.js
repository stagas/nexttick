//
// nextTick
// by stagas
//
// Common functions using process.nextTick()
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
  var then = function () {}
    , chain = { then: function (fn) { then = fn } }
    , args = []
    , exit = false
    , exitfn = function () {
      exit = true
      args = [].slice.call(arguments)
    }

  ;(function loop() {
    process.nextTick(function () {
      fn(exitfn)
      'undefined' !== typeof times
        ? --times && !exit && loop() || then.apply(this, args)
        : !exit && loop() || then.apply(this, args)
    })
    return true
  }())
  return chain
}

exports.while = function (truth, fn) {
  var then = function () {}
    , chain = { then: function (fn) { then = fn } }
    , args = []
    , exit = false
    , exitfn = function () {
      exit = true
      args = [].slice.call(arguments)
    }

  ;(function loop() {
    process.nextTick(function () {
      fn(exitfn)
      truth() && !exit && loop() || then.apply(this, args)
    })
    return true
  }())
  return chain
}

exports.forEach = function (array, fn) {
  var then = function () {}
    , chain = { then: function (fn) { then = fn } }
    , args = []
    , exit = false
    , exitfn = function () {
      exit = true
      args = [].slice.call(arguments)
    }
    
  var length = array.length
    , index = 0
  ;(function loop() {
    process.nextTick(function () {
      fn(array[index], index++, array, exitfn)
      index < length && !exit && loop() || then.apply(this, args)
    })
    return true
  }())
  return chain
}

exports.in = function (hash, fn) {
  var then = function () {}
    , chain = { then: function (fn) { then = fn } }
    , args = []
    , exit = false
    , exitfn = function () {
      exit = true
      args = [].slice.call(arguments)
    }

  var keys = Object.keys(hash)
    , key
  ;(function loop() {
    process.nextTick(function () {
      key = keys.shift()
      fn(hash[key], key, hash, exitfn)
      keys.length && !exit && loop() || then.apply(this, args)
    })
    return true
  }())
  return chain
}
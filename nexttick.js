//
// nextTick
// by stagas
//
// Common functions using process.nextTick()
//

var slice = [].slice

exports = module.exports = function () {
  var args = slice.call(arguments)
    , fn = args.shift()
    , then = null
  process.nextTick(function () {
    fn.apply(this, args)
    then && then()
  })
  return { then: function (fn) { then = fn } }
}

exports.nextTick = exports.tick = module.exports

function wrapper (loop) {
  var context = {}
  var then = function () {}
  var args = []
  loop = loop.bind(context)
  context.then = function () {
    then.apply(this, args)
  }
  context.exit = false
  context.exitfn = function () {
    this.exit = true
    args = slice.call(arguments)
  }.bind(context)
  context.loop = function () {
    process.nextTick(loop)
    return true
  }
  context.loop()
  return { then: function (fn) { then = fn } }
}

exports.loop = function (fn, times) {
  return wrapper(function () {
    fn(this.exitfn)
    'undefined' !== typeof times
      ? --times && !this.exit && this.loop() || this.then()
      : !this.exit && this.loop() || this.then()
  })
}

exports.while = function (truth, fn) {
  return wrapper(function () {
    fn(this.exitfn)
    truth() && !this.exit && this.loop() || this.then()
  })
}

exports.forEach = function (array, fn) {
  var length = array.length
    , index = 0
  return wrapper(function () {
    fn(array[index], index++, array, this.exitfn)
    index < length && !this.exit && this.loop() || this.then()
  })
}

exports.slice = function (array, begin, end) {
  var length = array.length
  begin = 'undefined' === typeof begin ? 0 : begin < 0 ? length + begin : begin
  begin = begin < 0 ? 0 : begin > length ? length : begin
  end = 'undefined' === typeof end ? length : end < 0 ? length + end : end
  end = end < begin ? begin : end > length ? length : end
  var sliced = []
  return exports.loop(function (exit) {
    if (begin < end) {
      sliced.push(array[begin++])
    } else {
      exit(sliced)
    }
  })
}

exports.in = function (hash, fn) {
  var keys = Object.keys(hash)
    , key
  return wrapper(function () {
    key = keys.shift()
    fn(hash[key], key, hash, this.exitfn)
    keys.length && !this.exit && this.loop() || this.then()
  })
}

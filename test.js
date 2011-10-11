var nextTick = require('./nexttick')
  , test = require('tap').test

test("simple", function (t) {
  t.plan(1)
  nextTick(function () {
    t.pass()
  })
})

test("specified loop length", function (t) {
  var i = 0
  nextTick.loop(function () {
    ++i
  }, 50).then(function () {
    t.equal(50, i)
    t.end()
  })
})

test("infinite loop with exit clause", function (t) {
  var i = 0
  nextTick.loop(function (exit) {
    ++i
    if (i === 100) exit()
  }).then(function () {
    t.equal(100, i)
    t.end()
  })
})

test("while loop", function (t) {
  var i = 0
  nextTick.while(function () { return i < 100 }, function () {
    ++i
  }).then(function () {
    t.equal(100, i)
    t.end()
  })
})

test("while loop w/ exit", function (t) {
  var i = 0
  nextTick.while(function () { return i < 100 }, function (exit) {
    ++i
    if (i === 50) exit()
  }).then(function () {
    t.equal(50, i)
    t.end()
  })
})

test("nextTick w/ arguments", function (t) {
  nextTick(function (a, b, c) {
    t.equal(1, a)
    t.equal(2, b)
    t.equal(3, c)
  }, 1, 2, 3).then(function () {
    t.end()
  })
})

test("forEach", function (t) {
  var arrayA = [ 1, 2, 3 ]
    , arrayB = []
    , indexes = []
  nextTick.forEach(arrayA, function (v, i, array) {
    arrayB.push(v)
    indexes.push(i)
    t.same(array, arrayA)
  }).then(function () {
    t.same([ 1, 2, 3 ], arrayB)
    t.same([ 0, 1, 2 ], indexes)
    t.end()
  })
})

test("forEach w/ exit", function (t) {
  var arrayA = [ 1, 2, 3 ]
    , arrayB = []
    , indexes = []
  nextTick.forEach(arrayA, function (v, i, array, exit) {
    arrayB.push(v)
    indexes.push(i)
    t.same(array, arrayA)
    if (i === 1) exit()
  }).then(function () {
    t.same([ 1, 2 ], arrayB)
    t.same([ 0, 1 ], indexes)
    t.end()
  })
})

test("slice", function (t) {
  var array = [ 1, 2, 3, 4, 5 ]
  t.plan(421)
  nextTick.slice(array).then(function (sliced) {
    t.same(sliced, array.slice())
  })
  for (var begin = -10; begin < 10; begin++) {
    ;(function (begin) {
      nextTick.slice(array, begin).then(function (sliced) {
        t.same(sliced, array.slice(begin))
      })
    }(begin))
  }
  for (var begin = -10; begin < 10; begin++) {
    for (var end = -10; end < 10; end++) {
      ;(function (begin, end) {
        nextTick.slice(array, begin, end).then(function (sliced) {
          t.same(sliced, array.slice(begin, end))
        })
      }(begin, end))
    }
  }
})

test("in", function (t) {
  var hashA = { foo: 'bar', baz: 'zoo', lol: 'blah' }
    , hashB = {}
  nextTick.in(hashA, function (v, k, hash) {
    hashB[k] = v
    t.same(hash, hashA)
  }).then(function () {
    t.same(hashB, hashA)
    t.end()
  })
})

test("in w/ exit", function (t) {
  var hashA = { foo: 'bar', baz: 'zoo', lol: 'blah' }
    , hashB = {}
  nextTick.in(hashA, function (v, k, hash, exit) {
    hashB[k] = v
    t.same(hash, hashA)
    if (k === 'baz') exit()
  }).then(function () {
    t.same(hashB, { foo: 'bar', baz: 'zoo' })
    t.end()
  })
})

test("arguments passing to callback", function (t) {
  nextTick.forEach([ 1, 2, 3 ], function (value, index, array, exit) {
    exit('whatever', 'works')
  }).then(function (a, b) {
    t.equal('whatever', a)
    t.equal('works', b)
    t.end()
  })
})

test("error handling", function (t) {
  nextTick.forEach([ 1, 2, 3 ], function (value, index, array, exit) {
    exit(new Error('Some error'))
  }).then(function (err) {
    t.equal('Some error', err.message)
    t.throws(function () { throw err })
    t.end()
  })
})
var nextTick = require('./nexttick')
  , assert = require('assert')

// specified loop length
;(function () {
  var i = 0
  nextTick.loop(function () {
    ++i
  }, 50).then(function () {
    assert.equal(50, i)
  })
}())

// infinite loop with exit clause
;(function () {
  var i = 0
  nextTick.loop(function (exit) {
    ++i
    if (i === 100) exit()
  }).then(function () {
    assert.equal(100, i)
  })
}())

// while loop
;(function () {
  var i = 0
  nextTick.while(function () { return i < 100 }, function () {
    ++i
  }).then(function () {
    assert.equal(100, i)
  })
}())

// nextTick w/ arguments
nextTick(function (a, b, c) {
  assert.equal(1, a)
  assert.equal(2, b)
  assert.equal(3, c)
}, 1, 2, 3)

// forEach
;(function () {
  var arrayA = [ 1, 2, 3 ]
    , arrayB = []
    , indexes = []
  nextTick.forEach(arrayA, function (v, i, array) {
    arrayB.push(v)
    indexes.push(i)
    assert.deepEqual(array, arrayA)
  }).then(function () {
    assert.deepEqual([ 1, 2, 3 ], arrayB)
    assert.deepEqual([ 0, 1, 2 ], indexes)
  })
}())

// forEach w/ exit
;(function () {
  var arrayA = [ 1, 2, 3 ]
    , arrayB = []
    , indexes = []
  nextTick.forEach(arrayA, function (v, i, array, exit) {
    arrayB.push(v)
    indexes.push(i)
    assert.deepEqual(array, arrayA)
    if (i === 1) exit()
  }).then(function () {
    assert.deepEqual([ 1, 2 ], arrayB)
    assert.deepEqual([ 0, 1 ], indexes)
  })
}())

// in
;(function () {
  var hashA = { foo: 'bar', baz: 'zoo', lol: 'blah' }
    , hashB = {}
  nextTick.in(hashA, function (v, k, hash) {
    hashB[k] = v
    assert.deepEqual(hash, hashA)
  }).then(function () {
    assert.deepEqual(hashB, hashA)
  })
}())

// in w/ exit
;(function () {
  var hashA = { foo: 'bar', baz: 'zoo', lol: 'blah' }
    , hashB = {}
  nextTick.in(hashA, function (v, k, hash, exit) {
    hashB[k] = v
    assert.deepEqual(hash, hashA)
    if (k === 'baz') exit()
  }).then(function () {
    assert.deepEqual(hashB, { foo: 'bar', baz: 'zoo' })
  })
}())

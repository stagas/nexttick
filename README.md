nextTick
========

Common functions using process.nextTick()

Installation
------------
    npm install nexttick

Usage
-----

```javascript
var nextTick = require('nexttick');

nextTick(function () {
  console.log('Hello, world');
});
```

API
---

### nextTick( fn [, arg1, arg2, ...] )

```javascript
nextTick(function () { console.log('hello'); });

nextTick(function (a, b) {
  console.log(a, b); // foo bar
}, 'foo', 'bar');
```

### nextTick.loop( fn(exit) [, times] )

```javascript
// specified loop length
var i = 0;
nextTick.loop(function () {
  console.log(++i);
}, 50);

// with exit
var i = 0;
nextTick.loop(function (exit) {
  console.log(++i);
  if (i > 100) exit();
});
```

### nextTick.while( truth, fn(exit) )

```javascript
var i = 0;
nextTick.while(function () { // this function is evaluated on each iteration
  return i < 100;
}, function () {
  console.log(++i);
});
```

### nextTick.forEach( array, fn(value, index, array, exit) )

```javascript
nextTick.forEach([ 1, 2, 3 ], function (value, index, array, exit) {
  console.log(index, value);
});
```

### nextTick.in( hash, fn(value, key, hash, exit) )

```javascript
nextTick.in({ foo: 'bar', baz: 'zoo' }, function (value, key, hash, exit) {
  console.log(key, value);
});
```

All loop methods accept a callback using a chained ```.then(cb)``` method, that acts like a callback.
You may also pass any arguments you want to it using the `exit([arg1, arg2, ...])` function.

```javascript
nextTick.forEach([ 1, 2, 3 ], function (value) {
  console.log(value);
}).then(function () { // this will be called when the above finishes
  console.log('All done');
});
```

### Error handling

Simply pass an `Error` to the `exit()` function:

```javascript
nextTick.forEach([ 1, 2, 3 ], function (value, index, array, exit) {
  exit(new Error('Some error'));
}).then(function (err) {
  if (err) throw err;
});
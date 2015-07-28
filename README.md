Quartz Storage
==============

Quartz Storage is meant to be a simple and safe cross browser/platform storage for games.
It makes use of localStorage when possible and falls back to cookies when localStorage is not accesible.

Storage can be namespaced so you can use same key values amonst different games/pages on the same site

### Getting Started ###

First you'd want to include the library in your page by doing the following:

```html
    <script src="path/to/your/external/libs/QuartzStorage-1.1.0.min.js"></script>
```

#### Setup a namespace ####

The storage objects in Quartz Storage are by default all grouped in a Quartz: namespace.
If you would like a different (game specific) namespace, you can just get an instance and set the namespace.

```javascript
Quartz.Storage.getInstance()
    .setNamespace('myGameName');
```

#### Set/Get an item ####

Setting and getting of items is as straightforward as ever:

```javascript
Quartz.Storage.getInstance()
    .set('foo', 'bar')
    .get('foo'); //bar
```

Keep in mind that due to localStorage all keys and values should be string!

```javascript
var s = Quartz.Storage.getInstance();

s.set('number', 9*18);

var num = s.get('number');

s === 162; //false
parseInt(s, 10) === 162; //true
```
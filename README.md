# json-schema-2015 [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> A JSON Schema validator using modern codebase

The current JSON Schema code is quite ancient (2002) and neds a rebuild. As A storng advocate of schema standards in JS 
and node, I thoguht I'd take a crack at it.

## Installation

```sh
$ npm install --save json-schema-2015
```

## Usage

```js
var jsonSchema = require('json-schema-2015');

jsonSchema({schemaDefinition: true});

```
## License

MIT © [Dave Edelhart](http://www.wonderlandlabs.com)


[npm-image]: https://badge.fury.io/js/json-schema-2015.svg
[npm-url]: https://npmjs.org/package/json-schema-2015
[travis-image]: https://travis-ci.org/bingomanatee/json-schema-2015.svg?branch=master
[travis-url]: https://travis-ci.org/bingomanatee/json-schema-2015
[daviddm-image]: https://david-dm.org/bingomanatee/json-schema-2015.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/bingomanatee/json-schema-2015
[coveralls-image]: https://coveralls.io/repos/bingomanatee/json-schema-2015/badge.svg
[coveralls-url]: https://coveralls.io/r/bingomanatee/json-schema-2015

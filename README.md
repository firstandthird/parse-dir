parse-dir
[![Build Status](https://travis-ci.org/firstandthird/parse-dir.svg?branch=master)](https://travis-ci.org/firstandthird/parse-dir)

=========

[![Greenkeeper badge](https://badges.greenkeeper.io/firstandthird/parse-dir.svg)](https://greenkeeper.io/)

Node lib to recursively read the files in a directory and return their contents.

## Installation

```npm install parse-dir```

## Usage

```parseDir(glob, callback);```

Or, if you prefer to make it synchronous:

```javascript
var result = parseDir(glob);
var otherResult = parseDir.sync(otherGlob);
```

### Example

```javascript
var parseDir = require('parse-dir');

parseDir('*', function(err, files) {

});
```

### Output

```javascript
[
  {
    fullpath: '/path/to/file.ext',
    filename: 'file.ext',
    basename: 'file',
    extension: '.ext',
    raw: 'raw contents of file',
    contents: 'parsed contents of file',
    parsed: true|false //if file is supported, it will parse the contents.  If false, contents == raw.  See Parsing Files.
  }
]
```

## Parsing Files

If `parseDir` knows how to parse a file, it will attempt to read it and turn it into a javascript object.

### Supported Files

* YAML
* JSON
* JS
* CoffeeScript
* Livescript

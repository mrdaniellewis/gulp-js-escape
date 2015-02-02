# Gulp JavaScript escape

A Gulp plugin that turns a file into a JavaScript escaped string.

```js
var jsEscape = require('gulp-js-escape');

// file.htm -> some text "needing" escaped

gulp.src( 'file.htm' )
	.pipe( jsEscape() )
	.dest( 'escaped.js' )

// escaped.js -> "some text \"needing\" escaped"
```

## `jsEscape( options )`

* `options.omitDelimiters` Boolean, default = false, if true the quotes around the string are omitted.

Returns Gulp Vinyl transform object stream.

Note that the encoding is assumed to be utf-8.  If a different encoding is required then use (another plugin)[https://www.npmjs.com/package/gulp-convert-encoding/] to convert the stream first.
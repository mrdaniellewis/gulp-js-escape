/* jshint node:true */
"use strict";

var through = require('through2');

/**
 *  
 *  @param {Boolean} [options.omitDelimiters=false] Do not delimit the string 
 *  @returns {stream.Transform}
 */
function jsEscape( options ) {
    
    options = options || {};
    var omitDelimiters = options.omitDelimiters === true;
   
    return through.obj( function(file, enc, cb) {

        if ( file.isBuffer() ) { 
            var data = JSON.stringify( file.contents.toString() );
            if ( omitDelimiters ) {
                data = data.slice( 1, -1 );
            }
            file.contents = new Buffer(data);
        }

        if ( file.isStream() ) {
            // Replace the stream with our piped stream
            file.contents = file.contents.pipe( through( 
                function( data, enc, cb ) {

                    if ( !this._started && !omitDelimiters ) {
                        this.push( '"' );
                        this._started = true;
                    }

                    if ( Buffer.isBuffer(data) ) {
                        data = data.toString();
                    }

                    this.push( JSON.stringify(data).slice( 1, -1 ) );

                    cb();
                },
                function( cb ) {
                    if ( !omitDelimiters ) {
                        this.push( '"' );
                    }
                    cb();
                }
            )  );
        }

        cb(null, file);

    } );
}

module.exports = jsEscape;


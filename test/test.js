/* jshint node:true, mocha: true */
"use strict";

var File = require('vinyl');
var collect = require('stream-collect');
var expect = require('expect');
var through = require('through2');
var jsEscape = require('../');

describe( 'gulp-js-escape', function() {

	describe( 'null file', function() {

		it( 'should return a null file', function() {

			var file = new File();
			var escaper = jsEscape();
			escaper.end(file);

			return collect(escaper)
				.then( function(data) {
					var file = data[0];
					expect( file.isNull() ).toBe( true );
				} );

		});
		
	});

	describe( 'in buffer node', function() {

		it( 'should escape the buffer', function() {

			var file = new File( {
				contents: new Buffer('a buffer " \n † 💩')
			} );
			var escaper = jsEscape();
			escaper.end(file);



			return collect(escaper)
				.then( function(data) {
					var file = data[0];
					expect( file.isBuffer() ).toBe( true );
					expect( file.contents.toString() ).toBe( '"a buffer \\" \\n † 💩"' );
				} );

		});

		it( 'should omit the quotation marks if the omitDelimiters option is used', function() {

			var file = new File( {
				contents: new Buffer('a buffer " \n † 💩')
			} );
			var escaper = jsEscape( { omitDelimiters: true } );
			escaper.end(file);

			return collect(escaper)
				.then( function(data) {
					var file = data[0];
					expect( file.isBuffer() ).toBe( true );
					expect( file.contents.toString('utf8') ).toBe( 'a buffer \\" \\n † 💩' );
				} );

		} );
		
	});

	describe( 'in streaming node', function() {

		it( 'should escape the stream', function() {

			var stream = through();
			stream.write( 'a stream ' );
			stream.end( '" \n † 💩' );

			var file = new File( {
				contents: stream
			} );
			var escaper = jsEscape();
			escaper.end(file);

			return collect(escaper)
				.then( function(data) {
					var file = data[0];
					expect( file.isStream() ).toBe( true );
					return collect(file.contents);
				} )
				.then( function(data) {
					expect( data.toString() ).toBe( '"a stream \\" \\n † 💩"' );
				} );

		});

		it( 'should omit the quotation marks if the omitDelimiters option is used', function() {

			var stream = through();
			stream.write( 'a stream ' );
			stream.end( '" \n † 💩' );

			var file = new File( {
				contents: stream
			} );
			var escaper = jsEscape( { omitDelimiters: true } );
			escaper.end(file);

			return collect(escaper)
				.then( function(data) {
					var file = data[0];
					expect( file.isStream() ).toBe( true );
					return collect(file.contents);
				} )
				.then( function(data) {
					expect( data.toString() ).toBe( 'a stream \\" \\n † 💩' );
				} );

		} );
		
	});

} );
# Startanull

Startanull is Gulp builder for styles, scripts, templates.

## Prepare for using

1. Install latest Node.JS

	```bash
	$ node --version
	>> v6.3.*
	$ npm --version
	>> 3.*
	```

1. Install Gulp as global package.

	```
	[sudo] npm install -g gulp
	```

## Setup

1. Install `gulp` and `startanull` packages as development dependencies for your project. To do this, run next command in your project folder:

	```bash
	$ npm install --save-dev gulp startanull
	```

1. Create `gulpfile.js` in your project folder

	```javascript
	'use strict';
	const startanull = require('startanull');
	const conf = {...}; // config object for startanull
	const gulp = conf.gulp = require('gulp');
	startanull(conf);
	```

1. Setup config. You can find sample config and gulpfile in `test` folder

# Tasks

Default
-------------------------------------------------------

Build styles, scripts and templates

```
gulp
```

Styles
-------------------------------------------------------

Build CSS from styles

```
gulp styles.build
```

Minify CSS

```
gulp styles.min
```

Build CSS from styles and minify them

```
gulp styles
```

Scripts
-------------------------------------------------------

Build Scripts with Webpack. Pass `min` flag for minified version

```
gulp scripts.build [--min]
```

Templates
-------------------------------------------------------

Build HTML from Pug templates

```
gulp templates.build
```

Watchers
-------------------------------------------------------

Rebuild assets on sources changed. Pass some options if you want watch for
specific modules.

- `s` - for styles
- `j` - for scripts
- `t` - for templates

```
gulp watch [-s|j|t]
```

BrowserSync
-------------------------------------------------------

Serve files with BrowserSync

```
gulp serve
```

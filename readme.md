# Startanull

Startanull is Gulp builder for styles, scripts, templates, with image processing

## Install

Install Node.JS and Gulp as global package.

```
[sudo] npm install -g gulp
```

Install dependencies

```
[sudo] npm install
```

## Setup

Project settings are placed in `.startanull.conf.js`

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

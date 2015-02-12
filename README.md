# less-plugin-glob [![Build Status](https://travis-ci.org/just-boris/less-plugin-glob.svg?branch=master)](https://travis-ci.org/just-boris/less-plugin-glob)

Globbing support in Less-imports.

This plugin allows to import multiple files using [glob expressions](https://github.com/isaacs/node-glob). 
Add this plugin and you can write import like this

```less
@import "common/**";
@import "themes/**";
```


## How to add plugins?

[Section about plugins in Less documentation](http://lesscss.org/usage/#plugins)

## Usage example


1. `npm install -g less less-plugin-glob`
1. Create file with import by glob, something like `@import "includes/**"`
1. Run `lessc --glob styles.less styles.css` and enjoy whole your styles concated by one line


## Caveats

Now glob imports are supported only on top-level stylesheets. In deep cases current dirrectory is lost and we can't
properly resolve file paths.

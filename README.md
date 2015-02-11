# less-plugin-glob [![Build Status](https://travis-ci.org/just-boris/less-glob-plugin.svg?branch=master)](https://travis-ci.org/just-boris/less-glob-plugin)

Globbing support in Less-imports.

This plugin allows to import multiple files using [glob expressions](https://github.com/isaacs/node-glob). 
Add this plugin and you can write import like this

```less
@import "common/**";
@import "themes/**";
```


## How to add plugins?

[Section about plugins in Less documentation](http://lesscss.org/usage/#plugins)

## Caveats

Now glob imports are supported only on top-level stylesheets. In deep cases current dirrectory is lost and we can't
properly resolve file paths.

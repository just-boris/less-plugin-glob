# less-plugin-glob

> Globbing support in Less-imports.

[![Travis status](https://img.shields.io/travis/just-boris/less-plugin-glob.svg?style=flat-square)](https://travis-ci.org/just-boris/less-plugin-glob)
[![npm version](https://img.shields.io/npm/v/less-plugin-glob.svg?style=flat-square)](https://www.npmjs.com/package/less-plugin-glob)
[![David](https://img.shields.io/david/just-boris/less-plugin-glob.svg?style=flat-square)](https://david-dm.org/just-boris/less-plugin-glob)

This plugin allows to import multiple files using [glob expressions](https://github.com/isaacs/node-glob).
Add this plugin and you can write import like this

```less
@import "common/**";
@import "themes/**";
```

## How to add plugins?

[Section about plugins in Less documentation](http://lesscss.org/usage/#plugins)

## Examples

### lessc usage

1. `npm install -g less less-plugin-glob`
1. Create file with import by glob, something like `@import "includes/**"`
1. Run `lessc --glob styles.less styles.css` and enjoy whole your styles concated by one line

### Programmatic usage

1. Install plugin locally `npm install less-plugin-glob`
2. Import it and add into `plugins` section of options.

```js
less.render(lessString, { plugins: [require('less-plugin-glob')] })
```

If you are using Gulp or Grunt or something else, you can import and add plugin by same way as well.

### Usage with webpack and less-loader

When using webpack and `less-loader` >= 4.0, it's important to make sure that `less-loader` is configured *not* to use its webpack resolver, which is now [active by default](https://github.com/webpack-contrib/less-loader#imports). Otherwise, `less-plugin-glob` won't run at all because `less-loader` applies a LESS plugin that passes all queries to the webpack resolver (bypassing this plugin). To make `less-loader` revert to the LESS resolver, [specify the `paths` loader option](https://github.com/webpack-contrib/less-loader#less-resolver):

    {
      loader: "less-loader",
      options: {
        plugins: [lessPluginGlob],
        paths: [path.resolve(__dirname, "path/to/my/styles")] // This is the important part!
      }
    }

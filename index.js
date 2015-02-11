var Promise = typeof Promise === 'undefined' ? require('promise') : Promise,
    promisify = require('promisify-node'),
    globby = require('globby'),
    path = require('path'),
    eol = require('os').EOL,
    globbyPromise = promisify(globby);

function isLess(file) {
    return path.extname(file) === '.less';
}

function processPaths(paths) {
    return paths.filter(function(path) {
        if(!isLess(path)) {
            console.warn('Here is non-less file: ' + path + ', ignored');
            return false;
        }
        return true;
    });
}

module.exports = {
    install: function(less, pluginManager) {
        function GlobFileManager() {

        }
        GlobFileManager.prototype = new less.FileManager();
        GlobFileManager.prototype.constructor = GlobFileManager;
        GlobFileManager.prototype.supports = function(filename, currentDirectory, options, environment) {
            return (filename).indexOf('*') > -1;
        };
        GlobFileManager.prototype.loadFile = function(filename, currentDirectory, options, environment) {
            var self = this,
                paths = options.paths.concat('');
            return Promise.all(paths.map(function(basePath) {
                return globbyPromise(path.join(currentDirectory, filename), {cwd: basePath});
            })).then(function(paths) {
                paths = Array.prototype.concat.apply([], paths);
                paths = processPaths(paths);
                return Promise.all(paths.map(function(file) {
                    return less.FileManager.prototype.loadFile.call(self, file, currentDirectory, options, environment);
                }));
            }).then(function(files) {
                return {contents: files.map(function(file) {
                    return file.contents;
                }).join(eol), filename: filename};
            });
        };
        GlobFileManager.prototype.loadFileSync = function(filename, currentDirectory, options, environment, encoding) {
            var paths = globby.sync(filename, {cwd: currentDirectory});
            paths = processPaths(paths);
            return paths.map(function(file) {
                return less.FileManager.prototype.loadFileSync.call(this, path.basename(file), path.dirname(file), options, environment, encoding);
            }, this).join(eol);
        };
        GlobFileManager.prototype.supportsSync = GlobFileManager.prototype.supports;
        pluginManager.addFileManager(new GlobFileManager());
    }
};

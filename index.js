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
        GlobFileManager.prototype.supports = function(filename) {
            return (filename).indexOf('*') > -1;
        };
        GlobFileManager.prototype.searchInPath = function(basePath, glob) {
            return globbyPromise(glob, {cwd: basePath}).then(function(files) {
                return files.map(function(file) {
                    return path.join(basePath, file);
                });
            });
        };
        GlobFileManager.prototype.loadFile = function(filename, currentDirectory, options) {
            var paths = [currentDirectory];
            if (!this.isPathAbsolute(filename) && paths.indexOf('.') === -1) {
                paths.push('.');
            }
            if (options.paths && options.paths.length > 0) {
                paths.push.apply(paths, options.paths);
            }
            return Promise.all(paths.map(function(basePath) {
                return this.searchInPath(basePath, filename);
            }, this)).then(function(paths) {
                paths = Array.prototype.concat.apply([], paths);
                return processPaths(paths);
            }).then(function(files) {
                return {contents: files.map(function(file) {
                    return '@import "' + file + '";';
                }).join(eol), filename: filename};
            });
        };
        GlobFileManager.prototype.loadFileSync = function(filename, currentDirectory) {
            var paths = globby.sync(filename, {cwd: currentDirectory});
            paths = processPaths(paths);
            return paths.map(function(file) {
                return '@import "' + file + '";';
            }, this).join(eol);
        };
        GlobFileManager.prototype.supportsSync = GlobFileManager.prototype.supports;
        pluginManager.addFileManager(new GlobFileManager());
    }
};

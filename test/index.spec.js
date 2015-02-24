var lessGlob = require('../'),
    less = require('less'),
    fs = require('fs'),
    expect = require('chai').expect;

function readResource(filename) {
    return fs.readFileSync(filename, 'utf-8');
}

function assertFilesToBeIncluded(output, files) {
    var pattern = "file:([\\w\\.\\-]+)",
        includes = output.match(new RegExp(pattern, 'g'));
    includes.forEach(function(include) {
        include = new RegExp(pattern).exec(include)[1];
        expect(files).to.contain(include);
        files.splice(files.indexOf(include), 1);
    });
    expect(files).to.have.length(0, 'all includes should be found');
}

var options = {
        paths: ['test/fixtures'],
        plugins: [lessGlob]
    };

describe('less-glob', function() {
    it('should import files by glob', function(done) {
        less.render(readResource('test/fixtures/all-less.less'), options)
            .then(function(output) {
                assertFilesToBeIncluded(output.css, [
                    'one.less',
                    'one-sub.less'
                ]);
            })
            .then(done, done);
    });

    it('should ignore non-less files', function(done) {
        less.render(readResource('test/fixtures/include-non-less.less'), options)
            .then(function(output) {
                assertFilesToBeIncluded(output.css, [
                    'two.less'
                ]);
                expect(output.css).to.not.contain('file:resource.txt');
            })
            .then(done, done);
    });

    it('should not break standard imports', function(done) {
        less.render(readResource('test/fixtures/no-glob.less'), options)
            .then(function(output) {
                assertFilesToBeIncluded(output.css, [
                    'one.less'
                ]);
            })
            .then(done, done);
    });

    it('should recursively resolve globs', function(done) {
        less.render(readResource('test/fixtures/recursive.less'), options)
            .then(function(output) {
                assertFilesToBeIncluded(output.css, [
                    'three.less',
                    'three-sub.less',
                    'three-sub2.less'
                ]);
            })
            .then(done, done);
    });
});
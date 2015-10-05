var lessGlob = require('../'),
    less = require('less'),
    fs = require('fs'),
    expect = require('chai').expect;

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

function lessRender(filename) {
    var options = {
        filename: filename,
        paths: ['test/fixtures'],
        plugins: [lessGlob]
    };
    return less.render(fs.readFileSync(filename, 'utf-8'), options)
}

describe('less-glob', function() {
    it('should import files by glob', function(done) {
        lessRender('test/fixtures/all-less.less')
            .then(function(output) {
                assertFilesToBeIncluded(output.css, [
                    'one.less',
                    'one-sub.less'
                ]);
            })
            .then(done, done);
    });

    it('should ignore non-less files', function(done) {
        lessRender('test/fixtures/include-non-less.less')
            .then(function(output) {
                assertFilesToBeIncluded(output.css, [
                    'two.less'
                ]);
                expect(output.css).to.not.contain('file:resource.txt');
            })
            .then(done, done);
    });

    it('should not break standard imports', function(done) {
        lessRender('test/fixtures/no-glob.less')
            .then(function(output) {
                assertFilesToBeIncluded(output.css, [
                    'one.less'
                ]);
            })
            .then(done, done);
    });

    it('should recursively resolve globs', function(done) {
        lessRender('test/fixtures/recursive.less')
            .then(function(output) {
                assertFilesToBeIncluded(output.css, [
                    'three.less',
                    'three-sub.less',
                    'three-sub2.less'
                ]);
            })
            .then(done, done);
    });

    it('should import files by path from project root', function(done) {
        lessRender('test/fixtures/project-root.less')
            .then(function(output) {
                assertFilesToBeIncluded(output.css, [
                    'one.less',
                    'one-sub.less'
                ]);
            })
            .then(done, done);
    });
});

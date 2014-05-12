#!/usr/bin/env node
var esprima = require('esprima');
var escodegen = require('escodegen');
var util = require('util');
var fs = require('fs');
var optimist = require('optimist');
var argv = optimist
    .usage('Add module names passed to define() static, resolved from the filename.\n\nUsage: $0 [-p n] files')
    .options('p', {
        "alias": 'strip',
        "describe": 'number of path segments to strip',
        "default": 0
    })
    .options('n', {
        "alias": "name",
        "describe": "Set the module name directly. You can only use a single file if you set this."
    })
    .options('h', {
        "alias": "help",
        "describe": "Show help"
    }).argv;

if (argv.h || argv._.length < 1 || (argv.n && argv._.length > 1)) {
    optimist.showHelp();
    process.exit();
}

var eswalk = require('./eswalk');

argv._.forEach(function (file) {
    var moduleName = argv.name ? argv.name : file.split('/').slice(argv.strip).join('/').replace(/\.js$/, '');
    fs.readFile(file, 'utf-8', function(err, src) {
        if (err) throw(err);
        var tree = esprima.parse(src);
        
        eswalk(tree, function(node, parent) {
            if (node.type == 'ExpressionStatement' &&
                node.expression.type == 'CallExpression' &&
                node.expression.callee.name == 'define') {
                fixupDefine(node.expression);
            }
        });

        console.log(escodegen.generate(tree));
    });

    function fixupDefine(node) {
        if (node['arguments'][0].type != 'Literal') {
            node['arguments'].unshift({
                type: 'Literal',
                value: moduleName
            });
        }
    }

});

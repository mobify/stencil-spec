define(function(require) {
    var dust = require('dust-full');
    var componentHelper = require('adaptivejs/lib/dust-component-helper');
    var componentSugar = require('adaptivejs/lib/dust-component-sugar');
    var templates = require('../../build/templates');
    var context;

    // Register helpers for precompiled component templates.
    dust = componentHelper(dust);
    templates.forEach(function(name) {
        dust.helpers[name] = componentSugar.makeHelper(name);
    });

    // Define any context required for the tests.
    context = {
        repo: 'https://github.com/mobify/stencil-spec'
    };

    dust.render('tests', context, function(err, out) {
        if (!err) {
            document.querySelector('body').innerHTML = out;
        } else {
            console.log(err);
        }
    });
});

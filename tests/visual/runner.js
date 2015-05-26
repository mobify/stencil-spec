define(function(require) {
    var dust = require('dust-full');
    var componentHelper = require('adaptivejs/lib/dust-component-helper');
    var sugar = require('adaptivejs/lib/dust-component-sugar');
    var tests = require('text-loader!tests.dust');
    var context;
    var templates;
    var compile = function(templates) {
        dust = componentHelper(dust);
        for (var helperName in templates) {
            if (templates.hasOwnProperty(helperName)) {
                dust.loadSource(dust.compile(templates[helperName], helperName));
                dust.helpers[helperName] = sugar.makeHelper(helperName);
            }
        }
    };

    // Require in the component’s templates:
    templates = {
        'c-spec': require('text-loader!../../spec.dust'),
        'c-spec__test': require('text-loader!../../spec__test.dust'),
        'c-spec__case': require('text-loader!../../spec__case.dust')
    };

    // Define any context required for the tests:
    context = {
        repo: 'https://github.com/mobify/stencil-spec'
    };

    // Compile and render
    compile(templates);
    dust.renderSource(tests, context, function(err, out) {
        if (!err) {
            document.querySelector('body').innerHTML = out;
        } else {
            console.log(err);
        }
    });
});

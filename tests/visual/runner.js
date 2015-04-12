define(function(require) {
    var dust = require('dustjs-component');
    var text = require('text');
    var tests = require('text!tests.dust');

    // Require the component’s template loader (`*.component.js`):
    require('../../spec.component');

    // Define any context required for the tests:
    var context = {
        repo: 'https://github.com/ry5n/stencil-spec'
    };

    // Render
    dust.renderSource(tests, context, function(err, out) {
        if (!err) {
            document.querySelector('body').innerHTML = out;
        } else {
            console.log(err);
        }
    });
});

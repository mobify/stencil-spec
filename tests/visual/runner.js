define(function(require) {
    var dust = require('dust-full');
    var componentHelper = require('adaptivejs/lib/dust-component-helper');

    // Add the component helper to dust.
    dust = componentHelper(dust);

    // Register component helper and precompile the templates
    // HOW???!!!

    // Define any context required for the tests:
    var context = {
        repo: 'https://github.com/mobify/stencil-spec'
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

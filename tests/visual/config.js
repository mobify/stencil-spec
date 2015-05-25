require.config({
    paths: {
        'text': '../../bower_components/text/text',
        'dust-full': '../../bower_components/dustjs-linkedin/dist/dust-full',
        'adaptivejs': '../../bower_components/adaptivejs',
    },
    shim: {
        'dust-full': {
            'exports': 'dust'
        }
    },
});

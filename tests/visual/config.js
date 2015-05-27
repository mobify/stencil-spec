require.config({
    paths: {
        'dust-full': '../../node_modules/dustjs-linkedin/dist/dust-full',
        'adaptivejs': '../../node_modules/adaptivejs',
    },
    shim: {
        'dust-full': {
            'exports': 'dust'
        }
    },
});

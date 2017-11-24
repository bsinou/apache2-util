var path = require('path');
//var ExtractTextPlugin = require ('extract-text-webpack-plugin');

var clientSrcPath = path.resolve (__dirname, 'src/main/resources/static/');
var serverSrcPath = path.resolve (__dirname, 'src/main/js/');

module.exports = {
	    entry: serverSrcPath + '/app.js',
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    output: {
        path: clientSrcPath+'/built',
        filename: 'app.bundle.js'
    },
    
//    plugins: [
//        new ExtractTextPlugin('styles.css'),
//    ],

    
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};

//
//var path = require ('path');
//var ExtractTextPlugin = require ('extract-text-webpack-plugin');
//
//
//
//module.exports = {
//
//    entry: clientSrcPath + '/main.js',
//
//    output: {
//        path: serverSrcPath,
//        filename: 'app.bundle.js'
//    },
//
//    plugins: [
//        new ExtractTextPlugin('styles.css'),
//    ],
//
//    module: {
//        rules: [
//            {test: /.js$/, exclude: /node_modules/, loader: 'babel-loader'},
//            {test: /.css/, exclude: /node_modules/, use: ExtractTextPlugin.extract({
//                fallback: 'style-loader',
//                use: [
//                    { loader: 'css-loader', options: { modules: true } }
//                ]
//            })}
//        ]
//    }
//};
var path = require('path');
// var ExtractTextPlugin = require ('extract-text-webpack-plugin');

var clientSrcPath = path.resolve(__dirname, 'src/main/resources/static/');
var serverSrcPath = path.resolve(__dirname, 'src/main/js/');

module.exports = {
	entry : serverSrcPath + '/app.js',
	devtool : 'sourcemaps',
	cache : true,
	debug : true,
	output : {
		path : clientSrcPath + '/built',
		filename : 'app.bundle.js'
	},

	// plugins: [
	// new ExtractTextPlugin('styles.css'),
	// ],

	module : {
		loaders : [ {
			test : path.join(__dirname, '.'),
			exclude : /(node_modules)/,
			loader : 'babel',
			query : {
				cacheDirectory : true,
				presets : [ 'es2015', 'react' ]
			}
		} ]
	}
};

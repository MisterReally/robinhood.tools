// 

const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const package = require('./package.json')



const wpconfig = require('@vue/cli-service/webpack.config')

module.exports = _.merge()

module.exports = {
	context: process.cwd(),
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.sass', '.scss', '.css'],
		modules: [__dirname, 'node_modules'],
	},
	entry: {
		vendors: [
			// 'animejs',
			// 'boom',
			// 'buefy',
			// 'bulma',
			// 'lockr',
			// 'mdi',
			// 'modern-normalize',
			'lodash',
			// 'node-forge',
			// 'simple-get',
			// 'sockjs-client',
			// 'vue',
			// 'vue-class-component',
			// 'vue-property-decorator',
			// 'vue-router',
			// 'vuex',
			// 'zousan',
			// '____',
			// '____',
			// '____',
			// '____',
			// '____',
		],
	},
	output: {
		filename: '[name].dll.js',
		path: path.resolve(__dirname, 'dist/client'),
		library: '[name]',
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]',
			path: path.resolve(__dirname, 'dist/client/[name].json'),
		}),
	],
}



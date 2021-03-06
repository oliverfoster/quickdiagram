require.config({
	'paths': {
		'jquery': "libs/jquery",
		'cookie': "libs/jquery.cookie",
		'scrollto': "libs/jquery.scrollTo",
		'underscore': "libs/underscore",
		'handlebars': "libs/handlebars-v2.0.0",
		'backbone': "libs/backbone",
		'draggabilly': "libs/draggabilly",
		'velocity': "libs/velocity",
		'throttle': "libs/throttle",
		'modernizr': "libs/modernizr",
		'url': "libs/url",
		'App': "libs/app"
	},
	'shim': {
		'velocity': {
			'deps': [
				'jquery'
			]
		},
		'scrollto': {
			'deps': [
				'jquery'
			]
		},
		'draggabilly': {
			'deps': [
				'jquery'
			]
		}
	}
	//'urlArgs': "bust=" +  (new Date()).getTime()
});

define('main',[
	'jquery',
	'cookie',
	'scrollto',
	'underscore',
	'handlebars',
	'backbone',
	'draggabilly',
	'throttle',
	'url',
	'velocity',
	'modernizr'
], function() {
	console.log("Loading...");
});

require(['main'],function() {
	require(['App'],function(App) {
		window.App = App;
	});
});
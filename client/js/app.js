var app =	angular.module('finApp', ['ngRoute', 'ngMaterial', 'ngAnimate', 'ngAria', 'md.data.table', 'ngMessages', 'focus-if']);

	app.config(function($routeProvider){
	    $routeProvider.when('/', {
	        templateUrl: "./client/views/main.html",
	        controller: "mainController"
	    //}).when('/register', {
	    //     templateUrl: "./client/views/dialog.registration.html",
	    //     controller: "SigningController"
	    // }).when('/signin', {
	    //     templateUrl: "./client/views/dialog.login.html",
	    //     controller: "SigningController"
	    }).otherwise({
	        redirectTo: '/'
	    })
	});

	app.config(function($mdThemingProvider) {
	  $mdThemingProvider.theme('default')
	    .primaryPalette('blue', {
	      'default': '800', // by default use shade 400 from the pink palette for primary intentions
	      'hue-1': '700', // use shade 100 for the <code>md-hue-1</code> class
	      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
	      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
	    })
	    // If you specify less than all of the keys, it will inherit from the
	    // default shades
	    .accentPalette('light-blue', {
	      'default': '600' // use shade 200 for default, and keep all other shades the same
	    });
	});	




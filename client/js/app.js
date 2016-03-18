var app =	angular.module('finApp', ['ngRoute', 'ngMaterial', 'md.data.table']);

app.config(function($routeProvider){
    $routeProvider.when('/', {
        templateUrl: "./client/views/main.html",
        controller: "mainController"
    }).when('/about', {
        templateUrl: "./views/about.html",
        controller: "AboutController"
    }).when('/signin', {
        templateUrl: "./views/signin.html",
        controller: "SigningController"
    }).otherwise({
        redirectTo: '/'
    })
});


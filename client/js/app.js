var app =	angular.module('finApp', ['ngRoute', 'ngMaterial']);
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

// angular.module('contentDemo1', ['ngMaterial'])
// .controller('AppCtrl', function($scope) {
// });


// angular.module('cardDemo1', ['ngMaterial'])
// .controller('AppCtrl', function($scope) {
//   $scope.imagePath = 'img/washedout.png';
// });
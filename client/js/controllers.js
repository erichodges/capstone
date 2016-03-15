app.controller('mainController', function($scope, $http){

	$http.get('https://api.stocktwits.com/api/2/streams/symbol/aapl.json').then(function(response){
		$scope.data = response.data;
		
		$scope.messages = response.data.messages;


	});

	

});
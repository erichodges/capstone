app.controller('mainController', function($scope, $http) {

		//input box --> tied to a scope var use ng-model
		//on click/button press --> run function WHICH concats model into http.get(s)
		//ng-model="ticker"
		//ng-click="getStockAPIs()"
$scope.getStockAPIs = function(){
		
    $http.get("https://api.stocktwits.com/api/2/streams/symbol/" + $scope.ticker + ".json").then(function(response) {
        $scope.data = response.data;
        $scope.messages = response.data.messages;
    });

    var yahooAPI = ('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + $scope.ticker + '%22)%0A%09%09&format=json&view=detailed&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=')

    $http.get(yahooAPI).then(function(response) {
    	$scope.stockDetail = response.data.query.results.quote;
    	console.log($scope.stockDetail);
    })
}
// https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + stockname + "%22)%0A%09%09&format=json&view=detailed&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=



    // var onDemandClient = new OnDemandClient();

    // onDemandClient.setAPIKey('f3787b4e9b8ef613d3daa421cb376c19');
    // onDemandClient.setJsonP(true);

    // /* get a quote for AAPL and GOOG */
    // onDemandClient.getFinancialHighlights({
    //     symbols: 'AAPL'
    // }, function(err, data) {
    // 		console.log(arguments);
    //     $scope.quotes = data;
    //     for (var x in $scope.quotes) {
    //         console.log("getQuote: " + $scope.quotes[x].symbol + " [" + $scope.quotes[x].name + "] = " + JSON.stringify($scope.quotes[x]));
    //     }
    // });

});

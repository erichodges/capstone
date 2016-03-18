app.controller('mainController', function($scope, $http, $timeout) {

    //input box --> tied to a scope var use ng-model
    //on click/button press --> run function WHICH concats model into http.get(s)
    //ng-model="ticker"
    //ng-click="getStockAPIs()"
    $scope.getStockAPIs = function() {

        $http.get("https://api.stocktwits.com/api/2/streams/symbol/" + $scope.ticker + ".json").then(function(response) {
            $scope.data = response.data;
            $scope.messages = response.data.messages;
        });

        var yahooAPI = ('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + $scope.ticker + '%22)%0A%09%09&format=json&view=detailed&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=')

        $http.get(yahooAPI).then(function(response) {
            $scope.stockDetail = response.data.query.results.quote;
            console.log($scope.stockDetail);
        $scope.ticker = '';    
        })
    }

    $scope.selected = [];

    $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
    };

    $scope.columns = [{
            name: 'Dessert',
            orderBy: 'name',
            unit: '100g serving'
        }, {
            descendFirst: true,
            name: 'Type',
            orderBy: 'type'
        }, {
            name: 'Calories',
            numeric: true,
            orderBy: 'calories.value'
        }, {
            name: 'Fat',
            numeric: true,
            orderBy: 'fat.value',
            unit: 'g'
        },
        /* {
           name: 'Carbs',
           numeric: true,
           orderBy: 'carbs.value',
           unit: 'g'
         }, */
        {
            name: 'Protein',
            numeric: true,
            orderBy: 'protein.value',
            trim: true,
            unit: 'g'
        },
        /* {
           name: 'Sodium',
           numeric: true,
           orderBy: 'sodium.value',
           unit: 'mg'
         }, {
           name: 'Calcium',
           numeric: true,
           orderBy: 'calcium.value',
           unit: '%'
         }, */
        {
            name: 'Iron',
            numeric: true,
            orderBy: 'iron.value',
            unit: '%'
        }, {
            name: 'Comments',
            orderBy: 'comment'
        }
    ];

    //// GET DATA HERE!!
    ////////////////////
    $http.get('desserts.js').then(function(desserts) {
        $scope.desserts = desserts.data;
        // $timeout(function () {
        //   $scope.desserts = desserts.data;
        // }, 1000);
    });



    $scope.getTypes = function() {
        return ['Candy', 'Ice cream', 'Other', 'Pastry'];
    };

    $scope.onPaginate = function(page, limit) {
        // $scope.$broadcast('md.table.deselect');

        console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
        console.log('Page: ' + page + ' Limit: ' + limit);

        $scope.promise = $timeout(function() {

        }, 2000);
    };

    $scope.deselect = function(item) {
        console.log(item.name, 'was deselected');
    };

    $scope.log = function(item) {
        console.log(item.name, 'was selected');
    };

    $scope.loadStuff = function() {
        $scope.promise = $timeout(function() {

        }, 2000);
    };

    $scope.onReorder = function(order) {

        console.log('Scope Order: ' + $scope.query.order);
        console.log('Order: ' + order);

        $scope.promise = $timeout(function() {

        }, 2000);
    };

});

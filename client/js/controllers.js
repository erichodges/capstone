app.controller('firstController', function($scope, $mdMedia, $mdDialog, $http) {

    $scope.status = '';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.user = localStorage.getItem('user');
    $scope.$on('loginSuccess', function(event, args) {
        $scope.user = args;
        localStorage.setItem('user', $scope.user);

        //grab saved stocks from database on successful login

        console.log('happened', args)

        $mdDialog.hide();
    })



    $scope.showLoginDialog = function(ev) {

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: 'SigningController',
            templateUrl: 'client/views/dialog.login.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });

    };


    $scope.logout = function() {
        localStorage.clear();
        $scope.user = undefined;
    };


    $scope.showRegisterDialog = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: 'SigningController',
            templateUrl: 'client/views/dialog.registration.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });

    };

    $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }

    });

});
//////////
// Login and Register Controllers
//////////
app.controller("SigningController", function($scope, $location, $http, $rootScope) {

    $scope.signup = function() {
        var url = '/auth/api/signup';
        console.log('signing controller')

        $http({
            method: "POST",
            url: url,
            data: $scope.user
        }).then(function(data) {
            // Save the JWT to localStorage so we can use it later
            localStorage.setItem('jwt', data.data.jwt);
            $rootScope.$broadcast('loginSuccess', $scope.user.email);
            $scope.user = {};
            console.log('broadcast is working')

        }).catch(function(err) {
            console.log(err);
            console.log("BAD THING ^^^");
        });
    };
    $scope.login = function() {
        var url = '/auth/api/login';

        var loginPostData = {
            username: $scope.user.email,
            password: $scope.user.password
        };

        $http({
            method: "POST",
            url: url,
            data: loginPostData
        }).then(function(data) {
            // Save the JWT to localStorage so we can use it later
            localStorage.setItem('jwt', data.data.jwt);
            $rootScope.$broadcast('loginSuccess', $scope.user.email);
            $scope.user = {
                username: data.data.email
            };
            // console.log($scope.user)

        }).catch(function(err) {
            console.log(err);
            console.log("BAD THING ^^^");
        });
    };

});
///////////
//Main Controller
///////////
app.controller('mainController', function($scope, $http, $timeout, $interval, $rootScope) {

    $scope.sendStockToDB = function(ev) {
        var url = '/auth/api/stockPost';
        // $scope.$on('tickerEntry', )
        $http({
            method: "POST",
            url: url,
            data: {
                jwt: localStorage.getItem('jwt'),
                stock: $scope.ticker
            }

        });
        // console.log(data, $scope.ticker)
    };

    $scope.getStockFromDB = function(ev) {
    	var url = '/stocks';
    			$http({
    				method: "GET",
    				url: url,

    			}).then(function(res){
    				$scope.stockDB = res.data;
    				console.log($scope.stockDB)
    			})
    };

    $scope.setStock = function(ticker) {
    	$scope.ticker = ticker;
    	$scope.getStockAPIs();
    }

    $scope.getStockAPIs = function() {

            $http.get("https://api.stocktwits.com/api/2/streams/symbol/" + $scope.ticker + ".json").then(function(response) {
                $scope.data = response.data;
                $scope.messages = response.data.messages;
            });

            var yahooAPI = ('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + $scope.ticker + '%22)%0A%09%09&format=json&view=detailed&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=');

            $http.get(yahooAPI).then(function(response) {
                $scope.stockDetail = response.data.query.results.quote;
                console.log($scope.stockDetail);
            })

            var now = new Date();
            var nowFormatted = now.toISOString().substring(0, 10);
            var lastYear = new Date();
            lastYear.setFullYear(now.getFullYear() - 1);
            var lastYearFormatted = lastYear.toISOString().substring(0, 10)


            var testUrl = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol = "' + $scope.ticker + '" and startDate = "' + lastYearFormatted + '" and endDate = "' + nowFormatted + '" &format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

            $http.get(testUrl).then(function(response) {
                $scope.chartData = response.data.query.results.quote;

                var accessor = candlestick.accessor();
                var data = $scope.chartData.map(function(d) {

                    return {
                        date: parseDate(d.Date),
                        open: +d.Open,
                        high: +d.High,
                        low: +d.Low,
                        close: +d.Close,
                        volume: +d.Volume
                    };
                }).sort(function(a, b) {
                    return d3.ascending(accessor.d(a), accessor.d(b));
                });

                x.domain(data.map(accessor.d));
                y.domain(techan.scale.plot.ohlc(data, accessor).domain());

                svg.select("g.candlestick").datum(data);
                draw();

                // Associate the zoom with the scale after a domain has been applied
                zoom.x(x.zoomable().clamp(false)).y(y);

                //       $scope.ChangeinPercent  = {
                //   name: function() {


                //   }
                // };
                // $rootScope.$broadcast('tickerEntry', $scope.ticker);
                // $scope.ticker = '';
            });
        }
        //D3 start
        ///////////

    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 850 - margin.left - margin.right,
        height = 612 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var x = techan.scale.financetime()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var zoom = d3.behavior.zoom()
        .on("zoom", draw);

    var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", y(1))
        .attr("width", width)
        .attr("height", y(0) - y(1));

    svg.append("g")
        .attr("class", "candlestick")
        .attr("clip-path", "url(#clip)");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    svg.append("rect")
        .attr("class", "pane")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);


    function draw() {
        svg.select("g.candlestick").call(candlestick);
        // using refresh method is more efficient as it does not perform any data joins
        // Use this if underlying data is not changing
        //        svg.select("g.candlestick").call(candlestick.refresh);
        svg.select("g.x.axis").call(xAxis);
        svg.select("g.y.axis").call(yAxis)
    }
    ///end of chart functionality





});

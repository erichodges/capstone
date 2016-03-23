app.controller('firstController', function($scope, $mdMedia, $mdDialog) {

    $scope.status = '  ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showConfirm = function(ev) {

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
                controller: 'firstController',
                templateUrl: 'client/views/dialog.login.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.statuses = ['Planned', 'Confirmed', 'Cancelled'];
    $scope.options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', '...'];
    $scope.submit = function() {
        // submit code goes here
    };
    $scope.resetRegistrationInput = function() {
        $scope.obj = {
            name: "",
            myselect: "",
            status: ""
        }
    };
    $scope.resetRegistrationInput();

    // $scope.user = {
    //     name: 'John Doe',
    //     email: '',
    //     phone: '',
    //     address: 'Mountain View, CA',
    //     donation: 19.99
    // };



    $scope.showAdvanced = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
                controller: 'firstController',
                templateUrl: 'client/views/dialog.registration.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
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


app.controller('mainController', function($scope, $http, $timeout, $interval) {



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

            // var single_stock_chart_url = ('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22' + $scope.ticker + '%22%20and%20startDate%20%3D%20%%22' + lastYearFormatted + '%22%20and%20endDate%20%3D%20%%22' + nowFormatted + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=');
            // //console.log(decodeURI(single_stock_chart_url));

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

                $scope.ticker = '';
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
        height = 620 - margin.top - margin.bottom;

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

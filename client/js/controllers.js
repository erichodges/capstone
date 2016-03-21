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

        var yahooAPI = ('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + $scope.ticker + '%22)%0A%09%09&format=json&view=detailed&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=');

        $http.get(yahooAPI).then(function(response) {
            $scope.stockDetail = response.data.query.results.quote;
            console.log($scope.stockDetail);
        })

        function generateFormattedDate(num){
            	var today = new Date();
							var priorDate = new Date().setDate(today.getDate() - num);
							var formattedDate = dateFormat(priorDate, "yyyy-mm-dd");

							return formattedDate;
        }

        var single_stock_chart_url = ('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22YHOO%22%20and%20startDate%20%3D%20%222009-09-11%22%20and%20endDate%20%3D%20%222010-03-10%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=');
        $http.get(single_stock_chart_url).then(function(response) {
            $scope.chartData = response.data.query.results.quote;
            console.log($scope.chartData);
    
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
			      }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
			      console.log(data)
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
///////////http://techanjs.org/techan.min.jshttp://techanjs.org/techan.min.js

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

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

    var svg = d3.select("body").append("svg")
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


});

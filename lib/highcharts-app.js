'use strict';

var myapp = angular.module('myapp', ["highcharts-ng"]);

myapp.controller("httpQueryAppControler1", function($scope, $http){

});

myapp.filter('bytes', function() {
  return function(bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    if (typeof precision === 'undefined') precision = 1;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
        number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
  }
});

function bytesToSize(bytes) {
  //var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2)
};


myapp.controller('myctrl', function ($scope, $http) {

  $http.get("http://10.151.0.186:8080/SizeOnDiscDB/SizeOnDiscSwatAndroid")
      .success(function(data){
        var raw_db_items= data["_embedded"]["rh:doc"];
        var raw_version_numbers = [];
        var android_build_sizes = [];
        var v_size_value_pairs = new Array();


        var index;

        for (index = 0; index < raw_db_items.length; ++index) {
          var t = raw_db_items[index];
          var v = t.versionnumber;
          var s = bytesToSize(t.appsizeondisc);
          raw_version_numbers.push(v);
          android_build_sizes.push(s);
          v_size_value_pairs.push([v,s]);
        }

        $scope.hockey_db_data = raw_db_items;

        $scope.hockey_versions = raw_version_numbers;

        $scope.hockey_build_sizes = android_build_sizes;

        $scope.hockey_vs_pairs = v_size_value_pairs;


        //Chart functions:
        //$scope.chartTypes = [
        //  {"id": "line", "title": "Line"},
        //  {"id": "spline", "title": "Smooth line"},
        //  {"id": "area", "title": "Area"},
        //  {"id": "areaspline", "title": "Smooth area"},
        //  {"id": "column", "title": "Column"},
        //  {"id": "bar", "title": "Bar"},
        //  {"id": "pie", "title": "Pie"},
        //  {"id": "scatter", "title": "Scatter"}
        //];
        //
        //$scope.dashStyles = [
        //  {"id": "Solid", "title": "Solid"},
        //  {"id": "ShortDash", "title": "ShortDash"},
        //  {"id": "ShortDot", "title": "ShortDot"},
        //  {"id": "ShortDashDot", "title": "ShortDashDot"},
        //  {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
        //  {"id": "Dot", "title": "Dot"},
        //  {"id": "Dash", "title": "Dash"},
        //  {"id": "LongDash", "title": "LongDash"},
        //  {"id": "DashDot", "title": "DashDot"},
        //  {"id": "LongDashDot", "title": "LongDashDot"},
        //  {"id": "LongDashDotDot", "title": "LongDashDotDot"}
        //];
        //
        //$scope.chartSeries = [
        //  //{"name": "android installer size", "data": [1, 2, 4, 7, 3], color: '#FF0000'},
        //  //{"name": "ios installer size", "data": [20, 30, 40, 70, 30], color: '#00FFFF'},
        //  {"name": "android build size", "data": android_build_sizes, color: '#00FFFF'},
        //  //{"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
        //  //{"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
        //];
        //
        //$scope.chartStack = [
        //  {"id": '', "title": "No"},
        //  {"id": "normal", "title": "Normal"},
        //  {"id": "percent", "title": "Percent"}
        //];
        //
        //$scope.addPoints = function () {
        //  var seriesArray = $scope.chartConfig.series;
        //  var rndIdx = Math.floor(Math.random() * seriesArray.length);
        //  seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
        //};
        //
        //$scope.addSeries = function () {
        //  var rnd = []
        //  for (var i = 0; i < 10; i++) {
        //    rnd.push(Math.floor(Math.random() * 20) + 1)
        //  }
        //
        //  $scope.chartConfig.series.push({
        //    data: rnd
        //  })
        //}
        //
        //$scope.removeRandomSeries = function () {
        //  var seriesArray = $scope.chartConfig.series;
        //  var rndIdx = Math.floor(Math.random() * seriesArray.length);
        //  seriesArray.splice(rndIdx, 1)
        //}
        //
        //$scope.removeSeries = function (id) {
        //  var seriesArray = $scope.chartConfig.series;
        //  seriesArray.splice(id, 1)
        //}
        //
        //$scope.toggleHighCharts = function () {
        //  this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
        //}
        //
        //$scope.replaceAllSeries = function (data) {
        //  //var data = [
        //  //  { name: "first", data: [10] },
        //  //  { name: "second", data: [3] },
        //  //  { name: "third", data: [13] }
        //  //];
        //  $scope.chartConfig.series = data;
        //};

        $scope.chartConfig = {

          options: {
            chart: {
              type: 'line'
            },

            size: {
              width: 400,
              height: 300
            },

            xAxis: {
              type: "category"
            },

            yAxis: {
              title: {
                text: 'Size ( MB )'
              }
            },

            tooltip: {
              formatter: function () {
                return 'android build size of version <b>' + this.key +
                    '</b> is <b>' + this.y + '</b> MB';
              }
            }
          },

          series: [
            {data: v_size_value_pairs, name: "android build size", color: '#00FFFF'}

          ],


          //series: $scope.chartSeries,

          title: {
            text: "Android Build Size"
          }
        }

        $scope.reflow = function () {
          $scope.$broadcast('highchartsng.reflow');
        };
      })




});
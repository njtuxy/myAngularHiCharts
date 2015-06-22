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
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2)
};


myapp.controller('mySwatAndroidBuildChart', function ($scope, $http) {
  $http.get("http://10.151.0.186:8080/SizeOnDiscDB/SizeOnDiscSwatAndroid")
      .success(function(data){
        var raw_db_items= data["_embedded"]["rh:doc"];
        //var raw_version_numbers = [];
        //var android_build_sizes = [];
        var v_size_value_pairs = new Array();
        var v_time_value_pairs = {};

        var index;

        for (index = 0; index < raw_db_items.length; ++index) {
          var t = raw_db_items[index];
          var version = t.versionnumber;
          var size = bytesToSize(t.appsizeondisc);
          var time = t._created_on;
          //raw_version_numbers.push(v);
          //android_build_sizes.push(s);
          v_size_value_pairs.unshift([version,size]);
          v_time_value_pairs[version] = time;
        }

        //$scope.hockey_db_data = raw_db_items;
        //
        //$scope.hockey_versions = raw_version_numbers;
        //
        //$scope.hockey_build_sizes = android_build_sizes;
        //$scope.hockey_vt_pairs =  v_time_value_pairs;
        //$scope.hockey_vs_pairs = v_size_value_pairs;


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
                return 'android build size: <b>' + this.y + '</b> MB'+ '<br>' +
                    'version: <b>' + this.key +'<br>'+
                '<br>' + "upload time:  " +
                    v_time_value_pairs[this.key]
                    ;
              }
            }
          },

          series: [
            {data: v_size_value_pairs, name: "android build size", color: '#008080'}

          ],


          //series: $scope.chartSeries,

          title: {
            text: "SWAT Android Build Size"
          }
        }

        $scope.reflow = function () {
          $scope.$broadcast('highchartsng.reflow');
        };
      })

});


myapp.controller('mySwatIOSBuildChart', function ($scope, $http) {
  $http.get("http://10.151.0.186:8080/SizeOnDiscDB/SizeOnDiscSwatIOS")
      .success(function(data){
        var raw_db_items= data["_embedded"]["rh:doc"];
        //var raw_version_numbers = [];
        //var android_build_sizes = [];
        var v_size_value_pairs = new Array();
        var v_time_value_pairs = {};

        var index;

        for (index = 0; index < raw_db_items.length; ++index) {
          var t = raw_db_items[index];
          var version = t.versionnumber;
          var size = bytesToSize(t.appsizeondisc);
          var time = t._created_on;
          //raw_version_numbers.push(v);
          //android_build_sizes.push(s);
          v_size_value_pairs.unshift([version,size]);
          v_time_value_pairs[version] = time;
        }

        //$scope.hockey_db_data = raw_db_items;
        //
        //$scope.hockey_versions = raw_version_numbers;
        //$scope.hockey_build_sizes = android_build_sizes;
        $scope.hockey_vt_pairs =  v_time_value_pairs;
        //$scope.hockey_vs_pairs = v_size_value_pairs;


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
                return 'ios build size: <b>' + this.y + '</b> MB'+ '<br>' +
                    'version: <b>' + this.key +'<br>'+
                    '<br>' + "upload time:  " +
                    v_time_value_pairs[this.key]
                    ;
              }
            }
          },

          series: [
            {data: v_size_value_pairs, name: "ios build size", color: '#008000'}

          ],


          //series: $scope.chartSeries,

          title: {
            text: "SWAT ios Build Size"
          }
        }

        $scope.reflow = function () {
          $scope.$broadcast('highchartsng.reflow');
        };
      })

});
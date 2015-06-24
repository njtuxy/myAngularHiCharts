'use strict';

var myapp = angular.module('myapp', ["highcharts-ng"]);

myapp.controller("httpQueryAppControler1", function ($scope, $http) {

});

myapp.filter('bytes', function () {
    return function (bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
});

function setValue(){
    $scope.myValue = "1111111"
}

function fomattedTime(unix_timestamp) {
    var date = new Date(unix_timestamp * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    return year + "/" + month + "/" + day + "/ " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

function bytesToSize(bytes) {
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2)
};

function formatDate(date) {
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;

    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    m = m < 10 ? "0" + m : m;

    s = s < 10 ? "0" + s : s;

    /* if you want 2 digit hours:
     h = h<10?"0"+h:h; */

    var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

    var replacement = h + ":" + m;
    /* if you want to add seconds
     replacement += ":"+s;  */
    replacement += " " + dd;

    return date.replace(pattern, replacement);
}

function show_popup() {
    var p = window.createPopup()
    var pbody = p.document.body
    pbody.style.backgroundColor = "lime"
    pbody.style.border = "solid black 1px"
    pbody.innerHTML = "This is a pop-up! Click outside to close."
    p.show(150, 150, 200, 50, document.body)
}

myapp.controller('mySwatIOSBuildChart', function ($scope, $http) {
    $http.get("http://10.151.0.186:8080/SizeOnDiscDB/SizeOnDiscSwatIOS?sort_by=-hockeyappid")
        .success(function (data) {

            //var db_item;
            //var db_items = new Array;

            var db_items = data["_embedded"]["rh:doc"][0]["app_versions"];
            //var raw_version_numbers = [];
            //var android_build_sizes = [];
            var versions = new Array();
            var v_size_value_pairs = new Array();
            var notes = new Array();
            var v_time_value_pairs = {};
            var v_notes_value_pairs = {};

            var t1 = new Array();
            var t2 = new Array();


            var index;

            for (index = 0; index < 100; ++index) {
                if(db_items[index].version === db_items[index+1].version) {
                    continue;
                }


                var t = db_items[index];
                var version = t.version;
                var size = bytesToSize(t.appsize);
                var time = t.timestamp;
                v_size_value_pairs.unshift([version, size]);
                v_time_value_pairs[version] = formatDate(fomattedTime(time));
                notes.unshift(t.notes);
                v_notes_value_pairs[version] = t.notes;
            }

            //$scope.raw_db_items = "asb";
            //$scope.t1 = t1;
            //$scope.t2 = t2;

            $scope.chartConfig = {
                options: {

                    chart: {
                        type: 'line'
                    },

                    size: {
                        width: 400,
                        height: 500
                    },

                    xAxis: {
                        type: "category"
                    },

                    yAxis: {
                        title: {
                            text: 'Size ( MB )'
                        }
                    },


                    plotOptions: {
                        series: {
                            point: {

                                events: {
                                    click: function (e) {
                                        var content;
                                        if(notes[this.x] == ""){
                                            content = "Opps, No Release Notes Found!";
                                        }
                                        else{
                                            content = notes[this.x];
                                        }
                                        hs.htmlExpand(null, {
                                            pageOrigin: {
                                                x: e.pageX || e.clientX,
                                                y: e.pageY || e.clientY
                                            },
                                            headingText: "Changes: ",
                                            maincontentText: content,
                                            width: 500
                                        });
                                    }

                                    //mouseOver: function () {
                                    //    var chart = this.series.chart;
                                    //    if (!chart.lbl) {
                                    //        chart.lbl = chart.renderer.label('')
                                    //            .attr({
                                    //                padding: 10,
                                    //                r: 10,
                                    //                fill: Highcharts.getOptions().colors[1]
                                    //            })
                                    //            .css({
                                    //                color: '#FFFFFF'
                                    //            })
                                    //            .add();
                                    //    }
                                    //    chart.lbl
                                    //        .show()
                                    //        .attr({
                                    //            text: 'x: ' + this.x + ', y: ' + this.y
                                    //        });
                                    //}
                                }
                            },
                            events: {
                                mouseOut: function () {
                                    if (this.chart.lbl) {
                                        this.chart.lbl.hide();
                                    }
                                }
                            }
                        }
                    },

                    tooltip: {
                        enabled: true,
                        formatter: function () {
                            return 'ios build size: <b>' + this.y + '</b> MB' + '<br>' +
                                'version: <b>' + this.key + '</b>' +
                                '<br>' +
                                "upload time:  <b> " + v_time_value_pairs[this.key] + '</b>'
                        },
                        useHTML: true
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


myapp.controller('mySwatAndroidBuildChart', function ($scope, $http) {
    $http.get("http://10.151.0.186:8080/SizeOnDiscDB/SizeOnDiscSwatAndroid?sort_by=-hockeyappid")
        .success(function (data) {
            var raw_db_items = data["_embedded"]["rh:doc"];
            //var raw_version_numbers = [];
            //var android_build_sizes = [];
            var versions = new Array();
            var v_size_value_pairs = new Array();
            var v_time_value_pairs = {};

            var index;

            for (index = 0; index < raw_db_items.length; ++index) {
                var t = raw_db_items[index];
                var version = t.versionnumber;

                if (!_.contains(versions, version)) {
                    versions.push(version)
                    var size = bytesToSize(t.appsizeondisc);
                    var time = t.timeuploaded;
                    v_size_value_pairs.unshift([version, size])
                    v_time_value_pairs[version] = formatDate(fomattedTime(time));
                }
                //raw_version_numbers.push(v);n
                //android_build_sizes.push(s);
                //v_size_value_pairs.unshift([version,size]);
                //v_time_value_pairs[version] = time;
            }


            //$scope.hockey_db_data = raw_db_items;
            //
            //$scope.hockey_versions = raw_version_numbers;
            //
            //$scope.hockey_build_sizes = android_build_sizes;
            $scope.v_time_value_pairs = v_time_value_pairs;
            $scope.hockey_vs_pairs = v_size_value_pairs;
            $scope.fomattedTime1 = fomattedTime(1435103415);
            $scope.fomattedTime12 = formatDate(fomattedTime(1435103415));

            $scope.chartConfig = {

                options: {
                    chart: {
                        type: 'line'
                    },

                    size: {
                        width: 400,
                        height: 1300
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
                            return 'ios build size: <b>' + this.y + '</b> MB' + '<br>' +
                                'version: <b>' + this.key + '</b>' +
                                '<br>' +
                                "upload time:  <b> " + v_time_value_pairs[this.key] + '</b> <br> <br>'
                                + '<p><a color: #FF0000, href="http://build-01.dev.fusion.sparx.io:8080/view/SWAT%20Adhoc/job/SWAT%20Adhoc%20Android/" target="_blank">See what\'s new in this version</a></p>'
                                ;
                        },
                        useHTML: true
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



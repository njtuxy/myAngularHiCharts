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
            var db_items = data["_embedded"]["rh:doc"][0]["app_versions"];
            var versions = new Array();
            var v_size_value_pairs = new Array();
            var notes = new Array();
            var v_time_value_pairs = {};
            var v_notes_value_pairs = {};
            var index;

            var end;
            if(db_items.length < 10){
                end = db_items.length;
            }
            else{
                end = 10;
            }


            for (index = 0; index < end; ++index) {
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

            $scope.chartConfig = {
                options: {

                    chart: {
                        type: 'line'
                    },

                    size: {
                        width: 400,
                        height: 800
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
                    {data: v_size_value_pairs, name: "ios build size", color: '#6D6E71'}

                ],


                //series: $scope.chartSeries,

                title: {
                    useHTML: true,
                    text: "<img src='./icons/ios.png' alt='' style= 'width:40px;height:40px;' />" + "   " +  "iOS"
                }
            }

            $scope.reflow = function () {
                $scope.$broadcast('highchartsng.reflow');
            };
        })

});


myapp.controller('mySwatAndroidBuildChart', function ($scope, $http) {
    $http.get("http://10.151.0.186:8080/SizeOnDiscDB/SizeOnDiscSwatAndroid")
        .success(function (data) {
            var db_items = data["_embedded"]["rh:doc"][0]["app_versions"];
            var versions = new Array();
            var v_size_value_pairs = new Array();
            var notes = new Array();
            var v_time_value_pairs = {};
            var v_notes_value_pairs = {};


            var end;
            if(db_items.length < 10){
                end = db_items.length;
            }
            else{
                end = 10;
            }

            var index;
            for (index = 0; index < end-1; ++index) {
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
                            return 'android build size: <b>' + this.y + '</b> MB' + '<br>' +
                                'version: <b>' + this.key + '</b>' +
                                '<br>' +
                                "upload time:  <b> " + v_time_value_pairs[this.key] + '</b>'
                        },
                        useHTML: true
                    }
                },

                series: [
                    {data: v_size_value_pairs, name: "android build size", color: '#98BE35'}

                ],


                //series: $scope.chartSeries,

                title: {
                    useHTML: true,
                    text: "<img src='./icons/android.png' alt='' style= 'width:40px;height:40px;' />" + "   " +  "Android"
                }
            }

            $scope.reflow = function () {
                $scope.$broadcast('highchartsng.reflow');
            };
        })

});

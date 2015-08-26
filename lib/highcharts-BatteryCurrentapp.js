'use strict';

var myapp = angular.module('myapp', ["highcharts-ng"]);


var THEMAINARRAYCURRENT = new Array();
var THEMAINARRAYTEMPATURE = new Array();
var THETEMPARRAYTOPUTINMAINARRAY = new Array();

var oid_key                 = 0;
var versionofapk_key        = 1;
var phonemodel_key          = 2;
var phoneandroidversion_key = 3;
var phoneserialnumber_key   = 4;
var totalvalue_key          = 5;
var averagevalue_key        = 6;
var maxvalue_key            = 7;
var minvalue_key            = 8;
var user_key                = 9;
var starttime_key           = 10;
var endtime_key             = 11;
var startdate_key           = 12;
var enddate_key             = 13;

var PHONEHARDWAREARRAY = new Array();
var BUILDCATEGORIESARRAY = new Array();
var DEVICESFORHIGHCHARTS = new Array();


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

function buildnumbersort(a, b) {

    var aa=a.split(".");
    var bb=b.split(".");

    if (aa.length == bb.length) {

        for (var i = 0; i < aa.length; i++) {
            if (aa[i] != bb[i]) {
                return parseFloat(aa[i]) - parseFloat(bb[i]);
            }
        };

        return 0;

    }

    return 0;
        
}

function CheckIfTestDataCurrent(key,value) {
    switch (key) {
        case "$oid":
            THETEMPARRAYTOPUTINMAINARRAY[oid_key] = value;
            break;
        case "VersionOfApk":
            THETEMPARRAYTOPUTINMAINARRAY[versionofapk_key] = value;
            break;

        case "PhoneModel":
            THETEMPARRAYTOPUTINMAINARRAY[phonemodel_key] = value;
            break;


        case "PhoneAndroidVersion":
            THETEMPARRAYTOPUTINMAINARRAY[phoneandroidversion_key] = value;
            break;
            
        case "PhoneSerialNum":
            THETEMPARRAYTOPUTINMAINARRAY[phoneserialnumber_key] = value;
            break;
            
        case "TotalBattCurrent":
            THETEMPARRAYTOPUTINMAINARRAY[totalvalue_key] = value;
            break;
            
        case "AverageBattCurrent":
            THETEMPARRAYTOPUTINMAINARRAY[averagevalue_key] = value;
            break;
            
        case "MaxBattCurrent":
            THETEMPARRAYTOPUTINMAINARRAY[maxvalue_key] = value;
            break;
            
        case "MinBattCurrent":
            THETEMPARRAYTOPUTINMAINARRAY[minvalue_key] = value;
            break;
            
        case "User":
            THETEMPARRAYTOPUTINMAINARRAY[user_key] = value;
            break;
            
        case "StartTime":
            THETEMPARRAYTOPUTINMAINARRAY[starttime_key] = value;
            break;
            
        case "EndTime":
            THETEMPARRAYTOPUTINMAINARRAY[endtime_key] = value;
            break;
            
        case "StartDate":
            THETEMPARRAYTOPUTINMAINARRAY[startdate_key] = value;
            break;
            
        case "EndDate":
            THETEMPARRAYTOPUTINMAINARRAY[enddate_key] = value;
            var total = THEMAINARRAYCURRENT.push(THETEMPARRAYTOPUTINMAINARRAY);
            THETEMPARRAYTOPUTINMAINARRAY = new Array();
            //alert("Added an item to the MAIN ARRAY. THE LENGTH OF MAIN ARRAY IS NOw " + total);
            break;

    }
}

function GetDeviceBuildStatsInfo(jsonobject , functionpassed) {
    for (var i in jsonobject) {
        functionpassed.apply(this,[i,jsonobject[i]]);
        if (jsonobject[i] !== null && typeof(jsonobject[i])=="object") {
            GetDeviceBuildStatsInfo(jsonobject[i],functionpassed);
        }
    }
}


myapp.controller('mySwatBatteryCurrentChart', function ($scope, $http) {
    $http.get("http://10.151.0.186:8080/BatteryCurrentMetricsForSwat/Android")
        .success(function (data) {
           
            var db_items = data["_embedded"]["rh:doc"];
            
            for (var i=0 ; i < db_items.length ; i++) 
            { 
                GetDeviceBuildStatsInfo(db_items[i],CheckIfTestDataCurrent);
            }


            for (var i=0 ; i < THEMAINARRAYCURRENT.length ; i++)
            {
                var theearrayoftestdata =THEMAINARRAYCURRENT[i];

                var doesthebuildexistinbuildarray = $.inArray(theearrayoftestdata[versionofapk_key], BUILDCATEGORIESARRAY);
                if (doesthebuildexistinbuildarray < 0) {
                    BUILDCATEGORIESARRAY[BUILDCATEGORIESARRAY.length]=theearrayoftestdata[versionofapk_key];
                }

                var doesthehardwareexistinbuildarray = $.inArray(theearrayoftestdata[phonemodel_key], DEVICESFORHIGHCHARTS);
                if (doesthehardwareexistinbuildarray < 0) {
                    DEVICESFORHIGHCHARTS[DEVICESFORHIGHCHARTS.length]=theearrayoftestdata[phonemodel_key];
                }

                if (PHONEHARDWAREARRAY.length == 0) {

                    var tempDataArray = new Array(theearrayoftestdata[averagevalue_key], 1);
                    var tempBuildArray = new Array(theearrayoftestdata[versionofapk_key], tempDataArray);
                    var tempHardwareArray = new Array(theearrayoftestdata[phonemodel_key], tempBuildArray);
                    PHONEHARDWAREARRAY[PHONEHARDWAREARRAY.length]=tempHardwareArray;

                }
                else {
                    var foundhardware = -1;
                    for (var hardwarei = 0; hardwarei < PHONEHARDWAREARRAY.length; hardwarei++) {
                        if (PHONEHARDWAREARRAY[hardwarei][0].toString() === theearrayoftestdata[phonemodel_key].toString()) {
                            foundhardware = hardwarei;
                        }
                    }

                    if (foundhardware > -1) {
                        
                        var locationofphonemodel = PHONEHARDWAREARRAY[foundhardware][1];
                        

                        if (locationofphonemodel[0].toString() === theearrayoftestdata[versionofapk_key].toString()) {
                            
                            PHONEHARDWAREARRAY[foundhardware][1][1][0]=parseFloat(locationofphonemodel[1][0])+parseFloat(theearrayoftestdata[averagevalue_key])
                            PHONEHARDWAREARRAY[foundhardware][1][1][1]=parseFloat(locationofphonemodel[1][1])+1;

                        }
                        else
                        {
                            var tempDataArray = new Array(theearrayoftestdata[averagevalue_key], 1);
                            var tempBuildArray = new Array(theearrayoftestdata[versionofapk_key], tempDataArray);
                            PHONEHARDWAREARRAY[foundhardware][PHONEHARDWAREARRAY[foundhardware].length] = tempBuildArray;

                        }
                    }
                    else {

                        var tempDataArray = new Array(theearrayoftestdata[averagevalue_key], 1);
                        var tempBuildArray = new Array(theearrayoftestdata[versionofapk_key], tempDataArray);
                        var tempHardwareArray = new Array(theearrayoftestdata[phonemodel_key], tempBuildArray);
                        PHONEHARDWAREARRAY[PHONEHARDWAREARRAY.length]=tempHardwareArray;

                    }

                }
            }

           
            BUILDCATEGORIESARRAY.sort(buildnumbersort);
            DEVICESFORHIGHCHARTS.sort();



            var TEMPVALUE = 100;

            var SERIESFORHIGHCHARTS = []

            for (var xy = 0; xy < DEVICESFORHIGHCHARTS.length; xy++) {

                         if (xy == 0) {
                    SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + "{ \n \"name\": ";
                }
                else {
                    //SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + " , { \n \"name\": ";
                    SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + " \n \"name\": ";
                }
                
                SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + "\"" + String(DEVICESFORHIGHCHARTS[xy]) + "\"" + ", \n \"data\": [\n";

                for (var ab = 0; ab < BUILDCATEGORIESARRAY.length; ab++) {

                    if (ab == 0) {
                        SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + " [ ";
                    }
                    else {
                        SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + ",\n [ ";
                    }

                    SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + "\"" + BUILDCATEGORIESARRAY[ab] + "\"" + ", " + (TEMPVALUE * ab) +" ]";

                    
                };

               //SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + "\n ]\n } \n }";
               SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + "\n ]";

            };

            SERIESFORHIGHCHARTS = SERIESFORHIGHCHARTS + "\n }";

            //Testing output to make sure SERIESFORHIGHCHARTS IS CORRECT.
            // var newWindow = window.open("");
            // var body = newWindow.document.body;
            // var text = "innerText" in body ? "innerText" : "textContent";
            // body[text] = SERIESFORHIGHCHARTS;

            //console.log(SERIESFORHIGHCHARTS);
            console.log(JSON.stringify(PHONEHARDWAREARRAY));
            console.log(BUILDCATEGORIESARRAY);
            console.log(DEVICESFORHIGHCHARTS);



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
                        type: "Build",
                        categories: BUILDCATEGORIESARRAY
                    },

                    yAxis: {
                        title: {
                            text: 'Power Consumed'
                        }
                    }
                },

                series: [ 

                //SERIESFORHIGHCHARTS ],
                    
                    {
                        name: "Nexus 5",
                        data: [
                            ["0.1.0.146121",null],
                            ["0.2.0.147455",-20775],
                            ["0.2.0.147748",null],
                            ["0.2.0.147893",null],
                            ["0.2.0.148125",null],
                            ["0.2.0.148235",null],
                            ["0.2.0.148389",-136005],
                            ["0.2.0.148424",null],
                            ["0.2.0.148545",null],
                            ["0.2.0.148574",-257979],
                            ["0.2.0.148721",null],
                            ["0.2.0.148741",null],
                            ["0.2.0.148992",null],
                            ["0.2.0.149203",null],
                            ["0.2.0.149267",null],
                            ["0.2.0.150275",-398941],
                            ["0.3.0.152370",-355895]
                        ]
                        }, {
                        name: "Nexus 6",
                        data: [
                            ["0.1.0.146121",null],
                            ["0.2.0.147455",null],
                            ["0.2.0.147748",-516048],
                            ["0.2.0.147893",null],
                            ["0.2.0.148125",null],
                            ["0.2.0.148235",null],
                            ["0.2.0.148389",null],
                            ["0.2.0.148424",null],
                            ["0.2.0.148545",null],
                            ["0.2.0.148574",null],
                            ["0.2.0.148721",null],
                            ["0.2.0.148741",null],
                            ["0.2.0.148992",null],
                            ["0.2.0.149203",-481318],
                            ["0.2.0.149267",null],
                            ["0.2.0.150275",null],
                            ["0.3.0.152370",null]
                        ]
                        }, {
                        name: "Nexus 9",
                        data: [
                            ["0.1.0.146121",-1931735],
                            ["0.2.0.147455",null],
                            ["0.2.0.147748",null],
                            ["0.2.0.147893",-1944033],
                            ["0.2.0.148125",null],
                            ["0.2.0.148235",-2325000],
                            ["0.2.0.148389",null],
                            ["0.2.0.148424",-2505015],
                            ["0.2.0.148545",null],
                            ["0.2.0.148574",null],
                            ["0.2.0.148721",null],
                            ["0.2.0.148741",null],
                            ["0.2.0.148992",-1558515],
                            ["0.2.0.149203",null],
                            ["0.2.0.149267",null],
                            ["0.2.0.150275",null],
                            ["0.3.0.152370",null]
                        ]
                        },{
                        name: "SM-G900V",
                        data: [
                            ["0.1.0.146121",null],
                            ["0.2.0.147455",null],
                            ["0.2.0.147748",null],
                            ["0.2.0.147893",null],
                            ["0.2.0.148125",450],
                            ["0.2.0.148235",null],
                            ["0.2.0.148389",450],
                            ["0.2.0.148424",450],
                            ["0.2.0.148424",null],
                            ["0.2.0.148545",null],
                            ["0.2.0.148574",null],
                            ["0.2.0.148721",null],
                            ["0.2.0.148741",null],
                            ["0.2.0.148992",null],
                            ["0.2.0.149203",null],
                            ["0.2.0.149267",null],
                            ["0.2.0.150275",null],
                            ["0.3.0.152370",null]
                        ]
                        },{
                        name: "SM-G925F",
                        data: [
                            ["0.1.0.146121",null],
                            ["0.2.0.147455",null],
                            ["0.2.0.147748",null],
                            ["0.2.0.147893",null],
                            ["0.2.0.148125",null],
                            ["0.2.0.148235",null],
                            ["0.2.0.148389",-366],
                            ["0.2.0.148424",null],
                            ["0.2.0.148545",null],
                            ["0.2.0.148574",null],
                            ["0.2.0.148721",-346],
                            ["0.2.0.148741",-274],
                            ["0.2.0.148992",null],
                            ["0.2.0.149203",null],
                            ["0.2.0.149267",-500],
                            ["0.2.0.150275",null],
                            ["0.3.0.152370",null]
                        ]
                    }

                ],


                title: {
                    useHTML: true,
                    text: "Battery Current Being Used! (Note This is Measured while Plugged into a computer)"
                }
            }

            // var chart = $("#chart2").highcharts();

            // chart.addSeries(
            // {
            //     name: "Nexus 9",
            //     data: [
            //             ["0.2.0.148992",-1558515],
            //             ["0.2.0.148424",-2505015],
            //             ["0.2.0.148235",-2325000],
            //             ["0.2.0.147893",-1912174],
            //             ["0.2.0.147893",-1884722],
            //             ["0.2.0.147893",-2035203],
            //             ["0.1.0.146121",-1860523],
            //             ["0.1.0.146121",-1579335],
            //             ["0.1.0.146121",-2569694],
            //             ["0.1.0.146121",-1815392],
            //             ["0.1.0.146121",-1864000],
            //             ["0.1.0.146121",-1901466],
            //             ["0.1.0.146121",-1901466],
            //             ["0.1.0.146121",-1901466]
            //           ]
            // });

            //chart.redraw();

            $scope.reflow = function () {
                $scope.$broadcast('highchartsng.reflow');
            };
        })

});



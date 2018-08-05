/*
 * @Author: renmin 
 * @Date: 2018-07-03 16:13:46 
 * @Last Modified by: renmin
 * @Last Modified time: 2018-08-05 16:51:04
 */


'use strict';
require.config(__FRAMEWORK_CONFIG__);
var array = [],
    deviceWidth = window.screen.width,
    howManyDaysTheMonth,
    howManyDaysNextMonth,
    whichYear,
    whichMonth,
    mNext,
    today,
    yNext,
    judgeTechOrMid;


require.async(['jquery', 'ares-basic', 'handlebars'], function ($, Ares, Handlebars) {

    var _app = {
        data: {
            // 日期对象
            date: new Date(),
            // 当前年份
            year: new Date().getFullYear(),
            // 当前月份
            month: new Date().getMonth() + 1,
            // 当前几号
            day: new Date().getDate(),
            todayFunc: function () {
                var a = new Date();
                var year = a.getFullYear();
                var month = a.getMonth() + 1;

                var day = a.getDate();

                // alert(JSON.stringify(year) + JSON.stringify(month) + JSON.stringify(day));
                // var yearStr = nian.toString();
                if (month < 10) {
                    var monthStr = "0" + month;
                } else {
                    var monthStr = month.toString();
                }
                if (day < 10) {
                    var dayStr = "0" + day;
                } else {
                    var dayStr = day.toString();
                }
                var dataStr = year + monthStr + dayStr;
                return dataStr;

            },
            // 当前周几
            dWeek: new Date().getDay(),
            // 一号周几
            isWeek: new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/1').getDay(),
            // 本月多少天
            monthDays: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
            // 上一月
            previous: function () {

                var y = $('.year').text();
                var y = Number(y);
                var m = $('.month').text();
                if (m == 1) {
                    y--;
                    m = 12;
                } else {
                    m--;
                }
                if (m < 10) {
                    m = "0" + m;
                } else {
                    m = m;
                }
                $('.year').text(y);
                $('.month').text(m);
                whichYear = y;
                whichMonth = m;

                // 上个月年月日
                var yearMonthDay = JSON.stringify(y) + m + "01";

                // 该月有多少天
                var howManyDaysTheMonth = new Date(y, m, 0).getDate();

                if (m == 12) {
                    mNext = 1;
                    yNext = y + 1;
                }
                else if (m < 12) {
                    mNext = Number(m) + 1;
                    yNext = y;
                }


                // alert(yNext)
                // alert(JSON.stringify(yNext)+JSON.stringify(mNext))
                // 下个月有多少天
                var howManyDaysNextMonth = new Date(yNext, mNext, 0).getDate();
                // alert(howManyDaysNextMonth);


                array = [];

                for (var i = 1; i <= howManyDaysTheMonth; i++) {

                    var obj = {
                        DAY: i
                    };
                    array.push(obj);
                    console.log(array);
                }

                var url = document.location.toString();
                if (url.charAt(url.length - 1) == 2) {
                    var data = {

                        CREATE_TIME: yearMonthDay,
                        ADDRESS: "科技部",
                        PAGE_NO: 1,
                        PAGE_SIZE: 10
                    }

                    _app.renderTech(data, howManyDaysTheMonth, howManyDaysNextMonth, whichYear, whichMonth);


                }
                // 中金
                else if (url.charAt(url.length - 1) == 3) {
                    var data = {

                        CREATE_TIME: yearMonthDay,
                        ADDRESS: "中金",
                        PAGE_NO: 1,
                        PAGE_SIZE: 10
                    }

                    _app.renderMidGold(data, howManyDaysTheMonth, howManyDaysNextMonth, whichYear, whichMonth);

                }

            },
            next: function () {

                var y = $('.year').text();
                var y = Number(y);
                var m = $('.month').text();
                if (m == 12) {
                    y++;
                    m = 1;
                } else {
                    m++;
                }
                if (m < 10) {
                    m = "0" + m;
                } else {
                    m = m;
                }
                $('.year').text(y);
                $('.month').text(m);
                whichYear = y;
                whichMonth = m;
                // 上个月年月日
                var yearMonthDay = JSON.stringify(y) + m + "01";
                // 该月有多少天
                var howManyDaysTheMonth = new Date(y, m, 0).getDate();

                if (m == 12) {
                    mNext = 1;
                    yNext = y + 1;
                }
                else if (m < 12) {
                    mNext = Number(m) + 1;
                    yNext = y;
                }

                var howManyDaysNextMonth = new Date(yNext, mNext, 0).getDate();


                array = [];
                var a = new Date();

                for (var i = 1; i <= howManyDaysTheMonth; i++) {

                    var obj = {
                        DAY: i
                    };
                    array.push(obj);
                    console.log(array);
                }


                var url = document.location.toString();
                if (url.charAt(url.length - 1) == 2) {
                    var data = {

                        CREATE_TIME: yearMonthDay,
                        ADDRESS: "科技部",
                        PAGE_NO: 1,
                        PAGE_SIZE: 10
                    }

                    _app.renderTech(data, howManyDaysTheMonth, howManyDaysNextMonth, whichYear, whichMonth);



                } else if (url.charAt(url.length - 1) == 3) {



                    var data = {
                        CREATE_TIME: yearMonthDay,
                        ADDRESS: "中金",
                        PAGE_NO: 1,
                        PAGE_SIZE: 10

                    }

                    _app.renderMidGold(data, howManyDaysTheMonth, howManyDaysNextMonth, whichYear, whichMonth)

                }

            }
        },

        init: function () {
            // this.ajaxGet();
            // 值班情况
            _app.currentOnDuty();
            _app.isPage();


            // 绑定事件
            _app.bindElement();

            //年月日星期
            _app.yearMonthDayWeek();
            this.userIdGet();


        },

        // 根据地址值判断状态，切换样式，下一级页面返回使用
        isPage: function () {

            var url = document.location.toString();
            if (url.charAt(url.length - 1) == 1) {
                _app.option1();

            } else if (url.charAt(url.length - 1) == 2) {
                history.replaceState(null, null, "?page=2");
                _app.option2();
            } else if (url.charAt(url.length - 1) == 3) {
                history.replaceState(null, null, "?page=3");
                _app.option3();

            }
        },
        // 点击当前值班情况按钮
        option1: function () {

            history.replaceState(null, null, "?page=1");
            $('.todayP').css("display", "flex");
            $('.box').css({ 'display': 'none' });
            $('.title').css({ 'display': 'flex' });
            $('.one').css({ 'display': 'flex' });
            $('.todayList').css('display', 'block');
            $('#option1').css({ 'background-color': '#71CB43', 'color': 'white', 'border-color': '#71CB43' });
            $('#option2').css({ 'background-color': 'white', 'color': '#71CB43', 'border-color': 'white' });
            $('#option3').css({ 'background-color': 'white', 'color': '#71CB43', 'border-color': 'white' });

            _app.currentOnDuty();

        },
        // 点击科技部按钮
        option2: function () {
            // judgeTechOrMid="02";
            // _app.renderCalendar();
            howManyDaysTheMonth = _app.data.monthDays;

            $('.year').text(_app.data.year);

            // 给月份前面加零
            if (_app.data.month <= 9 && _app.data.month.length != 2) {
                _app.data.month = "0" + _app.data.month
            }
            $('.month').text(_app.data.month);

            whichYear = _app.data.year;
            whichMonth = _app.data.month;
            if (_app.data.month == 12) {
                mNext = 1;
                yNext = _app.data.year + 1;
            } else {
                mNext = Number(_app.data.month) + 1;
                yNext = Number(_app.data.year);
            }
            // alert(mNext);
            // alert(yNext);

            howManyDaysNextMonth = new Date(yNext, mNext, 0).getDate();
            // alert( howManyDaysNextMonth);
            // 添加标记链接
            history.replaceState(null, null, "?page=2");
            // $('.one').css({ 'display': 'none' })
            $('.todayP').css('display', 'none');
            $('.todayList').css({ display: 'none' });

            var data = {
                // 当前时间
                CREATE_TIME: _app.data.todayFunc(),
                ADDRESS: "科技部",
                PAGE_NO: "1",
                PAGE_SIZE: "10"
            }

            _app.renderTech(data, howManyDaysTheMonth, howManyDaysNextMonth, whichYear, whichMonth);
            // alert(whichYear)
            $('#option2').css({ 'background-color': '#71CB43', 'color': 'white', 'border-color': '#71CB43' });
            $('#option1').css({ 'background-color': 'white', 'color': '#71CB43', 'border-color': 'white' });
            $('#option3').css({ 'background-color': 'white', 'color': '#71CB43', 'border-color': 'white' });


        },
        // 点击中金
        option3: function () {
            // judgeTechOrMid="03";
            howManyDaysTheMonth = _app.data.monthDays
            $('.year').text(_app.data.year);
            $('.month').text(_app.data.month);

            whichYear = _app.data.year;
            whichMonth = _app.data.month;
            if (_app.data.month == 12) {
                mNext = 1;
                yNext = _app.data.year + 1;
            } else {
                mNext = Number(_app.data.month) + 1;
                yNext = Number(_app.data.year);
            }
            // alert(mNext)
            howManyDaysNextMonth = new Date(yNext, mNext, 0).getDate();
            // 添加标记链接
            history.replaceState(null, null, "?page=3");
            // $('.one').css({ 'display': 'none' })

            var data = {
                // 当前时间
                CREATE_TIME: _app.data.todayFunc(),
                ADDRESS: "中金",
                PAGE_NO: "1",
                PAGE_SIZE: "10"
            }
            history.replaceState(null, null, "?page=3");
            $('.box').css({ display: 'block' });
            $('.one').css("display", "none");
            $('.todayList').css({ display: 'none' });
            // $('.title').css({ display: 'none' });
            $('#option3').css({ 'background-color': '#71CB43', 'color': 'white', 'border-color': '#71CB43' });
            $('#option1').css({ 'background-color': 'white', 'color': '#71CB43', 'border-color': 'white' });
            $('#option2').css({ 'background-color': 'white', 'color': '#71CB43', 'border-color': 'white' });
            $(".todayP").css("display", "none");
            _app.renderMidGold(data, howManyDaysTheMonth, howManyDaysNextMonth, whichYear, whichMonth);



        },
        renderTech: function (data, howManyDaysTheMonth, howManyDaysNextMonth, whichYear, whichMonth) {

            Ares.Service.get('rota/techRotaList', data, function (rets) {
                console.log("rets++++++++++" + JSON.stringify(rets.list));
                if (JSON.stringify(rets.list) == "{}") {
                    // _app.data.monthDays
                    var totalDays = new Date($(".year").text(), $(".month").text(), 0).getDate();

                    var list = [];
                    for (i = 1; i <= totalDays; i++) {
                        list[i - 1] = { "DAY": i };
                    }
                    rets = {
                        list: list
                    }
                    var source = $("#techTemplate").html();
                    var template = Handlebars.compile(source);

                    $("#_list").html(template(rets));
                    //  这月1号周几
                    var xday = new Date($(".year").text() + "/" + $(".month").text() + "/" + 1).getDay();


                    var html2 = '';

                    for (var j = howManyDaysNextMonth - xday + 1; j <= howManyDaysNextMonth; j++) {

                        html2 += "<li class='no_date'>" + j + "</li>";

                    }
                    $('.date ul li').eq(0).before(html2);

                    // //计算后面空格键；
                    var daysTotal = new Date($(".year").text(), $(".month").text(), 0).getDate();

                    var html3 = '';
                    for (var x = 1; x < 43 - daysTotal - xday; x++) {
                        html3 += "<li class='no_date'>" + x + "</li>";
                    }
                    $('.date ul li').eq(daysTotal + xday - 1).after(html3);
                    $(".date ul li").css("height", deviceWidth / 7);
                }
                else {
                    // alert(JSON.stringify(rets));
                    var arr = [];
                    var obj = {
                    };
                    var n;

                    var dayIndex;

                    // for (var prop in rets.list) {

                    //     dayIndex = (prop.slice(8, 10));

                    //     obj = {
                    //         DAY: dayIndex.toString(),
                    //         innerList: rets.list[prop]
                    //     }

                    //     arr.push(obj);

                    // }
                    // alert("arr" + JSON.stringify(arr));
                    // alert(l)
                    // for (i = 0; i <= l-1; i++) {
                    //     console.log(rets.list[i]);
                    // }

                    jQuery.each(rets.list, function (i, val) {
                        dayIndex = (i.slice(8, 10));
                        // alert(i)
                        // text = text + i +":"+ JSON.stringify(val) + ",";
                        console.log(JSON.stringify(val));
                        obj = {
                            DAY: dayIndex,
                            innerList: val
                        }
                        arr.push(obj);
                    });
                    // alert("arr1" + JSON.stringify(arr));
                    // 晚上测试先把去零代码注释掉

                    // 去零
                    // for (var i = 1; i <= arr.length; i++) {
                    //     if (arr[i - 1].DAY.slice(0, 1) == 0) {
                    //         // 赋值
                    //         arr[i - 1].DAY = i
                    //         // 截取


                    //     }
                    // }


                    // 按DAY排序，兼容safri浏览器
                    arr.sort(function (a, b) {
                        return a.DAY - b.DAY;
                    });
                    // alert("arr2" + JSON.stringify(arr));

                    for (var i = 1; i <= 9; i++) {
                        arr[i - 1].DAY = i.toString();
                    }
                    // alert("arr3" + JSON.stringify(arr));

                    // 去零


                    var params;

                    // 上下晚排序
                    var len;
                    // console.log("arr!!!!!!" + JSON.stringify(arr));
                    for (var i = 0; i <= arr.length - 1; i++) {
                        len = arr[i].innerList.length;
                        if (len == 3) {
                            if (arr[i].innerList[0].TIMESLOT == "下") {
                                params = arr[i].innerList[1];//中间的
                                arr[i].innerList[1] = arr[i].innerList[0];
                                arr[i].innerList[0] = params;
                                if (arr[i].innerList[0].TIMESLOT == "晚") {
                                    params = arr[i].innerList[0];
                                    arr[i].innerList[0] = arr[i].innerList[2];
                                    arr[i].innerList[2] = params
                                }
                            }
                            else if (arr[i].innerList[0].TIMESLOT == "晚") {
                                params = arr[i].innerList[2];
                                arr[i].innerList[2] = arr[i].innerList[0];
                                arr[i].innerList[0] = params;
                                if (arr[i].innerList[0].TIMESLOT == "下") {
                                    params = arr[i].innerList[0];
                                    arr[i].innerList[0] = arr[i].innerList[1];
                                    arr[i].innerList[1] = params
                                }
                            }
                            else if (arr[i].innerList[0].TIMESLOT == "上") {
                                if (arr[i].innerList[1].TIMESLOT == "晚") {
                                    params = arr[i].innerList[2];
                                    arr[i].innerList[2] = arr[i].innerList[1];
                                    arr[i].innerList[1] = params;
                                }

                            }
                        }

                    }

                    console.log("arr???????????????????" + JSON.stringify(arr));
                    var outObj = {
                        list: arr
                    }

                    // alert(JSON.stringify(typeof outObj.list[0]));
                    // alert("arr____________" + JSON.stringify(arr));
                    for (var i, i = 0; i <= n - 1; i++) {
                        // if (i <= 9) {
                        array[i] = i + 1;

                        // } else {
                        //     array
                        // }
                    }

                    // var arrayObj = new Object();
                    // arrayObj.array = array;

                    // console.log("outObj+++++++++++++" + JSON.stringify(outObj));
                    // handlebars渲染数据
                    var source = $("#techTemplate").html();
                    var template = Handlebars.compile(source);

                    $("#_list").html(template(outObj));

                    // alert("outObj________________" + JSON.stringify(outObj));
                    $(".date ul li").css("height", deviceWidth / 7);   // // 前后添加空格

                    //  这月1号周几
                    var xday = new Date($(".year").text() + "/" + $(".month").text() + "/" + 1).getDay();

                    var html2 = '';

                    for (var j = howManyDaysNextMonth - xday + 1; j <= howManyDaysNextMonth; j++) {

                        html2 += "<li class='no_date'>" + j + "</li>";

                    }

                    $('.date ul li').eq(0).before(html2);
                    $(".date ul li").css("height", deviceWidth / 7);

                    // //计算后面空格键；
                    var daysTotal = new Date($(".year").text(), $(".month").text(), 0).getDate();

                    var html3 = '';
                    for (var x = 1; x < 43 - daysTotal - xday; x++) {
                        html3 += "<li class='no_date'>" + x + "</li>";
                    }
                    $('.date ul li').eq(daysTotal + xday - 1).after(html3);
                    $(".date ul li").css("height", deviceWidth / 7);


                    // $(".date ul li").css("height", deviceWidth / 7);

                    // alert(whichYear.toString()+whichMonth.toString());
                    // 给周末添加样式,要在渲染之后添加
                    for (var i = 1; i <= howManyDaysTheMonth; i++) {

                        // 周几

                        var wk = new Date(whichYear.toString() + "/" + whichMonth.toString() + "/" + i).getDay();

                        // 给周末加颜色
                        if (wk == 6 || wk == 0) {
                            $('.day').eq(i - 1).addClass('weekend');
                        } else {
                            $('.day').eq(i - 1).addClass('workDay');
                            // 对齐格式
                            $('.day').eq(i - 1).children(0).after("<span class='spanUp'></span>")
                        }
                        // alert(new Date().getMonth());
                        // alert($(".month").text());
                        //    ==;
                        if (i <= 9) {
                            i = "0" + i;
                        }
                        // alert($(".year").text() + $(".month").text() + i );
                        if (_app.data.day <= 9) {
                            today = "0" + _app.data.day;
                        }
                        // alert(_app.data.year + _app.data.month + _app.data.day)
                        // 判断日期是否为今天 today为今日日期
                        if ($(".year").text() + $(".month").text() + i == _app.data.year + _app.data.month + today) {
                            $('.day').eq(i - 1).addClass('today');
                        }
                        // if (new Date().getDate() == i && new Date().getMonth() == $(".month").text()) {

                        // }

                        // 判断是否为该用户值班
                        if (outObj.list[i - 1].innerList.length == 3 && whichMonth >= _app.data.month) {

                            for (var j = 0; j <= 2; j++) {
                                // alert(outObj.list[i-1].innerList[j].USERNAME== JSON.parse(localStorage.getItem("customMessage")).NAME_CN);
                                if (outObj.list[i - 1].innerList[j].USERNAME == JSON.parse(localStorage.getItem("customMessage")).NAME_CN) {//添加今日以后的值班样式
                                    $("#_list").children(".day").eq(i - 1).addClass("dutyDay");
                                    var time = outObj.list[i - 1].innerList[j].TIMESLOT;
                                    if (time == "下") {
                                        time = "下午";
                                    }
                                    else if (time == "上") {
                                        time = "上午";
                                    }
                                    else if (time == "晚") {
                                        time = "晚上"
                                    }

                                }

                            }
                        }
                        // i >= _app.data.day - 1
                        else if (outObj.list[i - 1].innerList.length == 1 && whichMonth >= _app.data.month) {

                            if (outObj.list[i - 1].innerList[0].USERNAME == JSON.parse(localStorage.getItem("customMessage")).NAME_CN) {
                                $("#_list").children(".day").eq(i - 1).addClass("dutyDay");
                                // var time =outObj.list[i-1].innerList[0].TIMESLOT;
                            }

                        }
                        if (i < _app.data.day && whichMonth == _app.data.month) {
                            $("#_list").children(".day").eq(i - 1).removeClass("dutyDay");


                        }
                        $(".dutyDay:first").addClass("firstDutyDay");



                    }
                    // $(".no_date").removeClass("dutyDay");

                    $('.box').css({ display: 'block' });
                    $('.title').css({ display: 'none' });

                    $('#option2').css({ 'background-color': '#71CB43', 'color': 'white', 'border-color': '#71CB43' });
                    $('#option1').css({ 'background-color': 'white', 'color': '#71CB43', 'border-color': 'white' });
                    $('#option3').css({ 'background-color': 'white', 'color': '#71CB43', 'border-color': 'white' });


                }


                $(".dutyDay").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // alert(e.target);
                    if ($(this).hasClass("weekend")) {
                        var weekendOrNot = 1;

                    } else {
                        var weekendOrNot = 0;
                    }
                    var userId = JSON.parse(localStorage.getItem("customMessage")).USER_ID;
                    var userName = JSON.parse(localStorage.getItem("customMessage")).NAME_CN;

                    var year = $('.year').text();
                    var month = $('.month').text();

                    var clickDay = $(this).children(".number").eq(0).html();

                    if (clickDay <= 9) {
                        clickDay = "0" + clickDay
                    }
                    var clickYearMonthDay = year + month + clickDay;
                    // alert($(this).children().length);
                    // alert($(this).children(".spanUp").html())
                    // alert(clickYearMonthDay);
                    // alert(clickYearMonthDay);
                    var liParams;
                    // 周末
                    if ($(this).children().length == 4) {
                        liParams = {
                            LOGIN_NAME: userId,
                            USERNAME: userName,
                            ADDRESS: "科技部",
                            CREATE_TIME: clickYearMonthDay,
                            TIMESLOT: time,
                            OPTIONS: 2,
                            judgeTechOrMid: judgeTechOrMid,
                            weekendOrNot: weekendOrNot,

                        }
                        // alert(JSON.stringify(liParams));
                    }
                    // 工作日
                    else if ($(this).children().length == 2) {
                        liParams = {
                            LOGIN_NAME: userId,
                            USERNAME: userName,
                            ADDRESS: "科技部",
                            CREATE_TIME: clickYearMonthDay,
                            TIMESLOT: "晚上",
                            OPTIONS: 2,
                            judgeTechOrMid: judgeTechOrMid,
                            weekendOrNot: weekendOrNot
                        }
                    }
                    // alert(JSON.stringify(liParams));
                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/rota/application/application.html", liParams);
                });
            });
        },

        renderMidGold: function (data, howManyDaysTheMonth, howManyDaysNextMonth, whichYear, whichMonth) {

            Ares.Service.get('rota/midGoldRotaList', data, function (rets) {
                console.log("rets_____________________" + JSON.stringify(rets));
                // alert("rets"+JSON.stringify(rets))
                if (!JSON.stringify(rets.list)) {

                    // _app.data.monthDays
                    var totalDays = new Date($(".year").text(), $(".month").text(), 0).getDate();

                    var list = [];
                    for (i = 1; i <= totalDays; i++) {
                        list[i - 1] = { "DAY": i };
                    }
                    rets = {
                        list: list
                    }
                    var source = $("#techTemplate").html();
                    var template = Handlebars.compile(source);

                    $("#_list").html(template(rets));
                    //  这月1号周几
                    var xday = new Date($(".year").text() + "/" + $(".month").text() + "/" + 1).getDay();


                    var html2 = '';

                    for (var j = howManyDaysNextMonth - xday + 1; j <= howManyDaysNextMonth; j++) {

                        html2 += "<li class='no_date'>" + j + "</li>";

                    }
                    $('.date ul li').eq(0).before(html2);

                    // //计算后面空格键；
                    var daysTotal = new Date($(".year").text(), $(".month").text(), 0).getDate();

                    var html3 = '';
                    for (var x = 1; x < 43 - daysTotal - xday; x++) {
                        html3 += "<li class='no_date'>" + x + "</li>";
                    }
                    $('.date ul li').eq(daysTotal + xday - 1).after(html3);
                    $(".date ul li").css("height", deviceWidth / 7);
                } else {

                    var arr = [];
                    var obj = {};

                    var dayIndex;
                    // alert(JSON.stringify(rets.list));
                    for (i = 0; i <= rets.list.length - 1; i++) {
                        // for (var prop in rets.list) {

                        // 截取日期并转换成数字类型
                        dayIndex = rets.list[i].CREATE_TIME.slice(8, 10);



                        obj = {
                            DAY: dayIndex.toString(),
                            USERNAME: rets.list[i].USERNAME.toString()
                        }

                        arr.push(obj);

                    }

                    for (var i = 1; i <= 9; i++) {
                        arr[i - 1].DAY = i.toString();
                    }

                    var outObj = {
                        list: arr
                    }


                    console.log("OBJ_____________" + JSON.stringify(obj));

                    console.log("arr____________" + JSON.stringify(arr));


                    // handlebars渲染数据
                    var source = $("#midGoldTemplate").html();
                    var template = Handlebars.compile(source);
                    console.log(JSON.stringify(outObj.list));
                    $("#_list").html(template(outObj));

                    console.log("outObj________________" + JSON.stringify(outObj));
                    $(".date ul li").css("height", deviceWidth / 7);


                    // // 前后添加空格

                    //  这月1号周几
                    var xday = new Date($(".year").text() + "/" + $(".month").text() + "/" + 1).getDay();

                    var html2 = '';
                    for (var j = Number(howManyDaysNextMonth) - xday + 1; j <= Number(howManyDaysNextMonth); j++) {

                        html2 += "<li class='no_date'>" + j + "</li>";

                    }
                    $('.date ul li').eq(0).before(html2);

                    // //计算后面空格键；
                    var daysTotal = new Date($(".year").text(), $(".month").text(), 0).getDate();

                    var html3 = '';
                    for (var x = 1; x < 43 - daysTotal - xday; x++) {
                        html3 += "<li class='no_date'>" + x + "</li>";
                    }
                    $('.date ul li').eq(daysTotal + xday - 1).after(html3);
                    $(".date ul li").css("height", deviceWidth / 7);
                    // alert( _app.data.month);
                    // 给周末添加样式,要在渲染之后添加

                    for (var i = 1; i <= howManyDaysTheMonth; i++) {

                        // 周几

                        var wk = new Date(whichYear.toString() + "/" + whichMonth.toString() + "/" + i).getDay();

                        // 给周末加颜色
                        if (wk == 6 || wk == 0) {
                            $('.day').eq(i - 1).addClass('weekend');
                        }

                        // 判断日期是否为今天
                        if ($(".year").text() + $(".month").text() + i == _app.data.year + _app.data.month + _app.data.day) {
                            $('.day').eq(i - 1).addClass('today');
                        }
                        // i >= _app.data.day - 1

                        if (JSON.parse(localStorage.customMessage).NAME_CN == outObj.list[i - 1].USERNAME) {
                            $("#_list").children(".day").eq(i - 1).addClass("dutyDay");
                        }

                        if (i < _app.data.day && whichMonth == _app.data.month) {
                            $("#_list").children(".day").eq(i - 1).removeClass("dutyDay");

                        }

                    }

                }


                $(".dutyDay").click(function (e) {
                    // e.preventDefault();
                    // e.stopPropagation;

                    var userId = JSON.parse(localStorage.getItem("customMessage")).USER_ID;
                    var userName = JSON.parse(localStorage.getItem("customMessage")).NAME_CN;

                    var year = $('.year').text();
                    var month = $('.month').text();
                    // if (month <= 9) {
                    //     month = "0" + month
                    // }
                    var clickDay = $(this).children(".number").eq(0).html();

                    if (clickDay <= 9) {
                        clickDay = "0" + clickDay
                    }
                    var clickYearMonthDay = year + month + clickDay;
                    // alert($(this).children().length);
                    // alert($(this).children(".spanUp").html())
                    // alert(clickYearMonthDay);
                    // alert(clickYearMonthDay);
                    var liParams = {
                        LOGIN_NAME: userId,
                        USERNAME: userName,
                        ADDRESS: "中金",
                        CREATE_TIME: clickYearMonthDay,
                        TIMESLOT: "全天",
                        OPTIONS: 3,
                        judgeTechOrMid: judgeTechOrMid
                    }
                    // alert(JSON.stringify(liParams));


                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/rota/application/application.html", liParams);

                });
                $(".dutyDay:first").addClass("firstDutyDay");


                // $('.box').css({ display: 'block' });
                // $('.title').css({ display: 'none' });
            });
        },

        // 判断是不是周末
        weekendOrNot: function () {
            //判断是否是周六或周日；添加特殊样式
            if (_app.data.dWeek == 6 || _app.data.dWeek == 0) {
                $('.date ul li').addClass('weekend');
            }
        },

        userIdGet: function () {
            var userId = localStorage.getItem("customMessage").USER_ID;

        },
        todayFunc: function () {
            var a = new Date();
            var year = a.getFullYear();
            var month = a.getMonth() + 1;

            var day = a.getDate();

            // alert(JSON.stringify(year) + JSON.stringify(month) + JSON.stringify(day));
            // var yearStr = nian.toString();
            if (month < 10) {
                var monthStr = "0" + month;
            } else {
                var monthStr = month.toString();
            }
            if (day < 10) {
                var dayStr = "0" + day;
            } else {
                var dayStr = day.toString();
            }
            var dataStr = year + monthStr + dayStr;

        },

        yearMonthDayWeek: function () {
            // _app.baseCalendar();
            $('.yearY').html(_app.data.year);
            $('.monthM').html(_app.data.month);
            $('.dayD').html(_app.data.day);
            var weekday = new Array("星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日");

            if (_app.data.dWeek == 0) {
                // 周日
                $('.rightSpan').html(weekday[_app.data.dWeek + 6]);
            }
            // 周一至周六
            else { $('.rightSpan').html(weekday[_app.data.dWeek - 1]); }
        },
        currentOnDuty: function () {


            var a = new Date();

            var hours = a.getHours();

            var minutes = a.getMinutes();
            // alert(hours)
            var period;


            // 判断当前时段
            if (hours == 8 && minutes >= 30) {
                period = "上午";
            } else if (hours >= 9 && hours < 12) {
                period = "上午";
            } else if (hours >= 12 && hours < 17) {
                period = "下午";
            } else if (hours == 17 && minutes <= 30) {
                period = "下午";
            } else if (hours == 17 && minutes > 30) {
                period = "晚上";
            } else if (hours >= 18) {
                period = "晚上";
            } else if (hours < 8) {
                period = "晚上";
            } else if (hours == 8 && minutes < 30) {
                period = "晚上";
            }


            var year = a.getFullYear();
            var month = a.getMonth() + 1;

            var day = a.getDate();

            // alert(JSON.stringify(year) + JSON.stringify(month) + JSON.stringify(day));
            // var yearStr = nian.toString();
            if (month < 10) {
                var monthStr = "0" + month;
            } else {
                var monthStr = month.toString();
            }
            if (day < 10) {
                var dayStr = "0" + day;
            } else {
                var dayStr = day.toString();
            }
            var dataStr = year + monthStr + dayStr;

            // 如果是工作日请求 晚上 
            if (_app.data.dWeek == 6 || _app.data.dWeek == 0) {
                // 当前值班请求报文
                var current = {
                    CURRENTROTATIME: dataStr,
                    TIMESLOT: period,
                    // TIMESLOT: "晚上",
                    PAGE_NO: "1",
                    PAGE_SIZE: "10",
                    NAME: JSON.parse(localStorage.getItem("customMessage")).NAME_CN
                }
            } else {
                var current = {
                    CURRENTROTATIME: dataStr,
                    TIMESLOT: "晚上",
                    PAGE_NO: "1",
                    PAGE_SIZE: "10",
                    NAME: JSON.parse(localStorage.getItem("customMessage")).NAME_CN
                }
            }

            // 当日值班列表渲染
            Ares.Service.get('rota/currentRotaList', current, function (rets) {
                var source = document.getElementById("todayScript").innerHTML;

                var template = Handlebars.compile(source);

                console.log(JSON.stringify(rets));

                // 当前账号ID
                var userId = localStorage.getItem("customMessage");
                userId = JSON.parse(userId);


                var id = userId.ID;
                var userName = userId.NAME_CN;
                // alert(userName)

                // 当前值班人ID 科技部和中金
                if (!rets.list) {
                    alert("接口数据为空！")
                }
                var onDutyId1 = rets.list[0].LOGIN_NAME;
                var onDutyId2 = rets.list[1].LOGIN_NAME;

                // alert($(".todaySpan").eq(4).html())

                // 判断有无交接班按钮
                // 默认不显示按钮
                // $(".overBtn").css("display", "none");
                // 科技部显示按钮
                //    alert(JSON.stringify(rets));
                // alert(1);
                for (var i = 0; i <= 1; i++) {
                    // alert(rets.list[i].ADDRESS);
                    if (rets.list[i].ADDRESS == "科技部" && rets.list[i].USERNAME == JSON.parse(localStorage.getItem("customMessage")).NAME_CN) {

                        rets.list[i].RESULT = 1;

                        var listNumber = i;
                        $(".todayList").html(template(rets));
                        if (rets.list[i].PARAM2 == 1) {
                            $(".overBtn").css("display", "none")
                        }
                    } else {
                        $(".todayList").html(template(rets));
                    }
                }

                $('.overBtn').click(function (e) {

                    e.preventDefault(e);
                    e.stopPropagation(e);

                    var time = rets.list[listNumber].CREATE_TIME;
                    var week = rets.list[listNumber].WEEK;
                    var address = rets.list[listNumber].ADDRESS;
                    var username = rets.list[listNumber].USERNAME;
                    var timeslot = rets.list[listNumber].TIMESLOT;
                    var loginname = rets.list[listNumber].LOGIN_NAME;
                    var _time = time.slice(0, 10).replace(/-/g, "");
                    console.log(_time);
                    var pid = {
                        LOGIN_NAME: loginname,
                        CREATE_TIME: _time,
                        WEEK: week,
                        TIMESLOT: timeslot,
                        ADDRESS: address,
                        USERNAME: username,
                        OPTIONS: 1 //页面传参
                    }
                    console.table(JSON.stringify(pid));
                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/rota/application/application.html", pid);
                });


                // 中金
                if (rets.list[1].RESULT) {
                    // $(".todaySpan .overBtn:last").css("display", "block");
                    //    中金交接班事件
                    // $('.overBtn').click(function (e) {
                    //     // alert($('.overBtn').childNodes);
                    //     e.preventDefault(e);
                    //     e.stopPropagation(e);
                    //     console.log(JSON.stringify(rets.list[0]));
                    //     // alert(rets.list[2]);
                    //     var time = rets.list[0].CREATE_TIME;
                    //     var week = rets.list[0].WEEK;
                    //     var address = rets.list[0].ADDRESS;
                    //     var username = rets.list[0].USERNAME;
                    //     var timeslot = rets.list[0].TIMESLOT;
                    //     var loginname = rets.list[0].LOGIN_NAME;
                    //     var _time = time.slice(0, 10).replace(/-/g, "");
                    //     console.log(_time);
                    //     var pid = {
                    //         LOGIN_NAME: loginname,
                    //         CREATE_TIME: _time,
                    //         WEEK: week,
                    //         TIMESLOT: timeslot,
                    //         ADDRESS: address,
                    //         USERNAME: username,
                    //         OPTIONS: 1 //页面传参
                    //     }
                    //     console.table(JSON.stringify(pid));
                    //     Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/rota/application/application.html", pid);
                    // });
                }

            });
        },

        bindElement: function () {
            // 日历date ul li点击事件
            console.log($(".day").html())

            $('#back').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/mobileOperation.html");
            });


            $('.box')
                // 日历事件
                .on('click', '.next', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _app.data.next();

                })
                .on('click', '.prev', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _app.data.previous();

                })
                .on('click', '.yearMonth', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    renderCalendar(year, month, '');
                    $('.year').text(year);
                    $('.month').text(month);
                })

            // Tab栏事件
            $('.options')
                // 切换至当日情况
                .on('click', '#option1', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _app.option1();

                })
                // 切换至科技部
                .on('click', '#option2', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _app.option2();
                })

                // 切换至中金
                .on('click', '#option3', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _app.option3();


                })


        }

    }

    Ares.ready(function (data) {

        _app.init();

    });

});

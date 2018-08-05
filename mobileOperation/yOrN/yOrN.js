'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async(['jquery', 'ares-basic', 'handlebars'], function ($, Ares, Handlebars) {

    var _app = {

        init: function (e) {
            console.log(e);
            this.judgePage(e);
            this.bindEvent(e);
            this.handOverTask(e);
            this.shiftTask(e);

        },
        judgePage: function (e) {
            if (e.pid == 1) {
                $("#handOverTask").css("display", "none");
                $('#head').text('换班任务');
                // 提交按钮

                localStorage.removeItem("x");
                localStorage.setItem("x", "1");
            }
            else if (e.pid == 2) {
                $("#shiftTask").css("display", "none");
                $('#head').text('交接班任务');
                localStorage.removeItem("x");
                localStorage.setItem("x", "2");

            }
        },
        // 渲染交接班任务
        handOverTask: function (e) {
            // alert("remind传过来的" + JSON.stringify(e));
            // alert(typeof e)

            var handOverTaskObj = {
                ROTA_NAME: e.USERNAME,
                CREATE_TIME: e.CREATE_TIME,
                LOGIN_NAME: e.ROTA_NAME,
                ADDRESS: e.ADDRESS,
                ROTA_CONTENT: e.ROTA_CONTENT,
                ROTANAME: e.ROTANAME
            }
            // alert(JSON.stringify(e));


            var source = document.getElementById("handOverTaskTemplate").innerHTML;
            var template = Handlebars.compile(source);

            $("#handOverTask").html(template(handOverTaskObj));

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
            // var data = {
            //     CURRENTROTATIME: dataStr,
            //     TIMESLOT: period,
            //     PAGE_NO: "1",
            //     PAGE_SIZE: "10"
            // }

            $("#handOverSubmit").click(function () {
                // Ares.Service.get('rota/currentRotaList', data, function (rets) {



                var data = {
                    CREATE_TIME: dataStr,
                    TIMESLOT: period,
                }

                data.LOGIN_NAME = JSON.parse(localStorage.getItem("customMessage")).USER_ID;
                console.log(JSON.stringify(data));
                Ares.Service.get('rota/changeShiftWarn', data, function (rets) {
                    console.log(JSON.stringify(rets))
                    if (rets.list) {
                        alert("已接班!");
                        Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/myTask/myTask.html");
                    } else {
                        alert("没有交接班信息！");
                    }
                });


                // });


            })
            // $("#handOverNotice").text(handOverTaskObj.);


        },

        // 渲染换班
        shiftTask: function (e) {

            var render = {
                GIVER_ID: e.LOGIN_NAME,
                GIVER_NAME: e.USERNAME,
                ADDRESS: e.ADDRESS,
                CREATE_TIME: e.UPDATE_TIME,
                UPDATE_TIME: e.CREATE_TIME,
                TIMESLOT1: e.TIMESLOT1,
                USERNAME: e.ROTA_NAME,
                ROTA_CONTENT: e.ROTA_CONTENT
            }
            // alert("render"+JSON.stringify(render));

            // alert(JSON.stringify(shiftTaskObj));
            var source = document.getElementById("shiftTaskTemplate").innerHTML;
            var template = Handlebars.compile(source);
            $("#shiftTask").html(template(render));


            // 提交换班意见
            $('#shiftSubmit').click(function () {
                // 文本框内容
                var tips = $("#shiftNoticeContent").val();
                // 同意或拒绝
                var opinion = $("#shiftAgreeOrNot").val();
                //    alert(tips+opinion);
                // alert("eeeeee" + JSON.stringify(e));
                var shiftTaskObj = {
                    LOGIN_NAME: e.LOGIN_NAME,
                    USERNAME: e.USERNAME,
                    ADDRESS: e.ADDRESS,
                    CREATE_TIME: e.CREATE_TIME.slice(0, 4) + e.CREATE_TIME.slice(5, 7) + e.CREATE_TIME.slice(8, 10),
                    UPDATE_TIME: e.UPDATE_TIME.slice(0, 4) + e.UPDATE_TIME.slice(5, 7) + e.UPDATE_TIME.slice(8, 10),
                    TIMESLOT: e.TIMESLOT,
                    TIMESLOT1: e.TIMESLOT1,
                    ROTA_NAME: e.ROTA_NAME,
                    ROTA_LOGIN_NAME: e.ROTA_LOGIN_NAME,
                    OPINION: opinion,
                    ROTA_CONTENT: tips

                }
                // alert("shiftTaskObj"+JSON.stringify(shiftTaskObj));

                var yOrN = window.confirm("确定提交");


                if (yOrN == true) {
                    Ares.Service.get('rota/confirmChangeOff', shiftTaskObj, function (rets) {
                        // alert(JSON.stringify(rets));
                        if (rets.STATUS == 1) {

                            alert("提交成功！");
                            Ares.Page.load("/yt-market-base/1.0.0/my/remind/remind.html", 1);
                        } else {
                            alert("提交失败！")
                        }
                    });
                    alert("已提交！");
                }
                else {
                    alert("已取消！");
                }



            })
            // alert($("#shiftNotice").val());

        },
        bindEvent: function () {

            $('#back').click(function () {
                if ($('#head').text() == "换班任务") {

                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/remind/remind.html");

                }
                if ($('#head').text() == "交接班任务") {

                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/remind/remind.html");
                }

            });

            $('#submitBtn').click(function () {
                // Ares.Notification.confirm.show("确定提交","",function(){
                // })

                var yOrN = window.confirm("确定提交");


                if (yOrN == true) {
                    alert("已提交！");
                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/remind/remind.html");
                }
                else {
                    alert("已取消！");
                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/remind/remind.html");
                }
            });


            $("#shiftList").click(function () {
                $('#shiftTask').css({ 'display': 'block' });
                $('#head').text('换班任务');
                $('.shiftDetail').css({ 'display': 'none' });

            }
            );
            $("#overList").click(function () {
                $('#handTask').css({ 'display': 'block' });
                $('#head').text('交接班任务');
                $('.overDetail').css({ 'display': 'none' });


            }
            );


            $("#remind")
                // 换班提醒事件
                .on('click', '#shift', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('#remind').css({ 'display': 'none' });
                    $('#head').text('换班提醒');
                    $('.overDetail').css({ 'display': 'none' });
                    $('#handOverBody').css({ 'display': 'none' });
                    $('.shiftDetail').css({ 'display': 'block' });
                    sessionStorage.setItem("n", "1");
                })
                // 交接班提醒事件
                .on('click', '#handOver', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('#remind').css({ 'display': 'none' });
                    $('#head').text('交接班提醒');
                    $('#handOverBody').css({ 'display': 'none' });
                    $('.shiftDetail').css({ 'display': 'none' });
                    $('.overDetail').css({ 'display': 'block' });
                    sessionStorage.setItem("n", "1");

                })
        }

    }

    Ares.ready(function (pid2) {
        console.log(pid2);
        //    var pid=JSON.stringify(pid2);
        //   console.log(pid)

        _app.init(pid2);

    });

});
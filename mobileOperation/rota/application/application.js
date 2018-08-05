'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async(['jquery', 'ares-basic', 'handlebars'], function ($, Ares, Handlebars) {
    var _app = {


        init: function (e) {
            // this.judgeOptions(e);
            this.back();
            this.comeFrom(e);
            // this.submitHandOver(e);
            this.queryBtnEvent(e);
        },

        comeFrom: function (e) {
            var params = JSON.parse(e);
            if (params.OPTIONS == 1) {
                // alert(1)
                this.handOver(e);
                $("#head").text("交接班申请");
                // 工作日



            }
            else if (params.OPTIONS == 2) {
                // alert(2)
                $("#head").text("换班申请");
                this.shift(e);
                // 工作日
                if (JSON.parse(e).weekendOrNot == 0) {
                    $(".workDayNight").attr("selected","selected");
                }
                $("option").remove(".mid");

            }
            else if (params.OPTIONS == 3) {
                // alert(3)
                $("#head").text("换班申请");
                this.shift(e);
                $("option").remove(".tech");

            }
        },
        // 交接班
        // submitHandOver: function (e) {

        //     // 当前年份
        //     var year = new Date().getFullYear();

        //     // 当前月份
        //     var month = new Date().getMonth() + 1;

        //     // 当前几号
        //     var day = new Date().getDate();

        //     //   当前年月日
        //     var date = JSON.stringify(year) + "年" + JSON.stringify(month) + "月" + JSON.stringify(day) + "日";
        //     console.log(date);

        //     // var submitDetail={
        //     //     USERNAME:
        //     //     LOGIN_NAME:
        //     //     CREATE_TIME:day
        //     //     ROTANAME:
        //     //     ROTA_LOGIN_NAME:
        //     //     ADDRESS:
        //     //     ROTA_CONTENT:
        //     // }
        // },

        // 换班
        shift: function (e) {
            // e是字符串
            var str
            $("#handOverBody").css("display", "none");
            var source = $("#shift").html();
            var template = Handlebars.compile(source);

            var timeSlot = JSON.parse(e).TIMESLOT;
            // alert(timeSlot);
            var onDutyDay = JSON.parse(e).CREATE_TIME;



            // if (timeSlot == "晚上") {
            //     console.log("工作日");


            //     $("#shiftBody").html(template(JSON.parse(e)));
            // 字符串格式处理
            // str = onDutyDay.substr(0, 4) + "-" + onDutyDay.substr(4, 2) + "-" + onDutyDay.substr(6, 2);
            // $("#datePicker").attr("value", str);

            // $("#queryBtn").css("display", "none");
            // $("#datePicker").attr("value","");
            // }

            // 如果是周末，需要显示选择框选择上、下、晚
            // else {
            $("#queryBtn").css("display", "block");
            $("#shiftBody").html(template(JSON.parse(e)));
            $("#timeSlot").css("display", "none");
            $("#shiftOptionSelect").css("display", "block");
            // alert(onDutyDay)
            str = onDutyDay.substr(0, 4) + "-" + onDutyDay.substr(4, 2) + "-" + onDutyDay.substr(6, 2);
            // $("#datePicker").attr("value", new Date("2018/08/02"));
           
            $("#datePicker").val(str);
     
            // }

        },
        // 查询按钮事件
        queryBtnEvent: function (e) {
            var dateQuery = "";
            var data;

            // var selectedValue = options.text();

            $("#queryBtn").click(function () {
                var options = $("#shiftOptionSelect").val();
                // alert(options)
                dateQuery = $("#datePicker").val();
                dateQuery = dateQuery.substr(0, 4) + dateQuery.substr(5, 2) + dateQuery.substr(8, 2);
                // console.log(selectedValue);
                // 获取选择的时段
                // alert(e);
                // alert(e);

                // 工作日
                // if ($("#timeSlot").text() == "晚上") {
                //     data = {
                //         LOGIN_NAME: JSON.parse(e).LOGIN_NAME,
                //         USERNAME: JSON.parse(e).USERNAME,
                //         ADDRESS: JSON.parse(e).ADDRESS,
                //         CREATE_TIME: dateQuery,
                //         TIMESLOT: "晚上"
                //     }
                // }
                // // 周末
                // else {
                data = {
                    LOGIN_NAME: JSON.parse(e).LOGIN_NAME,
                    USERNAME: JSON.parse(e).USERNAME,
                    ADDRESS: JSON.parse(e).ADDRESS,
                    CREATE_TIME: dateQuery,
                    TIMESLOT: options
                    // }
                }
                // alert(JSON.stringify(data));
                // 获取接班人信息
                Ares.Service.get('rota/changeOffName', data, function (rets) {

                    if (rets.list) {
                        $("#shiftAccepter").text(rets.list[0].ROTANAME);
                    } else {
                        alert("该时间段没有值班！")
                    }

                    // alert(rets.list[0].LOGIN_NAME);
                    // 提交事件
                    $('#submit').click(function () {

                        var submitShiftData = {
                            USERNAME: JSON.parse(e).USERNAME,
                            LOGIN_NAME: JSON.parse(e).LOGIN_NAME,
                            ADDRESS: JSON.parse(e).ADDRESS,
                            CREATE_TIME1:JSON.parse(e).CREATE_TIME,
                            TIMESLOT: JSON.parse(e).TIMESLOT,
                            ROTANAME: $("#shiftAccepter").text(),
                            ROTA_LOGIN_NAME: rets.list[0].LOGIN_NAME,
                            CREATE_TIME: dateQuery, 
                            TIMESLOT1: options,
                        };
                        
                        // alert(("submitShiftData" + JSON.stringify(submitShiftData)));
                        Ares.Service.get("rota/submitChangeOff", submitShiftData, function (rets) {

                            // alert("rets"+JSON.stringify(rets));
                        });
                        var yOrN = window.confirm("确定提交");


                        if (yOrN == true) {
                            alert("已提交！");
                            Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/rota/rota.html");
                        }
                        else {
                            alert("已取消！");
                            
                        }

                    });

                });
            });
        },
        // 交接班
        handOver: function (e) {
            console.log("我是PID" + e);
            console.log(typeof e)
            var pidObj = JSON.parse(e)
            var loginname = pidObj.LOGIN_NAME;
            console.log(pidObj.LOGIN_NAME);
            var createtime = pidObj.CREATE_TIME;
            // var data = JSON.parse(pidObj);

            // 当前值班人名字
            var handover = pidObj.USERNAME;
            // alert("handover__________" + handover);
            // alert("pidObj"+JSON.stringify(pidObj));

            Ares.Service.get('rota/nextRotaInfo', pidObj, function (rets) {
                //   alert("rets"+JSON.stringify(rets.list));
                // 规范日期格式
                rets.list[0].CREATE_TIME = rets.list[0].CREATE_TIME.slice(0, 10);

                rets.list[0].USERNAME = handover;

                var b = rets.list[0];
                var source = document.getElementById("handover").innerHTML;
                var template = Handlebars.compile(source);
                //    alert(JSON.stringify(b));
                $("#handOverBody").html(template(b));


                // 提交申请



                // 提交交接班事件
                $('#submit').click(function () {
                    // 交接班内容
                    var rotacontent = $("#textArea").val();
                    console.log("下一值班人" + rets.list[0].ROTA_LOGIN_NAME);
                    var submitData = {
                        USERNAME: handover,
                        LOGIN_NAME: loginname,
                        CREATE_TIME: createtime,
                        ROTANAME: rets.list[0].ROTANAME,
                        ROTA_LOGIN_NAME: rets.list[0].LOGIN_NAME,
                        ADDRESS: rets.list[0].ADDRESS,
                        ROTA_CONTENT: rotacontent,
                    }

                    // alert("sumitdata" + JSON.stringify(submitData));

                    Ares.Service.get("rota/submitChangeShift", submitData, function (rets) {

                        // alert(("rets____" + JSON.stringify(rets)));
                    });
                    var yOrN = window.confirm("确定提交");


                    if (yOrN == true) {
                        alert("已提交！");
                        Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/rota/rota.html");
                    }
                    else {
                        alert("已取消！");
                        Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/rota/rota.html");
                    }

                });

            });
        },
        back: function () {

            $('#back').click(function () {

                Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/rota/rota.html");

            });
        },
    }

    Ares.ready(function (pid) {


        var pid = JSON.stringify(pid);
        console.log("___________pid" + pid);
        _app.init(pid);
        // $("#datePicker").attr("value","2017-07-20");
        // alert($("#datePicker").attr("value"));

        // alert(JSON.parse(pid).OPTIONS)

    });

});
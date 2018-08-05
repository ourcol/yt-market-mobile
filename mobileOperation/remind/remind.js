'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async(['jquery', 'ares-basic', 'handlebars'], function ($, Ares, Handlebars) {
    var _app = {

        init: function (pid) {
            //    根据参数显示页面
            this.judgePid(pid);
            this.bindEvent();
        },
        judgePid: function (pid) {
            // 参数为1换班提醒
            if (pid == 1 || localStorage.getItem("x") == 1) {
                $('#head').text("换班提醒");
                // 当前账号ID
                var userId = localStorage.getItem("customMessage");
                userId = JSON.parse(userId)
                var loginname = { LOGIN_NAME: userId.USER_ID };

                Ares.Service.get('rota/changeOffWarn', loginname, function (rets) {
                    console.log("rets" + JSON.stringify(rets));

                    if (rets.list) {
                        // 删除列表内的日期的后缀
                        for (var i = 0, l = rets.list.length; i <= l - 1; i++) {
                            console.log(JSON.stringify(rets.list[i].CREATE_TIME));
                            var createtime = JSON.stringify(rets.list[i].CREATE_TIME);
                            var updatetime = JSON.stringify(rets.list[i].UPDATE_TIME);

                            rets.list[i].CREATE_TIME = createtime.slice(1, 11);
                            rets.list[i].UPDATE_TIME = updatetime.slice(1, 11);
                        }
                    }
                    var source = document.getElementById("shiftTemplate").innerHTML;
                    var template = Handlebars.compile(source);
                    $("#shiftContent").html(template(rets));

                    $(".shiftLi").click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        // alert(JSON.stringify(e));
                        var shiftObj = {
                            LOGIN_NAME: $(this).children("div").eq(4).html(),
                            USERNAME: $(this).children("div").eq(0).html(),
                            ROTA_LOGIN_NAME: $(this).children("div").eq(6).html(),
                            ROTA_NAME: $(this).children("div").eq(5).html(),
                            ADDRESS: $(this).children("div").eq(1).html(),
                            CREATE_TIME: $(this).children("div").eq(2).html(),
                            TIMESLOT: $(this).children("div").eq(3).html(),
                            TIMESLOT1: $(this).children("div").eq(7).html(),
                            UPDATE_TIME: $(this).children("div").eq(8).html(),
                            pid: 1
                        }
                        // alert("shiftObj" + JSON.stringify(shiftObj));
                        Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/yOrN/yOrN.html", shiftObj);
                    }
                    );
                    $('#handOverContent').css("display", "none");
                    $('#shiftContainer').css("display", "block");
                    localStorage.removeItem("x");
                    if (!rets.list) {
                        $("#shiftContentUl").html("<div class='noneDataRemind'><p>暂无数据</p></div>");
                    }

                });


                // 参数为2交班提醒
            } else if (pid == 2 || localStorage.getItem("x") == 2) {
                $('#head').text("交接班提醒");

                // 当前账号ID
                var userId = localStorage.getItem("customMessage");
                userId = JSON.parse(userId);
                var loginname2 = { LOGIN_NAME: userId.USER_ID };
                Ares.Service.get('rota/changeShiftWarn', loginname2, function (rets) {

                    // alert("我的交接班提醒" + JSON.stringify(rets));
                    if (rets.list) {
                        // alert(JSON.stringify(rets.list));
                        // 删除列表内的日期的后缀
                        for (var i = 0, l = rets.list.length; i <= l - 1; i++) {
                            console.log(JSON.stringify(rets.list[i].CREATE_TIME));
                            var createtime = JSON.stringify(rets.list[i].CREATE_TIME);

                            rets.list[i].CREATE_TIME = createtime.slice(1, 11);
                        }
                    }
                    var source = document.getElementById("handOverTemplate").innerHTML;
                    var template = Handlebars.compile(source);
                    // alert(JSON.stringify(rets));
                    $("#handOverContent").html(template(rets));
                    // alert(JSON.stringify(rets));
                    $(".handOverLi").click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var handOverObj = {
                            USERNAME: $(this).children("div").eq(0).html(),
                            ROTANAME: $(this).children("div").eq(1).html(),
                            ADDRESS: $(this).children("div").eq(2).html(),
                            CREATE_TIME: $(this).children("div").eq(3).html(),
                            ROTA_CONTENT: $(this).children("div").eq(4).html(),
                            LOGIN_NAME: $(this).children("div").eq(5).html(),
                            ROTA_LOGIN_NAME: $(this).children("div").eq(6).html(),
                            pid: 2
                        }
                        Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/yOrN/yOrN.html", handOverObj);
                    }
                    );
                    $('#handOverContainer').css("display", "block");
                    $('#shiftContent').css("display", "none");
                    $('#shiftTitle').css("display", "none");
                    localStorage.removeItem("x");
                    if (!rets.list) {
                        $("#handOverContent").html("<div class='noneDataRemind'><p>暂无数据</p></div>");
                    }

                });

            }
            if ($('#head').text() == "换班提醒") {
                history.replaceState(null, null, "?page=1");
            } else if ($('#head').text() == "交接班提醒") {
                history.replaceState(null, null, "?page=2");
            }
        },
        bindEvent: function () {

            $('#back').click(function () {
                Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/myTask/myTask.html");
            });




        }

    }

    Ares.ready(function (pid) {
        _app.init(pid);


    });

});
'use strict';

// session num解决index,donepage页面跳转问题
// session flag,towork解决回到work工作台缓存问题

require.config(__FRAMEWORK_CONFIG__);
require.async(['jquery', 'ares-basic', 'handlebars'], function ($, Ares, Handlebars) {
    var data = {};
    var a;

    var _app = {
        init: function () {
            _app.bindEvement();
            _app.JudgeEquipment();
            _app.userInfo();
            _app.getRetsTotal();
            // this.getToken();
            _app.getMenus();
        },
        // flag=1,sessionStorage存在
        getMenus: function (e) {
            var local, _local;
            // alert(a);
            // alert("我拿到了本地的flag"+sessionStorage.getItem("flag"));
            // alert(document.cookie);
            if (sessionStorage.getItem("flag") !== null)
            // if(document.cookie=='judgecookie=jc')
            {
                // alert(2);
                var source = document.getElementById("template").innerHTML;
                var template = Handlebars.compile(source);
                _local = sessionStorage.getItem("towork");
                local = JSON.parse(_local);
                $("#_list").html(template(local));
            } else {
                Ares.Service.get('ares/getMenus', data, function (rets) {
                    //    alert(JSON.stringify(rets.LIST));
                    if (rets.LIST) {
                        var setUp = {
                            MENU_NAME: "设置",
                            MENU_SORT: "9",
                            MENU_NO: "mySetUp"
                        }
                        rets.LIST.push(setUp);
                        var compare = function (property) {
                            return function (a, b) {
                                var value1 = a[property];
                                var value2 = b[property];
                                return value1 - value2;
                            }
                        }
                        rets.LIST.sort(compare('MENU_SORT'));
                        // alert(JSON.stringify(rets));
                        var source = document.getElementById("template").innerHTML;
                        var template = Handlebars.compile(source);
                        $("#_list").html(template(rets));
                        // localStorage.setItem("a", JSON.stringify(rets));
                        sessionStorage.setItem("towork", JSON.stringify(rets));
                        sessionStorage.setItem("flag", 1);
                        var a = sessionStorage.getItem("flag");
                        // alert("我是a"+a);
                        document.cookie = "judgecookie=jc";
                    }
                    else {
                        var setUp = {
                            MENU_NAME: "设置",
                            MENU_SORT: "9",
                            MENU_NO: "mySetUp"
                        }
                        var LIST=[];
                        rets.LIST=LIST;
                        rets.LIST.push(setUp); 
                        var source = document.getElementById("template").innerHTML;
                        var template = Handlebars.compile(source);
                        $("#_list").html(template(rets));
                    }
                });
            }
        },
        // crm,移动驾驶舱
        getToken: function (e) {
            var userid = JSON.parse(localStorage.getItem("customMessage")).USER_ID;
            console.log(userid);
            var data = {
                userId: userid
            }
            // alert("data" + JSON.stringify(data))
            Ares.Service.get('mobileCockpit/mobileCockpitUrl', data, function (rets) {

                var apiname = rets.URL;
                var length = apiname.length;
                var index = apiname.indexOf("/jsc");
                apiname = apiname.slice(index, length);

                var _param = {
                    ApiName: apiname,
                    token: '123456',
                };
                // alert("_param值" + JSON.stringify(_param));
                Ares.Plugins.openUrl.aresloadpage(_param, function (rets) {
                    // if (rets.status == 1) {
                    //     console.log("打开成功！");
                    // } else if (rets.status == 0) {
                    //     alert("打开失败！")
                    // }
                    // alert(JSON.stringify(rets));

                });

            })
        },
        // 打开OA用
        openOA: function (e) {
            var data = {}

            Ares.Service.get('ares/getToken', data, function (rets) {

                var u = navigator.userAgent;
                if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    var _param = {
                        urlScheme: 'todolist',
                        token: rets.token,
                    };
                } else if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
                    var _param = {
                        packageName: 'com.rc.mobile.oa.activity',
                        token: rets.token,
                    };
                }
                // alert("_param" + JSON.stringify(_param));
                // alert("rets.token的值为" + rets.token);
                Ares.Plugins.openOA.jumpOA(_param, function (rets) {
                    // alert(JSON.stringify(rets));
                    // if (rets.STATUS == 1) {
                    //     console.log("打开成功！");
                    // } else if (rets.STATUS == 0) {
                    //     alert("未安装移动OA应用，请到Anyoffice下载！")
                    // }
                });
            });
        },
        userInfo: function () {
            var _data = {
                userId: "816" + $("#userId").html()
            };

            Ares.Service.get("ares/login/serviceToHtml5", _data, function (rets) {
                console.log("rets_______" + JSON.stringify(rets));
                localStorage.setItem("customMessage", JSON.stringify(rets));
                console.log(localStorage.getItem("customMessage"));
                $(".user_name").html(rets.NAME_CN);
                $(".user_num").html(rets.USER_ID);

            });
        },
        bindEvement: function () {
            $("#_content")
                // 信贷审批
                .on("click", ".1", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Ares.Page.load('/yt-market-base/1.0.0/index/index.html');
                })
                // 财务审批
                .on("click", ".2", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Ares.Page.load('/yt-market-base/1.0.0/finanApproval/finanApproval.html');
                })
                // CRM
                .on("click", ".6", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    localStorage.removeItem("pageNum"); //判断是管理者页面还是个人平台页面
                    localStorage.removeItem("userId");
                    localStorage.removeItem("userType");//判断用户类型（对公对私客户经理）
                    localStorage.removeItem("kpiOrg");//登录用户的机构号
                    localStorage.removeItem("ORG_TYPE");//判断机构类型（支行，网点。。。）
                    localStorage.removeItem("getGLMenu");//对管理者菜单接口做的缓存
                    localStorage.removeItem("getGRMenu");//对个人平台菜单接口做的缓存
                    Ares.Page.load('/yt-market-base/1.0.0/Crm/crm.html');
                })
                // 移动运维
                .on("click", ".7", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Ares.Page.load('/yt-market-base/1.0.0/mobileOperation/mobileOperation.html');
                })
                // 移动OA，CRM
                .on("click", ".4", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _app.openOA();
                    // Ares.Page.load('/yt-market-base/1.0.0/rota/rota.html');
                })
                // 移动驾驶舱
                .on("click", ".5", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _app.getToken();
                    // Ares.Page.load('/yt-market-base/1.0.0/rota/rota.html');
                })
                // 我的
                .on("click", ".9", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Ares.Page.load('/yt-market-base/1.0.0/my/my.html');
                })
                // 退出账号
                .on("click", ".homeBtn", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Ares.Notification.confirm.show("是否确定退出", "", function () {
                        Ares.Element.judgeIosPhone(function () {
                            Ares.Plugins.Logout.logout(function () { })
                        }, function () {
                            var parames = ["gotoLogin"];
                            Ares.Plugins.leave.getOut(parames, function () { })
                        })
                    });
                }).on("click", ".address", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Ares.Plugins.getAddress.getAddressInfo("", function (rets) {
                        return rets
                    });
                })
        },
        // badges
        getRetsTotal: function () {
            if (localStorage.getItem("b") == null) {
                $("i:first").hide();
            } else {
                $(".circle:first").html(localStorage.getItem("b"));
            }
        },
        JudgeEquipment: function () {
            /**
             * 判断设备是安卓还是ios
             */
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS) {
                $('header').css("top", "20px");
                $('#judge').css("display", "block");
                $('.option').css("margin-top", "33px");
                $('.homeBtn').css("top", 23);
                var userId = Ares.Session.getPropertyValue("loginId");
            } else {
                $('header').css("top", "0px");
                $('#judge').css("display", "none");
                var userId = Ares.Session.loginName();
            }
            $("#userId").html(userId);
        }
    };


    Ares.ready(function () {
        // 清index页的num session
        sessionStorage.removeItem('num');
        _app.init();

    });

});



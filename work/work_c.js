/**
 * Created by Administrator on 2018/2/27.
 */
'use strict';

require.config(__FRAMEWORK_CONFIG__);

require.async(['jquery', 'ares-basic', 'handlebars'], function ($, Ares ) {

    var _app = {
        init: function () {
            _app.bindEvement();
            _app.JudgeEquipment();
        },

        bindEvement:function () {
            $("#_content").on("click",".creditApproval",function () {
                Ares.Page.load('/yt-market-base/1.0.0/index/index.html');
            }).on("click",".my",function () {
                Ares.Page.load('/yt-market-base/1.0.0/my/my.html');
            }).on("click",".homeBtn",function () {
                Ares.Page.load('/yt-market-base/1.0.0/my/my.html');
            })
        },
        JudgeEquipment:function () {
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
            } else {
                $('header').css("top", "0px");
                $('#judge').css("display", "none");
            }
            // alert('是否是Android：'+isAndroid);
            // alert('是否是iOS：'+isiOS);
        }
    };

    Ares.ready(function(){
        _app.init();
    });

});

'use strict';
require.config(__FRAMEWORK_CONFIG__);
require.async(['jquery', 'ares-basic', 'handlebars'], function ($, Ares, Handlebars) {

    var _app = {

        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {

            $('#back').click(function () {

                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/mobileOperation.html");
     
               
            });
            
            $("#remind")
                // 换班提醒事件
                .on('click', '#shift', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/remind/remind.html",1);
                })
                // 交接班提醒事件
                .on('click', '#handOver', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/remind/remind.html",2);

                })
        }

    }

    Ares.ready(function () {
        _app.init();
      
    });

});
'use strict'

require.config(__FRAMEWORK_CONFIG__);

require.async(['jquery', 'ares-basic', 'handlebars'], function ($, Ares, Handlebars) {
    var _app = {
        init: function () {
            this.clickEvent();
        },
        clickEvent: function () {
            $('#body')
                .on('click', '#back', function () {
                    Ares.Page.load("/yt-market-base/1.0.0/work/work.html");
                })
                .on('click', '.operation', function () {
                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/rota/rota.html");
                })
                .on('click', '.myTask', function () {
                    Ares.Page.load("/yt-market-base/1.0.0/mobileOperation/myTask/myTask.html");
                })

        }

    }


    Ares.ready(function () {

        _app.init();

    });
});


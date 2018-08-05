'use strict';

require.config(__FRAMEWORK_CONFIG__);
require.async(['jquery', 'ares-basic','scrolload'], function ($, Ares, Scrolload) {
    var _app;
    _app = {
        init: function () {
            _app.load1();
            _app.bindEvent();
        },
        // bindElevent:function () {
        //     $("#crm_page").on("click",".mySpace",function () {
        //         Ares.Notification.alert.show("请填写意见");
        // })
        //
        // }
        load1: function(data) {
            _app.sl = new Scrolload({
                url: 'crm/queryGSkhzbKpi',
                // url: 'mobileCrm/mobileCrm',
                method:'GET',
                pageSize:5,
                pageNo:1,
                pageNoProp:'PAGE_NO',
                listKey:'LIST',
                pageable:true,
                pullDown:true,
                pullUp:true,
                params:{
                    orgId:"816000000",
                    usrId:"8160588",
                    kpiType:5
                },
                templateEngine: 'jsrender',
                elements: {
                    scrollWrapper: '#homeScheduleScroll1',
                    dataContent: '#homeScheduleView1',
                    successTemplate: '#scheduleFoundDataListTmpl'
                },

                callbacks: {
                    fnAfterRender: function (records, rets, scrolload) {
                        alert(JSON.stringify(rets));
                        console.log(rets);
                    },
                    fnBeforeRenderRow: function(records, index, data, scrolload) {

                    },
                    fnAfterRenderRow:function(records, index, data, $html, scrolload){

                    },

                }
            });
            return _app.sl
        },
        bindEvent:function (data) {
            $("#crm_page").on("click",".mySpace",function () {
                $(".img_cur").addClass("hide");
                $(".img").removeClass("hide");
                $(".img_cur_4").removeClass("hide").siblings("img").addClass("hide");
                $("#myInfo").removeClass("hide").siblings("div").addClass("hide");
                alert("获取菜单");
                Ares.Service.get('ares/getMenus',"", function (rets) {
                    alert(JSON.stringify(rets))
                })
            })
        }
    };
    Ares.ready(function(){
        alert("1");
        _app.init();
    });

});

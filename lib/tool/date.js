
"use strict";

class date {

    static get_instance(){
        return new Date();
    }

    static timestamp(){
        var date = get_instance().getTime();
    }

    static format(fmt,date_object){
        if(!date_object){
            date_object = date.get_instance();
        }
        var o = {   
            "M+" : date_object.getMonth()+1,                 //月份   
            "d+" : date_object.getDate(),                    //日   
            "h+" : date_object.getHours(),                   //小时   
            "m+" : date_object.getMinutes(),                 //分   
            "s+" : date_object.getSeconds(),                 //秒   
            "q+" : Math.floor((date_object.getMonth()+3)/3), //季度   
            "S"  : date_object.getMilliseconds()             //毫秒   
        };   
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (date_object.getFullYear()+"").substr(4 - RegExp.$1.length));
        }   
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){ 
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
            }
        }  
        return fmt;   
    }
}

module.exports = date;
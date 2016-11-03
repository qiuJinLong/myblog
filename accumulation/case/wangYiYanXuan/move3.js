function getStyle(obj, name) {
    return (obj.currentStyle || getComputedStyle(obj, false))[name];
}

//easing 运动类型
/*
* ease  0匀速  1加速  2减速
*
* easing   linear   匀速
*          ease-in   加速
*          ease-out  减速
* */

function move(obj, json, options) {
    options = options || {};
    options.duration = options.duration || 700; //运动时间
    options.easing = options.easing || "ease-out"; //默认减速运动

    //多个起点 和 多个距离
    var start = {},
        dis = {};
    for(var name in json) {
        //透明度小数
        if(name == "opacity") {
            start[name] = parseFloat(getStyle(obj, name));
        } else {
            start[name] = parseInt(getStyle(obj, name));
        }
        dis[name] = json[name]-start[name];
    }
    var count = Math.round(options.duration/30);
    var n = 0;
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        n++;
        for(var name in json) {
            //位置： 起点+n*距离/次数
            //透明度不带单位px
            switch(options.easing) {
                case "linear": //匀速
                    var a = n/count;
                    var cur = start[name] + dis[name]*a*a*a;
                    break;
                case  "ease-in": //加速
                    var a = n/count;
                    var cur = start[name]+dis[name]*a*a*a;
                    break;
                case "ease-out": //减速
                    var a = 1-n/count;
                    var cur = start[name]+dis[name]*(1-a*a*a);
                    break;
            }
            if(name == "opacity") {
                obj.style.opacity = cur;
                obj.style.filter = "alpha(opacity:"+cur*100+")";
            } else {
                obj.style[name] = cur+"px";
            }
        }
        if(n == count) {
            clearInterval(obj.timer);
            options.complete && options.complete();
        }

    }, 30);

}


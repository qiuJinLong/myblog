function getStyle(obj, name) {
    return (obj.currentStyle || getComputedStyle(obj, false))[name];
}

function move(obj, json, options) {
    options.easing  = options.easing || "ease-out";
    options.duration = options.duration || "700";

    var start = {},
        dis = {};
    for(var name in json) {
        if(name == "opacity") {
            start[name] = parseFloat(getStyle(obj, name));
        } else {
            start[name] = parseInt(getStyle(obj, name));
        }
        dis[name] = json[name] - start[name];
    }

    var count = Math.round(options.duration/30),
        n = 0,
        cur = 0;

    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        n++;
        for(var name in json) {
            cur = start[name]+dis[name]*n/count;
            if(name == "opacity") {
                obj.style.opacity = cur;
                obj.style.filter = "alpha("+cur*100+")";
            } else {
                obj.style[name] = cur+"px";
            }
        }
        console.log(n == count);
        if(n == count) {
            clearInterval(obj.timer);
            options.complete && options.complete();
        }
    }, 30);

}
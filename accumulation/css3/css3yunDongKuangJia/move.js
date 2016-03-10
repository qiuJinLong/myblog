/**
 * Created by qiujinlong on 2016/3/10.
 */
function move(obj, json, options) {
    options = options || {};
    options.time = options.time || 300;
    options.type = options.type || "ease";

    obj.style.transition = options.time + "ms all "+options.type;

    for(var name in json) {
        obj.style[name] = json[name];
    }

    function tEnd() {
        obj.removeEventListener("webkitTransitionEnd", tEnd, false);
        obj.style.transition = "none";
        options.end && options.end.call(obj);
    }

    obj.addEventListener("webkitTransitionEnd", tEnd, false);

}

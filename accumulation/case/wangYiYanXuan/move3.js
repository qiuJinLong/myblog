function getStyle(obj, name) {
    return (obj.currentStyle || getComputedStyle(obj, false))[name];
}

//easing �˶�����
/*
* ease  0����  1����  2����
*
* easing   linear   ����
*          ease-in   ����
*          ease-out  ����
* */

function move(obj, json, options) {
    options = options || {};
    options.duration = options.duration || 700; //�˶�ʱ��
    options.easing = options.easing || "ease-out"; //Ĭ�ϼ����˶�

    //������ �� �������
    var start = {},
        dis = {};
    for(var name in json) {
        //͸����С��
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
            //λ�ã� ���+n*����/����
            //͸���Ȳ�����λpx
            switch(options.easing) {
                case "linear": //����
                    var a = n/count;
                    var cur = start[name] + dis[name]*a*a*a;
                    break;
                case  "ease-in": //����
                    var a = n/count;
                    var cur = start[name]+dis[name]*a*a*a;
                    break;
                case "ease-out": //����
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


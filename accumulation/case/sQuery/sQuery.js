/**
 * Created by qiujinlong on 2016/1/22.
 */
"use strict"

function sQuery(arg) {
    this.elements = [];
    this.domString = "";
    switch (typeof arg) {
        case "function":
            domReady(arg);
            break;
        case "string":
            if(arg.indexOf("<") != -1) {
                this.domString = arg;
            } else {
                var aEle = getEle(arg);
                this.elements = aEle;
            }
            break;
        default :
            this.elements.push(arg);
            break;
    }
}

function $(arg) {
    return new sQuery(arg);
}

sQuery.prototype.css = function(name, value) {
    if(arguments.length == 2) {
        for(var i=0; i<this.elements.length; i++) {
            this.elements[i].style[name] = value;
        }
    } else {
        if(typeof name == "string") {
            return getStyle(this.elements[0], name);
        } else {
            var json = name;
            for(var i=0; i<this.elements.length; i++) {
                for(var name in json) {
                    this.elements[i].style[name]=json[name];
                }
            }
        }
    }
};

function getStyle(obj, name) {
    return (obj.currentStyle || getComputedStyle(obj, false))[name];
}


sQuery.prototype.attr = function(name, value) {
    if(arguments.length == 2) {
        for(var i=0; i<this.elements.length; i++) {
            this.elements[i].setAttribute(name, value);
        }
    } else {
        if(typeof name == "string") {
            return this.elements[0].getAttribute(name);
        } else {
            var json = name;
            for(var i=0; i<this.elements.length; i++) {
                for(var name in json) {
                    this.elements[i].setAttribute(name, json[name]);
                }
            }
        }
    }
};

;"click mouseover mouseout contextmenu load scroll resize blur focus keydown keyup mousedown mousemove mouseup".replace(/\w+/g, function(sEv) {
    sQuery.prototype[sEv] = function(fn) {
        for(var i=0; i<this.elements.length; i++) {
            addEvent(this.elements[i], sEv, fn);
        }
    };
});

function addEvent(obj, sEv, fn) {
    if(obj.addEventListener) {
        obj.addEventListener(sEv, function(ev) {
            var oEvent = ev || event;
            if(fn.apply(obj, arguments) == false) {
                oEvent.preventDefault();
                oEvent.cancelBubble = true;
            }
        }, false);
    } else {
        obj.attachEvent("on"+sEv, function(ev) {
            var oEvent = ev||event;
            if(fn.apply(obj, arguments) == false) {
                oEvent.cancelBubble = true;
                return false;
            }
        });
    }
};

sQuery.prototype.mouseenter = function(fn) {
    for(var i=0; i<this.elements.length; i++) {
        addEvent(this.elements[i], "mouseover", function(ev) {
            var from = ev.fromElement || ev.relatedTarget;
            if(this.contains(from)) return;
            fn && fn.apply(this, arguments);
        });
    }
};

sQuery.prototype.mouseleave = function(fn) {
    for(var i=0; i<this.elements.length; i++) {
        addEvent(this.elements[i], "mouseout", function(ev) {
            var to = ev.toElement || ev.relatedTarget;
            if(this.contains(to)) return;
            fn && fn.apply(this, arguments);
        });
    }
};

sQuery.prototype.hover = function(fnOver, fnOut){
    this.mouseenter(fnOver);
    this.mouseleave(fnOut);
};

sQuery.prototype.toggle = function() {
    var arg = arguments;
    var _this = this;
    for(var i=0; i<this.elements.length; i++) {
        (function(count) {
            addEvent(_this.elements[i], "click", function() {
                var fn = arg[count%arg.length];
                fn && fn.apply(this, arguments);
                count++;
            });
        })(0);
    }
};

sQuery.prototype.appendTo = function(str) {
    var aParent = getEle(str);
    for(var i=0; i<aParent.length; i++) {
        aParent[i].insertAdjacentHTML("beforeEnd", this.domString);
        var obj = document.createElement("h3");
        obj.innerHTML = "标题三obj";
        aParent[i].insertAdjacentHTML("beforeEnd", obj);
    }
};

sQuery.prototype.prependTo = function(str) {
    var aParent = getEle(str);
    for(var i=0; i<aParent.length; i++) {
        aParent[i].insertAdjacentHTML("afterBegin", this.domString);
    }
};

sQuery.prototype.insertBefore = function(str) {
    var aParent = getEle(str);
    for(var i=0; i<aParent.length; i++) {
        aParent[i].insertAdjacentHTML("afterEnd", this.domString);
    }
};

sQuery.prototype.insertAfter=function(str) {
    var aParent = getEle(str);
    for(var i=0; i<aParent.length; i++) {
        aParent[i].insertAdjacentHTML("afterEnd", this.domString);
    }
};

sQuery.prototype.remove = function() {
    for(var i=0; i<this.elements.length; i++) {
        this.elements[i].parentNode.removeChild(this.elements[i]);
    }
};

sQuery.prototype.removeClass = function(sClass) {
    var reg = new RegExp("\\b"+sClass+"\\b");
    for(var i=0; i<this.elements.length; i++) {
        if(this.elements[i].className) {
            if(!reg.test(this.elements[i].className)) {
                this.elements[i].className += " " + sClass;
            }
        } else {
            this.elements[i].className = sClass;
        }
    }
};

sQuery.prototype.hide = function() {
    for(var i=0; i<this.elements.length; i++) {
        this.elements[i].style.display = "none";
    }
};

sQuery.prototype.show = function() {
    for(var i=0; i<this.elements.length; i++) {
        this.elements[i].style.display = "block";
    }
};

sQuery.prototype.index = function() {
    var obj = this.elements[this.elements.length - 1];
    var aSibling = obj.parentNode.children;
    for(var i=0; i<aSibling.length; i++) {
        if(obj == aSibling[i]) {
            return i;
        }
    }
};

sQuery.prototype.eq = function(n) {
    return $(this.elements[n]);
};

function domReady(fn) {
    if(document.addEventListener) {
        document.addEventListener("DOMContentLoaded", fn, false);
    } else {
        document.attachEvent("onreadystatechange", function() {
            if(doucment.readyState == "complete") {
                fn();
            }
        });
    }
}

function getByStr(str, aParent) {
    var aEle = [];
    for(var i=0; i<aParent.length; i++) {
        switch (str.charAt(0)) {
            case "#":
                aEle.push(aParent[i].getElementById(str.substring(1)));
                break;
            case ".":
                if(aParent[i].getElementsByClassName) {
                    var aResult = aParent[i].getElementsByClassName(str.substring(1));
                    for(var j=0; j<aResult.length; j++) {
                        aEle.push(aResult[j]);
                    }
                } else {
                    var arr = aParent[i].getElementsByTagName("*");
                    var regExp = new RegExp("\\b" + str.substring(1) + "\\b");
                    for(var j=0; j<arr.length; j++) {
                        if(regExp.test(arr[j].className)) {
                            aEle.push(arr[j]);
                        }
                    }
                }
                break;
            default :
                if(/\w+\.\w+/.test(str)) {
                    //li.red
                    var aStr = str.split(".");
                    var arr = aParent[i].getElementsByTagName(aStr[0]);
                    var regExp = new RegExp("\\b"+aStr[1]+"\\b");
                    for(var j=0; j<arr.length; j++) {
                        if(regExp.test(arr[j].className)) {
                            aEle.push(arr[j]);
                        }
                    }
                } else if(/\w+\[\w+=\w+\]/.test(str)) {
                    //input[type=button]
                    var aStr = str.split(/\[|=|\]/);
                    var arr = aParent[i].getElementsByTagName(aStr[0]);
                    for(var j=0; j<arr.length; j++) {
                        if(arr[j][aStr[1]] == aStr[2]) {
                            aEle.push(arr[j]);
                        }
                    }
                } else if(/\w+:\w+(\(\d+\))?/.test(str)) {
                    //li:first   li:eq(2)
                    var aStr = str.split(/:|\(|\)/);
                    var arr = aParent[i].getElementsByTagName(aStr[0]);
                    switch (aStr[1]) {
                        case "first":
                            aEle.push(arr[0]);
                            break;
                        case "lase":
                            aEle.push(arr[arr.length - 1]);
                            break;
                        case "eq":
                            aEle.push(arr[aStr[2]]);
                            break;
                        case "lt":
                            for(var j=0; j<aStr[2]; j++) {
                                aEle.push(arr[j]);
                            }
                            break;
                        case "gt":
                            for(var j=parseInt(aStr[2])+1; j<arr.length; j++) {
                                aEle.push(arr[j]);
                            }
                            break;
                        case "odd":
                            for(var j=1; j<arr.length; j+=2) {
                                aEle.push(arr[j]);
                            }
                            break;
                        case "even":
                            for(var j=0; j<arr.length; j+=2) {
                                aEle.push(arr[j]);
                            }
                            break;
                    }
                }else {
                    var arr = aParent[i].getElementsByTagName(str);
                    for(var j=0; j<arr.length; j++) {
                        aEle.push(arr[j]);
                    }
                }
                break;
        }
    }
    return aEle;
}

function getEle(str) {
    var arr = str.replace(/^\s+|\s+$/g, "").split(/\s+/);
    //split()中如果写的是字符串，它就认为你以字符串的形式分隔，如果写的是正则，那么就是以正则的形式分隔
    //split("\\s")  它其实找的是\s这个字符串，而不是空白
    var aParent = [document];
    var aResult = [];
    for(var i=0; i<arr.length; i++) {
        aParent = getByStr(arr[i], aParent);
        aResult = aParent;
    }
    return aResult;
}
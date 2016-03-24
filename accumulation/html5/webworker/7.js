/**
 * Created by qiujinlong on 2016/3/10.
 */
function fn(n) {
    if(n<=2) {
        return 1;
    } else {
        return fn(n-1)+fn(n-2);
    }
}
this.onmessage = function(ev) {
    this.postMessage(fn(ev.data));
};

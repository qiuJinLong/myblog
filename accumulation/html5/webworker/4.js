/**
 * Created by qiujinlong on 2016/3/10.
 */
this.onmessage = function(ev) {
    ev.data.push(5);
    this.postMessage(ev.data);
};

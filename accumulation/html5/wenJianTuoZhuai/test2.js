//各种标签提示
if (_DataMap.GPro[j].LB) {
    var promTips = _DataMap.GPro[j].LB,
        promTipsHTML = "",
        promLab = {};

    //特例
    if (promTips.PT == 2 && _DataMap.GP.NM != '秒杀商品') {
        promLab.title = "特例";
        promLab.tips = "特例品不可使用全场优惠券，但可以使用品牌优僡券。";
        promLab.ClsFilter = 'pro-tip-txt';
        promLab.ClsTipFilter = 'pro-tip-on';
        promLab.ClsTxtFilter = 'tipbox-on';
        promTipsHTML += Lang.sub(tmpPromType, promLab);
    }

    //银泰专享
    if (promTips.IsLT) {
        promLab.title = "银泰专享";
        promLab.tips = "1、银泰专享商品暂不支持货到付款业务。<br>2、由于银泰专享商品销售库存实时变动，您购买的产品可能会缺货，敬请谅解。";
        promLab.ClsFilter = 'pro-tip-txt2';
        promLab.ClsTipFilter = 'pro-tip-on';
        promLab.ClsTxtFilter = 'tipbox-on';
        promTipsHTML += Lang.sub(tmpPromType, promLab);
    }

    //奢品标示
    if (promTips.IsL) {
        promLab.title = "奢品";
        promLab.ClsFilter = 'pro-tip-txt';
        promTipsHTML += Lang.sub(tmpPromType, promLab);
    }

    //增加赠品标示
    if (_DataMap.GPro[j].TY == 1 || _DataMap.GPro[j].TY == 2) {
        promLab.title = "赠品";
        if (_DataMap.GPro[j].YTP > 0) {
            promLab.title = '超值换购';
        }
        promLab.ClsFilter = 'pro-tip-txt3';
        promTipsHTML += Lang.sub(tmpPromType, promLab);
    }

    //增加预售标记
    if (promTips.IsPS) {
        promLab.title = "预售";
        promLab.tips = promTips.PSM; //"预售商品不支持货到付款，预订后10天发货。";
        promLab.ClsFilter = 'pro-tip-txt';
        promLab.ClsTipFilter = 'pro-tip-on';
        promLab.ClsTxtFilter = 'tipbox-on';
        if (promTips.PSM) {
            promTipsHTML += Lang.sub(tmpPromType, promLab);
        } else {
            promTipsHTML += Lang.sub(tmpPromErrorType, promLab);
        }
    }

    //增加渠道价专享标识
    if (promTips.IsCP) {
        promLab.title = "渠道会员专享";
        promLab.tips = "渠道会员专享，不参加任何促销活动，数量有限，售完恢复银泰价。";
        promLab.ClsFilter = 'pro-tip-txt';
        promLab.ClsTipFilter = 'pro-tip-on';
        promLab.ClsTxtFilter = 'tipbox-on';
        promTipsHTML += Lang.sub(tmpPromType, promLab);
    }

    //增加一元抢购标识
    if (promTips.PB && promTips.PB != "") {
        promLab.title = promTips.PB;
        promLab.ClsFilter = 'pro-tip-txt3';
        promTipsHTML += Lang.sub(tmpPromType, promLab);
    }

    //增加不支持无理由退换标识
    if (promTips.NotRma) {
        promLab.title = '不支持无理由退换';
        promLab.ClsFilter = 'pro-tip-txt4';
        promTipsHTML += Lang.sub(tmpProTrunType, promLab);
    }

    Nodes[dataEvtID].tr[j].one('.pro-pro').append(promTipsHTML);
}

//特卖商品
if (promTips.PT == 3) {
    var start = _DataMap.GPro[j].ST,
        end = _DataMap.GPro[j].ET;
    /*
     Nodes[dataEvtID].prospe = S.Node.create('<div class="pro-spec">'+
     '<span class="pro-spec-tit">特卖</span>'+
     '<span class="pro-spec-txt">数量有限，请尽快提交订单，</span>'+
     '<span class="pro-spec-time" start="'+start+'" end="'+end+'">倒计时00天00小时00分00秒</span>'+
     '</div>');
     Nodes[dataEvtID].prosbt = S.Node.create('<div class="pro-spec-bt"></div>');
     */

    var prospeNode = S.Node.create('<div class="pro-spec-bt"></div>' +
        '<div class="pro-spec">' +
        '<span class="pro-spec-tit">特卖</span>' +
        '<span class="pro-spec-txt">数量有限,请尽快提交订单,</span>' +
        '<span class="pro-spec-time" start="' + start + '" end="' + end + '">倒计时00天00小时00分00秒</span>' +
        '</div>');

    Nodes[dataEvtID].tr[j].one('.pro-pro').append(prospeNode);
    proSpeArr.push(Nodes[dataEvtID].tr[j].one('.pro-pro').one('.pro-spec'));
}


if (isGiftGroup && j > 0) {
    Nodes[dataEvtID].tr[0].one('.th-item').append(Nodes[dataEvtID].tr[j]);
} else {
    Nodes[dataEvtID].table.append(Nodes[dataEvtID].tr[j]);
}
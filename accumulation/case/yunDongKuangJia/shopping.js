/// <reference path="../../yui/3.2.0/build/yui/yui.js" />
/// <reference path="../../eva/eva.js" />

/*
 *
 * shopping
 * ���ﳵҵ���߼�ҳ�漶��
 * Update: 2014/09/28 ����
 *
 * Լ�����淶��
 *   1.���ڳ��õ��ġ��ַ����������¼����͡���ʽ���ԡ�DOMѡ�����������ؼ��֡����ñ������棬�����ѹ���ȣ�
 *   2.�¼����Ͷ�Ӧ�ı����ԡ�E_����Ϊǰ׺��DOMѡ�����ԡ�Sel_����Ϊǰ׺����ʽ�����ԡ�Cls_����Ϊǰ׺����ʽ���Լ�ֵ�ԡ�S_����Ϊǰ׺��DOM�ڵ���DOM�ڵ���еı�ʶ�ԡ�N_����Ϊǰ׺
 *   3.��Ҫ������DOM�ڵ���Ҫ���ռ��洢֮����ʹ�ã��Լ��ٶ�α���DOM������������Ӱ�죻
 *   4.�ԡ�_����ͷ�ķ�����ʾ˽�з���������Ҫ�����˽������ݵ����ʱͨ��Ҳ��ʾ�ص���Ӧ��ȷ��Ĵ�������
 *   5.��һ��DOM�ڵ��б��ڡ��Ż�ȯ������ҳ��͡�Ĭ���б�ҳ��ת��
 *   6.�Ż�ȯ������彻��ģ��Ϊ������js�ļ����ڡ�Ĭ���б�ҳ�����ѡ����ʵ�ʱ����̬���ظ��ļ�
 *   7.�� _rite_ ��ͷΪ��Ʒ/�Ź��ķ���
 *   8.�� _treasure_ ��ͷΪ�ղؼеķ���
 *   9.�� _inter_ ��ͷΪ�Ƽ�������Ʒ�ķ���
 *
 * ����ʵ��������
 * http://jira.yintai.org/confluence/pages/viewpage.action?pageId=16646328
 *
 *
 */

S.namespace("Pages");

//var Yintai_Coupon_File_Version = "",
//    Yintai_Coupon_File_Host = "";

////��ȡcouponģ��İ汾��
//(function () {
//    var now = new Date();
//    Yintai_Coupon_File_Version = "" + now.getFullYear() + now.getMonth() + now.getDate() + now.getHours();

//    var scripts = document.getElementsByTagName("script"),
//        url = scripts[scripts.length - 1].src,
//        reg = /^(http:\/\/.[^\/]+).[^&|\?]*([&|\?]v=(\d+))?/,
//        m = url.match(reg);

//    if (m) {
//        if (m[1]) {
//            Yintai_Coupon_File_Host = m[1];
//        }
//        if (m[3]) {
//            Yintai_Coupon_File_Version = m[3];
//        }
//    } else {
//        Yintai_Coupon_File_Host = "http://r.ytrss.com";

//    }
//})();
Eva.require("node", "io-base", "json-parse", "json-stringify", "anim", "count-plug", "plug-postip", "box", "cookie", "tab", "jsonp", "ui-client-fast", "plug-carousel", "plug-switchable-effect", "datalazyloader").ready(function (S) {
    //ģ���ڲ�ȫ�ֱ�������
    var Nodes = {}, //DOM�ڵ��
        JSON = S.JSON,
        Lang = S.Lang,
        isIE = S.UA.ie,
        isIE6 = isIE == 6,
        NULL = null,
        TRUE = true,
        FALSE = false,

        E_CLICK = 'click',

        Page_Inst = NULL, //ҳ�漶����ʵ��
    //Coupon_File_Version = Yintai_Coupon_File_Version, //couponģ���ļ��İ汾��

        Sel_CommodityBox = "#CommodityBox",
        Sel_BargainBox = ".bargainBox",
        Sel_EvtTit = ".limit",
        Sel_CheckLayer = "#CheckLayer",
        sel_Accountsbox = ".Accountsbox",
        Sel_CheckOut = ".Accounts",
        Sel_Selectkey = ".Selectkey",
        Sel_LiPinBox = "#J-LiPinBox",
        Sel_CostlyBox = "#J-CostlyBox",

        Sel_ClearCart = "#ClearCartBtn",
    //Sel_SelCoupon = "#SelectCoupon",
    //Sel_ActiveCoupon = "#ActiveCoupon",
    //Sel_CouponWidget = "#couponWidget",
        Sel_SelLiPin = "#SelectLiPin",

        Sel_FloatFix = "#J-FloatFix",
        Sel_Interested = "#J-Interested",
        Sel_SideFloat = "#J-SideFloat",

        DISPLAY = "display",
        BLOCK = "block",
        INLINEBLOCK = "inline-block",
        NONE = "none",
        VISIBLE = "visible",
        HIDDEN = "hidden",
        VISIBILITY = "visibility",

        CommBoxWrap = "CommodityBoxWrap",
        ModifyTip = "ModifyTip",
        LiPin = "LiPin", //��Ʒ
        Costl = "Costl", //��������

    //CouponScriptPath = Yintai_Coupon_File_Host + "/rs/js/ec/v3/shoppingcart-coupon@20140729.js",
        LoadingLogoPath = "http://r.ytrss.com/rs/img/EC/v3/min-loading.gif",

        Tmpl_Loading = '<span style="position:relative;top:6px;left:10px" class="J-Load"><img src="' + LoadingLogoPath + '"/></span>',
        Tmpl_SubmitLoading = '<span><img src="' + LoadingLogoPath + '" /><span>������...</span></span>',

    //CouponUrlFlag = "coupon=1",

        Cls_Ing = "J-Working",
        Cls_Inhibit = "inhibit",

        bargainID = NULL,
        miaoShaID = NULL,
        tmpPRS = '',
        tmpPro = '',
        tmpBoxTitle = '',
        tmpPromType = '',
        tmpPromErrorType = '',
        tmpProTrunType = '',
        tmpFavPro = '',
        tmpDeledTr = '',

        tipAnim = NULL,
        tipAnimTime = 0.5,
        gift = 'gift',
        normal = '0%2B0',

        mainDataMap = NULL,
        DataGift = NULL,
        DataCGI = NULL,
        DataAmount = NULL,

        N_Wrap = "wrap",
        Muster = "nuster",
        itemcodeNull = "", //������һֱΪ��,{IC}�ַ��滻
        Dols = "&yen;", //��Ԫ����

        Cls_Select = "select",
        CHECKED = "checked",
        Disabled = "disabled",

        Attr_GroupNo = "key",
        Attr_Itemcode = "itemcode",

        N_DeledGoods = "#RemoveBlock",
        N_DeledStock = "#LackInventory",
        N_Collection = "#J-Collection",

        Sel_Reset = "#J-Reset",
        Sel_Return = "#J-Return",
        Sel_EnterInput = "#J-EnterCheck",
        Sel_AProduct = ".AProduct",
        Sel_CheapGift = ".CheapGift",
        Sel_Choose = ".J-choose input",
        Sel_layTip = ".J-layTip",
        Sel_SelectColor = ".J-selectColor li",
        Sel_SelectSpeci = ".J-selectSpeci li",
        Sel_CheckAll = '.J-check-all',
        N_SubmitLoading = "submitloading",

        GbIndex = 0;

    var ShoppingCart = function (config) {
        var self = this;

        Nodes = {}; //����
        self.renderEvtID = [];
        self.cartMap = NULL; //���ﳵ�е����ݣ��������û��Ѿ�ѡ�����Ʒ��Ϣ��������������Ʒ�Ƽ�֮�������
        self.promMap = NULL; //�����Ƽ���Ʒ����
        self.swop = FALSE; //self.swop ����self.swop���������� ��Ʒ(gift) �� ��ֵ����(worth) �޸��������
        self.choice = TRUE; //���������ƶ�ѡ��ѡ����Loading�����а������������ɲ���!!! -- ����

        self.init.call(self);

        //if (window.location.hash.indexOf(CouponUrlFlag) > -1) {
        //    self.switchTo("coupon");
        //}

        //�ж��Ƿ����Ż�ȯ -- ͬʱ���ּ�����ѡ���Ż�ȯ��ť
        //if (window.Yintai_ShoppingCart.coupons.length == 0) {
        //    Nodes[Sel_SelCoupon].setStyle(DISPLAY, NONE);
        //} else {
        //    Nodes[Sel_ActiveCoupon] && Nodes[Sel_ActiveCoupon].setStyle(DISPLAY, NONE);
        //}
    }
    ShoppingCart.prototype = {
        /**
         * ��ʼ��
         *
         * @method init
         * @param ��
         */
        init: function () {
            var self = this;

            self.bfdTimerCount = 0; //�ٷֵ��Ƽ���ѯ����

            self.collectNodes();

            mainDataMap = fakeData.GroupItems;
            HasGift = fakeData.HasGift;
            DataGift = fakeData.Gifts;
            ChangedGroup = fakeData.ChangedGroupItems;
            DataAmount = fakeData.TotalModel;

            self.prepareData();

            if (mainDataMap.length == 0) {
                if (ChangedGroup != NULL && ChangedGroup != 'undefined' && ChangedGroup.length > 0) {
                    DataCGI = ChangedGroup['0'].GPro;
                    if (DataCGI.length > 0) {
                        self.clearCart(TRUE);
                        self.romveList(Nodes[N_DeledStock], DataCGI);
                    }
                    return FALSE;
                } else {
                    self.clearCart();
                    return FALSE;
                }
            } else {
                if (ChangedGroup != NULL && ChangedGroup != 'undefined' && ChangedGroup.length > 0) {
                    DataCGI = ChangedGroup['0'].GPro;
                    if (DataCGI.length > 0) {
                        self.romveList(Nodes[N_DeledStock], DataCGI);
                    }
                }
            }

            self.render();
            self.bindEvent();
            self.onceForAll();
            self._loveSale(); //[�����]ƥ��Ӻ�
        },
        /**
         * �ռ��ڵ�
         * @method collectNodes
         * @param ��
         */
        collectNodes: function () {
            Nodes['document'] = S.one(document);
            Nodes['window'] = S.one(window);
            Nodes['#doc'] = S.one('#doc');
            Nodes['#bd'] = S.one('#bd');
            Nodes[Sel_ClearCart] = S.one(Sel_ClearCart);
            //Nodes[Sel_SelCoupon] = S.one(Sel_SelCoupon);
            //Nodes[Sel_ActiveCoupon] = S.one(Sel_ActiveCoupon);
            //Nodes[Sel_CouponWidget] = S.one(Sel_CouponWidget);
            Nodes[Sel_SelLiPin] = S.one(Sel_SelLiPin);
            Nodes[sel_Accountsbox] = S.one(sel_Accountsbox);
            Nodes[Sel_CheckOut] = Nodes[sel_Accountsbox].one(Sel_CheckOut);
            Nodes[Sel_CheckLayer] = S.one(Sel_CheckLayer);
            Nodes[Sel_Selectkey] = Nodes[Sel_CheckLayer].one(Sel_Selectkey);
            Nodes[N_DeledGoods] = S.one(N_DeledGoods); //ɾ��-��Ʒ�б�
            Nodes[N_DeledStock] = S.one(N_DeledStock); //ȱ��-��治����Ʒ���ڵ�
            Nodes[Sel_FloatFix] = S.one(Sel_FloatFix); //���㰴ť ֮ ��������Ԫ��
        },
        /**
         * ׼�����ֽ���Ҫ��Ⱦ������
         *
         * @method prepareData
         * @param ��
         */
        prepareData: function () {
            var self = this;
            tmpPRS = '<span>{PpN}��<b>{PpV}</b></span>',
                tmpProPart =
                    '<div class="property cf">' +
                    '<div class="pro-img"><a title="{NM}" target="_blank" href="{LK}"><img alt="" src="{SRC}"></a></div>' +
                    '<p class="pro-title"><a href="{LK}" title="{NM}" target="_blank">{NM}</a></p>' +
                    '<div class="pro-pro">' +
                    '<p class="pro-check"></p>' +
                    '</div>' +
                    '</div>',
                tmpPro =
                    '<div class="AProduct areacolor cf">' +
                    '<div class="category th-chk">' +
                    '<div><input type="checkbox" class="J-willing" checked="checked" sku="{IC}" id="J-Change-{IC}-{PT}-{YTP}" data-clk="clkcartcheckbox" /><label class="checked J-SelectPro" data-clk="clkcartcheckbox" for="J-Change-{IC}-{PT}-{YTP}"></label></div>' +
                    '</div>' +
                    '<div class="category th-item">' +
                    tmpProPart +
                    '</div>' +
                    '<div class="category th-price">' +
                    '<div class="pro-price">' +
                    '<strong>��<em>{YTP}</em></strong>' +
                    '<span class="pro-rebate"><b>{DC}</b>��</span>' +
                    '<b class="integral {hiddenCls}">+<i>{CostPoints}</i>����</b>' +
                    '</div>' +
                    '</div>' +
                    '<div class="category th-amount">' +
                    '<div class="pro-number">' +
                    '<a href="javascript:void(0)" title="����" class="nums-red {disable}">-</a>' +
                    '<input type="text" class="pro-nums" value="{Qty}" lastvalue="{Qty}" />' +
                    '<a href="javascript:void(0)" title="����" class="nums-add">+</a>' +
                    '</div>' +
                    '</div>' +
                    '<div class="category th-sum">{Points}</div>' +
                    '<div class="category th-op">' +
                    '<div class="decidetime">' +
                    '<a class="pro-collect" href="javascript:void(0)">�����ղ�</a>' +
                    '</div>' +
                    '<div class="decidetime">' +
                    '<a class="pro-alter" href="javascript:void(0)">�޸Ĳ���</a>' +
                    '</div>' +
                    '<div class="decidetime">' +
                    '<a class="pro-remove" href="javascript:void(0)">ɾ����Ʒ</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                tmpBoxTitle =
                    '<div class="CommodityTitle">' +
                    '<div class="ActivitieHead">' +
                    '<h3>{NM}</h3>' +
                    '</div>' +
                    '</div>',
                tmpPromType =
                    '<div class="pro-tip {ClsTipFilter}">' +
                    '<span class="{ClsFilter}"><em>{title}</em></span>' +
                    '<div class="tipbox {ClsTxtFilter}">' +
                    '<div class="tipbox-i">' +
                    '<i>{tips}</i>' +
                    '<span class="uparrow"></span>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                tmpPromErrorType =
                    '<div class="pro-tip">' +
                    '<span class="{ClsFilter}"><em>{title}</em></span>' +
                    '</div>',
                tmpProTrunType =
                    '<div class="pro-tip">' +
                    '<span class="{ClsFilter}"><a href="http://www.yintai.com/help/index.html#reRegime" target="_blank"></a>{title}</span>' +
                    '</div>',
                tmpFavPro =
                    '<div class="shopping_menuOne">' +
                    '<div class="shopping_special_img">' +
                    '<a href="{LK}"><img width="88" height="118" alt="" src="{SRC}"></a>' +
                    '</div>' +
                    '<div class="shopping_special_info">' +
                    '<h3><a href="{LK}">{NM}</a></h3>' +
                    '<div class="CheckGoods">' +
                    '<label>��ɫ��</label>' +
                    '<select class="CheckGoodsColor" options="{color}">' +
                    '</select>' +
                    '<label>���룺</label>' +
                    '<select class="CheckGoodsSize" options="{size}">' +
                    '</select>' +
                    '</div>' +
                    '<div class="CheckGoodsAttr">' +
                    '<span class="add_shopping_bag" itemcode="{IC}">��ӵ����ﳵ</span>' +
                    '<span class="PresentPrice">�Żݼ� <strong>��{YTP}</strong></span>' +
                    '<span class="OriginalPrice">ԭ�� <em>��{MP}</em></span>' +
                    '</div>' +
                    '<p class="ActivitiesTips">{PromotionName}</p>' +
                    '</div>' +
                    '</div>',
                tmpDeledTr =
                    '<div class="RemoveThis cf">' +
                    '<div class="Remove Remove1">{sku}</div>' +
                    '<div class="Remove Remove2"><a href="{url}" target="_blank">{title}</a></div>' +
                    '<div class="Remove Remove3"><strong>��{price}</strong></div>' +
                    '<div class="Remove Remove4">{num}</div>' +
                    '<div class="Remove Remove5">' +
                    '<a href="javascript:void(0);" class="rebuy">���¹���</a> <span class="split">|</span> <a href="javascript:void(0);" class="moveclt">�����ղ�</a>' +
                    '</div>' +
                    '</div>';

            if (!Nodes[CommBoxWrap]) {
                Nodes[CommBoxWrap] = S.one(Sel_CommodityBox);
            }

            for (var i = 0; i < mainDataMap.length; i++) {
                var dataType = TRUE,
                    _DataMap = mainDataMap[i];
                console.log(mainDataMap[i]);
                self.createEvtNode(_DataMap); //������Ʒ�ṹ��ϸ
            }

            //var checkPro = Nodes[CommBoxWrap].all(".J-willing");
            //checkPro.each(function (that) {
            //    that.set(CHECKED, TRUE);
            //});

            //��ֵ������ť
            if (!HasGift && Nodes[Sel_SelLiPin]) {
                Nodes[Sel_SelLiPin].addClass(HIDDEN);
            } else {
                Nodes[Sel_SelLiPin].removeClass(HIDDEN);
            }

            //�Ż���Ʒ&��Ʒ
            Nodes['DOMfavGoods'] = S.Node.create('<div class="shopping_special cf"><h3 class="product_title">�Ż���Ʒѡ��</h3></div>');
            Nodes['favGoods'] = [];
            if (DataGift.length == 0) {
                Nodes['DOMfavGoods'].addClass(HIDDEN);
            } else {
                Nodes['DOMfavGoods'].removeClass(HIDDEN);
            }
            for (var n = 0; n < DataGift.length; n++) {
                Nodes['favGoods'][n] = S.Node.create(Lang.sub(tmpFavPro, DataGift[n]));
                var nodeSelectColor = Nodes['favGoods'][n].one('.CheckGoodsColor'),
                    nodeSelectSize = Nodes['favGoods'][n].one('.CheckGoodsSize'),
                    OPCOLOR = nodeSelectColor.getAttribute('options').split(','),
                    OPSIZE = nodeSelectSize.getAttribute('options').split(','),
                    optionsNodeColor = "",
                    optionsNodeSize = "";
                for (var c = 0; c < OPCOLOR.length; c++) {
                    optionsNodeColor += '<option value="' + OPCOLOR[c] + '">' + OPCOLOR[c] + '</option>';
                }
                nodeSelectColor.append(optionsNodeColor);
                for (var s = 0; s < OPSIZE.length; s++) {
                    optionsNodeSize += '<option value="' + OPSIZE[s] + '">' + OPSIZE[s] + '</option>';
                }
                nodeSelectSize.append(optionsNodeSize);
                if (n % 2 !== 0) {
                    Nodes['favGoods'][n].addClass('shopping_menuTwo');
                }

                Nodes['DOMfavGoods'].append(Nodes['favGoods'][n]);
            }

            //�Ż���Ʒ��ӵ����ﳵ����
            Nodes['DOMfavGoods'].delegate(E_CLICK, function (e) {

                var ET = e.currentTarget,
                    itemCode = ET.getAttribute('itemcode');

                S.io(window.Env.ShoppingCartV2Ajax, {
                    method: 'POST',
                    data: "op=12&itemcode=" + itemCode + "&qty=1",
                    on: {
                        success: function (index, req) {
                            var response = req.responseText,
                                response = JSON.parse(response);

                            self.add(response);
                        }
                    }
                });

            }, '.add_shopping_bag');

            //Nodes[Sel_CouponWidget] && (Nodes['CouponWidget'] = Nodes[Sel_CouponWidget]);
        },
        /**
         * ��Ⱦ
         *
         * @method render
         * @param reRender {Boolean} �Ƿ�������Ⱦ
         */
        render: function () {
            var self = this;
            self.createWidget();
        },
        /**
         * �����ṹ
         *
         * @method createEvtNode
         * @param _DataMap {json} ����
         */
        createEvtNode: function (_DataMap) {
            if (_DataMap == 'normal') {
                Nodes[normal] = {};
                Nodes[normal].wrap = S.Node.create('<div class="CommodityBox"></div>');
                Nodes[normal].hd = S.Node.create('<div class="DirectoryTitle"><div class="CommodityTitle"><div class="ActivitieHead"><h3>��ͨ��Ʒ</h3></div></div></div>');
                Nodes[normal].table = S.Node.create('<div class="CommodityList"></div>');
                Nodes[normal].wrap.append(Nodes[normal].hd);
                Nodes[normal].wrap.append(Nodes[normal].table);
                Nodes[normal].wrap.setStyle(DISPLAY, NONE);
            } else {
                var self = this,
                    hdHTML = "",
                    bdHTML = "",
                    bdProHTML = "",
                    spot = "", //����spot��ʶ������ ��Ʒ(gift) �� ��ֵ����(worth) �������ߵļ۸�
                    isGiftGroup = _DataMap.GP.PT == 13 || _DataMap.GP.PT == 14 || _DataMap.GP.PT == 17 || _DataMap.GP.PT == 18,
                    dataEvtID = _DataMap.GP.ID + '%2B' + _DataMap.GP.PT;

                hdHTML = Lang.sub(tmpBoxTitle, _DataMap.GP);

                if (Nodes[dataEvtID]) {
                    dataEvtID = GbIndex + '%2B' + dataEvtID;
                    GbIndex++;
                }

                Nodes[dataEvtID] = {};
                Nodes[dataEvtID].hd = S.Node.create(hdHTML);
                Nodes[dataEvtID].tip = S.Node.create('<div class="Activities"><p></p><a href="javascript:void(0);" target="_blank">�鿴����� &gt;</a></div>');
                Nodes[dataEvtID].hd.append(Nodes[dataEvtID].tip);

                var onSale = Nodes[dataEvtID].tip.one('p'),
                    onLink = Nodes[dataEvtID].tip.one('a');

                if (_DataMap.GP.NM !== "��ͨ��Ʒ") {
                    Nodes[dataEvtID].hd.one('.ActivitieHead').addClass('Initiate');

                    if (_DataMap.GP.TP) {
                        onSale.append(_DataMap.GP.TP);
                    } else {
                        onSale.addClass(HIDDEN);
                    }

                    if (_DataMap.GP.DU) {
                        onLink.set('href', _DataMap.GP.DU);
                    } else {
                        onLink.addClass(HIDDEN);
                    }
                } else {
                    onLink.addClass(HIDDEN);
                }

                Nodes[dataEvtID].table = S.Node.create('<div class="CommodityList"></div>');

                for (var j = 0; j < _DataMap.GPro.length; j++) {
                    //ѭ����ǰÿһ��GPro�е���Ʒ
                    var prsHTML = '',
                        prsPT = isGiftGroup ? _DataMap.GP.PT : _DataMap.GPro[j].PT,
                        hiddenCls = _DataMap.GPro[j].CostPoints ? "" : HIDDEN,
                        disableCls = (_DataMap.GPro[j].Qty == 1) ? "disable" : "",
                        prEvtID = _DataMap.GPro[j].ID + '%2B' + prsPT;

                    for (var prs = 0; prs < _DataMap.GPro[j].MaP.length; prs++) {
                        prsHTML += Lang.sub(tmpPRS, _DataMap.GPro[j].MaP[prs]);
                    }
                    if (!Nodes[dataEvtID].tr) {
                        Nodes[dataEvtID].tr = []
                    };

                    //����� �� 17��X��X��
                    if (isGiftGroup && parseInt(_DataMap.GPro[j].Qty) > 1) {
                        _DataMap.GPro[j].NM = _DataMap.GPro[j].NM + ' �� ' + _DataMap.GPro[j].Qty;
                    }

                    if (isGiftGroup && j > 0) {
                        bdProHTML = Lang.sub(tmpProPart, _DataMap.GPro[j]);
                        Nodes[dataEvtID].tr[j] = S.Node.create(bdProHTML);
                    } else {
                        if (isGiftGroup) {
                            _DataMap.GPro[j].Qty = _DataMap.GP.PC;
                        }

                        if (prsPT == 18 && _DataMap.GP.PC > 1) {
                            disableCls = "";
                        }

                        bdHTML = Lang.sub(tmpPro, S.merge(_DataMap.GPro[j], { "hiddenCls": hiddenCls, "disable": disableCls }));
                        Nodes[dataEvtID].tr[j] = S.Node.create(bdHTML);
                        (isGiftGroup || prsPT == 17) && Nodes[dataEvtID].tr[j].addClass('gift-bag');
                    }

                    if (isGiftGroup) {
                        var allProLink = j == 0 ? Nodes[dataEvtID].tr[j].all('.property a') : Nodes[dataEvtID].tr[j].all('a');
                        allProLink.set('href', 'javascript:void(0);').set('target', '_self').setStyle('cursor', 'default');
                    }

                    Nodes[dataEvtID].tr[j].one('.pro-check').append(prsHTML);
                    if (isGiftGroup && j == 0) {
                        Nodes[dataEvtID].tr[j].setAttribute('itemCode', _DataMap.GP.Guid);
                        Nodes[dataEvtID].tr[j].setAttribute('isGiftGroup', TRUE);
                    } else {
                        Nodes[dataEvtID].tr[j].setAttribute('itemCode', _DataMap.GPro[j].IC);
                    }
                    Nodes[dataEvtID].tr[j].setAttribute('evtID', prEvtID);

                    if (typeof Nodes[gift] != 'object') {
                        Nodes[gift] = [];
                    }

                    //�Ƿ��Ա������Ʒ
                    if (_DataMap.GPro[j].PT == 12) {
                        Nodes[dataEvtID].tr[j].one('.pro-collect').remove();
                        Nodes[dataEvtID].tr[j].one('.pro-number').setContent(_DataMap.GPro[j].Qty);
                    }

                    //һԪ������Ʒ
                    if (_DataMap.GPro[j].PT == 15) {
                        Nodes[dataEvtID].tr[j].one('.pro-rebate').addClass(HIDDEN);
                        Nodes[dataEvtID].tr[j].one('.pro-number').setContent(_DataMap.GPro[j].Qty);
                        Nodes[dataEvtID].tr[j].one('.th-sum').setContent("0");
                        Nodes[dataEvtID].tr[j].one('.pro-collect').remove();
                    }

                    //0Ԫ��Ʒ���������ʾ��TYΪ1��ʾ��������2��ʾע������Ʒ
                    if (_DataMap.GPro[j].TY == 1 || _DataMap.GPro[j].TY == 2) {
                        Nodes[dataEvtID].tr[j].setAttribute('isGift', 'true');
                        Nodes[dataEvtID].tr[j].one('.pro-rebate').addClass(HIDDEN);
                        if (_DataMap.GPro[j].TY == 1) {
                            Nodes[gift].push(Nodes[dataEvtID].tr[j]);
                        }
                    }

                    if (!isGiftGroup || j == 0) {
                        //���ۿ�����ʾ�ۿ۱�ǩ
                        if (_DataMap.GPro[j].DC == 10 || _DataMap.GPro[j].DC == 0 || isGiftGroup) {
                            Nodes[dataEvtID].tr[j].one('.pro-rebate').addClass(HIDDEN);
                        }

                        _DataMap.GPro[j].IsS && Nodes[dataEvtID].tr[j].one('.pro-number').setContent('<span class="NotStock">��ʱȱ��</span>');
                    }



                    //��ʱ��������ʱ
                    if (_DataMap.GPro[j].ST != NULL && _DataMap.GPro[j].ET != NULL) {
                        var start = _DataMap.GPro[j].ST,
                            end = _DataMap.GPro[j].ET;
                        Nodes[dataEvtID].tr[j].one('.pro-pro').append('<div class="pro-tip-time" start="' + start + '" end="' + end + '"></div>');
                    }

                    //���ֱ�ǩ��ʾ
                    if (_DataMap.GPro[j].LB) {
                        var promTips = _DataMap.GPro[j].LB,
                            promTipsHTML = "",
                            promLab = {};

                        //����
                        if (promTips.PT == 2 && _DataMap.GP.NM != '��ɱ��Ʒ') {
                            promLab.title = "����";
                            promLab.tips = "����Ʒ����ʹ��ȫ���Ż�ȯ��������ʹ��Ʒ���Ńaȯ��";
                            promLab.ClsFilter = 'pro-tip-txt';
                            promLab.ClsTipFilter = 'pro-tip-on';
                            promLab.ClsTxtFilter = 'tipbox-on';
                            promTipsHTML += Lang.sub(tmpPromType, promLab);
                        }

                        //������Ʒ
                        if(promTips.PT == 3) {
                            var start = _DataMap.GPro[j].ST,
                                end = _DataMap.GPro[j].ET;
                            /*
                             Nodes[dataEvtID].prospe = S.Node.create('<div class="pro-spec">'+
                             '<span class="pro-spec-tit">����</span>'+
                             '<span class="pro-spec-txt">�������ޣ��뾡���ύ������</span>'+
                             '<span class="pro-spec-time" start="'+start+'" end="'+end+'">����ʱ00��00Сʱ00��00��</span>'+
                             '</div>');
                             Nodes[dataEvtID].prosbt = S.Node.create('<div class="pro-spec-bt"></div>');
                             */
                            promTipsHTML = '<div class="pro-spec-bt"></div>' +
                                '<div class="pro-spec">' +
                                '<span class="pro-spec-tit">����</span>' +
                                '<span class="pro-spec-txt">�������ޣ��뾡���ύ������</span>' +
                                '<span class="pro-spec-time" start="' + start + '" end="' + end + '">����ʱ00��00Сʱ00��00��</span>' +
                                '</div>';
                        }

                        //��̩ר��
                        if (promTips.IsLT) {
                            promLab.title = "��̩ר��";
                            promLab.tips = "1����̩ר����Ʒ�ݲ�֧�ֻ�������ҵ��<br>2��������̩ר����Ʒ���ۿ��ʵʱ�䶯��������Ĳ�Ʒ���ܻ�ȱ���������½⡣";
                            promLab.ClsFilter = 'pro-tip-txt2';
                            promLab.ClsTipFilter = 'pro-tip-on';
                            promLab.ClsTxtFilter = 'tipbox-on';
                            promTipsHTML += Lang.sub(tmpPromType, promLab);
                        }

                        //��Ʒ��ʾ
                        if (promTips.IsL) {
                            promLab.title = "��Ʒ";
                            promLab.ClsFilter = 'pro-tip-txt';
                            promTipsHTML += Lang.sub(tmpPromType, promLab);
                        }

                        //������Ʒ��ʾ
                        if (_DataMap.GPro[j].TY == 1 || _DataMap.GPro[j].TY == 2) {
                            promLab.title = "��Ʒ";
                            if (_DataMap.GPro[j].YTP > 0) {
                                promLab.title = '��ֵ����';
                            }
                            promLab.ClsFilter = 'pro-tip-txt3';
                            promTipsHTML += Lang.sub(tmpPromType, promLab);
                        }

                        //����Ԥ�۱��
                        if (promTips.IsPS) {
                            promLab.title = "Ԥ��";
                            promLab.tips = promTips.PSM; //"Ԥ����Ʒ��֧�ֻ������Ԥ����10�췢����";
                            promLab.ClsFilter = 'pro-tip-txt';
                            promLab.ClsTipFilter = 'pro-tip-on';
                            promLab.ClsTxtFilter = 'tipbox-on';
                            if (promTips.PSM) {
                                promTipsHTML += Lang.sub(tmpPromType, promLab);
                            } else {
                                promTipsHTML += Lang.sub(tmpPromErrorType, promLab);
                            }
                        }

                        //����������ר���ʶ
                        if (promTips.IsCP) {
                            promLab.title = "������Աר��";
                            promLab.tips = "������Աר�����μ��κδ�������������ޣ�����ָ���̩�ۡ�";
                            promLab.ClsFilter = 'pro-tip-txt';
                            promLab.ClsTipFilter = 'pro-tip-on';
                            promLab.ClsTxtFilter = 'tipbox-on';
                            promTipsHTML += Lang.sub(tmpPromType, promLab);
                        }

                        //����һԪ������ʶ
                        if (promTips.PB && promTips.PB != "") {
                            promLab.title = promTips.PB;
                            promLab.ClsFilter = 'pro-tip-txt3';
                            promTipsHTML += Lang.sub(tmpPromType, promLab);
                        }

                        //���Ӳ�֧���������˻���ʶ
                        if (promTips.NotRma) {
                            promLab.title = '��֧���������˻�';
                            promLab.ClsFilter = 'pro-tip-txt4';
                            promTipsHTML += Lang.sub(tmpProTrunType, promLab);
                        }

                        Nodes[dataEvtID].tr[j].one('.pro-pro').append(promTipsHTML);
                    }
                    if (isGiftGroup && j > 0) {
                        Nodes[dataEvtID].tr[0].one('.th-item').append(Nodes[dataEvtID].tr[j]);
                    } else {
                        Nodes[dataEvtID].table.append(Nodes[dataEvtID].tr[j]);
                    }

                    //�ɷ��޸�����
                    if (!_DataMap.GPro[j].CM) {
                        var pronumber = Nodes[dataEvtID].tr[j].one('.pro-number');
                        pronumber && pronumber.setContent(_DataMap.GPro[j].Qty);
                    }

                    //�Ƿ��ɾ��
                    if (!_DataMap.GPro[j].CDE) {
                        var proremove = Nodes[dataEvtID].tr[j].one('.pro-remove');
                        proremove && proremove.remove();
                    }

                    //�ܷ��ղ�
                    if (!_DataMap.GPro[j].CC) {
                        var procollect = Nodes[dataEvtID].tr[j].one('.pro-collect');
                        procollect && procollect.remove();
                    }

                    //�Ƿ���޸Ĳ���
                    if (!_DataMap.GPro[j].GM) {
                        var proalter = Nodes[dataEvtID].tr[j].one('.pro-alter');
                        proalter && proalter.remove();
                    }

                    //�����ǰ��Ʒ��ɾ��/���ղ�/���޸Ĳ��� ����� "-" ��ʾ
                    if (!_DataMap.GPro[j].CDE && !_DataMap.GPro[j].CC && !_DataMap.GPro[j].GM) {
                        Nodes[dataEvtID].tr[j].one('.th-op').setContent('<div class="decidetime">--</div>');
                    }

                    //�Ź� ��Ʒ ��ʾ����
                    if (_DataMap.GP.PT == 3) { //��Ʒ(gift) �� ��ֵ����(worth)
                        var _dataMZMP = _DataMap.GPro[j].MZMP,
                            notCheck = Nodes[dataEvtID].tr[j].one('.th-chk').one('div');

                        if (_DataMap.GPro[0].YTP > 0) {
                            spot = 'worth';
                        } else {
                            spot = 'gift';
                            notCheck.setContent(); //����0Ԫ��Ʒ�����input��ť
                        }

                        if (_dataMZMP != NULL && _dataMZMP != 'undefined') {
                            self._rite_origin(_dataMZMP, Nodes[dataEvtID].table.all(Sel_AProduct).item(j));
                        }
                    }

                    //�Ż�ȯ
                    if (_DataMap.GP.PT == 9) {
                        var notCheck = Nodes[dataEvtID].tr[j].one('.th-chk').one('div');
                        notCheck && notCheck.setStyle(DISPLAY, NONE);
                    }

                    //ע������Ʒ
                    if (_DataMap.GP.PT == 7) {
                        var notCheck = Nodes[dataEvtID].tr[j].one('.th-chk').one('div');
                        notCheck && notCheck.setStyle(DISPLAY, NONE);
                    }

                }

                Nodes[dataEvtID].wrap = S.Node.create('<div class="CommodityBox"></div>');
                if (_DataMap.GP.PT == 3) {
                    if (spot == 'gift') {
                        Nodes[dataEvtID].wrap.set("id", "J-LiPinBox");
                    } else if (spot == 'worth') {
                        Nodes[dataEvtID].wrap.set("id", "J-CostlyBox");
                    }
                }

                Nodes[dataEvtID].wrap.append(Nodes[dataEvtID].hd);
                Nodes[dataEvtID].wrap.append(Nodes[dataEvtID].table);
                if (_DataMap.GP.NM == '��ʱ����') {
                    Nodes['BargainBox'] = Nodes[dataEvtID].wrap;
                }
                if (_DataMap.GP.NM == '��ɱ��Ʒ') {
                    Nodes['miaoShaBox'] = Nodes[dataEvtID].wrap;
                }
                //����
                /*
                if (_DataMap.GPro[j].LB) {
                    Nodes['teMaiBox'] = Nodes[dataEvtID].wrap;
                }
                        */
                self.renderEvtID.push(dataEvtID);
            }
        },
        /**
         * ���¼������ܻ��ڲ�ͬ��ʱ�̱����ã�ͨ������slot����ȷ����ͬʱ�ڰ󶨵���ͬԪ���ϵ��¼�
         *
         * @method bindEvent
         * @param slot {String} ��ʶ��ͬ��ʱ����Ҫ�󶨵���ͬԪ���ϵĲ�ͬ�¼�
         */
        bindEvent: function (slot) {
            var self = this;

            //��ʱ��������ʱ�¼���
            if (Nodes['BargainBox']) {
                Nodes['BargainBox'].plug(S.Plugin.Count, {
                    countSel: ".pro-tip-time",
                    template: "����ʱ��{day}��{hour}Сʱ{minute}��{second}��"
                });
            }

            if (Nodes['miaoShaBox']) {
                Nodes['miaoShaBox'].plug(S.Plugin.Count, {
                    countSel: ".pro-tip-time",
                    template: "����ʱ��{day}��{hour}Сʱ{minute}��{second}��"
                });
            }

            if (Nodes['teMaiBox']) {
                Nodes['teMaiBox'].plug(S.Plugin.Count, {
                    countSel: ".pro-spec-time",
                    template: "����ʱ��{day}��{hour}Сʱ{minute}��{second}��"
                });
            }

            //��ʱ������ �Ż�ȯ ���Ƶ�����ҳ����ʾ
            if (Nodes[Sel_CheckLayer]) {
                var payofone = Nodes[Sel_CheckLayer].one(".PayofOne");

                payofone.setStyle("position", "relative");
                //ȥ�����Ż�ȯ��Ǩ�Ƶ�����ҳ���뵽����ҳʹ�ã�����ʾ
                //payofone.append('<div style="height:22px;position:absolute;top:26px;left:6px;color:#e5004f"><span style="display:inline-block;width:18px;height:22px;overflow:hidden;vertical-align:middle;background:url(http://r.ytrss.com/rs/img/EC/v3/shopcart/shopping-icon.png) 0 -362px no-repeat"></span>�Ż�ȯ��Ǩ�Ƶ�����ҳ���뵽����ҳʹ�ã�</div>');
            }

            //��Ʒ��ǩ�¼���
            Nodes[CommBoxWrap].all('.pro-tip-txt2').each(function (hoe, index) {
                hoe.next('.tipbox-on').setStyle('width', '440px');
            });
            Nodes[CommBoxWrap].plug([{ fn: S.Plugin.Postip, cfg: { tipsSel: ".tipbox-on", triggersSel: ".pro-tip-on", hideDelay: 300 } }]);

            //ȷ�ϲ������㴴��
            if (Nodes['confirmNode'] == NULL || Nodes['confirmNode'] == undefined) {
                Nodes['confirmNode'] = S.Node.create('<div style="display:block" class="decbox"><div class="decbox-i"><i></i><p><a class="agree" href="javascript:void(0);">ȷ��</a><a class="reject" href="javascript:void(0);">ȡ��</a></p><span class="decrow"></span></div></div>');
            }
            Nodes['confirmNode'].delegate(E_CLICK, function (e) {
                e.halt();
                var _ET = e.currentTarget,
                    proTr = _ET.ancestor(Sel_AProduct),
                    proItemCode = proTr.getAttribute('itemcode'),
                    proInput = proTr.one('input.pro-nums'),
                    proNumber = proTr.one('.pro-number'),
                    proNum = NULL,
                    proDetail = {};

                if (proInput) {
                    proNum = proInput.get('value');
                } else {
                    proNum = parseInt(proNumber.get('value'));
                }

                proDetail = {
                    "sku": proItemCode,
                    "title": proTr.one('.pro-title a').get('innerHTML'),
                    "url": proTr.one('.pro-title a').get('href'),
                    "price": proTr.one('.pro-price strong em').get('innerHTML'),
                    "num": proNum,
                    "evtid": proTr.getAttribute('evtid')
                };

                Nodes['confirmNode'].setStyle(DISPLAY, NONE);

                self.checkLabel = _ET;  //��¼��ǰѡ������һ����Ʒ�Ľڵ�,���㴦��������ʱ����.

                if (_ET.hasClass('agree')) {
                    if (Nodes['confirmNode'].previous('a').hasClass('pro-collect')) {

                        if (self.isLogin()) {
                            self._collect(proTr, proDetail);
                        } else {
                            self.directLogin("collect", function () {
                                self._collect(proTr, proDetail);
                            });
                        }

                        //�����ͳ��-�����ղ�-��Ʒ���
                        self._clk_common('moveToCollection', '{' + proItemCode + '}');

                    } else if (Nodes['confirmNode'].previous('a').hasClass('pro-remove')) {

                        if (proTr.hasAttribute('isGift') || proTr.hasAttribute('isGiftGroup')) {
                            self._del(proTr, proDetail);
                        } else {
                            self._del(proTr, proDetail, TRUE);
                        }

                        //ga�Ƴ���Ʒͳ��
                        self.gaRemoveProduct();

                        //�����ͳ��-ɾ����Ʒ-��Ʒ���
                        self._clk_common('delProd', '{' + proItemCode + '}');
                    }

                }
            }, 'a');

            //ɾ����Ʒ / �ղ���Ʒ / �޸Ĳ���
            Nodes[CommBoxWrap].delegate(E_CLICK, function (e) {
                var ET = e.currentTarget,
                    etParent = ET.ancestor(Sel_AProduct),
                    etMaxPar = ET.ancestor(".CommodityBox"),
                    iNum = etMaxPar.all(Sel_AProduct).size(), //�ж��б����
                    itemCode = etParent.getAttribute("itemCode"),
                    evt = etParent.getAttribute("evtid").split("%2B"),
                    evtav = evt[0],
                    evtid = evt[1];

                if (ET.hasClass('pro-collect')) {
                    Nodes['confirmNode'].removeClass("delbox");
                    Nodes['confirmNode'].one('i').setContent('��ȷ��Ҫ�����ղ���');

                    confirm();
                } else if (ET.hasClass('pro-remove')) {
                    if (iNum > 0 && evtid == 3 && !ET.ancestor(Sel_CostlyBox)) {
                        Nodes['confirmNode'].addClass("delbox");
                        Nodes['confirmNode'].one('i').setContent('ɾ����Ʒ��ᵼ��������Ʒ�����ȷ��Ҫɾ������Ʒ��');
                    } else {
                        Nodes['confirmNode'].removeClass("delbox");
                        Nodes['confirmNode'].one('i').setContent('��ȷ��Ҫɾ������Ʒ��');
                    }

                    confirm();
                }

                function confirm() {
                    ET.get('parentNode').appendChild(Nodes['confirmNode']);
                    Nodes['confirmNode'].setStyle(DISPLAY, BLOCK);
                }

                if (ET.hasClass('pro-alter')) {
                    if (!ET.hasClass('Cls_Ing')) {
                        self.proNode = etParent;
                        self._rite_modifyAttr(itemCode, evtav, evtid, ET);
                    }
                }

            }, '.decidetime a');

            //������Ʒ����
            Nodes[CommBoxWrap].delegate(E_CLICK, function (e) {
                var ET = e.currentTarget,
                    changeBox = ET.ancestor('.pro-number'),
                    NumsInput = changeBox.one('input'),
                    NumsValue = parseInt(NumsInput.get('value')),
                    evtTR = ET.ancestor(Sel_AProduct),
                    evtID = evtTR.getAttribute('evtID'),
                    itemCode = evtTR.getAttribute('itemCode');

                if (ET.hasClass('nums-add')) {
                    if (ET.hasClass('disable')) {
                        return FALSE;
                    }
                    if (NumsValue < 99) {
                        NumsValue = NumsValue + 1;
                        self._changeCount(itemCode, NumsValue, evtID, changeBox, NumsInput, TRUE);
                    } else {
                        return FALSE;
                    }
                } else if (ET.hasClass('nums-red')) {
                    if (ET.hasClass('disable')) {
                        return FALSE;
                    }
                    if (NumsValue > 1) {
                        NumsValue = NumsValue - 1;
                        self._changeCount(itemCode, NumsValue, evtID, changeBox, NumsInput, FALSE);
                    } else {
                        return FALSE;
                    }
                }

            }, '.pro-number a');

            //��ɾ����Ʒ���¹���
            Nodes[N_DeledGoods] && Nodes[N_DeledGoods].delegate(E_CLICK, function (e) {
                var ET = e.currentTarget,
                    infoNode = ET.ancestor('.Remove5'),
                    itemCode = infoNode.getAttribute('itemcode'),
                    evtID = infoNode.getAttribute('evtid'),
                    num = infoNode.getAttribute('num'),
                    itemInfo = {};
                self.delRemove(itemCode, ET.ancestor('.RemoveThis'));
                if (!Nodes[N_DeledGoods].one('.RemoveThis')) {
                    Nodes[N_DeledGoods].addClass(HIDDEN);
                }
                itemInfo.evtid = evtID;
                itemInfo.num = num;
                itemInfo.itemCode = itemCode;
                itemInfo.sku = itemCode;
                if (ET.hasClass('rebuy')) {
                    self._add(itemInfo);
                } else if (ET.hasClass('moveclt')) {
                    self._collect('null', itemInfo);
                }
            }, '.Remove5 a');

            //�޸���Ʒ����
            Nodes[CommBoxWrap].delegate('keyup', function (e) {
                var ET = e.currentTarget;

                self.checkLabel = ET;

                ET.set('value', ET.get('value').replace(/\D/g, ''));
                if (parseInt(ET.get('value')) < 1 || ET.get('value') == '') {
                    ET.set('value', 1);
                } else if (parseInt(ET.get('value')) > 99) {
                    ET.set('value', 99);
                }
                if (e.keyCode == 13) {
                    ET.blur();
                }
            }, 'input.pro-nums');

            Nodes[CommBoxWrap].delegate('blur', function (e) {
                var ET = e.currentTarget,
                    changeBox = ET.ancestor('.pro-number'),
                    evtTR = ET.ancestor(Sel_AProduct),
                    evtID = evtTR.getAttribute('evtID'),
                    itemCode = evtTR.getAttribute('itemCode');

                if (ET.get('value') != ET.getAttribute('lastValue')) {
                    self._changeCount(itemCode, ET.get('value'), evtID, changeBox, ET);
                }

            }, 'input.pro-nums');

            //��չ��ﳵ
            Nodes[Sel_ClearCart].on(E_CLICK, function () {

                var delDate = self._inter_checkPro(3),
                    upwnNode = Nodes[CommBoxWrap].one('.J-UpCheck'),
                    downNode = Nodes[CommBoxWrap].one('.J-DownChcek');

                if (delDate.number < 1) {
                    self._errorTip('��ѡ����Ʒ!');
                } else {
                    var fullUpCheck = upwnNode.hasClass(CHECKED),
                        fullDownCheck = upwnNode.hasClass(CHECKED);

                    if (fullUpCheck && fullDownCheck) {
                        self.affirmClearCart();
                    } else {
                        if (delDate) {
                            self.affirmClearCart(delDate);
                        } else {
                            self._errorTip('��ѡ����Ʒ!');
                        }
                    }
                }

                //�����-��չ���������ﳵId
                //var shopCartId = S.Cookie.getSub('ShoppingCart', 'CartID'); //�޸�Ϊȡҳ����� YinTai_TagData �� carts ��� id
                if (typeof YinTai_TagData != 'undefined' && YinTai_TagData) {
                    self._clk_common('clearCart', '{' + YinTai_TagData.carts[0].id + '}');
                }
            });

            //ѡ����Ʒ
            Nodes[CommBoxWrap].delegate(E_CLICK, function (e) {
                var thisNode = e.target,
                    pareNode = null,
                    fulcheck = null,
                    checkCun = 0,
                    aProduct = Nodes[CommBoxWrap].all(Sel_AProduct),
                    chcekLab = Nodes[CommBoxWrap].all('.J-SelectPro'),
                    upwnNode = Nodes[CommBoxWrap].one('.J-UpCheck'),
                    downNode = Nodes[CommBoxWrap].one('.J-DownChcek');

                if (!self.choice) {
                    return FALSE;
                }

                if (!thisNode.hasClass(CHECKED)) {
                    thisNode.addClass(CHECKED);

                    if (thisNode.hasClass('J-UpCheck') || thisNode.hasClass('J-DownChcek')) {
                        chcekLab.addClass(CHECKED);
                        aProduct.addClass('areacolor');

                        downNode.addClass(CHECKED);
                        upwnNode.addClass(CHECKED);

                        if (thisNode.hasClass(Cls_Ing)) {
                            return FALSE;
                        }

                        self.choice = FALSE;
                        thisNode.addClass(Cls_Ing);

                        S.io(window.Env.ShoppingCartV2Ajax, {
                            method: "post",
                            data: "op=15",
                            on: {
                                success: function (index, req) {
                                    var response = JSON.parse(req.responseText);

                                    self.choice = TRUE;
                                    thisNode.removeClass(Cls_Ing);
                                    Nodes[sel_Accountsbox].removeClass(Cls_Inhibit);

                                    window.fakeData = response;

                                    Nodes[CommBoxWrap].destroy(TRUE);
                                    Nodes[CommBoxWrap] = NULL;
                                    Nodes['confirmNode'].purge();

                                    Page_Inst = NULL;
                                    S.Pages.ShoppingCart = ShoppingCart;
                                    S.Pages.ShoppingCart.instance = Page_Inst = new ShoppingCart();
                                },
                                failure: function () {
                                    self.choice = TRUE;
                                    window.location.reload(TRUE);
                                }
                            }
                        });
                    }
                } else {
                    thisNode.removeClass(CHECKED);

                    if (thisNode.hasClass('J-UpCheck') || thisNode.hasClass('J-DownChcek')) {

                        var delDate = self._inter_checkPro(2);

                        aProduct.each(function (nowNode, index) {
                            var thatID = nowNode.getAttribute('evtid'),
                                thatPT = thatID && thatID.split('%2B')[1],
                                thatPT = parseInt(thatPT);
                            if (thatPT != 9) {
                                nowNode.removeClass('areacolor');
                            }
                        });
                        chcekLab.removeClass(CHECKED);

                        downNode.removeClass(CHECKED);
                        upwnNode.removeClass(CHECKED);

                        Nodes[sel_Accountsbox].addClass(Cls_Inhibit);

                        self._choiceProduct(delDate.delList, 2);
                    }
                }

                //��ѡʱ ���¼۸����Ϣ
                if (thisNode.hasClass('J-SelectPro')) {

                    self.checkLabel = thisNode; //��¼��ǰѡ������һ����Ʒ�Ľڵ�,���㴦��������ʱ����.

                    pareNode = thisNode.ancestor(Sel_AProduct);
                    chcekLab.each(function (that, index) {
                        if (that.hasClass(CHECKED)) {
                            checkCun += 1;
                        }
                    });

                    if (checkCun == 0) {
                        if (!fulcheck) {
                            fulcheck = {};
                        }
                        fulcheck.prdate = self._inter_checkDate(thisNode, pareNode);
                    } else {
                        fulcheck = self._inter_checkPro(1, thisNode);
                    }

                    //��ѡʱ���ȫѡ�˰� ����ȫѡ��ѡ��
                    if (chcekLab.size() == fulcheck.number) {
                        downNode.addClass(CHECKED);
                        upwnNode.addClass(CHECKED);
                    } else {
                        downNode.removeClass(CHECKED);
                        upwnNode.removeClass(CHECKED);
                    }

                    //������ʾ��۸�
                    if (!thisNode.hasClass(CHECKED)) {
                        pareNode.removeClass('areacolor');

                        self._choiceProduct(fulcheck.prdate, 0);
                    } else {
                        pareNode.addClass('areacolor');

                        self._choiceProduct(fulcheck.prdate, 1);
                    }
                }

            }, '.J-UpCheck,.J-SelectPro,.J-DownChcek');

            //ѡ���Ż�ȯ
            //if (Nodes[Sel_SelCoupon]) {
            //    Nodes[Sel_SelCoupon].on(E_CLICK, function () {
            //        if (Nodes[Sel_SelCoupon].hasClass(Cls_Ing)) {
            //            return FALSE;
            //        }
            //        Nodes[Sel_SelCoupon].addClass(Cls_Ing);
            //        self.switchTo("coupon");

            //        //�����-ʹ���Ż�ȯ
            //        self._clk_common('useCoupon');
            //    });
            //}

            //ѡ��ֵ����
            if (Nodes[Sel_SelLiPin]) {
                Nodes[Sel_SelLiPin].on(E_CLICK, function (e) {
                    e.halt();

                    if (Nodes[Sel_SelLiPin].hasClass(Cls_Ing)) {
                        return FALSE;
                    }

                    Nodes[Sel_SelLiPin].addClass(Cls_Ing);

                    var loadingNode = S.Node.create(Tmpl_Loading);
                    Nodes[Sel_Selectkey].append(loadingNode);

                    self.swop = TRUE; //������Ʒ�� �� ��ֵ������� ����
                    self._rite_modifyAttr();
                });
            }

            //����
            if (Nodes[Sel_CheckOut]) {
                Nodes[Sel_CheckOut].on(E_CLICK, function (e) {

                    if (Nodes[sel_Accountsbox].hasClass(Cls_Inhibit)) {
                        return FALSE;
                    }

                    //����Cls_Ing��˵���Ѿ������������ϴ�����δ����
                    if (Nodes[Sel_CheckOut].hasClass(Cls_Ing)) {
                        return FALSE;
                    }

                    //���� - ��������
                    self.goToCheckOut();

                    self.gaSettlement();
                });
            }

            //�����Ż�ȯGA
            //Nodes[Sel_ActiveCoupon] && Nodes[Sel_ActiveCoupon].on(E_CLICK, function (e) {
            //    e.stopPropagation();

            //    //GAͳ��
            //    self.gaActiveaCoupons();

            //    //�����-�����Ż�ȯ
            //    self._clk_common('actCoupon');

            //    //ҳ����ת�ӳ�
            //    //setTimeout(function () {
            //    //    location.href = e.currentTarget.get('href');
            //    //}, 100);
            //});

            //������ - ��������
            if (Nodes[Sel_FloatFix]) {
                self._floatBar(Nodes[Sel_FloatFix]);
                Nodes['window'].on('scroll', function () {
                    self._floatBar(Nodes[Sel_FloatFix]);
                }, self);
                Nodes['window'].on('resize', function () {
                    self._floatBar(Nodes[Sel_FloatFix]);
                }, self);
            }
        },
        /**
         * ҳ����Ⱦ��ֻ��һ�ε��¼�
         * @method onceForAll
         * @param ��
         */
        onceForAll: function () {
            var self = this;

            if (typeof Env == "undefined") {
                Env = {};
            }

            if (!Env.onceForAll) {
                Env.onceForAll = TRUE;
            } else {
                Nodes[Sel_Interested] = S.one(Sel_Interested);
                Nodes['.J-InterOpaque'] = Nodes[Sel_Interested].one('.J-InterOpaque');

                Nodes[Sel_SideFloat] = S.one(Sel_SideFloat);
                Nodes['#J-SidePlace'] = S.one('#J-SidePlace');
                Nodes['.J_GoToTop'] = Nodes[Sel_SideFloat].one('.J_GoToTop');

                return FALSE;
            }

            //�Ƽ�����Ȥ��Ʒ - start
            var interestedHTML = '<div class="interested hidden" id="J-Interested">' +
                '<div class="inter-title J-InterTitle">' +
                '<span class="hidden none bfd_h"></span>' +
                '<span class="hidden bfd_i"></span>' +
                '<span class="hidden bfd_j"></span>' +
                '<span class="hidden treasure"></span>' +
                '</div>' +
                '<div class="inter-mian J-InterMian">' +
                '<div class="inter-solo hidden cf bfd_h"></div>' +
                '<div class="inter-solo hidden cf bfd_i"></div>' +
                '<div class="inter-solo hidden cf bfd_j"></div>' +
                '<div class="inter-solo hidden cf treasure"></div>' +
                '</div>' +
                '<div class="inter-opaque hidden J-InterOpaque"></div>' +
                '</div>';
            Nodes['#doc'].one('.bdwraper').append(interestedHTML);
            Nodes[Sel_Interested] = S.one(Sel_Interested); //�Ƽ�����Ȥ��Ʒ�ڵ�
            Nodes['.J-InterOpaque'] = Nodes[Sel_Interested].one('.J-InterOpaque');

            //�Ƽ�����Ȥģ�� -- �¼���
            if (Nodes[Sel_Interested]) {
                new S.Tab(Nodes[Sel_Interested], { triggersCls: "J-InterTitle", panelsCls: "J-InterMian", activeTriggerCls: "cursor", triggerType: "hover", delay: 0.1 });

                Nodes[Sel_Interested].delegate(E_CLICK, function (e) {
                    e.halt();

                    var thisNode = e.target,
                        pareNode = thisNode.ancestor('li'),
                        intersku = '';

                    if (thisNode.hasClass('J-interAdd')) {
                        if (!self.clickFinish) { //����Ƿ�����

                            var loadingNode = S.Node.create(Tmpl_Loading);
                            thisNode.ancestor('div').append(loadingNode);

                            self.interSKU = pareNode.getAttribute(Attr_Itemcode);
                            self._inter_getInterDate(self.interSKU);
                        }
                    }

                    if (thisNode.hasClass('J-close')) {
                        self.proNodeHTML && self.proNodeHTML.remove();
                        Nodes['.J-InterOpaque'].addClass(HIDDEN);
                    }

                    if (thisNode.hasClass('J-addToCart')) {

                        if (!self.clickFinish) { //����Ƿ�����

                            var fullColorNode = self.proNodeHTML.all('.J-colorList span'),
                                fullSizeNode = self.proNodeHTML.all('.J-sizeList span'),
                                fullErrorNode = self.proNodeHTML.one('.J-errorTip'),
                                fullCount = fullSizeNode.size();

                            if (fullCount > 0) {

                                fullSizeNode.some(function (that, index) {
                                    if (that.hasClass('cursor')) {
                                        intersku = that.getAttribute(Attr_Itemcode);
                                        return TRUE;
                                    }
                                });
                                if (!intersku) {
                                    fullErrorNode.setContent('<p>��ѡ����!</p>');
                                    return FALSE;
                                }
                            }

                            if (fullCount == 0 && !intersku) {
                                intersku = self.interSKU;
                            }

                            var loadingNode = S.Node.create(Tmpl_Loading);
                            thisNode.ancestor('div').append(loadingNode);

                            self._inter_addToCart(intersku);
                        }
                    }

                }, '.J-interAdd,.J-close,.J-addToCart');
            }

            //Ϊ���ﳵ��� - �Ҳ����������� - ������Ϣ
            var N_GoToTop = null,
                floatHTML = '<div class="side-place hidden" id="J-SidePlace">' +
                    '<div class="side-posi">' +
                    '<div class="side-float" id="J-SideFloat">' +
                    '<a href="' + Env.Feedback + '" class="propose" target="_blank"><i></i><strong>��������ӡ�����ǻ��ø���</strong></a>' +
                    '<a href="javascript:void(0)" class="gototop J_GoToTop" title="�ض���">�ض���</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

            Nodes['#bd'].append(floatHTML);
            Nodes[Sel_SideFloat] = S.one(Sel_SideFloat);
            Nodes['#J-SidePlace'] = S.one('#J-SidePlace');
            Nodes['.J_GoToTop'] = Nodes[Sel_SideFloat].one('.J_GoToTop');

            //�ٷֵ��Ƽ�
            self.bfdReq();

            //Ϊ���ﳵ��� - �ص������뷴������ ֮ ������������
            if (Nodes[Sel_SideFloat]) {
                self._floatBar(Nodes[Sel_SideFloat]);
                Nodes['window'].on('scroll', function () {
                    self._floatBar(Nodes[Sel_SideFloat]);
                }, self);
                Nodes['window'].on('resize', function () {
                    self._floatBar(Nodes[Sel_SideFloat]);
                }, self);

                Nodes['.J_GoToTop'].on(E_CLICK, function (e) {
                    e.halt();

                    if (Nodes['document'].fx) {
                        Nodes['document'].fx.set("to", {
                            scroll: [0, 0]
                        });
                        Nodes['document'].fx.run();
                    } else {
                        Nodes['document'].plug(S.Plugin.NodeFX, {
                            to: {
                                scroll: [0, 0]
                            },
                            easing: S.Easing.easeOut,
                            duration: 0.2
                        }).fx.run();
                    }
                });

                setTimeout(function () {
                    Nodes['#J-SidePlace'].removeClass(HIDDEN);
                }, 2000);
            }
            //�������Ĺ�����ʷΪ���Ƽ�
            var cookie_ytlt = S.Cookie.get('Yt_ct'),
                cookie_ytltVal = ''
                ;
            if (cookie_ytlt) {
                cookie_ytltVal = self.getCookieParam('id', cookie_ytlt);
                S.jsonp(Env.ShoppingCartRecommendUrl + cookie_ytltVal + '/' + '?callback={callback}', {
                    //S.jsonp('http://pc-wangqingwen/YinTaiSites/secure.yintai.com/ajax_result/shopcart-tuijian-ajax.aspx' + '/' + '?callback={callback}', {
                    on: {
                        success: function (result) {
                            var data = result.val;
                            if (data.length > 0) {
                                var recommendTmpBox = '<div class="interested" id="J-srecommend" style="margin-top:20px">' +
                                    '<div class="inter-title J-InterTitle">' +
                                    '<span class="none">�������Ĺ�����ʷΪ���Ƽ�</span>' +
                                    '</div>' +
                                    '<div class="inter-mian J-srecommendMain" style="height:290px">' +
                                    '<div class="inter-solo cf">' +
                                    '<span class="inter-prev eva-switchable-prev"><a href="javascript:void(0)"></a></span>' +
                                    '<span class="inter-next eva-switchable-next"><a href="javascript:void(0)"></a></span>' +
                                    '<div class="inter-list scroller">' +
                                    '<ul class="inter-list-mian eva-switchable-panels cf"></ul>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                                Nodes['#doc'].one('.bdwraper').append(recommendTmpBox);
                                var N_srecommend = S.one('#J-srecommend'),
                                    N_srecommendList = S.one('#J-srecommend ul'),
                                    N_srecommendMain = S.one('.J-srecommendMain .inter-solo'),
                                    listTmp = '<li itemcode="{sku}">' +
                                        '<div class="inter-pro-pic">' +
                                        '<a target="_blank" href="{url}"><img alt="{title}" {attrsrc}="{src}"></a>' +
                                        '</div>' +
                                        '<p class="inter-pro-txt"><a href="{url}" target="_blank">{title}</a></p>' +
                                        '<p class="inter-pro-dis"><strong>��{price}</strong></p>' +
                                        '</li>',
                                    attrsrc = 'src',
                                    stockNode = ''
                                    ;
                                //�б�
                                for (var i = 0; i < data.length; i++) {
                                    if (i > 4) {
                                        attrsrc = 'data-src';
                                    }
                                    stockNode += Lang.sub(listTmp, {
                                        'sku': data[i].itemCode,
                                        'url': data[i].itemUrl,
                                        'attrsrc': attrsrc,
                                        'src': data[i].imageUrl,
                                        'title': data[i].itemName,
                                        'price': data[i].salePrice
                                    });
                                }
                                N_srecommendList.setContent(stockNode);
                                if (N_srecommendMain.all('ul li').size() > 5) {
                                    N_srecommendMain.plug([
                                        { fn: S.Plugin.Carousel, cfg: { interval: 4, autoplay: FALSE, circular: TRUE, steps: 5, viewSize: [870] } },
                                        { fn: S.Plugin.SwitchableEffect, cfg: { effect: 'scrollX', relateType: 'carousel', easing: 'easeOutStrong', duration: 1 } }
                                    ]).carousel.on('switch', function (e) {
                                            var N_PrevBtn = N_srecommendMain.one('.inter-prev'),
                                                N_NextBtn = N_srecommendMain.one('.inter-next');

                                            var tabPannel = N_srecommendMain.one('ul');
                                            if (tabPannel != null) {
                                                //ͼƬ�ӳټ���
                                                if (!self.YT_lazyLoad) {
                                                    self.YT_lazyLoad = new S.DataLazyLoader();
                                                }
                                                self.YT_lazyLoad.loadCustomLazyData(tabPannel, 'img-src');
                                            }

                                            if (N_PrevBtn && N_PrevBtn.hasClass('eva-switchable-disable-btn')) {
                                                N_PrevBtn.addClass('featured-prev');
                                            } else {
                                                N_PrevBtn.removeClass('featured-prev');
                                            }
                                            if (N_NextBtn && N_NextBtn.hasClass('eva-switchable-disable-btn')) {
                                                N_NextBtn.addClass('featured-next');
                                            } else {
                                                N_NextBtn.removeClass('featured-next');
                                            }
                                        });

                                    N_srecommendMain.all('.eva-switchable-triggers li').each(function (Node, index) {
                                        Node.setContent('?').setStyle(VISIBILITY, VISIBLE);
                                    });
                                } else {
                                    var N_PrevBtn = N_srecommendMain.one('.inter-prev'),
                                        N_NextBtn = N_srecommendMain.one('.inter-next')
                                        ;

                                    N_PrevBtn && N_PrevBtn.addClass('featured-prev');
                                    N_NextBtn && N_NextBtn.addClass('featured-next');
                                }
                            }
                        },
                        failure: function () { }
                    }
                });
            }
        },
        /**
         * ��תȥ����ҳ�� - Ϊ�����ģ����A��ǩ������ת
         * @method creatJumpCheckout
         * @param Url ��ת�ĵ�ַ
         */
        creatJumpCheckout: function (Url) {
            var self = this,
                aNode = null,
                pNode = Nodes[Sel_CheckOut].get('parentNode');

            pNode.append('<a id="J-checkout" style="position:absolute;left:0;top:0;width:143px;height:38px" href="' + Url + '"/></a>');

            aNode = document.getElementById("J-checkout");
            aNode.click(); //ʹ��jsģ����a��ǩ.
        },
        /**
         * ����ҳ�����õ���widget
         *
         * @method createWidget
         * @param slot {String} ��ʶ��ͬ��ʱ����Ҫ������widget���ò���ֻ�Ǳ�ʶĳһʱ��㣬�����ʱ�����Ҫ������Щwidget�����ڲ��߼�ȷ����
         */
        createWidget: function () {
            var self = this,
                evtsID = self.renderEvtID;

            if (!Nodes[Sel_CheckLayer]) {
                Nodes[Sel_CheckLayer] = S.one(Sel_CheckLayer);
            }
            Nodes[Sel_CheckLayer].one('.J-DownChcek').addClass(CHECKED);

            Nodes[N_DeledGoods] = S.one('#RemoveBlock');

            Nodes[CommBoxWrap].setContent();

            //����� - ��Ŀ����
            var categoryclass = '<div class="CommodityCate">' +
                '<span class="th-chk"><span><input type="checkbox" id="J-UpCheck" checked="checked" data-clk="clkcartcheckboxall" /><label for="J-UpCheck" data-clk="clkcartcheckboxall" class="checked J-UpCheck" ></label></span>&nbsp;ȫѡ</span>' +
                '<span class="th-item">��Ʒ</span>' +
                '<span class="th-price">����</span>' +
                '<span class="th-amount">����</span>' +
                '<span class="th-sum">��û���</span>' +
                '<span class="th-op">����</span>' +
                '</div>';

            Nodes[CommBoxWrap].append(categoryclass);

            //������ʾ
            for (var q = 0; q < evtsID.length; q++) {
                Nodes[CommBoxWrap].append(Nodes[evtsID[q]].wrap);
                var Ncollect = {},
                    wrapHeight,
                    areacolor = Nodes[evtsID[q]].wrap.all(Sel_AProduct);
                Ncollect['chk'] = Nodes[evtsID[q]].wrap.all('.th-chk div');
                Ncollect['price'] = Nodes[evtsID[q]].wrap.all('.pro-price');
                Ncollect['number'] = Nodes[evtsID[q]].wrap.all('.th-amount');
                Ncollect['sum'] = Nodes[evtsID[q]].wrap.all('.th-sum');
                Ncollect['op'] = Nodes[evtsID[q]].wrap.all('.th-op');
                wrapHeight = parseInt(areacolor.getComputedStyle('height'));
                for (var i in Ncollect) {
                    if (Ncollect[i]) {
                        Ncollect[i].each(function (vale, index) {
                            vale.setStyle("marginTop", wrapHeight / 2 - parseInt(vale.getComputedStyle('height')) / 2 - 15);
                        });
                    }
                }
            }

            if (!Nodes[normal]) {
                self.createEvtNode('normal');
            }

            Nodes[CommBoxWrap].append(Nodes[Sel_CheckLayer]);
            self.updateAmount(DataAmount);
            Nodes[Sel_CheckLayer].removeClass(HIDDEN);

            Nodes[CommBoxWrap].append(Nodes['DOMfavGoods']);
            Nodes[CommBoxWrap].append(Nodes[N_DeledGoods]); //��ɾ����Ʒ��Žڵ�
            Nodes[CommBoxWrap].append(Nodes[N_DeledStock]); //���޻���Ʒ��Žڵ�

            if (Env.vouchers) { //�л����ﳵ���Ż�ȯ�Ӵ�ʱ,ͨ�� Env.vouchers �������Ƿ������ɾ����Ʒ�б� -- ����
                Env.vouchers = FALSE;
                Nodes[N_DeledGoods].addClass(HIDDEN);
                Nodes[N_DeledGoods].one('.RemoveList').setContent();
            }
        },
        /**
         * ��չ����DOM����
         * @method clearCart
         * @param pass {boolean} �ж��ǲ���ֻ��ȱ���б�
         */
        clearCart: function (pass) {
            var tmpEmptyCart =
                    '<div class="Emptycart">' +
                    '<div class="EmptyExplain">' +
                    '<div class="EmptyIco"></div>' +
                    '<div class="EmptyDetails">' +
                    '<h3>���Ĺ��������δ��Ӳ�Ʒ��</h3>' +
                    '<p>�뾡��ѡ����Ҫ����Ĳ�Ʒ��! ף���������!</p>' +
                    '<a href="http://www.yintai.com/" class="c-btn c-btn-big" title="��������">��������</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                nodeEmptyCart = S.Node.create(tmpEmptyCart);

            if (!pass) {
                Nodes[CommBoxWrap].setContent(nodeEmptyCart);
            } else {
                Nodes[Sel_CheckLayer].insert(tmpEmptyCart, 'before');
                S.one(".EmptyDetails h3").setContent('���Ĺ������Ʒ��Ϣ�����仯��');
                S.one(".EmptyDetails p").setContent('��ҳ�и��ྪϲ����ȥ��ѡ��Ʒ�ɣ�');
                if (Nodes[CommBoxWrap].one('.CartLoading')) {
                    Nodes[CommBoxWrap].setStyle(DISPLAY, NONE);
                }
            }

            Nodes[Sel_CheckLayer].addClass(HIDDEN);
        },
        /**
         * ��չ�������ݲ���
         * @method _clearCart
         */
        _clearCart: function () {
            var self = this;
            S.io(window.Env.ShoppingCartV2Ajax, {
                method: 'POST',
                data: "op=2",
                on: {
                    success: function (index, req) {

                        self.clearCart();

                        if (Nodes['#J-SidePlace']) {
                            Nodes['#J-SidePlace'].addClass(HIDDEN);
                        }

                        window.UI_header.initCart();
                    }
                }
            })
        },
        /**
         * ɾ��/�ղ���Ʒ��,����ҳ��ʵ������ִ��self.clearCart()����
         * @method delProductClearCart
         * @param ��
         */
        delProductClearCart: function () {
            var self = this,
                chcekLab = self.renderEvtID,
                checkCun = 0;

            S.Array.each(chcekLab, function (that, index) {
                var thatPT = that.split("%2B")["1"];
                if (thatPT != 3) {
                    checkCun += 1;
                }
            });

            if (checkCun == 0) {
                self.clearCart();
            }
        },
        /**
         * ɾ����������DOM����
         * @method affirmClearCart
         * @param data {array} ѡ�����Ʒ
         */
        affirmClearCart: function (data) {
            var self = this;

            new S.Box({
                head: '<span class="title">��ܰ��ʾ</span><a class="close closebtn" style="cursor:pointer;"><i title="�ر�" class="shutdown">�ر�</i></a>',
                body: '<div class="empty-tip-txt"><span>��ȷ��Ҫɾ����ѡ�е���Ʒ��</span></div>',
                foot: '<div class="empty-tip-submit J-EmptySubmit"><input type="button" value="ȷ��" class="submit c-lbtn c-lbtn-small"><input type="button" value="ȡ��" class="c-btn c-btn-small"></div>',
                width: 320,
                modal: TRUE,
                onload: function (_box) {
                    var pareNode = _box.overlay._posNode;

                    pareNode.one('.shutdown').on(E_CLICK, function () {
                        _box.close();
                    });

                    pareNode.one('.J-EmptySubmit').delegate(E_CLICK, function (e) {
                        var ET = e.currentTarget;
                        if (ET.hasClass('submit')) {
                            if (data) {
                                self._many_del(data);
                            } else {
                                self._clearCart();
                            }
                        }
                        _box.close();

                    }, 'input');
                }
            }).render();
        },
        /**
         * ����ͼ�л���ָ�����Ӵ���
         *
         * @method switchTo
         * @param view {String} �Ӵ���ʶ����ѡֵ��coupon,group
         */
        //switchTo: function (view) {
        //    var self = this;
        //    var switchAnim = new S.Anim({
        //        to: { 'opacity': '0' },
        //        duration: 0.2
        //    });

        //    if (view == "coupon") {
        //        var loadingNode = S.Node.create(Tmpl_Loading);
        //        Nodes[Sel_Selectkey].append(loadingNode);

        //        S.io(window.Env.ShoppingCartV2Ajax, {
        //            method: 'POST',
        //            data: "op=13",
        //            on: {
        //                success: function (index, req) {
        //                    var response = req.responseText,
        //                        response = JSON.parse(response),
        //                        LA = response.LA,
        //                        cModel = response.CMODEL;

        //                    //Nodes[Sel_SelCoupon].removeClass(Cls_Ing);
        //                    loadingNode && loadingNode.remove();

        //                    if (LA.Status == -1) {
        //                        self.directLogin("coupon");
        //                        return FALSE;
        //                    } else {

        //                        //�û�û�Ż�ȯ.���л���ͼ
        //                        if (cModel.AvailableCoupons.length == 0) {
        //                            S.Box.alert('��Ǹ�������˻�û�п��õ��Ż�ȯ��');
        //                            return FALSE;
        //                        }

        //                        //��Ʒ�������Ż�ȯʹ������
        //                        if (cModel.GroupItems.length == 0) {
        //                            S.Box.alert('��Ǹ�����ﳵ�����Ʒ������ʹ���Ż�ȯ��������');
        //                            return FALSE;
        //                        }

        //                        var prosIndex = 0,
        //                            attrIC = "IC",
        //                            sku = "",
        //                            groupItem,
        //                            products = window.Yintai_ShoppingCart.products = {};

        //                        for (var i = 0; i < cModel.GroupItems.length; i++) {
        //                            groupItem = cModel.GroupItems[i];
        //                            for (var j = 0; j < groupItem.GPro.length; j++) {
        //                                sku = groupItem.GPro[j][attrIC];

        //                                //�Ѳ�ͬ�����е�sku�ϲ�����ͨ��Qty���ֳ���
        //                                if (products[sku]) {
        //                                    products[sku].Qty += groupItem.GPro[j].Qty;
        //                                } else {
        //                                    products[sku] = groupItem.GPro[j];
        //                                    products[sku].actyDescs = []; //���Ϣ�ṹ��ƽ��
        //                                    products[sku].PPS = []; //PP==previousPromotion ��ʾĬ�ϵĻ��������
        //                                }

        //                                //������Ʒ����ƽ�̸÷���Ļ��Ϣ
        //                                for (var k = 0; k < groupItem.GPro[j].Qty; k++) {
        //                                    products[sku].actyDescs.push(groupItem.GP.NM ? groupItem.GP.NM : "");
        //                                    products[sku].PPS.push(groupItem.GPro[j].PP);
        //                                }
        //                            }
        //                        }

        //                        window.Yintai_ShoppingCart.coupons = cModel.AvailableCoupons;
        //                        window.Yintai_ShoppingCart.TotalModel = cModel.TotalModel;

        //                        if (!S.Pages.Coupon) {
        //                            S.Get.script(CouponScriptPath + "?v=" + Yintai_Coupon_File_Version, {
        //                                onSuccess: function (o) {
        //                                    switchAnim.run();
        //                                },
        //                                timeout: 10000, // 10 second timeout
        //                                autopurge: TRUE,
        //                                purgetheshold: 1
        //                            });
        //                        } else {
        //                            S.Pages.Coupon.instance.destroy();
        //                            S.Pages.Coupon.instance.init();
        //                            switchAnim.run();
        //                        }

        //                        if (location.hash.indexOf(CouponUrlFlag) == -1) {
        //                            location.hash += CouponUrlFlag;
        //                        }
        //                    }
        //                }
        //            }
        //        });

        //        //���� - �Ƽ�����Ȥ��Ʒ�ڵ�
        //        Nodes[Sel_Interested].addClass(HIDDEN);

        //        switchAnim.set('node', Nodes[CommBoxWrap]);
        //        switchAnim.once('end', function () {
        //            Nodes[CommBoxWrap].setStyle(DISPLAY, NONE);
        //            Nodes['CouponWidget'].setStyles({ 'opacity': '0', 'display': BLOCK });
        //            switchAnim.set('node', Nodes['CouponWidget']);
        //            switchAnim.set('to', { 'opacity': '1' });
        //            switchAnim.run();

        //            self._floatBar(Nodes[Sel_SideFloat]);
        //            self._floatBar(Nodes[Sel_FloatFix]);
        //        });
        //    } else if (view == "render") {
        //        // data success
        //        Nodes[CommBoxWrap].purge(TRUE);
        //        Nodes[CommBoxWrap] = NULL;
        //        Nodes['confirmNode'].purge();

        //        location.hash = ''; //�Ƴ�url�е�coupon��ʶ
        //        self.switchTo("group");
        //    } else if (view == "group") {
        //        switchAnim.set('node', Nodes['CouponWidget']);
        //        switchAnim.once('end', function () {
        //            Nodes['CouponWidget'].setStyle(DISPLAY, NONE);

        //            if (!Nodes[CommBoxWrap]) {
        //                Nodes[CommBoxWrap] = S.one(Sel_CommodityBox);
        //            }

        //            Nodes[CommBoxWrap].setStyles({ 'opacity': '0', 'display': BLOCK });

        //            Page_Inst = NULL;
        //            Env.vouchers = TRUE;  //�л����ﳵ���Ż�ȯ�Ӵ�ʱ,ͨ�� Env.vouchers �������Ƿ������ɾ����Ʒ�б� -- ����
        //            S.Pages.ShoppingCart = ShoppingCart;
        //            S.Pages.ShoppingCart.instance = Page_Inst = new ShoppingCart();
        //            switchAnim.set('node', Nodes[CommBoxWrap]);
        //            switchAnim.set('to', { 'opacity': '1' });

        //            //��ʾ - �Ƽ�����Ȥ��Ʒ�ڵ�
        //            if (!Nodes[Sel_Interested]) {
        //                Nodes[Sel_Interested] = S.one(Sel_Interested);
        //            }
        //            var interCount = Nodes[Sel_Interested].all('li').size();
        //            if (interCount > 0) {
        //                Nodes[Sel_Interested].removeClass(HIDDEN);
        //            }

        //            //��ֵ������ť
        //            if (HasGift && Nodes[Sel_SelLiPin]) {
        //                Nodes[Sel_SelLiPin].removeClass(HIDDEN);
        //            }

        //            self._floatBar(Nodes[Sel_SideFloat]);
        //            self._floatBar(Nodes[Sel_FloatFix]);

        //            switchAnim.run();
        //        });
        //        switchAnim.run();
        //    }
        //},
        /**
         * �ղ���Ʒ
         *
         * @method collect
         * @param sku {String}  Ҫ�ղ���Ʒ��Ӧ��sku
         */
        collect: function (_node, proDetail) {
            var self = this;
            self._del(_node, proDetail, TRUE);
        },
        /**
         * ִ��ʵ�ʵ��ռ�������������������ڸ���UI
         *
         * @method _collect
         * @param sku {String}
         */
        _collect: function (_node, proDetail) {
            var self = this,
                itemCode = proDetail.sku,
                IDs = proDetail.evtid.split('%2B');

            S.jsonp(window.Env.MyFavoriteAjaxUrl + '?op=AddItemToFavorite&itemcode=' + itemCode + '&callback={callback}', function (result) {
                if (result.ok) {
                    S.io(window.Env.ShoppingCartV2Ajax, { //itemcode=05-171-0008&op=3&promotionId=0&promotionType=0&qty=2
                        method: 'POST',
                        data: 'op=3&itemcode=' + itemCode + '&promotionId=' + IDs[0] + '&promotionType=' + IDs[1] + '&qty=2', //data: 'op=9&itemcode=' + itemCode + '&promotionId=' + IDs[0] + '&promotionType=' + IDs[1],
                        on: {
                            success: function (index, req) {
                                var response = req.responseText,
                                    response = JSON.parse(response),
                                    flag = FALSE;
                                if (response.Status == -1) {
                                    self.directLogin("collect", function () {
                                        self._collect(_node, proDetail);
                                    });
                                } else if (_node != 'null') {
                                    if (_node.hasAttribute('isGift')) {
                                        flag = TRUE;
                                    }

                                    self.del(_node, proDetail);
                                    self.updateAmount(response.TotalModel);
                                    self.updateIsMeet(proDetail.evtid, response);
                                    self.updateGift(response, flag);
                                }

                                //�ղؼ� - ���»�ȡ�б�����
                                self._treasure_send();
                                self.delProductClearCart();
                            }
                        }
                    });
                } else if (!result.ok && result.msg == 'E0009') { //E009����˷��ص�δ��¼״̬
                    self.directLogin("collect", function () {
                        self._collect(_node, proDetail);
                    });
                }
            });
        },
        /**
         * �ӹ��ﳵ��ɾ��ָ������Ʒ
         *
         * @method del
         * @param sku {String} Ҫɾ����Ʒ��sku
         */
        del: function (_node, proDetail, noCollect) {
            var self = this,
                itemCode = proDetail.sku;

            var delAnimFade = new S.Anim({
                    node: _node,
                    duration: .4,
                    to: { opacity: 0 }
                }),
                delAnimHide = new S.Anim({
                    to: { height: 0 },
                    easing: S.Easing.backIn,
                    duration: .5
                });
            delAnimHide.on('end', function () {
                _node.setStyle(DISPLAY, NONE);
                if (_node.siblings(Sel_AProduct)._nodes.length == 0) {
                    _node.ancestor('.CommodityBox') && _node.ancestor('.CommodityBox').setStyle(DISPLAY, NONE);
                }

                _node.remove();

                if (noCollect) {
                    var delNode = S.Node.create(Lang.sub(tmpDeledTr, proDetail)),
                        LogID = window.UI_header.getUserNN();
                    if (!LogID) {
                        delNode.one('.split').remove();
                        delNode.one('.moveclt').remove();
                    }
                    delNode.one('.Remove5').setAttribute('evtid', proDetail.evtid);
                    delNode.one('.Remove5').setAttribute('itemcode', proDetail.sku);
                    delNode.one('.Remove5').setAttribute('num', proDetail.num);
                    Nodes[N_DeledGoods].one('.RemoveList').prepend(delNode);
                    if (Nodes[N_DeledGoods].hasClass(HIDDEN)) {
                        Nodes[N_DeledGoods].removeClass(HIDDEN);
                    }
                }

                if (!Nodes[CommBoxWrap].one(Sel_AProduct)) {
                    self.clearCart();
                    return FALSE;
                }

            });

            delAnimFade.on('end', function () {
                var trH = _node.getComputedStyle('height'),
                    placeTr = S.Node.create('<div style="height:' + trH + '"></div>');
                _node.get('children').setStyle(DISPLAY, NONE);
                _node.append(placeTr);

                delAnimHide.set('node', placeTr);
                delAnimHide.run();
            });

            delAnimFade.run();
        },
        /**
         * ִ��ʵ�ʵ���Ʒɾ������
         *
         * @method _del
         * @param _node {Array} �ڵ���� / proDetail {JSON} ��Ʒ��Ϣ / noCollect {Boolean} ����
         */
        _del: function (_node, proDetail, noCollect) {
            var self = this,
                IDs = proDetail.evtid.split('%2B'),
                num = proDetail.num,
                itemCode = proDetail.sku,
                paramID = 'itemcode';
            if (IDs[1] == 13 || IDs[1] == 14 || IDs[1] == 17 || IDs[1] == 18) {
                paramID = "guid";
            }
            S.io(window.Env.ShoppingCartV2Ajax, {
                method: 'POST',
                data: 'op=3' + '&' + paramID + '=' + itemCode + '&qty=' + num + '&promotionId=' + IDs[0] + '&promotionType=' + IDs[1],
                on: {
                    success: function (index, req) {
                        var res = req.responseText,
                            res = JSON.parse(res),
                            flag = FALSE;
                        if (IDs[1] == "15" || IDs[1] == "16") { //15��һԪ����Ʒ //16�������̳�
                            self.del(_node, proDetail, flag);
                        } else {
                            self.del(_node, proDetail, noCollect);
                        }
                        self.updateAmount(res.TotalModel);
                        if (_node.hasAttribute('isGift')) {
                            flag = TRUE;
                        }

                        if (res.GG && res.GG.length != 0) {
                            flag = FALSE;
                        }

                        self.updateIsMeet(proDetail.evtid, res);
                        self.updateGift(res, flag);
                        self.delProductClearCart();

                        //if (res.TotalModel.Qty > 0) {
                        //    self.updateIsMeet(proDetail.evtid, res);
                        //    self.updateGift(res, flag);
                        //} else {
                        //    self.clearCart();
                        //}
                    }
                }
            });
        },
        /**
         * ִ��ʵ�ʵĶ����Ʒͬʱɾ������
         *
         * @method _many_del
         * @param _date {JSON} ��Ʒ��Ϣ
         */
        _many_del: function (_date) {
            var self = this,
                allDate = _date,
                delList = allDate.delList,
                delNode = allDate.delNode,
                delDeta = allDate.delDeta;

            S.io(window.Env.ShoppingCartV2Ajax, {
                method: 'POST',
                data: 'op=21' + '&BulkDelete=' + delList,
                on: {
                    success: function (index, req) {
                        var res = req.responseText,
                            res = JSON.parse(res);

                        for (var i = 0; i < delNode.length; i++) {

                            var flag = FALSE,
                                noCollect = TRUE,
                                IDs = delDeta[i].evtid.split('%2B');

                            if (delNode[i].hasAttribute('isGift') || delNode[i].hasAttribute('isGiftGroup')) {
                                noCollect = FALSE;
                            }

                            if (IDs[1] == "15" || IDs[1] == "16") { //15��һԪ����Ʒ //16�������̳�
                                self.del(delNode[i], delDeta[i], flag);
                            } else {
                                self.del(delNode[i], delDeta[i], noCollect);
                            }

                            self.updateAmount(res.TotalModel);

                            if (delNode[i].hasAttribute('isGift')) {
                                flag = TRUE;
                            }

                            if (res.GG && res.GG.length != 0) {
                                flag = FALSE;
                            }

                            self.updateIsMeet(delDeta[i].evtid, res);
                            self.updateGift(res, flag);
                            self.delProductClearCart();
                        }
                    }
                }
            });
        },
        /**
         * ��ָ������Ʒ��ӵ����ﳵ
         *
         * @method add
         * @param sku {String} ��Ҫ��ӵ����ﳵ����Ʒ��sku
         */
        add: function (data, evtID) {
            var self = this,
                flag = FALSE,
                nodeID = '';
            evtID = data.PM.ID + '%2B' + data.PM.PT;
            nodeID = evtID;
            //if (data.PM.PT == 6) {
            //    nodeID = '0%2B6';
            //}
            if (data.PM.PT == 10) {
                nodeID = '0%2B10';
            }
            if (data.PM.PT == 18) {
                nodeID = '0%2B0';
            }

            var hiddenCls = data.IM.CostPoints ? "" : HIDDEN,
                disableCls = (data.IM.Qty == 1) ? "disable" : "",
                preNode = S.Node.create(Lang.sub(tmpPro, S.merge(data.IM, { "hiddenCls": hiddenCls, "disable": disableCls }))),
                PRSHTML = '';
            for (var i = 0; i < data.IM.MaP.length; i++) {
                PRSHTML += Lang.sub(tmpPRS, data.IM.MaP[i]);
            }
            preNode.one('.pro-check').append(PRSHTML);
            if (data.IM.ST && data.IM.ET) {
                var start = data.IM.ST,
                    end = data.IM.ET;
                preNode.one('.pro-pro').append('<div class="pro-tip-time" start="' + start + '" end="' + end + '"></div>');
                preNode.plug(S.Plugin.Count, {
                    countSel: ".pro-tip-time",
                    template: "����ʱ��{day}��{hour}Сʱ{minute}��{second}��"
                });
            }
            if (data.IM.LB) {
                var promTips = data.IM.LB,
                    promTipsHTML = "",
                    promLab = {};

                //����
                if (promTips.PT == 2 && data.IM.PT != 10) {
                    promLab.title = "����";
                    promLab.tips = "����Ʒ����ʹ��ȫ���Ż�ȯ��������ʹ��Ʒ���Ńaȯ��";
                    promLab.ClsFilter = 'pro-tip-txt';
                    promLab.ClsTipFilter = 'pro-tip-on';
                    promLab.ClsTxtFilter = 'tipbox-on';
                    promTipsHTML += Lang.sub(tmpPromType, promLab);
                }

                //��̩ר��
                if (promTips.IsLT) {
                    promLab.title = "��̩ר��";
                    promLab.ClsFilter = 'pro-tip-txt2';
                    promLab.ClsTipFilter = '';
                    promLab.ClsTxtFilter = '';
                    promTipsHTML += Lang.sub(tmpPromType, promLab);
                }

                //��Ʒ��ʾ
                if (promTips.IsL) {
                    promLab.title = "��Ʒ";
                    promLab.ClsFilter = 'pro-tip-txt';
                    promLab.ClsTipFilter = '';
                    promLab.ClsTxtFilter = '';
                    promTipsHTML += Lang.sub(tmpPromType, promLab);
                }

                //������Ʒ��ʾ
                if (data.IM.TY == 1 || data.IM.TY == 2) {
                    promLab.title = "��Ʒ";
                    if (data.IM.YTP > 0) {
                        promLab.title = '��ֵ����';
                    }
                    promLab.ClsFilter = 'pro-tip-txt3';
                    promLab.ClsTipFilter = '';
                    promLab.ClsTxtFilter = '';
                    promTipsHTML += Lang.sub(tmpPromType, promLab);
                }

                //����Ԥ�۱��
                if (promTips.IsPS) {
                    promLab.title = "Ԥ��";
                    promLab.tips = promTips.PSM; //"Ԥ����Ʒ��֧�ֻ������Ԥ����10�췢����";
                    promLab.ClsFilter = 'pro-tip-txt';
                    promLab.ClsTipFilter = 'pro-tip-on';
                    promLab.ClsTxtFilter = 'tipbox-on';
                    if (promTips.PSM) {
                        promTipsHTML += Lang.sub(tmpPromType, promLab);
                    } else {
                        promTipsHTML += Lang.sub(tmpPromErrorType, promLab);
                    }
                }

                //����������ר���ʶ
                if (promTips.IsCP) {
                    promLab.title = "������Աר��";
                    promLab.tips = "������Աר�����μ��κδ�������������ޣ�����ָ���̩�ۡ�";
                    promLab.ClsFilter = 'pro-tip-txt';
                    promLab.ClsTipFilter = 'pro-tip-on';
                    promLab.ClsTxtFilter = 'tipbox-on';
                    promTipsHTML += Lang.sub(tmpPromType, promLab);
                }

                //���Ӳ�֧���������˻���ʶ
                if (promTips.NotRma) {
                    promLab.title = "��֧���������˻�";
                    promLab.ClsFilter = 'pro-tip-txt4';
                    promTipsHTML += Lang.sub(tmpProTrunType, promLab);
                }

                preNode.one('.pro-pro').append(promTipsHTML);
                preNode.plug([{ fn: S.Plugin.Postip, cfg: { tipsSel: ".tipbox-on", triggersSel: ".pro-tip-on", hideDelay: 300 } }]);
            }

            //�Ƿ���Ʒ
            if (!Nodes[gift]) {
                Nodes[gift] = [];
            }

            if (data.IM.TY == 1) {
                preNode.setAttribute('isGift', 'true');
                Nodes[gift].push(preNode);
                preNode.one('.pro-number').setContent('1');
                preNode.one('.pro-collect').remove();
                flag = TRUE;
            }

            //�Ƿ���޸�����
            if (!data.IM.CM) {
                preNode.one('.pro-number').setContent(data.IM.Qty);
            }

            //�Ƿ��ɾ��
            if (!data.IM.CDE) {
                var proremove = preNode.one('.pro-remove');
                proremove && proremove.remove()
            }

            //�ܷ��ղ�
            if (!data.IM.CC) {
                var procollect = preNode.one('.pro-collect');
                procollect && procollect.remove();
            }

            //�Ƿ���޸Ĳ���
            if (!data.IM.GM) {
                var proalter = preNode.one('.pro-alter');
                proalter && proalter.remove();
            }

            //�����ǰ��Ʒ��ɾ��/���ղ�/���޸Ĳ��� ����� "-" ��ʾ
            if (!data.IM.CDE && !data.IM.CC && !data.IM.GM) {
                preNode.one('.th-op').setContent('<div class="decidetime">--</div>');
            }

            //���ۿ�����ʾ�ۿ�
            if (data.IM.DC == 10 || data.IM.DC == 0) {
                preNode.one('.pro-rebate').setStyle(DISPLAY, NONE);
            }

            if (typeof evtID == undefined) {
                evtID = '0%2B0';
            }

            //����ͨ��Ʒ�������������Ʒ(PM.PT=3)����ֻ��һ��ʱ.ɾ�������¼���ʱ�Ҳ���Nodes[nodeID]�������Ĭ�ϼӻ���ͨ��Ʒ��.
            if (!Nodes[nodeID] && data.PM.PT == 3) {
                nodeID = '0%2B0';
            }

            preNode.setAttribute('evtid', evtID);
            preNode.setAttribute('itemcode', data.IM.IC);
            Nodes[nodeID].hd.scrollIntoView(TRUE);

            preNode.setStyles({ 'overflow': 'hidden', 'height': '0', 'opacity': '0' });

            var addAnimShow = new S.Anim({
                    node: preNode,
                    to: { 'height': '90px' },
                    duration: .5,
                    easing: S.Easing.backOut
                }),
                addAnimFade = new S.Anim({
                    node: preNode,
                    to: { 'opacity': '1' },
                    duration: .5
                });
            addAnimShow.on('end', function () {

                //������ʾ
                var Ncollect = {},
                    wrapHeight,
                    areacolor = preNode;
                Ncollect['chk'] = areacolor.one('.th-chk div');
                Ncollect['price'] = areacolor.one('.pro-price');
                Ncollect['number'] = areacolor.one('.th-amount');
                Ncollect['sum'] = areacolor.one('.th-sum');
                Ncollect['op'] = areacolor.one('.th-op');
                wrapHeight = parseInt(areacolor.getComputedStyle('height'));
                for (var i in Ncollect) {
                    if (Ncollect[i]) {
                        Ncollect[i].setStyle("marginTop", wrapHeight / 2 - parseInt(Ncollect[i].getComputedStyle('height')) / 2 - 15);
                    }
                }

                addAnimFade.run();
            });
            addAnimFade.on('end', function () {
                addAnimFade = NULL;
                addAnimShow = NULL;
                preNode.setStyles({ 'overflow': 'visible', 'height': 'auto', 'opacity': '1' });

                //������Ʒ�ܼ�
                var numWrap = preNode.one('.pro-number');
                self.updateAmount(data.TotalModel);
                self.updateIsMeet(evtID, data);
                self.updateGift(data, flag);

            });

            if (Nodes[nodeID].wrap.getStyle(DISPLAY) == NONE) {
                Nodes[nodeID].wrap.setStyle(DISPLAY, BLOCK);
            }
            Nodes[nodeID].table.append(preNode);
            addAnimShow.run();
        },
        /**
         * ִ��ʵ�ʵġ���ָ������Ʒ��ӵ����ﳵ������
         *
         * @method _add
         * @param goods {JSON} ��Ʒ����
         */
        _add: function (itemInfo) {
            var self = this,
                itemCode = itemInfo.itemCode,
                Nums = itemInfo.num;
            S.io(window.Env.ShoppingCartV2Ajax, {
                method: 'POST',
                data: "op=11&itemcode=" + itemCode + "&qty=" + Nums,
                on: {
                    success: function (index, req) {
                        var response = req.responseText,
                            IM = NULL,
                            totalModel = NULL;
                        response = JSON.parse(response);

                        self.add(response);
                    }
                }
            });
        },
        /**
         * �޸���Ʒ����
         *
         * @method changeCount
         * @param count {Number} �޸ĺ����Ʒ����
         * @param sku {String}
         */
        delRemove: function (itemCode, node) {
            node.remove();
        },
        /**
         * �޸Ļ�Ƿ�������ʾ
         *
         * @method updateIsMeet
         * @param evtID {string}
         * @param res {obj}
         */
        updateIsMeet: function (evtID, res) {
            var self = this,
                bargainTP = evtID && evtID.split('%2B')[1],
                pTip = null,
                pLink = null,
                pass = (evtID != null && bargainTP != '' && bargainTP != 3 && bargainTP != 6 && bargainTP != 9 && bargainTP != 10);

            if (Nodes[evtID]) {

                if (self.checkLabel) {
                    pTip = self.checkLabel.ancestor(".CommodityBox").one(".Activities p");
                } else {
                    pTip = Nodes[evtID].tip.one('p');
                }

                pLink = Nodes[evtID].tip.one('a');

                //���»�Ƿ�������ʾ
                if (res.PM == NULL && pass) {
                    pTip.addClass(HIDDEN);
                } else if (pass) {

                    if (res.PM.DU) {
                        pLink.set('href', res.PM.DU).removeClass(HIDDEN);
                    }

                    if (bargainTP == 13 && bargainTP == 14 && bargainTP == 17) {
                        if (self.checkLabel && self.checkLabel.hasClass(CHECKED)) {
                            if (res.PM.TP) {
                                pTip.setContent(res.PM.TP).removeClass(HIDDEN);
                            } else {
                                pTip.addClass(HIDDEN);
                            }
                        } else {
                            pTip.addClass(HIDDEN);
                        }
                    } else {
                        if (res.PM.TP) {
                            pTip.setContent(res.PM.TP).removeClass(HIDDEN);
                        } else {
                            pTip.addClass(HIDDEN);
                        }
                    }
                }
            } else {
                if (Nodes[sel_Accountsbox].hasClass(Cls_Inhibit)) {
                    S.Array.each(self.renderEvtID, function (thisNode, index) {
                        var thatNode = Nodes[thisNode],
                            thatPT = thisNode && thisNode.split('%2B')[1],
                            pass = FALSE,
                            pTip = null,
                            pLink = null;

                        //����������PT�����ж�,ֻҪ����ɱ��������Ʒ.�������� pTip ��ʾ�Ļ���
                        if (thatPT == 6 || thatPT == 9 || thatPT == 10) {
                            pass = TRUE;
                        }

                        if (thatNode && !pass) {
                            pTip = thatNode.tip.one('p');
                            pTip && pTip.addClass(HIDDEN);
                        }
                    });
                }
            }

            self.checkLabel = null; //���� - ��¼��ǰѡ������һ����Ʒ�Ľڵ�,���㴦��������ʱ����.
        },
        /**
         * �޸���Ʒ����
         *
         * @method changeCount
         * @param count {Number} �޸ĺ����Ʒ����
         * @param sku {String}
         */
        changeCount: function (res, evtID, node, iNode, boon, nums, paramID) {
            var self = this,
                haitaoMark = evtID.split('%2B')[1],
                iout = res.CGI && res.CGI.length > 0,
                outStock = iout && res.CGI['0'].GPro, //��ǰ���ﳵȱ����Ʒ�б�
                outStocknums = outStock.length, //��ȱ������
                outGroup = iout && res.CGI['0'].GP, //��ǰ���ﳵȱ�����
                amount = res.IM.Qty, //����˷��ص�ǰ��Ʒ����
                pass = (nums == amount), //�жϵ�ǰ��Ʒ����������뷵�ص������Ƿ����
                checkPar = null,
                checkLab = null;

            if (tipAnim == NULL) {
                tipAnim = new S.Anim({
                    to: { 'opacity': tipAnimTime },
                    duration: 2
                });
            } else {
                tipAnim.stop();
            }

            tipAnim.on('end', function () {
                Nodes[ModifyTip].setStyle(DISPLAY, NONE);
            });

            //�޸�����
            if (iNode) {
                if (paramID != 'guid') { //�Ƿ�������
                    iNode.setAttribute('lastvalue', amount);
                    iNode.set('value', amount);
                } else if (haitaoMark == '18') { //��Ʒ����
                    iNode.setAttribute('lastvalue', amount);
                    iNode.set('value', amount);
                } else {
                    iNode.setAttribute('lastvalue', nums);
                    iNode.set('value', nums);
                }
            }

            if (node) {
                if (Nodes[ModifyTip] == NULL || Nodes[ModifyTip] == undefined) {
                    Nodes[ModifyTip] = S.Node.create('<div style="display:block" class="ModifyTip"><p class="J-suc">�޸ĳɹ�</p><p>������Ʒ�ܽ��Ϊ��<b></b></p><strong></strong><i>�ر�</i><span class="uparrow"></span></div>');
                    Nodes[ModifyTip].one('i').on(E_CLICK, function (e) {
                        Nodes[ModifyTip].setStyle(DISPLAY, NONE);
                        tipAnim && tipAnim.stop() && (tipAnim = NULL);
                    });
                }
                //�޸��ܼ�
                Nodes[ModifyTip].one('b').setContent(res.TotalModel.YTA);

                //��ʾ�޸�
                var numred = node.one('.nums-red'),
                    numadd = node.one('.nums-add');

                if (!pass) {
                    if (amount == 1) {
                        numred.addClass('disable');
                    } else {
                        numred.removeClass('disable');
                    }
                    numadd.addClass('disable');

                    Nodes[ModifyTip].one('.J-suc').setContent("���ɹ���" + amount + "��");
                } else {
                    //numred.removeClass('disable');

                    if (amount == 1) {
                        numred.addClass('disable');
                    } else {
                        numred.removeClass('disable');
                    }

                    if (amount == 99) {
                        numadd.addClass('disable');
                    } else {
                        numadd.removeClass('disable');
                    }

                    Nodes[ModifyTip].one('.J-suc').setContent("�޸ĳɹ�");
                }

                //�����Ʒ�䶯�漰����Ʒ�����ʾ
                if (res.IM.Tips) {
                    tipAnim = NULL;
                    tipAnimTime = 20; //��ʧʱ��
                    Nodes[ModifyTip].addClass("ModifyTipBig");
                    Nodes[ModifyTip].one('strong').setContent(res.IM.Tips);
                } else {
                    Nodes[ModifyTip].removeClass("ModifyTipBig");
                    Nodes[ModifyTip].one('strong').setContent();
                    tipAnimTime = 0.5; //��ʧʱ��
                }
                node.ancestor('.th-amount').next('.th-sum').setContent(res.IM.Points);
                node.appendChild(Nodes[ModifyTip]);

                Nodes[ModifyTip].setStyle(DISPLAY, BLOCK);
                Nodes[ModifyTip].setStyle('opacity', 1);
                tipAnim && tipAnim.stop() && tipAnim.set('node', Nodes[ModifyTip]) && tipAnim.run();

                //��ȡ��ѡ�ڵ�
                checkPar = node.ancestor(Sel_AProduct),
                    checkLab = checkPar.one('.J-SelectPro');
            }

            if (amount > 0) {
                self.checkLabel = iNode;
            }

            self.updateIsMeet(evtID, res);
            self.updateAmount(res.TotalModel);
            self.updateGift(res);

            if (outStock && outStocknums > 0) {
                self.clearOutStorkPro(outStock, outGroup, TRUE);
            }

            //��δѡ�����Ʒѡ����
            checkPar && checkPar.addClass('areacolor');
            checkLab && checkLab.addClass(CHECKED);
        },
        /**
         * ִ����Ӧ�������޸ĺ�Ĳ���
         *
         * @method _changeCount
         * @param sku {String}
         */
        _changeCount: function (itemCode, Nums, evtID, node, iNode, boon) {
            //����˷������� result
            var self = this,
                IDs = evtID.split('%2B'),
                paramID = 'itemcode';

            if (IDs[1] == 13 || IDs[1] == 14 || IDs[1] == 17 || IDs[1] == 18) {
                paramID = "guid"; //�Ƿ�������
            }

            S.io(window.Env.ShoppingCartV2Ajax, {
                method: 'POST',
                data: "op=4&" + paramID + "=" + itemCode + "&qty=" + Nums + "&promotionid=" + IDs[0] + "&promotionType=" + IDs[1],
                on: {
                    success: function (index, req) {
                        var response = req.responseText;
                        response = JSON.parse(response);
                        self.changeCount(response, evtID, node, iNode, boon, Nums, paramID);
                    }
                }
            });
        },
        /**
         * �޸���Ʒѡ��
         *
         * @method choiceProduct
         * @param res {JSON} �޸�ѡ������˷��ص�����
         * @param evtid {}
         */
        choiceProduct: function (res, evtid) {
            var self = this,
                iout = res.CGI && res.CGI.length > 0,
                outStock = iout && res.CGI['0'].GPro, //��ǰ���ﳵȱ����Ʒ�б�
                outStocknums = outStock && outStock.length, //��ȱ������
                outGroup = iout && res.CGI['0'].GP; //��ǰ���ﳵȱ�����

            if (outStock && outStocknums > 0) {
                self.clearOutStorkPro(outStock, outGroup, TRUE);
            }

            self.updateIsMeet(evtid, res);
            self.updateAmount(res.TotalModel);
            self.updateGift(res, FALSE);
        },
        /**
         * ִ����Ӧ��ѡ���޸ĺ�Ĳ���
         *
         * @method _choiceProduct
         * @param
         */
        _choiceProduct: function (date, count) {
            var self = this,
                result = date,
                evtid = null,
                IDs = null;

            if (!(Lang.isArray(result)) && (typeof (result) != "string")) {
                IDs = result.evtid.split('%2B');
                evtid = result.evtid;
                result = result.sku + "," + result.num + "," + IDs[0] + "," + IDs[1];
            }

            self.choice = FALSE;

            S.io(window.Env.ShoppingCartV2Ajax, {
                method: 'POST',
                data: "op=22&Choice=" + result + "&ChoiceType=" + count,
                on: {
                    success: function (index, req) {
                        var response = req.responseText;
                        response = JSON.parse(response);

                        self.choice = TRUE;
                        self.choiceProduct(response, evtid);
                    },
                    failure: function () {
                        self.choice = TRUE;
                    }
                }
            });
        },
        /**
         * ȥ����
         * @method goToCheckOut
         * @param ��
         */
        goToCheckOut: function () {
            var self = this,
                loadingNode = S.Node.create(Tmpl_SubmitLoading);

            Nodes[Sel_CheckOut].addClass(Cls_Ing);
            S.one('.AccountsTip').append(loadingNode);

            S.io(window.Env.ShoppingCartV2Ajax, {
                method: 'POST',
                data: 'op=10',
                on: {
                    success: function (index, req) { //LA.Status 1 �ɹ� 2 �ֿⲻͬ -1 δ��¼ 0 У��ʧ�ܣ���ʾ��Ϣ����ҳ�� ����render
                        loadingNode && loadingNode.remove();

                        Nodes[Sel_CheckOut].removeClass(Cls_Ing);

                        var response = req.responseText,
                            response = JSON.parse(response),
                            LA = response.LA;
                        if (LA.Status == -1) {
                            self.directLogin("checkout");
                        } else if (LA.Status == 0) {
                            S.Box.alert(response.MSG, function (pBox) {

                                if (Nodes[CommBoxWrap].one('.CommodityBox')) {
                                    Nodes[CommBoxWrap].all('.CommodityBox').remove();
                                }

                                window.fakeData = response.CMODEL;

                                Nodes[CommBoxWrap].destroy(TRUE);
                                Nodes[CommBoxWrap] = NULL;
                                Nodes['confirmNode'].purge();

                                Page_Inst = NULL;
                                S.Pages.ShoppingCart = ShoppingCart;
                                S.Pages.ShoppingCart.instance = Page_Inst = new ShoppingCart();
                            }, {
                                modal: TRUE
                            });
                        } else if (LA.Status == 2) {//���ã������������˲�ͬ�ֿⷢ������Ʒ���ؿ�������������
                            S.Box.confirm(LA.MSG, function (pBox) { }, {
                                modal: TRUE,
                                yesText: "����",
                                noText: "������",
                                yes: function () {
                                    if (isIE && isIE < 9) {
                                        self.creatJumpCheckout(LA.URL);
                                    } else {
                                        window.location.href = LA.URL;
                                    }
                                },
                                no: function () {
                                    return FALSE;
                                }
                            });
                        } else {
                            if (isIE && isIE < 9) {
                                self.creatJumpCheckout(LA.URL);
                            } else {
                                window.location.href = LA.URL;
                            }
                        }
                    }
                }
            });
        },
        /**
         * �����ܼ���Ϣ
         *
         * @method updateAmount
         * @param amount {Number} �ܼ�ֵ
         * @param save {Number} ��ʡ��ֵ
         */
        updateAmount: function (amount) {
            var self = this,
                TipNode = Nodes[Sel_CheckLayer].one('.J-freight'),
                CueNode = Nodes[Sel_CheckLayer].one('.AccountsNum .cue'),
                InANode = Nodes[Sel_CheckLayer].one('.J-TotalIntegral'),
                InBNode = Nodes[Sel_CheckLayer].one('.J-math'),
                InteOne = InANode.one('.integral'),
                InteTwo = InBNode.one('.integral'); //���Ļ���

            amount.freightTips = '�ö���δ��' + amount.SF.RFN + 'Ԫ����֧���˷�' + amount.SF.SSF + 'Ԫ';
            amount.freightCue = '�����˷�';

            Nodes[Sel_CheckLayer].one('.TotalAmount .total').setContent(Dols + amount.Am);
            Nodes[Sel_CheckLayer].one('.TotalAmount .save').setContent(Dols + amount.RA);
            Nodes[Sel_CheckLayer].one('.TotalAmount .freight').setContent(Dols + amount.SF.ASF);
            Nodes[Sel_CheckLayer].one('.TotalAmount .pay').setContent(Dols + amount.YTA);
            Nodes[Sel_CheckLayer].one('.AccountsNum .pay').setContent(Dols + amount.YTA);

            if (amount.TPT) {
                InteOne.setContent(amount.TPT);
                InteTwo.setContent(amount.TPT);
                InANode.removeClass(HIDDEN);
                InBNode.removeClass(HIDDEN);
            } else {
                InANode.addClass(HIDDEN);
                InBNode.addClass(HIDDEN);
            }

            if (amount.YTA == 0 && amount.Qty == 0) {
                amount.freightTips = '��ѡ����Ʒ���н���';
                amount.freightCue = '';
                TipNode.removeClass('TipTure');
            } else if (amount.SF.IsESF) {
                TipNode.addClass('TipTure');
                amount.freightTips = '�ö�������' + amount.SF.RFN + 'Ԫ���˷�����';
                amount.freightCue = '�����˷�';
            } else {
                TipNode.removeClass('TipTure');
            }

            //������㰴ť��ʶ
            if (amount.YTA == 0 && amount.Qty == 0) {
                Nodes[sel_Accountsbox].addClass(Cls_Inhibit);
            } else {
                Nodes[sel_Accountsbox].removeClass(Cls_Inhibit);
            }

            TipNode.setContent(amount.freightTips).removeClass(HIDDEN);

            if (!amount.freightCue) {
                CueNode.addClass(HIDDEN);
            } else {
                CueNode.setContent('(' + amount.freightCue + ')').removeClass(HIDDEN);
            }

            //����ͷ�����������
            window.UI_header.initCart();
        },
        /**
         * ������Ʒ��Ϣ
         *
         * @method updateGift
         * @param gifts {JSON} / add {Boolean}
         */
        updateGift: function (gifts, add, hasgifs) {
            var self = this,
                N_LiPinBox = null,
                avl_gifts = gifts.GM,
                sel_gifts = gifts.GG ? gifts.GG : gifts,
                has_Gifts = gifts.HasGift ? gifts.HasGift : hasgifs;

            //if (sel_gifts && sel_gifts.length > 0) {
            //    N_LiPinBox = S.one(Sel_LiPinBox);
            //    N_LiPinBox && N_LiPinBox.removeClass(HIDDEN);
            //}

            if (add != TRUE) {
                self._updateGift(sel_gifts, has_Gifts);
            }

            //�ػ��ѡ��Ʒ���� - �� - �����class=shopping_special.
            if (avl_gifts && avl_gifts.length > 0) {
                Nodes['DOMfavGoods'].setContent();

                Nodes['DOMfavGoods'].append('<h3 class="product_title">�Ż���Ʒѡ��</h3>');

                for (var n = 0; n < avl_gifts.length; n++) {
                    Nodes['favGoods'][n] = S.Node.create(Lang.sub(tmpFavPro, avl_gifts[n]));
                    var nodeSelectColor = Nodes['favGoods'][n].one('.CheckGoodsColor'),
                        nodeSelectSize = Nodes['favGoods'][n].one('.CheckGoodsSize'),
                        OPCOLOR = nodeSelectColor.getAttribute('options').split(','),
                        OPSIZE = nodeSelectSize.getAttribute('options').split(','),
                        optionsNodeColor = "",
                        optionsNodeSize = "";
                    for (var c = 0; c < OPCOLOR.length; c++) {
                        optionsNodeColor += '<option value="' + OPCOLOR[c] + '">' + OPCOLOR[c] + '</option>';
                    }
                    nodeSelectColor.append(optionsNodeColor);
                    for (var s = 0; s < OPSIZE.length; s++) {
                        optionsNodeSize += '<option value="' + OPSIZE[s] + '">' + OPSIZE[s] + '</option>';
                    }
                    nodeSelectSize.append(optionsNodeSize);
                    if (n % 2 !== 0) {
                        Nodes['favGoods'][n].addClass('shopping_menuTwo');
                    }

                    Nodes['DOMfavGoods'].append(Nodes['favGoods'][n]);
                }
            } else {
                Nodes['DOMfavGoods'].addClass(HIDDEN);
            }
        },
        /**
         * ������Ʒ��Ϣ - ִ��ʵ�ʵ���Ⱦ����
         *
         * @method _updateGift
         * @param sel_gifts {JSON} ��Ʒ��Ϣ / has_Gifts {Boolean} �Ƿ�����Ʒ
         */
        _updateGift: function (sel_gifts, has_Gifts) {
            var self = this,
                tepDirTitle = '<div class="CommodityTitle">' +
                    '<div class="ActivitieHead Initiate">' +
                    '<h3>{giftLabel}</h3>' +
                    '</div>' +
                    '<div class="Activities">' +
                    '<p class="hidden"></p><a class="hidden" href="javascript:void(0);" target="_blank">�鿴����� &gt;</a>' +
                    '</div>' +
                    '</div>',
                tepDirGenre = '<div class="CommodityList"></div>',
                promLab = {};

            //�ػ��Ѽӵ����ﳵ����Ʒ
            if (Nodes[gift].length > 0) {
                for (var j = 0; j < Nodes[gift].length; j++) {
                    Nodes[gift][j].remove();
                }
            }

            if (sel_gifts && sel_gifts.length > 0) {
                Nodes[gift] = [];

                for (var i = 0; i < sel_gifts.length; i++) {
                    var giftLabel = '��ֵ����',
                        PRSHTML = '',
                        hiddenCls = sel_gifts[i].CostPoints ? "" : HIDDEN;

                    Nodes[gift][i] = S.Node.create(Lang.sub(tmpPro, S.merge(sel_gifts[i], { "hiddenCls": hiddenCls })));

                    for (var j = 0; j < sel_gifts[i].MaP.length; j++) {
                        PRSHTML += Lang.sub(tmpPRS, sel_gifts[i].MaP[j]);
                    }
                    Nodes[gift][i].one('.pro-check').append(PRSHTML);

                    Nodes[gift][i].one('.pro-rebate').setStyle(DISPLAY, NONE);
                    Nodes[gift][i].setAttribute('itemcode', sel_gifts[i].IC);
                    Nodes[gift][i].setAttribute('evtid', sel_gifts[i].ID + '%2B3');
                    Nodes[gift][i].setAttribute('isGift', 'true');
                    Nodes[gift][i].one('.pro-number').setContent(sel_gifts[i].Qty);
                    Nodes[gift][i].one('.pro-collect').remove();

                    if (sel_gifts[i].YTP == 0) {
                        var proremove = Nodes[gift][i].one('.pro-remove'),
                            notCheck = Nodes[gift][i].one('.th-chk').one('div');
                        proremove && proremove.remove();
                        notCheck.setContent(); //����0Ԫ��Ʒ�����input��ť
                        giftLabel = '��Ʒ';
                    }

                    //�Ƿ��ɾ��
                    if (!sel_gifts[i].CDE) {
                        var proremove = Nodes[gift][i].one('.pro-remove');
                        proremove && proremove.remove()
                    }

                    //�ܷ��ղ�
                    if (!sel_gifts[i].CC) {
                        var procollect = Nodes[gift][i].one('.pro-collect');
                        procollect && procollect.remove();
                    }

                    //�Ƿ���޸Ĳ���
                    if (!sel_gifts[i].GM) {
                        var proalter = Nodes[gift][i].one('.pro-alter');
                        proalter && proalter.remove();
                    }

                    //�����ǰ��Ʒ��ɾ��/���ղ�/���޸Ĳ��� ����� "-" ��ʾ
                    if (!sel_gifts[i].CDE && !sel_gifts[i].CC && !sel_gifts[i].GM) {
                        Nodes[gift][i].one('.th-op').setContent('<div class="decidetime">--</div>');
                    }

                    //������ʾ
                    Nodes[gift][i].one('.pro-pro').append('<div class="pro-tip "><span class="pro-tip-txt3"><em>' + giftLabel + '</em></span></div>');

                    //���Ӳ�֧���������˻���ʶ
                    if (sel_gifts[i].NotRma) {
                        promLab.title = '��֧���������˻�';
                        promLab.ClsFilter = 'pro-tip-txt4';
                        Nodes[gift][i].one('.pro-pro').append(Lang.sub(tmpProTrunType, promLab));
                    }

                    //��Ʒ/��ֵ������Դ��ʾ
                    self._rite_origin(sel_gifts[i].MZMP, Nodes[gift][i]);

                    //���°���ʾ��Ϣ
                    Nodes[gift][i].plug([{ fn: S.Plugin.Postip, cfg: { tipsSel: ".tipbox-on", triggersSel: ".pro-tip-on", hideDelay: 300 } }]);

                    if (sel_gifts[i].YTP > 0) {
                        Nodes[Sel_LiPinBox] = S.one(Sel_LiPinBox);
                        if (!S.one(Sel_CostlyBox)) {
                            Nodes[Costl] = {};
                            Nodes[Costl].wrap = S.Node.create('<div class="CommodityBox" id="J-CostlyBox"></div>');
                            Nodes[Costl].hd = S.Node.create(Lang.sub(tepDirTitle, { giftLabel: giftLabel }));
                            Nodes[Costl].table = S.Node.create(tepDirGenre);
                            Nodes[Costl].wrap.append(Nodes[Costl].hd);
                            Nodes[Costl].wrap.append(Nodes[Costl].table);

                            if (Nodes[Sel_LiPinBox]) {
                                Nodes[Sel_LiPinBox].insert(Nodes[Costl].wrap, 'after');
                            } else {
                                Nodes[CommBoxWrap].insert(Nodes[Costl].wrap, Nodes[Sel_CheckLayer]);
                            }
                        }

                        Nodes[Sel_CostlyBox] = S.one(Sel_CostlyBox);
                        Nodes[Sel_CostlyBox].setStyle(DISPLAY, BLOCK);
                        Nodes[Sel_CostlyBox].one(".CommodityList").append(Nodes[gift][i]);
                    } else {
                        Nodes[Sel_CostlyBox] = S.one(Sel_CostlyBox);
                        if (!S.one(Sel_LiPinBox)) {
                            Nodes[LiPin] = {};
                            Nodes[LiPin].wrap = S.Node.create('<div class="CommodityBox" id="J-LiPinBox"></div>');
                            Nodes[LiPin].hd = S.Node.create(Lang.sub(tepDirTitle, { giftLabel: giftLabel }));
                            Nodes[LiPin].table = S.Node.create(tepDirGenre);
                            Nodes[LiPin].wrap.append(Nodes[LiPin].hd);
                            Nodes[LiPin].wrap.append(Nodes[LiPin].table);

                            if (Nodes[Sel_CostlyBox]) {
                                Nodes[CommBoxWrap].insert(Nodes[LiPin].wrap, Nodes[Sel_CostlyBox]);
                            } else {
                                Nodes[CommBoxWrap].insert(Nodes[LiPin].wrap, Nodes[Sel_CheckLayer]);
                            }
                        }

                        Nodes[Sel_LiPinBox] = S.one(Sel_LiPinBox);
                        Nodes[Sel_LiPinBox].setStyle(DISPLAY, BLOCK);
                        Nodes[Sel_LiPinBox].one(".CommodityList").append(Nodes[gift][i]);
                    }
                }
            }

            //������ʾ
            for (var k = 0; k < Nodes[gift].length; k++) {
                var Ncasual = {},
                    AProduct = Nodes[gift][k],
                    wrapHeight = parseInt(AProduct.getComputedStyle('height'));

                Ncasual['chk'] = AProduct.one('.th-chk div');
                Ncasual['price'] = AProduct.one('.pro-price');
                Ncasual['number'] = AProduct.one('.th-amount');
                Ncasual['sum'] = AProduct.one('.th-sum');
                Ncasual['op'] = AProduct.one('.th-op');

                for (var u in Ncasual) {
                    if (Ncasual[u]) {
                        Ncasual[u].setStyle("marginTop", wrapHeight / 2 - parseInt(Ncasual[u].getComputedStyle('height')) / 2 - 15);
                    }
                }
            }

            //��ͨ��Ʒ�� - Ϊ�������ظ���
            if (Nodes[normal] && Nodes[normal].wrap && !Nodes[normal].wrap.one(Sel_AProduct)) {
                Nodes[normal].wrap.setStyle(DISPLAY, NONE);
            }

            //��Ԫ��Ʒ�� - Ϊ�������ظ���
            if (S.one(Sel_LiPinBox) && !S.one(Sel_LiPinBox).one(Sel_AProduct)) {
                S.one(Sel_LiPinBox).setStyle(DISPLAY, NONE);
            }

            //�Ӽ���Ʒ�� - Ϊ�������ظ���
            if (S.one(Sel_CostlyBox) && !S.one(Sel_CostlyBox).one(Sel_AProduct)) {
                S.one(Sel_CostlyBox).setStyle(DISPLAY, NONE);
            }

            //��ֵѡ����ť - ��ʾ������
            if (has_Gifts && Nodes[Sel_SelLiPin]) {
                Nodes[Sel_SelLiPin].removeClass(HIDDEN);
            } else {
                Nodes[Sel_SelLiPin].addClass(HIDDEN);
            }
        },
        /**
         * δ��¼���������¼����
         * @method directLogin
         * @param bool {String} / callback {Function}
         */
        directLogin: function (bool, callback) {
            var self = this;

            new S.clientFast({
                url: Env.popUpLoginUrl,
                onafter: function () {

                    switch (bool) {
                        case "coupon":
                            self.switchTo("coupon")
                            break;
                        case "checkout":
                            self.goToCheckOut();
                            break;
                        case "collect":
                            callback();
                            break;
                        default:
                            window.location.reload(TRUE);
                            break;
                    }
                }
            });
        },
        /**
         * ����Ѽ��빺�ﳵ��ȱ����Ʒ
         * @method clearOutStorkPro
         * @param data {JSON} ȱ���б� / dataGroup {JSON} ȱ����� / isLackStock �޸Ĳ�Ʒ����ʱ-������Ʒ�仯�б�����ʾ ��ǰ��Ʒ ��治��
         */
        clearOutStorkPro: function (data, dataGroup, isLackStock) {
            var self = this,
                allpro = Nodes[CommBoxWrap].all(Sel_AProduct);

            //�ж��ǲ�����ϰ�
            if (!dataGroup.Guid) {
                for (i = 0; i < data.length; i++) {
                    for (j = 0; j < allpro.size() ; j++) {
                        var pNode = allpro.item(j);
                        if (data[i].IsNoStock) {
                            var sku = pNode._node.getAttribute(Attr_Itemcode);
                            if (sku == data[i].IC) {
                                var parentNode = pNode.get("parentNode");
                                if (parentNode && parentNode.all(Sel_AProduct).size() < 2) {
                                    pNode.ancestor(".CommodityBox").remove();
                                }
                                self.delRemove(data.IC, pNode);
                            }
                        }
                    }
                }
            } else {
                for (j = 0; j < allpro.size() ; j++) {
                    var pNode = allpro.item(j);
                    var sku = pNode._node.getAttribute(Attr_Itemcode);
                    if (sku == dataGroup.Guid) {
                        var parentNode = pNode.get("parentNode");
                        if (parentNode && parentNode.all(Sel_AProduct).size() < 2) {
                            pNode.ancestor(".CommodityBox").remove();
                        }
                        self.delRemove(data.IC, pNode);
                    }
                }
            }

            //��ȡ��ǰ������ĸ���
            if (!Nodes[CommBoxWrap].one('.CommodityBox')) {
                self.clearCart(TRUE);
            }

            self.romveList(Nodes[N_DeledStock], data, isLackStock);
        },
        /**
         * ����ɾ�� / ȱ��.��治��ڵ�
         * @method romveList
         * @param _data ��ʲô�͵Ĳ�Ʒ�б����� / _Node ����ĸ��ڵ� / isLackStock �޸Ĳ�Ʒ����ʱ-������Ʒ�仯�б�����ʾ ��ǰ��Ʒ ��治��
         */
        romveList: function (pNode, data, isLackStock) {
            var stockNode = '',
                tmpStockTr =
                    '<div class="RemoveThis cf">' +
                    '<div class="Remove Remove1">{sku}</div>' +
                    '<div class="Remove Remove2"><a href="{url}" target="_blank">{title}</a></div>' +
                    '<div class="Remove Remove3"><strong>��{price}</strong></div>' +
                    '<div class="Remove Remove4">{status}</div>' +
                    '<div class="Remove Remove5">' +
                    '<a href="{url}" target="_blank">�鿴</a>' +
                    '</div>' +
                    '</div>';

            for (i = 0; i < data.length; i++) {
                if ((!isLackStock) || (isLackStock && data[i].IsNoStock)) {
                    stockNode += Lang.sub(tmpStockTr, { 'sku': data[i].IC, 'url': data[i].LK, 'title': data[i].NM, 'price': data[i].YTP, 'status': data[i].Tips }); //data
                }
            }

            pNode.one('.RemoveList').setContent();
            pNode.one('.RemoveList').prepend(stockNode);

            if (pNode.hasClass(HIDDEN)) {
                pNode.removeClass(HIDDEN);
            }
            if (!stockNode) {
                pNode.addClass(HIDDEN);
            }
        },
        /**
         * ������ Ԫ����������
         * @method _floatBar
         * @param ��
         */
        _floatBar: function (thatNode) {
            var parNodePrice = thatNode.get('parentNode').get('region').top,
                viewHeight = Nodes['document'].get('viewportRegion').height,
                navHeight = parseInt(thatNode.getStyle('height')),
                scrollY = Nodes['document'].get('docScrollY'),
                nodePrice = viewHeight - navHeight,
                N_GoToTop = null
                ;

            if (Nodes[Sel_SideFloat]) {
                N_GoToTop = Nodes[Sel_SideFloat].one('.J_GoToTop');
            }

            if (scrollY < 100) {
                N_GoToTop && N_GoToTop.setStyle(DISPLAY, NONE);
            } else {
                N_GoToTop && N_GoToTop.setStyle(DISPLAY, BLOCK);
            }

            if (scrollY + nodePrice > parNodePrice) {
                thatNode.setStyle('position', 'static');

                if (isIE6 && thatNode._node.id == "J-SideFloat") {
                    thatNode.setStyle('position', 'absolute');
                    thatNode.setStyle('top', -(Nodes['#bd'].get('region').height - (nodePrice + scrollY)));
                }
            } else {
                thatNode.setStyle('position', 'fixed');
                if (isIE6) {
                    thatNode.setStyle('position', 'absolute');
                    if (thatNode._node.id != "J-SideFloat") {
                        thatNode.setStyle('top', scrollY + nodePrice);
                    } else {
                        thatNode.setStyle('top', -(parNodePrice - (nodePrice + scrollY)));
                    }
                }
            }
        },
        /**
         * ����ǰ��Ʒ��ϸ����
         * @method _rite_origin
         * @param _data ��ʲô�͵Ĳ�Ʒ�б����� / _Node ����ĸ��ڵ�
         */
        _rite_origin: function (_data, _Node) {
            if (!_data) { return FALSE }
            var _dataIMS = _data.MainItemModels,
                quantity = _dataIMS.length,
                tmpUIHTML = '',
                tempOrign = '<div class="pro-activity cf">' +
                    '<div class="pro-txt-tip pro-tip-on">' +
                    '<span class="m-tip-cla">��Դ</span>' +
                    '<div class="m-tip-box tipbox-on">' +
                    '<div class="m-tip-list">' +
                    '<div class="m-list-box">' +
                    '<h3 class="m-l-title">����Ʒ��Ӧ���»��Ʒ</h3>' +
                    '<ul class="m-l-list">{orignList}</ul>' +
                    '</div>' +
                    '</div>' +
                    '<span class="m-triangle"></span>' +
                    '</div>' +
                    '</div>' +
                    '<p class="pro-txt-name">' + _data.PromotionName + '</p>' +
                    '</div>',

                tempList = '<li>' +
                    '<div class="pic">' +
                    '<a href="{oHref}"><img alt="{oTitle}" src="{oPicUrl}"></a>' +
                    '</div>' +
                    '<div class="ptx">' +
                    '<p class="ptx-href"><a href="{oHref}">{oTitle}</a></p>' +
                    '<p class="ptx-tiua"><strong>��{iPrice}</strong> X <b>{iNums}</b>��</p>' +
                    '</div>' +
                    '</li>';

            //��װ�б�
            if (_data != NULL && quantity > 0) { //��֤�������ݵ���ȷ��
                for (i = 0; i < quantity; i++) {
                    tmpUIHTML += Lang.sub(tempList, { oHref: _dataIMS[i].LK, oTitle: _dataIMS[i].NM, oPicUrl: _dataIMS[i].SRC, iPrice: _dataIMS[i].YTP, iNums: _dataIMS[i].Qty });
                }
            }

            if (_Node) {
                _Node.one('.pro-pro').append(Lang.sub(tempOrign, { orignList: tmpUIHTML }));

                //�жϸ������и��� �߶� ��λ��topֵ ����3��ֵĬ��
                var pNode = _Node.one('.m-tip-box'),
                    iNode = _Node.one('.m-tip-list'),
                    itip = _Node.one('.m-triangle');

                switch (quantity) {
                    case 1:
                        pNode.setStyles({ 'height': '116px', 'top': '-116px' });
                        iNode.setStyle('height', '114px');
                        itip.setStyle('top', '115px');
                        break;
                    case 2:
                        pNode.setStyles({ 'height': '184px', 'top': '-184px' });
                        iNode.setStyle('height', '182px');
                        itip.setStyle('top', '183px');
                        break;
                    default:
                        break;
                }
            }
        },
        /**
         * ����ǰ��Ʒ��ϸ����
         * @method _rite_modifyAttr
         * @param itemCode ��Ʒsku / evtav �id / evtid ���
         */
        _rite_modifyAttr: function (itemCode, evtav, evtid, etNode) {
            var self = this,
                data = '';

            if (!self.swop) {
                data = 'op=19&st=9&instant=0&p=' + evtav + '&itemcode=' + itemCode;
            } else {
                data = 'op=16&st=9&instant=0';
            }

            S.io(window.Env.ShoppingCartV2Ajax, {
                method: 'get',
                data: data,
                on: {
                    success: function (index, req) {
                        var result = req.responseText,
                            loading = Nodes[Sel_Selectkey].one(".J-Load");

                        loading && loading.remove();

                        if (result == "[]") {
                            self.swop = FALSE;
                            self._errorTip('�Բ��𣬲���ʧ�ܣ����Ժ����ԣ�', NULL);
                            Nodes[Sel_SelLiPin].removeClass(Cls_Ing);
                            return FALSE;
                        }

                        result = JSON.parse(result);

                        if (result != NULL && result.length >= 0) {
                            self._rite_Cycle(result);
                        }
                        Nodes[Sel_SelLiPin].removeClass(Cls_Ing);
                        etNode && etNode.removeClass(Cls_Ing);
                    },
                    failure: function () {
                        var loading = Nodes[Sel_Selectkey].one(".J-Load");
                        loading && loading.remove();
                        Nodes[Sel_SelLiPin].removeClass(Cls_Ing);
                        etNode && etNode.removeClass(Cls_Ing);
                        self._errorTip("�Բ��𣬲���ʧ�ܣ����Ժ����ԣ�", NULL);
                    }
                }
            })
        },
        /**
         * ѭ�����ݽṹ
         * @method _rite_Cycle
         * @param _data �Ź� ��ƷJSON����
         */
        _rite_Cycle: function (_data) {
            var self = this,
                tmpProHeading = '<div class="DirectoryTitle"><div class="y-title"><h3>{AName}</h3></div><div class="y-other"><span class="close">�ر�</span></div></div>',
                tmpProSort = '<div class="Itemize"><span class="lipin1">ѡ��</span><span class="lipin2">��Ʒ��ϸ</span><span class="lipin3">����</span><span class="lipin4">��ɫ</span><span class="lipin5">���</span></div>',
                tmpModFoot = '<div class="k-enter cf"><div class="k-enter-le J-enterLeft"><p class="k-check-all J-check-all">��ѡ���� <b>{quantity}</b> ����Ʒ������ <strong>��{total}.00</strong> Ԫ</p></div><div class="k-enter-re"><span class="c-lay-tip hidden J-layTip">&nbsp;</span><a class="c-ente" id="J-EnterCheck" title="ȷ��" href="javascript:void(0)">ȷ��</a><button class="c-lbtn" id="J-Return" title="ȡ��">ȡ��</button></div></div>',
                layerBoxTitle = '�޸���Ʒ';

            //��Ⱦ�ṹ
            Nodes[Muster] = {};
            Nodes[Muster].prolist = ''; //�б�
            Nodes[Muster].sort = tmpProSort; //�б���Ŀ

            for (var i = 0; i < _data.length; i++) {
                var dataType = TRUE,
                    _dataMap = _data[i];
                self._rite_createNode(_dataMap);
            }

            if (self.swop) {
                layerBoxTitle = '��ѡ��ֵ������Ʒ'
            }

            var head = Lang.sub(tmpProHeading, { AName: layerBoxTitle }),
                cont = Nodes[Muster].sort + '<div class="ItemList J-itemlist">' + Nodes[Muster].prolist + '</div>',
                foot = tmpModFoot;

            self._rite_Layer(head, cont, foot);
        },
        /**
         * ��Ⱦ���ݽṹ
         * @method _rite_createNode
         * @param _dataMap ��ƷJSON����
         */
        _rite_createNode: function (_dataMap) {
            var self = this,
                tmpProFalse = '<div class="lipin lipin1 J-choose"><input type="checkbox" disabled="disabled" checked="checked" name="lipin" /></div>',
                tmpProTrue = '<div class="lipin lipin1 J-choose"><input type="checkbox" name="lipin" /></div>',
                tmpProSelect = '<div class="lipin lipin1 J-choose"><input type="checkbox" checked="checked" name="lipin" /></div>',
                tmpProDetail = '<div class="lipin lipin2 J-detail"><div class="gifperty cf"><div class="gif-img"><a href="{IUrl}" target="_blank"><img src="{IU}" /></a></div><p class="gif-title"><a href="{IUrl}" title="{GName}" target="_blank">{GName}</a></p></div></div>',
                tmpProPrice = '<div class="lipin lipin3 J-price"><div class="pro-price"><strong>��{YTP}</strong></div></div>',
                tmpProColor = '<div class="lipin lipin4 J-color"><div class="lipin-changeColor"><ul class="cf J-selectColor" iswitch="{iswitch}">{color}</ul></div></div>',
                tmpProSpeci = '<div class="lipin lipin5 J-speci"><div class="lipin-changeSize J-selectSpeci">{speci}</div></div>',
                tmpProAProduct = '<div class="AProduct cf" ActivityId="{Aid}" itemcode="{IC}" key="{GR}">{Goods}</div>',
                _dataGG = _dataMap.GG,
                _dataJP = _dataMap.JP;

            //��Ʒ��ϸ
            Nodes[Muster].fullgifts = "";
            for (j = 0; j < _dataGG.length; j++) {
                var _dataGGI = _dataGG[j].GGI,
                    curIC = "", //itemcode
                    pick = FALSE, //ѭ��Ĭ�ϲ�Ʒ��
                    iswitchNum = -1 //Ĭ�ϲ�Ʒ���
                    ;
                Nodes[Muster].color = "";
                Nodes[Muster].speci = "";

                //ѭ����Ʒ
                for (i = 0; i < _dataGGI.length; i++) {

                    var hasPro = TRUE; //ѭ���ж��Ƿ��в�Ʒ
                    var hasGGP = TRUE; //��ȡ��ǰGGP���еĵ�һ��sku����

                    //��ѡ��Ʒ
                    var DataGGP = _dataGGI[i].GGP;

                    if (DataGGP.length != 0) {
                        //��ƷĬ����ʾ
                        if (hasGGP && _dataGGI[i].GGP[0].IC && i == 0) {
                            hasGGP = FALSE;

                            Nodes[Muster].detail = Lang.sub(tmpProDetail, {
                                IU: _dataGGI[i].GGP[0].IU,
                                IUrl: Lang.sub(Env.ProductDetail, { itemcode: _dataGGI[i].GGP[0].IC }),
                                GName: _dataGGI[i].GGP[0].Name
                            });
                            Nodes[Muster].price = Lang.sub(tmpProPrice, {
                                YTP: _dataGGI[i].GGP[0].YTP
                            });
                        }

                        //��ѡ��Ʒ
                        for (n = 0; n < DataGGP.length; n++) {
                            if (DataGGP[n].Chk) {
                                curIC = DataGGP[n].IC;
                                pick = TRUE;
                                break;
                            }
                        }

                        iswitchNum += 1; //��ǰ�����к�

                        if (pick) {
                            break;
                        }
                    } else {
                        hasPro = FALSE;
                    }
                }

                if (hasPro) {
                    //ѭ����Ʒ ƴ�ṹ
                    for (i = 0; i < _dataGGI.length; i++) {
                        var DataGGP = _dataGGI[i].GGP,
                            selectspeci = FALSE //�Ƿ�ѡ��
                            ;

                        if (DataGGP.length != 0) {
                            //���
                            Nodes[Muster].speci_li = "";
                            for (k = 0; k < DataGGP.length; k++) {
                                if (DataGGP[k].Chk) { //Ĭ��ѡ�в�Ʒ
                                    selectspeci = TRUE;
                                    Nodes[Muster].speci_li += '<li class="select" title="' + DataGGP[k].SPV + '" IC="' + DataGGP[k].IC + '" YTP="' + DataGGP[k].YTP + '"><span>' + DataGGP[k].SPV + '</span></li>';
                                } else {
                                    Nodes[Muster].speci_li += '<li title="' + DataGGP[k].SPV + '" IC="' + DataGGP[k].IC + '" YTP="' + DataGGP[k].YTP + '"><span>' + DataGGP[k].SPV + '</span></li>';
                                }
                            }

                            //��ɫ
                            //if (_dataGGI[i].FPV != '' && _dataGGI[i].FPV != NULL) {
                            if (selectspeci) {
                                Nodes[Muster].color_li = '<li class="select"><img src="' + _dataGGI[i].GGP[0].IU + '" title="' + _dataGGI[i].GGP[0].Name + '" name="' + _dataGGI[i].GGP[0].Name + '" href="' + Lang.sub(Env.ProductDetail, { itemcode: _dataGGI[i].GGP[0].IC }) + '" /></li>';
                            } else {
                                Nodes[Muster].color_li = '<li><img src="' + _dataGGI[i].GGP[0].IU + '" title="' + _dataGGI[i].GGP[0].Name + '" name="' + _dataGGI[i].GGP[0].Name + '" href="' + Lang.sub(Env.ProductDetail, { itemcode: _dataGGI[i].GGP[0].IC }) + '" /></li>';
                            }
                            Nodes[Muster].color += Nodes[Muster].color_li;
                            //}

                            if (i == 0) {
                                Nodes[Muster].speci += '<ul class="cf">' + Nodes[Muster].speci_li + '</ul>';
                            } else {
                                Nodes[Muster].speci += '<ul class="cf hidden">' + Nodes[Muster].speci_li + '</ul>';
                            }
                        }
                    }

                    //ѡ��
                    if (_dataGG[j].Cancel) {
                        if (pick && curIC) {
                            Nodes[Muster].choose = tmpProSelect;
                        } else {
                            Nodes[Muster].choose = tmpProTrue;
                        }
                    } else {
                        Nodes[Muster].choose = tmpProFalse;
                    }

                    Nodes[Muster].color = Lang.sub(tmpProColor, {
                        iswitch: iswitchNum,
                        color: Nodes[Muster].color
                    });
                    Nodes[Muster].speci = Lang.sub(tmpProSpeci, {
                        speci: Nodes[Muster].speci
                    });
                    Nodes[Muster].goods = Nodes[Muster].choose + Nodes[Muster].detail + Nodes[Muster].price + Nodes[Muster].color + Nodes[Muster].speci;

                    //д��key��itemcode
                    if (_dataGG[j].Cancel) {
                        if (pick && curIC) {
                            Nodes[Muster].fullgifts += Lang.sub(tmpProAProduct, { Aid: _dataMap.AId, IC: curIC, GR: _dataGG[j].GR, Goods: Nodes[Muster].goods });
                        } else {
                            Nodes[Muster].fullgifts += Lang.sub(tmpProAProduct, { Aid: _dataMap.AId, IC: itemcodeNull, GR: _dataGG[j].GR, Goods: Nodes[Muster].goods }); //IC: _dataGG[j].GGI[0].GGP[0].IC
                        }
                    } else {
                        if (pick && curIC) {
                            Nodes[Muster].fullgifts += Lang.sub(tmpProAProduct, { Aid: _dataMap.AId, IC: curIC, GR: _dataGG[j].GR, Goods: Nodes[Muster].goods });
                        } else {
                            Nodes[Muster].fullgifts += Lang.sub(tmpProAProduct, { Aid: _dataMap.AId, IC: itemcodeNull, GR: _dataGG[j].GR, Goods: Nodes[Muster].goods });
                        }
                    }
                }
            }

            Nodes[Muster].prolist += Nodes[Muster].fullgifts;
        },
        /**
         * �Ź� ��Ʒ ������
         * @method _rite_Layer
         * @param headHTML ����ͷ / contHTML �����м� / footHTML ���ڽŵ�
         */
        _rite_Layer: function (headHTML, contHTML, footHTML) {
            var self = this

            self.reviseLayer = new S.Box({
                head: headHTML,
                body: contHTML,
                foot: footHTML,
                width: 940,
                modal: TRUE,
                onload: function (box) {
                    var pNode = box.overlay._posNode,
                        closeNode = pNode.one('.close'),
                        viewiHeight = Nodes['document'].get("viewportRegion").height,
                        boxHeight = parseInt(pNode.one('.yui3-overlay-content').getComputedStyle("height")),
                        itemlist = pNode.one('.J-itemlist'),
                        itemlistHeight = parseInt(itemlist.getComputedStyle("height")),
                        winTop = (viewiHeight - boxHeight) / 2,
                        widgethd = 122; //���������߶�

                    pNode.one('.yui3-overlay-content').addClass('PresentBox');
                    pNode.one('.yui3-widget-hd').setStyles({ 'padding': '0', 'height': 'auto' });
                    pNode.one('.yui3-widget-ft').setStyles({ 'padding': '0', 'margin': '0', 'height': 'auto', 'border': 'none' });
                    pNode.one('.yui3-widget-bd').setStyles({ 'padding': '0' });
                    pNode.one('.yui3-widget-bd').addClass('CommodityList CheapGift');

                    proportion = parseInt((viewiHeight / 5) * 4);

                    if (proportion < (itemlistHeight - widgethd)) {
                        itemlist.setStyles({ 'height': proportion - widgethd, 'overflowY': 'auto' });
                    }

                    if (winTop <= 0) {
                        winTop = 10;
                    }
                    pNode.setStyle('top', winTop);

                    if (!self.swop) {
                        pNode.one('.J-enterLeft').setStyle(DISPLAY, NONE);
                    }

                    //�۸����
                    self._rite_calculate(pNode);

                    //ȡ���Ź� ��Ʒѡ��
                    Nodes[Sel_Return] = pNode.one(Sel_Return);

                    Nodes[Sel_Return].on(E_CLICK, function (e) {
                        self.swop = FALSE;
                        box.close();
                        //self.switchReturn();
                    });

                    //�¼���
                    self._rite_bindEvent(pNode);

                    //�رմ���
                    closeNode.on(E_CLICK, function () {
                        self.swop = FALSE;
                        box.close();
                    });
                }
            }).render();

        },
        /**
         * �¼���
         * @method _rite_bindEvent
         * @param N_Layer ���������Ľڵ�
         */
        _rite_bindEvent: function (N_Layer) {
            var self = this;

            //Nodes[Sel_Reset] = N_Layer.one(Sel_Reset);
            Nodes[Sel_EnterInput] = N_Layer.one(Sel_EnterInput);
            Nodes[Sel_AProduct] = N_Layer.all(Sel_AProduct);
            Nodes[Sel_CheapGift] = N_Layer.all(Sel_CheapGift);
            Nodes[Sel_Choose] = N_Layer.all(Sel_Choose);
            Nodes[Sel_layTip] = N_Layer.one(Sel_layTip);

            Nodes[Sel_EnterInput].insert(Tmpl_Loading, "before");

            Nodes[N_SubmitLoading] = N_Layer.one('.J-Load');
            Nodes[N_SubmitLoading].setStyles({ 'float': 'left', 'display': 'none', 'top': '7px', 'left': 0 });

            //ѡ����Ʒ��ɫ
            self._rite_checkColor(N_Layer)

            //ѡ����Ʒ���
            self._rite_checkSpeci(N_Layer);

            //���õ���input
            N_Layer.delegate(E_CLICK, function (e) {
                var curT = e.target,
                    inputCheck = curT.get(CHECKED),
                    fatBox = curT.ancestor(Sel_AProduct),
                    resetColor = fatBox.all(Sel_SelectColor),
                    resetSpeci = fatBox.all(Sel_SelectSpeci);

                if (!inputCheck) {
                    self._rite_resetAnyone(resetColor, resetSpeci);

                    fatBox.setAttribute(Attr_Itemcode, "");
                    fatBox.setStyle('background', NONE);
                }
                else {
                    self._rite_onlyCheck(N_Layer, fatBox, resetColor, resetSpeci);
                }

                self._rite_calculate(N_Layer); //ͳ�Ƹ������۸�

            }, ".J-choose input");

            //�ύ
            Nodes[Sel_EnterInput].on(E_CLICK, function () {
                self._rite_defineSubmit(N_Layer);
            });

            // Tab��ɫ/���
            Nodes[Sel_AProduct].each(function (that, index) {
                if (that.one(".J-selectColor li") && that.one(".J-speci ul")) {
                    var iswitch = parseInt(that.one(".J-selectColor").getAttribute("iswitch"));
                    new S.Tab(that, { triggersCls: "J-selectColor", panelsCls: "J-selectSpeci", activeTriggerCls: "", triggerType: "click", switchTo: iswitch });
                }
            });
        },
        /**
         * ��������ѡ��,ͳ�Ƹ������۸�
         * @method _rite_calculate
         * @param N_Layer ���������Ľڵ�
         */
        _rite_calculate: function (N_Layer) {
            var self = this,
                several = 0,
                total = 0,
                choInput = N_Layer.all('.J-choose input'),
                iNode = N_Layer.one(Sel_CheckAll);

            choInput.each(function (Node, index) {
                var parNode = Node.ancestor(Sel_AProduct);

                if (Node.get(CHECKED) && parNode.getAttribute(Attr_Itemcode)) {
                    several += 1;
                    total += parseFloat(parNode.one('.lipin3 strong').get('innerHTML').replace(/[^0-9.]/gi, '')); //"��10"
                }
            });

            iNode.one('b').setContent(several); //�޸ĸ���
            iNode.one('strong').setContent(Dols + total); //�޸Ļ����ܼ�
        },
        /**
         * ѡ���м���Ʒ��ɫ
         * @method _rite_checkColor
         * @param N_Layer ���������Ľڵ�
         */
        _rite_checkColor: function (N_Layer) {
            N_Layer.delegate(E_CLICK, function (e) {
                e.halt();
                var curT = e.currentTarget,
                    curImg = curT.one('img'),
                    curRow = curT.ancestor(Sel_AProduct),
                    anyOneInput = curRow.one(Sel_Choose),
                    curOther = curT.siblings(),
                    reSpeci = curRow.all(".J-selectSpeci li"),

                    curSrc = curImg.getAttribute('src'),
                    curHref = curImg.getAttribute('href'),
                    curName = curImg.getAttribute('name'),

                    reDetail = curRow.one('.J-detail'),
                    reDetailGifa = reDetail.one('.gif-img a'),
                    reDetailGifImg = reDetail.one('.gif-img img'),
                    reDetailTitle = reDetail.one('.gif-title a');

                reDetailGifa.setAttribute('href', curHref);
                reDetailGifImg.setAttribute('src', curSrc);
                reDetailTitle.setAttribute('href', curHref);
                reDetailTitle.setContent(curName);

                curOther.each(function (that, index) {
                    that.removeClass(Cls_Select);
                });
                curT.addClass(Cls_Select);

                reSpeci.each(function (that, index) {
                    that.removeClass(Cls_Select);
                });

                if (!anyOneInput.get("disabled")) {
                    curRow.setAttribute(Attr_Itemcode, "");
                }

                if (!anyOneInput.get(CHECKED)) {
                    anyOneInput.set(CHECKED, TRUE);
                }

            }, '.J-selectColor li');
        },
        /**
         * ѡ���м���Ʒ���
         * @method _rite_checkSpeci
         * @param N_Layer ���������Ľڵ�
         */
        _rite_checkSpeci: function (N_Layer) {
            var self = this;

            N_Layer.delegate(E_CLICK, function (e) {
                e.halt();
                var iTarget = e.currentTarget,
                    iSibling = iTarget.ancestor(".J-selectSpeci").all("li"),
                    iProduct = iTarget.ancestor(Sel_AProduct),
                    iColor = iProduct.all(".J-color li"),
                    iInput = iProduct.one(Sel_Choose),
                    iPrice = iProduct.one(".J-price strong"),

                    yPrice = iTarget.getAttribute("YTP"),
                    itemCode = iTarget.getAttribute("IC"),

                    checkPass = FALSE;

                function _updateGood(Delete, Target, Product, Price) {
                    Delete.each(function (that, index) {
                        that.removeClass(Cls_Select);
                    });
                    Target.addClass(Cls_Select);
                    Product.setAttribute(Attr_Itemcode, itemCode);
                    Price.setContent(Dols + yPrice);
                }

                if (!iInput.get(CHECKED)) {
                    iInput.set(CHECKED, TRUE);
                }

                if (iColor.size() > 0) {
                    iColor.some(function (Node, index) {
                        if (Node.hasClass(Cls_Select)) {
                            checkPass = TRUE;
                            return TRUE;
                        }
                    });
                    if (!checkPass) {
                        Nodes[Sel_layTip].setContent('����ѡ����Ʒ��ɫ');
                        Nodes[Sel_layTip].removeClass(HIDDEN);
                        iProduct.setStyle("background", "#fff0f3");
                    } else {
                        _updateGood(iSibling, iTarget, iProduct, iPrice);
                        iProduct.setStyle("background", NONE);
                        Nodes[Sel_layTip].setContent();
                        Nodes[Sel_layTip].addClass(HIDDEN);
                    }
                } else {
                    _updateGood(iSibling, iTarget, iProduct, iPrice);
                    iProduct.setStyle("background", NONE);
                    Nodes[Sel_layTip].setContent();
                    Nodes[Sel_layTip].addClass(HIDDEN);
                }

                self._rite_calculate(N_Layer); //ͳ�Ƹ������۸�

            }, '.J-selectSpeci li');
        },
        /**
         * ��ѡinputʱ,����ɫ��������Ψһ.����ҪĬ��ѡ��
         * @method _rite_onlyCheck
         * @param N_Layer��ǰ���ڸ��ڵ� / pNode��ǰ��Ʒ���ڵ� / cNode��ɫ�� / sNode�����
         */
        _rite_onlyCheck: function (N_Layer, pNode, cNode, sNode) {
            var self = this,
                pass = FALSE;

            if (!cNode._nodes.length && (sNode._nodes.length == 1)) {
                sNode.addClass(Cls_Select);
                pNode.setAttribute(Attr_Itemcode, sNode.item('0').getAttribute('ic'));
                pass = TRUE;
            } else if ((cNode._nodes.length == 1) && (sNode._nodes.length == 1)) {
                cNode.addClass(Cls_Select);
                sNode.addClass(Cls_Select);
                pNode.setAttribute(Attr_Itemcode, sNode.item('0').getAttribute('ic'));
                pass = TRUE;
            }

            if (pass) {
                self._rite_calculate(N_Layer); //ͳ�Ƹ������۸�
            }
        },
        /**
         * ѭ�����ClassName
         * @method _rite_resetAnyone
         * @param nodeColor nodeSpeci �ڵ�
         */
        _rite_resetAnyone: function (nodeColor, nodeSpeci) {
            if (nodeColor) {
                nodeColor.each(function (Node) {
                    Node.removeClass(Cls_Select);
                });
            }

            if (nodeSpeci) {
                nodeSpeci.each(function (Node) {
                    Node.removeClass(Cls_Select);
                });
            }
        },
        /**
         * �ύ��ǰѡ��
         * @method _rite_defineSubmit
         * @param N_Layer �ڵ�
         */
        _rite_defineSubmit: function (N_Layer) {
            var self = this,
                requestLiPin = self._rite_getData();

            if (Nodes[Sel_EnterInput].hasClass(Cls_Ing)) { //��ǰ�����ύ����
                return FALSE;
            }

            if (!self.submitWrong) { //���й��δѡ ����
                return FALSE;
            }

            if (!requestLiPin) { //����ռ�����Ʒ����Ϊ�� ��رմ���
                Nodes[Sel_layTip].setContent("��ʲô��û����ѡŶ!");
                Nodes[Sel_layTip].removeClass(HIDDEN);
                Nodes[Sel_EnterInput].removeClass(Cls_Ing);
                return FALSE;
            } else {
                Nodes[Sel_layTip].addClass(HIDDEN);
            }

            Nodes[Sel_EnterInput].addClass(Cls_Ing);
            Nodes[N_SubmitLoading].setStyle(DISPLAY, INLINEBLOCK);

            if (!self.swop) {
                op = 20; //�޸ĵ�����Ʒ/��ֵ������Ʒ����ʱ����
            } else {
                op = 17; //��ֵ������Ʒѡ��ʱ����
            }

            S.io(window.Env.ShoppingCartV2Ajax, {
                method: 'post',
                data: "op=" + op + "&items=" + requestLiPin, //ֻ���ع��ﳵ���� / false ��ʾ
                on: {
                    success: function (index, req) {
                        var result = req.responseText;
                        result = JSON.parse(result);

                        Nodes[Sel_EnterInput].removeClass(Cls_Ing);
                        Nodes[N_SubmitLoading].setStyle(DISPLAY, NONE); //�Ƴ��������С�״̬

                        self._rite_renewPro(result, N_Layer);
                    },
                    failure: function () {
                        Nodes[Sel_EnterInput].removeClass(Cls_Ing);
                        Nodes[N_SubmitLoading].setStyle(DISPLAY, NONE);
                    }
                }
            });
        },
        /**
         * ��ȡ���ύ����Ʒ��Ϣ
         * @method _rite_getData
         * @return {String} �����ռ����ַ�
         */
        _rite_getData: function () {
            var self = this,
                returnPass = TRUE,
                reqList = '',
                reqResult = '';

            //ѭ��ÿ��ѡ��
            Nodes[Sel_Choose].some(function (that, index) {
                var icheck = that.get(CHECKED), // trueΪ��ѡ��
                    iProduct = that.ancestor(Sel_AProduct),
                    iColor = TRUE,
                    iSpeci = TRUE;

                if (icheck) {
                    var iProduct = that.ancestor(Sel_AProduct),
                        iselect = iProduct.getAttribute(Attr_Itemcode) == '';

                    if (iselect) {
                        var iSelectColor = iProduct.all(Sel_SelectColor),
                            iSelectSpeci = iProduct.one(Sel_SelectSpeci);

                        if (iSelectColor) {
                            iSelectColor.some(function (Node) {
                                if (Node.hasClass(Cls_Select)) {
                                    iColor = FALSE;
                                    return TRUE;
                                }
                            });
                        } else if (iSelectSpeci) {
                            iSelectSpeci.some(function (Node) {
                                if (Node.hasClass(Cls_Select)) {
                                    iSpeci = FALSE;
                                    return TRUE;
                                }
                            });
                        }

                        if (iColor) {
                            Nodes[Sel_layTip].setContent('����ѡ����Ʒ��ɫ');
                            Nodes[Sel_layTip].removeClass(HIDDEN);
                            iProduct.setStyle("background", "#fff0f3");
                            returnPass = FALSE;
                            return TRUE;
                        } else if (iSpeci) {
                            Nodes[Sel_layTip].setContent('����ѡ����Ʒ���');
                            Nodes[Sel_layTip].removeClass(HIDDEN);
                            iProduct.setStyle("background", "#fff0f3");
                            returnPass = FALSE;
                            return TRUE;
                        }
                    }
                }
            });

            //�ռ�ѡ����Ʒ��Ϣ
            if (returnPass) {
                Nodes[Sel_CheapGift].some(function (that, index) {
                    var aProduct = that.all(Sel_AProduct),
                        activity = '',
                        activityId = '',
                        reqPiece = '',
                        reqAllPiece = '';
                    aProduct.some(function (Node, index) {
                        reqAllPiece = '';
                        var nodeInput = Node.one("input"),
                            iDefault = nodeInput.get(Disabled) && nodeInput.get(CHECKED),
                            iSelect = nodeInput.get(CHECKED) && Node.getAttribute(Attr_Itemcode) != '';

                        if (iDefault || iSelect) {
                            var groupNo = Node.getAttribute(Attr_GroupNo),
                                itemcode = Node.getAttribute(Attr_Itemcode);

                            activityId = Node.getAttribute("ActivityId");
                            reqPiece = '{"key": "' + groupNo + '","value": "' + itemcode + '"}' + ",";
                            reqAllPiece += reqPiece;
                        }

                        if (reqAllPiece) {
                            reqList = '{"ActivityId": ' + activityId + ',"GroupItems": [' + reqAllPiece.substring(0, reqAllPiece.length - 1) + ']}' + ",";
                            reqResult += reqList;
                        }
                    });
                });
                self.submitWrong = TRUE;
            } else {
                self.submitWrong = FALSE;
            }

            if (reqResult.length > 0) {
                reqResult = '[' + reqResult.substring(0, reqResult.length - 1) + ']';
                return reqResult;
            } else {
                return "";
            }
        },
        /**
         * �����޸ĵ��Ź�/��Ʒ
         * @method _rite_renewPro
         * @param _data �޸ĵĺ󷵻ص�JSON����
         */
        _rite_renewPro: function (_data, N_Layer) {
            var self = this;

            if (self.swop) { //self.swop ������Ʒ�� �� ��ֵ������� ����

                //�жϵ�ǰ��ֵ�����Ƿ�ɹ�!
                if (!_data.IsSucceed) {
                    self._rite_resetAnything(N_Layer);

                    self._errorTip(_data.Message, function () {
                        window.location.reload(TRUE); //���¼��ص�ǰ���ﳵ
                    });
                    return FALSE;
                }

                var result = _data.ShoppingCartModel,
                    groupItems = result.GroupItems,
                    gifts = [],
                    hasGift = result.HasGift;

                for (var i = 0; i < groupItems.length; i++) {
                    var thatPT = groupItems[i].GP.PT;

                    if (thatPT == 3) {
                        gifts = gifts.concat(groupItems[i].GPro);
                    }
                }

                self.updateAmount(result.TotalModel);
                self.updateGift(gifts, FALSE, hasGift);

                //δ���� ��ѡ ����ʱ,ѡ������Ʒ��ʹ�õ�ʵ�ַ���->������Ⱦҳ��
                //window.fakeData = _data.ShoppingCartModel;

                //Nodes[CommBoxWrap].destroy(TRUE);
                //Nodes[CommBoxWrap] = NULL;
                //Nodes['confirmNode'].purge();

                //Page_Inst = NULL;
                //S.Pages.ShoppingCart = ShoppingCart;
                //S.Pages.ShoppingCart.instance = Page_Inst = new ShoppingCart();

                self._rite_resetAnything(N_Layer);
                return FALSE;
            }

            if (!self.proNode) {
                self._errorTip("�Բ��𣬲���ʧ�ܣ����Ժ����ԣ�", NULL);
                self._rite_resetAnything(N_Layer);

                return FALSE;
            }

            if (!_data.IsSucceed) {
                self._errorTip(_data.Message, NULL);
                self._rite_resetAnything(N_Layer);

                return FALSE;
            }

            //�޸ĵ�ǰ������
            var per2 = self.proNode.one('.th-item'),
                per3 = self.proNode.one('.th-price'),
                per4 = self.proNode.one('.th-sum'),
                property = '';

            for (var i = 0; i < _data.IM.MaP.length; i++) {
                property += Lang.sub(tmpPRS, _data.IM.MaP[i]);
            }

            self.proNode.setAttribute(Attr_Itemcode, _data.IM.IC);

            per2.one('.pro-title a').setContent(_data.IM.NM);
            per2.one('.pro-img a').setAttribute('title', _data.IM.NM);
            per2.one('.pro-img img').setAttribute('src', _data.IM.SRC);
            per2.one('.pro-check') && per2.one('.pro-check').setContent(property);
            per3.one('.pro-price em').setContent(_data.IM.YTP);
            per4.setContent(_data.IM.Points);

            self._rite_resetAnything(N_Layer);
        },
        /**
         * �����޸ĵ��Ź�/��Ʒ ����ر�������
         * @method _rite_resetAnything
         * @param that {Node}
         */
        _rite_resetAnything: function (that) {
            var self = this;

            self.swop = FALSE;
            that.purge(TRUE);
            self.reviseLayer.close();
            self.proNode = NULL;
        },
        /**
         * ��ʾ����
         * @method _errorTip
         * @param Text ��ʾ�ı�
         */
        _errorTip: function (Text, fn) {
            new S.Box.alert(Text, fn, { title: '��ܰ��ʾ', draggable: TRUE, modal: TRUE });
        },
        /**
         * �ղؼ� - ��ȡ�ղ���Ʒ�б�����
         * @method _treasure_send
         * @param page ҳ��  / count ����
         */
        _treasure_send: function (page, count) {
            var self = this;

            if (!page) {
                var page = 1;
            }

            if (!count) {
                var count = 60;
            }

            S.jsonp(Env.FavoriteList + '?pn=' + page + '&ps=' + count + '&callback={callback}', function (result) {
                if (result.Gpro && result.Gpro.length > 0) {
                    self.bfdRecommend({ "label": "�ҵ��ղ�", "prods": result, 'queryTag': 'treasure' }, TRUE);
                }
            });
        },
        /**
         * ѡ����ʲô��Ʒ - ��ȡ�û�ѡ���Ʒ����ز���
         * @method _inter_checkPro
         * @param stort {Number} ����1Ϊ������Ʒ���ݼ�,2�Ƿ���ɾ����Ʒ�����ݼ�
         */
        _inter_checkPro: function (stort, checkNode) {
            var self = this,
                chcekLab = Nodes[CommBoxWrap].all('.J-SelectPro'),
                checkCun = chcekLab.size(),
                checkNum = 0,
                delManyNode = [],
                delManyDeta = [],
                delManyPost = '';

            if (stort == 1) {
                var _ET = checkNode,
                    proTr = _ET.ancestor(Sel_AProduct),
                    proDetail = self._inter_checkDate(_ET, proTr),

                    delManyPost = proDetail;
            }

            for (var i = 0; i < checkCun; i++) {
                var pass = chcekLab.item(i).hasClass(CHECKED);
                if (pass) {
                    checkNum += 1;

                    if (stort == 2 || stort == 3) {
                        var _ET = chcekLab.item(i),
                            proTr = _ET.ancestor(Sel_AProduct),
                            proDetail = self._inter_checkDate(_ET, proTr),
                            IDs = proDetail.evtid.split('%2B'),
                            paramID = "ItemCode";

                        if (stort == 2) {
                            delManyPost += '{"' + paramID + '":"' + proDetail.sku + '","Qty":' + proDetail.num + ',"PromotionId":' + IDs[0] + ',"PromotionType":' + IDs[1] + '},';
                            delManyNode.push(proTr);
                            delManyDeta.push(proDetail);
                        } else if (stort == 3) {
                            if (IDs[1] != 9) {
                                delManyPost += '{"' + paramID + '":"' + proDetail.sku + '","Qty":' + proDetail.num + ',"PromotionId":' + IDs[0] + ',"PromotionType":' + IDs[1] + '},';
                                delManyNode.push(proTr);
                                delManyDeta.push(proDetail);
                            }
                        }
                    }
                }
            }

            switch (stort) {
                case 1:
                    return {
                        number: checkNum,
                        prdate: checkNum > 0 ? delManyPost : []
                    }
                    break;
                case 2:
                    return {
                        number: checkNum,
                        delList: checkNum > 0 ? ('[' + delManyPost.substring(0, delManyPost.length - 1) + ']') : [],
                        delNode: delManyNode,
                        delDeta: delManyDeta
                    }
                    break;
                case 3:
                    return {
                        number: checkNum,
                        delList: checkNum > 0 ? ('[' + delManyPost.substring(0, delManyPost.length - 1) + ']') : [],
                        delNode: delManyNode,
                        delDeta: delManyDeta
                    }
                    break;
            }
        },
        /**
         * ѡ����Ʒ - ��ȡ�û�ѡ���Ʒ����ϸ����
         * @method _inter_checkDate
         * @param thisNode {Node} ��ǰѡ��Ľڵ�, pareNode {Node} ��ǰѡ��ĸ��ڵ�
         * @param return {JSON} ��Ʒ���ݼ�
         */
        _inter_checkDate: function (thisNode, pareNode) {
            var _ET = thisNode,
                proTr = pareNode,
                proInput = proTr.one('input.pro-nums'),
                proNumber = proTr.one('.pro-number'),

                proItemCode = proTr.getAttribute('itemcode'),
                proItemHTML = proTr.one('.pro-title a').get('innerHTML'),
                proItemURL = proTr.one('.pro-title a').get('href'),
                proItemPrice = proTr.one('.pro-price strong em').get('innerHTML'),
                proItemNum = NULL,
                proItemEvtid = proTr.getAttribute('evtid'),

                proDetail = {};

            if (proInput) {
                proItemNum = proInput.get('value');
            } else {
                proItemNum = parseInt(proNumber.get('innerHTML'));
            }

            proDetail = {
                "sku": proItemCode,
                "title": proItemHTML,
                "url": proItemURL,
                "price": proItemPrice,
                "num": proItemNum,
                "evtid": proItemEvtid
            };

            return proDetail;
        },
        /**
         * �Ƽ�����Ȥ��Ʒ - ��ȡ��ǰ��Ʒ������
         * @method _inter_getInterDate
         * @param sku ��ƷItemCode
         */
        _inter_getInterDate: function (sku) {
            var self = this;

            self.clickFinish = TRUE;

            S.jsonp(Env.InterestedAddToCart + "?&ItemCode=" + sku + "&callback={callback}" + "&random=" + Math.random(), {
                on: {
                    success: function (date) {
                        var result = date;

                        self._inter_Rendering(result);
                        self.clickFinish = FALSE;
                    },
                    failure: function () {
                        self.clickFinish = FALSE;
                        var loading = Nodes[Sel_Interested].one('.J-Load');
                        loading && loading.remove();
                    }
                }
            });
        },
        /**
         * �Ƽ�����Ȥ��Ʒ - ��Ⱦ��ɫ��ߴ絯����
         * @method _inter_Rendering
         * @param result{JSON} ��Ʒ��ɫ��ߴ�����
         */
        _inter_Rendering: function (result) {
            var self = this,
                proColor = result.WareColor,
                proSize = result.WareSize,
                colorCount = proColor.length,
                sizeCount = proSize.length,
                colorPass = FALSE,
                sizePass = FALSE,
                colorHTMl = '',
                sizeHTML = '',
                proNodeHTML = '<div class="pro-det-box">' +
                    '<div class="pro-det-main J-DetMain">' +
                    '<h3 class="fordetails">��ѡ����Ʒ��Ϣ</h3>' +
                    '<div class="forcolor cf">' +
                    '<span class="color-name">��ɫ��</span>' +
                    '<div class="color-list J-colorList cf">' +
                    '</div>' +
                    '</div>' +
                    '<div class="forsize cf">' +
                    '<span class="size-name">���</span>' +
                    '<div class="size-list J-sizeList cf">' +
                    '</div>' +
                    '</div>' +
                    '<div class="fortips J-errorTip"></div>' +
                    '<div class="foradd">' +
                    '<span class="enter-add"><a href="javascript:void(0)" class="J-addToCart">ȷ��</a></span>' +
                    '</div>' +
                    '<span class="forclose J-close"></span>' +
                    '</div>' +
                    '</div>';

            if (colorCount == 0 && sizeCount == 0) {
                self._inter_addToCart(self.interSKU);

                return FALSE;
            }

            self.proNodeHTML = S.Node.create(proNodeHTML);

            var N_DetMain = self.proNodeHTML.one('.J-DetMain'),
                N_ColorListNode = self.proNodeHTML.one('.J-colorList'),
                N_SizeListNode = self.proNodeHTML.one('.J-sizeList'),
                fullErrorNode = self.proNodeHTML.one('.J-errorTip'),
                loading = Nodes[Sel_Interested].one('.J-Load');

            loading && loading.remove();

            if (colorCount > 0) {

                colorPass = TRUE;

                for (var i = 0; i < colorCount; i++) {
                    colorHTMl += '<span class="' + ((i == 0) ? "cursor" : "") + '"><img src="' + proColor[i].SRC + '" title="" /><i></i></span>';
                }
            } else {
                N_ColorListNode.addClass(HIDDEN);
            }

            if (sizeCount > 0) {

                sizePass = TRUE;

                for (var k = 0; k < sizeCount; k++) {
                    var size = proSize[k].Count,
                        copyHTML = '';

                    for (var j = 0; j < size.length; j++) {
                        var copy = size[j];
                        copyHTML += '<span title="' + copy.NAME + '" class="' + ((j == 0) ? "cursor" : "") + '" itemcode="' + copy.SKU + '">' + copy.NAME + '<i></i></span>';
                    }

                    sizeHTML += '<div class="' + ((k == 0) ? "" : HIDDEN) + '">' + copyHTML + '</div>';
                }
            } else {
                N_SizeListNode.addClass(HIDDEN);
            }

            if (!colorPass) {
                N_ColorListNode.get('parentNode').setContent();
            } else {
                N_ColorListNode.setContent(colorHTMl);
            }

            if (!sizePass) {
                N_SizeListNode.get('parentNode').setContent();
            } else {
                N_SizeListNode.setContent(sizeHTML);
            }

            Nodes['.J-InterOpaque'].removeClass(HIDDEN);
            Nodes[Sel_Interested].append(self.proNodeHTML);

            var N_SizeNode = N_SizeListNode.all('span');

            //�������� - �л��¼�
            if (colorCount > 1) {
                new S.Tab(N_DetMain, { triggersCls: "J-colorList", panelsCls: "J-sizeList", activeTriggerCls: "cursor", triggerType: E_CLICK });
            }

            //�������� - ��ɫ ����ѡ��
            N_ColorListNode.delegate(E_CLICK, function (e) {
                N_SizeNode.removeClass('cursor');
                fullErrorNode.setContent();
            }, 'span');

            //�������� - �ߴ� ����ѡ��
            N_SizeListNode.delegate(E_CLICK, function (e) {
                var thisNode = e.currentTarget;

                N_SizeNode.removeClass('cursor');
                thisNode.addClass('cursor');
                fullErrorNode.setContent();
            }, 'span');
        },
        /**
         * ����Ȥ��Ʒ - ���빺�ﳵ
         * @method _inter_addToCart
         * @param itemCode ��Ʒsku���
         */
        _inter_addToCart: function (itemCode) {
            var self = this,
                para = { op: 1, itemcode: itemCode, qty: 1, st: 1, instant: 0 };

            self.clickFinish = TRUE;

            S.jsonp(Env.ShoppingCartV2Ajax + "?" + S.QueryString.stringify(para) + "&random=" + Math.random() + "&callback={callback}", {
                on: {
                    success: function (request) { //{"cartid":0,"code":"0:��ͨ��Ʒ����ʧ�ܣ�1:��ͨ��Ʒ����ɹ���2:��������ɹ���3:��������ʧ��","money":706.00,"num":1,msg��""}
                        var result = request,
                            pass = FALSE,
                            fullErrorNode = null,
                            loading = null;

                        loading = Nodes[Sel_Interested].one('.J-Load');
                        loading && loading.remove();

                        self.clickFinish = FALSE;

                        //��ӹ��ﳵʧ�ܴ���
                        if (self.proNodeHTML) {
                            fullErrorNode = self.proNodeHTML && self.proNodeHTML.one('.J-errorTip');

                            if (result.code == 0 || result.Status == 0) {
                                fullErrorNode.setContent('<p>' + (result.msg || result.MSG) + '</p>');
                                return FALSE;
                            }

                            if (result.code == 1 || result.code == 2) {
                                fullErrorNode.setContent('<p>���빺����ɹ�����Ŭ������ҳ��...</p>');
                                pass = TRUE;
                            }
                        } else {
                            if (result.code == 0 || result.Status == 0) {
                                self._errorTip((result.msg || result.MSG), null);
                                return FALSE;
                            }

                            if (result.code == 1 || result.code == 2) {
                                pass = TRUE;
                            }
                        }

                        if (pass) {
                            window.location.reload(FALSE);
                        }

                        self.proNodeHTML && self.proNodeHTML.remove();
                        Nodes['.J-InterOpaque'] && Nodes['.J-InterOpaque'].addClass(HIDDEN);
                    },
                    failure: function () {
                        var loading = Nodes[Sel_Interested].one('.J-Load');
                        loading && loading.remove();

                        self._errorTip("���ʧ�ܣ����Ժ����ԡ�", null);
                        self.clickFinish = FALSE;
                        self.proNodeHTML && self.proNodeHTML.remove();
                        Nodes['.J-InterOpaque'].addClass(HIDDEN);
                    }
                }
            });
        },
        /**
         * �ٷֵ��Ƽ�������
         * @method bfdReq
         */
        bfdReq: function () {
            var self = this;

            //��ѯ�ȴ�
            if (typeof ($BFD_Core) == "function" && typeof ($BFD_Core.Recommend) == "function") {
                $BFD_Core.Recommend();

                //�ղؼ� - �����ղ���Դ
                if (self.isLogin()) {
                    self._treasure_send();
                }
            } else {
                if (self.bfdTimerCount < 10) {
                    self.bfdTimerCount++;
                    setTimeout(function () {
                        self.bfdReq();
                    }, 500);
                }
            }
        },
        /**
         * �ٷֵ��Ƽ���Ϣ��ʾ
         *
         * @method bfdRecommend
         * @param {Array} data ���� {label:"�����ֿ�",prods:[],queryTag:"bfd_e"}
         */
        bfdRecommend: function (data, category, boon) {
            var self = this,
                tabTit = data.label,
                queryTag = data.queryTag,
            //query = "from=" + queryTag,
                prods = data.prods;

            if (!Nodes[Sel_Interested]) {
                return FALSE;
            }

            if (!prods) {
                return FALSE;
            }

            if (queryTag == 'treasure') {
                prods = data.prods.Gpro;
            }
            var N_TitleNode = Nodes[Sel_Interested].one('.J-InterTitle .' + queryTag),
                N_ImainNode = Nodes[Sel_Interested].one('.J-InterMian .' + queryTag),
                attrsrc = "src",
                stockNode = '',
                parenHTML = '<span class="inter-prev eva-switchable-prev"><a href="javascript:void(0)"></a></span>' +
                    '<span class="inter-next eva-switchable-next"><a href="javascript:void(0)"></a></span>' +
                    '<div class="inter-list scroller J-InterList">' +
                    '<ul class="inter-list-mian eva-switchable-panels cf" id="J_BFD_' + queryTag + '">{fullTxt}</ul>' +
                    '</div>',
                stockHTML = '<li itemcode="{sku}">' +
                    '<div class="inter-pro-pic">' +
                    '<a target="_blank" onclick="{bfd}" href="{url}"><img alt="{title}" {attrsrc}="{src}"></a>' +
                    '</div>' +
                    '<p class="inter-pro-txt"><a onclick="{bfd}" href="{url}" target="_blank">{title}</a></p>' +
                    '<p class="inter-pro-dis"><strong>��{price}</strong></p>' +
                    '<div class="inter-pro-add"><a class="c-lbtn J-interAdd" href="javascript:void(0)">���빺���</a></div>' +
                    '</li>';

            for (var i = 0; i < prods.length; i++) {

                if (i > 5) {
                    attrsrc = "data-src";
                }

                if (queryTag == 'treasure') {
                    var imgSrc = prods[i].SRC.replace(/\/smallimage\//i, "/NormalImage/"); //�滻ͼƬ��С

                    stockNode += Lang.sub(stockHTML, {
                        'sku': prods[i].IC,
                        'url': prods[i].LK,
                        'bfd': '',
                        'attrsrc': attrsrc,
                        'src': imgSrc,
                        'title': prods[i].NM,
                        'price': prods[i].YTP
                    });
                } else {
                    var href = self.delUrlQuery(prods[i].url, 'from', queryTag);
                    //href = prods[i].url.replace(/[?|&]?from=[^&]*&?/i, ""), //�Ƴ������е�from��Ϣ
                    //href = href.indexOf("?") > -1 ? href + "&" + query : href + "?" + query,
                    imgSrc = prods[i].img; //.replace(/\/smallimage\//i, "/NormalImage/"); //�滻ͼƬ��С

                    stockNode += Lang.sub(stockHTML, {
                        'sku': prods[i].iid,
                        'bfd': '$BFD.bind(\'' + prods[i].iid + '\', ' + (i + 1) + ')',
                        'url': href,
                        'attrsrc': attrsrc,
                        'src': imgSrc,
                        'title': prods[i].name,
                        'price': prods[i].price
                    });
                }
            }

            if (stockNode) {
                N_ImainNode.destroy();
                N_ImainNode = Nodes[Sel_Interested].one('.J-InterMian .' + queryTag);

                N_TitleNode.setContent(tabTit + '<i></i>').removeClass(HIDDEN);
                N_ImainNode.setContent(Lang.sub(parenHTML, { 'fullTxt': stockNode })).removeClass(HIDDEN);

                self.bfdBindEvnet(N_ImainNode);

                var clearTime = setTimeout(function () {
                    clearTimeout(clearTime);

                    //if (queryTag == 'treasure') {
                    //    var tabspan = Nodes[Sel_Interested].all('.J-InterTitle span'),
                    //        tabmain = Nodes[Sel_Interested].all('.J-InterMian .inter-solo');

                    //    tabspan.each(function (curNode, index) {
                    //        curNode.removeClass('cursor').removeClass('none');
                    //    });

                    //    tabmain.each(function (curNode, index) {
                    //        curNode.setStyle(DISPLAY, NONE);
                    //    });

                    //    tabspan.item(3).addClass('none cursor');
                    //    tabmain.item(3).setStyle(DISPLAY, BLOCK);
                    //}

                    Nodes[Sel_Interested].removeClass(HIDDEN);

                }, 200);
            }
        },
        /**
         * �ٷֵ����� ��ȡ�� �Ƽ�����Ȥ��Ʒ �¼���
         *
         * @method bfdBindEvnet
         * @param ��
         */
        bfdBindEvnet: function (thisNode) {
            var self = this,
                thisNode = thisNode,
                count = 0;

            if (!thisNode) {
                return FALSE;
            }

            count = thisNode.all('.J-InterList li').size();

            if (count > 5) {

                thisNode.plug([
                    { fn: S.Plugin.Carousel, cfg: { interval: 4, autoplay: FALSE, circular: TRUE, steps: 5, viewSize: [870] } },
                    { fn: S.Plugin.SwitchableEffect, cfg: { effect: "scrollX", relateType: "carousel", easing: "easeOutStrong", duration: 1 } }
                ]).carousel.on('switch', function (e) {
                        var N_PrevBtn = thisNode.one('.inter-prev'),
                            N_NextBtn = thisNode.one('.inter-next');

                        var tabPannel = thisNode.one("ul");
                        if (tabPannel != null) {
                            //ͼƬ�ӳټ���
                            if (!self.YT_lazyLoad) {
                                self.YT_lazyLoad = new S.DataLazyLoader();
                            }
                            self.YT_lazyLoad.loadCustomLazyData(tabPannel, "img-src");
                        }

                        if (N_PrevBtn && N_PrevBtn.hasClass('eva-switchable-disable-btn')) {
                            N_PrevBtn.addClass('featured-prev');
                        } else {
                            N_PrevBtn.removeClass('featured-prev');
                        }
                        if (N_NextBtn && N_NextBtn.hasClass('eva-switchable-disable-btn')) {
                            N_NextBtn.addClass('featured-next');
                        } else {
                            N_NextBtn.removeClass('featured-next');
                        }
                    });

                thisNode.all('.eva-switchable-triggers li').each(function (Node, index) {
                    Node.setContent("?").setStyle(VISIBILITY, VISIBLE);
                });

            } else {
                var N_PrevBtn = thisNode.one('.inter-prev'),
                    N_NextBtn = thisNode.one('.inter-next');

                N_PrevBtn && N_PrevBtn.addClass('featured-prev');
                N_NextBtn && N_NextBtn.addClass('featured-next');
            }
        },
        /**
         * ת��������ʽ
         * @method escapeReg
         */
        _escapeRegexRe: function (str) {
            return str.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), "\\\x241");
        },
        /**
         * ɾ��URLָ���Ĳ���
         * @method delUrlQuery
         * @param url {String} ��ַ
         * @param key {String} ��Ҫɾ���Ĳ�������
         * @param content {String} �滻������
         */
        delUrlQuery: function (url, key, content) {
            var self = this,
                fullUrl = '',
                word = self._escapeRegexRe(key),
                reg = new RegExp("((\\?)(" + word + "=[^&]*&)+(?!" + word + "=))|(((\\?|&)" + word + "=[^&]*)+$)|(&" + word + "=[^&]*)", "g"),
                searchUrl = url.replace(reg, "$2");
            if (content) {
                if (searchUrl.indexOf('?') > 0) {
                    fullUrl = searchUrl + '&' + key + '=' + content;
                } else {
                    fullUrl = searchUrl + '?' + key + '=' + content;
                }
            } else {
                fullUrl = searchUrl;
            }

            return fullUrl;
        },
        /**
         * �ж��û��Ƿ��¼
         *
         * @method isLogin
         * @param return ����ֵ
         */
        isLogin: function () {
            return window.UI_header.getUserNN();
        },
        /**
         * ��ʱ���ӵ�[�����]ƥ��Ӻ�
         * @method _loveSale
         * @param ��
         * @param null
         */
        _loveSale: function () {
            var titleNode = Nodes[CommBoxWrap].all('.AProduct .pro-title a');

            titleNode.each(function (thisNode, index) {
                var titleText = '';

                if (thisNode) {
                    titleText = thisNode.getHTML();
                }

                if (titleText) {
                    titleText = titleText.replace('[�����]', '<font style="color:#e5004f">[�����]</font>');
                    thisNode.setContent(titleText);
                }
            });
        },
        /**
         * ɾ����ƷGAͳ��
         */
        gaRemoveProduct: function () {
            if (typeof proxy_ga_removeProduct != undefined) {
                proxy_ga_removeProduct();
            }
        },
        /**
         * �����Ż�ȯGAͳ��
         */
        gaActiveaCoupons: function () {
            if (typeof proxy_ga_activateCoupons != undefined) {
                proxy_ga_activateCoupons();
            }
        },
        /**
         * �ύ����GAͳ��
         */
        gaSettlement: function () {
            if (typeof proxy_ga_settlement != undefined) {
                proxy_ga_settlement();
            }
        },
        /**
         * �����ͳ��
         * @method directLogin
         * @param ������
         * �����ղ�--��Ʒ��ţ�moveToCollection,{��Ʒ���}
         * ɾ����Ʒ--��Ʒ��ţ�delProd,{��Ʒ���}
         * ��չ�����������ﳵId��clearCart����,{���ﳵId}
         * �����Ż�ȯ-- actCoupon
         * ʹ���Ż�ȯ-- useCoupon
         */
        _clk_common: function (eventType, params) {
            if (typeof _clk != 'undefined' && typeof _clk.common.sendEventRequest != 'undefined') {
                _clk.common.sendEventRequest(eventType, params);
            }
        },
        getCookieParam: function (name, cookie) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = cookie.match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        }
    }

    S.Pages.ShoppingCart = ShoppingCart;
    S.Pages.ShoppingCart.instance = Page_Inst = new ShoppingCart();
});
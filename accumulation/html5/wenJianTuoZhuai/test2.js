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

//������Ʒ
if (promTips.PT == 3) {
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

    var prospeNode = S.Node.create('<div class="pro-spec-bt"></div>' +
        '<div class="pro-spec">' +
        '<span class="pro-spec-tit">����</span>' +
        '<span class="pro-spec-txt">��������,�뾡���ύ����,</span>' +
        '<span class="pro-spec-time" start="' + start + '" end="' + end + '">����ʱ00��00Сʱ00��00��</span>' +
        '</div>');

    Nodes[dataEvtID].tr[j].one('.pro-pro').append(prospeNode);
    proSpeArr.push(Nodes[dataEvtID].tr[j].one('.pro-pro').one('.pro-spec'));
}


if (isGiftGroup && j > 0) {
    Nodes[dataEvtID].tr[0].one('.th-item').append(Nodes[dataEvtID].tr[j]);
} else {
    Nodes[dataEvtID].table.append(Nodes[dataEvtID].tr[j]);
}
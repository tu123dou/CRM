//->获取所有的客户信息,然后展示在页面上guo
~(function () {
    var content = document.getElementById('content');

    //->SEND AJAX GET DATA
    ajax({
        url: '/getAllList',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: function (result) {
            if (result && result.code == 0) {
                bindHTML(result.data);
            }
        }
    });

    //->BIND HTML
    function bindHTML(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var cur = data[i];
            str += '<li>';
            str += '<span>' + cur.id + '</span>';
            str += '<span>' + cur.name + '</span>';
            str += '<span>';
            str += '<a href="detail.html?id=' + cur.id + '">修改</a>';
            str += '<a href="javascript:;" data-id="' + cur.id + '">删除</a>';//->开始绑定的时候,就把客户的ID存储到自定义属性上,这样后期点击的时候想知道它代表哪个客户的话,直接获取自定义属性值即可->"自定义属性的应用"
            str += '</span>';
            str += '</li>';
        }
        content.innerHTML = str;
    }

    //->使用事件委托实现删除操作
    content.onclick = function (e) {
        e = e || window.event;
        var tar = e.target || e.srcElement,
            tarTag = tar.tagName.toUpperCase();
        if (tarTag === 'A' && tar.innerHTML === '删除') {
            //->ALERT:提示框-只有确定按钮
            //->CONFIRM:确认提示框-有确定和取消两个按钮
            //->PROMPT:在确认的基础上增加输入的操作-可填写操作的原因
            //扩展:回去后可以搜索一些提示框组件插件(jquery dialog...),也可以自己封装一套可扩展的,样式好看的弹出框插件
            var customId = tar.getAttribute('data-id'),
                flag = window.confirm('确定要删除编号为 [ ' + customId + ' ] 的客户吗?');
            //->[确定]通过API接口文档,向服务器发送请求,告诉服务器删除谁,服务器把最后的结果告知客户端,如果删除成功的话,我们在页面中把这一条记录移除即可
            if (flag) {
                ajax({
                    url: '/removeInfo?id=' + customId,
                    type: 'get',
                    dataType: 'json',
                    success: function (result) {
                        if (result && result.code == 0) {
                            content.removeChild(tar.parentNode.parentNode);
                        }
                    }
                });
            }
        }
    }
})();

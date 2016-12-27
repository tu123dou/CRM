~function (pro) {
    //->queryURLParameter:解析URL地址中问号传递的参数值的 例如：'http://localhost/detail.html?id=2&lx=10' ->{id:2,lx:10}
    function queryURLParameter() {
        var reg = /([^?&=#]+)=([^?&=#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }
    pro.queryURLParameter = queryURLParameter;
}(String.prototype);

~function () {
    var userName = document.getElementById('userName'),
        submit = document.getElementById('submit');

    //->获取当前页面的URL地址,然后把问号传递过来的参数值获取到
    var curURL = window.location.href;
    console.log(curURL);
    var urlObj = curURL.queryURLParameter();
    var customId = urlObj['id'];

    //->如果当前的操作是修改的话,我们需要首先把ID对应的客户信息获取到,然后展示在对应的文本框中
    if (typeof customId !== 'undefined') {
        ajax({
            url: '/getInfo?id=' + customId,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result && result.code == 0) {
                    userName.value = result["data"]["name"];
                }
            }
        });
    }

    //->提交
    submit.onclick = function () {
        //->获取文本框中的内容
        var value = userName.value;

        //->[修改]
        if (typeof customId !== 'undefined') {
            ajax({
                url: '/updateInfo',
                type: 'post',
                dataType: 'json',
                data: {id: customId, name: value},
                success: function (result) {
                    if (result && result.code == 0) {
                        window.location.href = 'http://localhost/index.html';
                    }
                }
            });
            return;
        }
        //->[增加]按照API要求把内容传递给服务器,并接受返回结果:返回的是成功则跳转回到首页,失败给予相关的提示即可
        ajax({
            url: '/addInfo',
            type: 'post',
            dataType: 'json',
            data: {name: value},
            success: function (result) {
                if (result && result.code == 0) {
                    //->JS中页面跳转的方式:window.location.href
                    window.location.href = 'index.html';
                }
            }
        });
    }
}();
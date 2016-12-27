var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->资源文件请求处理
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/html';
        suffix === 'CSS' ? suffixMIME = 'text/css' : (suffix === 'JS' ? suffixMIME = 'text/javascript' : 'text/html');
        var conFile = 'i am sorry',
            status = 404;
        try {
            conFile = fs.readFileSync('.' + pathname, 'utf-8');
            status = 200;
        } catch (e) {

        }
        res.writeHead(status, {'content-type': suffixMIME + ';charset=utf-8;'});
        res.end(conFile);
        return;
    }

    //->API
    //->获取所有的客户信息,并且把其转换为JSON格式的对象,方便后面的操作
    var customData = fs.readFileSync('./json/custom.json', 'utf-8');
    customData = JSON.parse(customData);
    var result = {
        code: 1,
        msg: 'error'
    };

    //->返回全部的客户信息
    if (pathname === '/getAllList') {
        if (customData.length > 0) {
            result = {
                code: 0,
                msg: 'success',
                data: customData
            };
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));//可以把JSON.stringify去掉
        return;
    }

    //->返回指定的客户信息
    if (pathname === '/getInfo') {
        var customId = query['id'];//->获取客户端传递的客户ID
        customData.forEach(function (item, index) {
            if (item['id'] == customId) {
                result = {
                    code: 0,
                    msg: 'success',
                    data: item
                };
            }
        });
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    //->增加客户信息
    if (pathname === '/addInfo') {
        //->接收客户端传递的内容:客户端是通过请求主体(POST)把数据传递过来的,所以我们不能依托于QUERY来获取了
        //->req.on('data',[function]) 正在接收请求主体内容
        //->req.on('end',[function])  请求主体内容已经接收完成
        var passData = '';
        req.on('data', function (chunk) {
            passData += chunk;
        });
        req.on('end', function () {
            //->传递进来的值只有NAME,没有ID,我们需要根据当前的数据自动给其生成一个ID:让目前最大的ID在原来的基础上加1即可(如果之前一个都没有,我的ID则为1即可)
            passData = JSON.parse(passData);
            passData['id'] = customData.length === 0 ? 1 : parseFloat(customData[customData.length - 1]['id']) + 1;
            customData.push(passData);

            //->此时customData存储了原来的和最新的,我们把最新的数据重新的写入到存储数据的文件中即可
            fs.writeFileSync('./json/custom.json', JSON.stringify(customData), 'utf-8');

            //->返回结果即可
            result = {
                code: 0,
                msg: 'success'
            };
            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify(result));
        });
    }
});
server1.listen(80, function () {
    console.log('hello world 80!');
});
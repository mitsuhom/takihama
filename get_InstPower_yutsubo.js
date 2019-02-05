'use strict'
var fs = require('fs');
var http = require('http');
// スマートメーターBルート活用サービス(以下、SMBA)のAPIに接続する
var http = require('https');
var host = 'api.pms.iij.jp';
var request = http.get({
    "host" : host,
    "port" : 443,
    "path" : "/external_api/v1/bwd_int_power/pss63035513",
    "auth" : "78bd315b-fa20-49a3-a2c8-9f8462a8d94b:8d955a77f3d707876736df631f650893689dd4c5e4897f5a2fcf5f9fb9f02251"
  },
  function(response) {
    var body = "";
    response.setEncoding('utf8');
    response.on('data', function(chunk){
      body += chunk;
    });
    response.on('end', function(response){
     // 最新の値だけ取得する
     var rcvData = JSON.parse(body);
     var lastValue = (rcvData[rcvData.length-4].value - rcvData[rcvData.length-5].value);

     // Machinistに送信するデータを作成
     var toStrObj = {};
     toStrObj.agent_id = "44a481fe-8153-4f36-a60e-0333d5775b52";
     toStrObj.api_key = "26921b1b869cfb16";
     toStrObj.metrics = [{namespace : "ID-0008",
                  name : "Inst Power", value : lastValue}];

     // JSON形式に変換し、tmpという一時ファイルに保存する
     var toStr = JSON.stringify(toStrObj);
     fs.writeFile("yutsubo", toStr, function (err) {
       if (err) {
         console.log(err.message);
       }
      });
    });
  }
);
request.on('error', function(e){
  console.log(e);
})
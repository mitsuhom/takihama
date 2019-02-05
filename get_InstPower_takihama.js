'use strict'
var fs = require('fs');
var http = require('http');
// �X�}�[�g���[�^�[B���[�g���p�T�[�r�X(�ȉ��ASMBA)��API�ɐڑ�����
var http = require('https');
var host = 'hv-api.pms.iij.jp';
var request = http.get({
    "host" : host,
    "port" : 443,
    "path" : "/external_api/v1/active_power/dss63035490",
    "auth" : "cd017593-36e1-492d-b898-6c90c3f8e5b5:8a0a547fde069673bc026720bfb7c2751771159c9a3130c57e160cfd9875cdb5"
  },
  function(response) {
    var body = "";
    response.setEncoding('utf8');
    response.on('data', function(chunk){
      body += chunk;
    });
    response.on('end', function(response){
     // �ŐV�̒l�����擾����
     var rcvData = JSON.parse(body);
     var lastValue = (rcvData[rcvData.length-4].value - rcvData[rcvData.length-5].value);

     // Machinist�ɑ��M����f�[�^���쐬
     var toStrObj = {};
     toStrObj.agent_id = "8c766f56-bc7f-4646-8a70-96b9ef7d3e62";
     toStrObj.api_key = "26921b1b869cfb16";
     toStrObj.metrics = [{namespace : "ID-0010",
                  name : "Active Power", value : lastValue}];

     // JSON�`���ɕϊ����Atmp�Ƃ����ꎞ�t�@�C���ɕۑ�����
     var toStr = JSON.stringify(toStrObj);
     fs.writeFile("takihama", toStr, function (err) {
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
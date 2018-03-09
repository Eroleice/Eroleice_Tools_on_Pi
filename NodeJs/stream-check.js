const request=require('request');
const fs=require('fs');

const streamer_list = {
	"夏小木":{
		"plat":"huya",
		"api":"http://roomapicdn.plu.cn/room/roomstatus?roomid=2290816&lzv=1",
		"id":2290816,
		"url":"http://star.longzhu.com/2584782"
	},
	"夜樱":{
		"plat":"bilibili",
		"api":"http://api.live.bilibili.com/room/v1/Room/get_info?room_id=73603&from=room",
		"id":73603,
		"url":"http://live.bilibili.com/73603"
	}
};

console.log("开始抓取......");

for (var name in streamer_list){
	/* 挨个抓取直播间信息 */
	getData(name,streamer_list[name]["plat"],streamer_list[name]["id"],function(_name,_ret){
		/* 获得返回信息 */
		var json = JSON.stringify(_ret);
		/* 写入json存档 */
		fs.writeFile("/home/FTP/api/src/json/stream-check/"+_name+".json", json, 'utf8', (error) => { console.log(_name+"抓取完成") });
	});		
}

function getData(_name,_plat,_room,callback){
	
	var ret = [];
	var randomIp = Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255);
	
	/* 获取直播间api地址 */
	if (_plat=="huya"){
		/* 虎牙 */
		var referer = "http://roomapicdn.plu.cn/room/roomstatus?roomid="+_room+"&lzv=1";
	} else if (_plat=="bilibili"){
		/* bilibili */
		var referer = "http://api.live.bilibili.com/room/v1/Room/get_info?room_id="+_room+"&from=room";
	}
	
	request({
		url:referer,
		encoding: 'utf-8',
		method:'GET',
		headers:{
			'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/51.0.2704.106 Safari/537.36',
			'X-Forwarded-For':randomIp,
			'referrer':referer
		}
	   },function(err,res,body){
			if(err)
			{
			   console.log(err);	
			}
			else
			{
				/* 返回数据 */
				var data = JSON.parse(body);
				
				if (_plat=="huya"){
					/* 解读虎牙直播间数据 */
					if (typeof data["Broadcast"]!=="undefined"){
						ret = {
							"onAir":1,
							"title":data["Broadcast"]["Title"],
							"game":data["Broadcast"]['GameName'],
							"begin":Math.Floor(parseInt(data["Broadcast"]["BeginTime"])/1000),
							"url":list[_name]
						};
					} else {
						ret = {
							"onAir":0,
							"url":list[_name]
						}
					}
				} else if (_plat=="bilibili"){
					/* 解读bilibili直播间数据 */
					if (data["data"]["live_status"]==1){
						var bt = data["data"]["live_time"]+" UTC +0800";
						var bt_s = Math.floor(Date.parse(bt)/1000);
						ret = {
							"onAir":1,
							"title":data["data"]["title"],
							"game":data["data"]['area_name'],
							"begin":bt_s,
							"url":list[_name]
						};
					} else {
						ret = {
							"onAir":0,
							"url":list[_name]
						}
					}

				}
				
				/* 结束读取，callback to loop */
				callback(_name,ret);	
			}	
		});
}

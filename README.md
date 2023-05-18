# XF音乐盒

一个在线音乐播放器<br>在线使用：[https://mu-jie.cc/musicBox/](https://mu-jie.cc/musicBox/)

![pagePC](http://mujie-data.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E5%BA%8A/%E5%8E%8B%E7%BC%A9_Snipaste_2023-04-27_12-42-34.png)
![pageMbile](http://mujie-data.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E5%BA%8A/8039D291E1BE2DE8B7F1857D838200AE.jpg)

## 近期更新
V3.0.5
1. 新增音乐盒(歌单)功能，用户可从播放列表保存歌单并上传云端，其他设备可通过歌单ID号一键导入到本地音乐盒

V3.0.4
1. 新增一键导入/导出主题
2. 新增主题市场（Beta）

V3.0.3
1. 新增主题自定义
2. 更换依赖包源，访问更快

**由于酷我api不能跨源，需要自行部署接口获取酷我音乐的搜索结果、MP3文件链接和歌词（如您需要私有部署的话），我这里用的是flask来进行部署。**

### html
1. 在```list.js```中
```js
xhrList.open('get', 'http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/?name=' + SearchContent);
```
请求了app.py中的```'/'```的路由,url参数为```name=```,用来获取搜索结果

2. 在```musicPlyr.js```中
```js
xhrSong.open('get', 'http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/rid/?rid=' + rid);
```
请求了app.py中的```'/rid/'```的路由,url参数为```rid=```,根据rid返回MP3文件链接

3. 在```musicPlyr.js```中
```js
xhrSong.open('get', 'http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/lrc/?rid=' + rid);
```
请求了app.py中的```'/lrc/'```的路由,url参数为```rid=```,根据rid返回歌词

4.在```list.js```中
```js
musicBoxData.open('post', 'http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/music-box-list/?method=post');
```
与
```js
getMusicBoxList.open('get', `http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/music-box-list/?method=get&id=${id}`);
```
请求了app.py中的```'/music-box-list/'```的路由，用以存储用户的歌单与获取云端的歌单

### app.py依赖
- pip install flask
- pip install requests

### Leancloud
app.py中使用了Leancloud的数据存储服务以存储用户的歌单数据
![](http://mujie-data.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E5%BA%8A/musicBox%E6%AD%8C%E5%8D%95%E5%90%8E%E7%AB%AF%E7%BB%93%E6%9E%84%E5%9B%BE%20(2).png)
（此部分只作存储原理说明，您无需任何操作）
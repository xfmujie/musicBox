# XF音乐盒

一个在线音乐播放器

![pagePC](http://mujie-data.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E5%BA%8A/%E5%8E%8B%E7%BC%A9_Snipaste_2023-04-27_12-42-34.png)
![pageMbile](http://mujie-data.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E5%BA%8A/8039D291E1BE2DE8B7F1857D838200AE.jpg)
由于酷我api不能跨源，需要自行部署接口获取酷我音乐的搜索结果、MP3文件链接和歌词，我这里用的是flask来进行部署。

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
<br>

```js
xhrSong.open('get', 'http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/lrc/?rid=' + rid);
```
请求了app.py中的```'/lrc/'```的路由,url参数为```rid=```,根据rid返回歌词


### app.py依赖
- pip install flask
- pip install requests

## 近期更新
V3.0.4
1. 新增一键导入/导出主题
2. 新增主题市场（Beta）

V3.0.3
1. 新增主题自定义
2. 更换依赖包源，访问更快
3. 修复一些问题
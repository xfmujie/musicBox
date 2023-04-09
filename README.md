# XF音乐盒

通过flask部署一个接口，来获取酷我音乐的搜索结果和MP3文件链接
（酷我api不能跨源，需要自行部署接口）

### html
1. 在```list.js```中
```js
xhrList.open('get', 'https://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/?name=' + SearchContent);
```
请求了app.py中的```'/'```的路由,url参数为```?name=```,用来获取搜索结果

2. 在```musicPlyr.js```中
```js
xhrSong.open('get', 'https://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/rid/?rid=' + rid);
```
请求了app.py中的```'/rid/'```的路由,url参数为```?rid=```,根据rid返回MP3文件链接


### app.py依赖
- pip install flask
- pip install requests
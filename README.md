# XF音乐盒

一个在线音乐播放器<br>在线使用：[https://mu-jie.cc/musicBox/](https://mu-jie.cc/musicBox/)

![pagePC](http://ali.mu-jie.cc/img/uipc.jpg)
![pageMbile](http://ali.mu-jie.cc/img/musicBoxUI.jpg)

## 近期更新
V3.0.9
1. 修复n个小bug
2. 优化轮播体验

V3.0.8
1. 新增定时关闭

V3.0.7
1. 可导入酷我歌单

V3.0.6
1. 搜索歌曲支持翻页
2. 优化歌单搜索功能

V3.0.5
1. 新增音乐盒(歌单)功能，用户可从播放列表保存歌单并上传云端，其他设备可通过歌单ID号一键导入到本地音乐盒

V3.0.4
1. 新增一键导入/导出主题
2. 新增主题市场（Beta）

V3.0.3
1. 新增主题自定义
2. 更换依赖包源，访问更快

**由于酷我api不能跨源，需要自行部署接口获取酷我音乐的搜索结果、MP3文件链接和歌词（如您需要私有部署的话），我这里用的是flask来进行部署。**


### app.py依赖
- pip install flask
- pip install requests


### Leancloud
app.py中使用了Leancloud的数据存储服务以存储用户的歌单数据
![](http://mujie-data.oss-cn-shenzhen.aliyuncs.com/%E5%9B%BE%E5%BA%8A/musicBox%E6%AD%8C%E5%8D%95%E5%90%8E%E7%AB%AF%E7%BB%93%E6%9E%84%E5%9B%BE%20(2).png)
（此部分只作存储原理说明，如您没有私有化的需求，可无视）
# XF音乐盒


一个在线音乐播放器<br>在线使用：[http://ali.mu-jie.cc/musicBox/index.html](http://ali.mu-jie.cc/musicBox/index.html)

![pagePC](http://ali.mu-jie.cc/img/uipc.jpg)
![pageMbile](http://ali.mu-jie.cc/img/musicBoxUI.jpg)

## 近期更新
V3.1.2
1. 新增歌单和列表的数据备份恢复功能

V3.1.1
1. 回来了~

V3.1.0
1. 新增『我的喜欢』

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


### 说明
由于酷我api不能跨源，需要自行部署接口获取酷我音乐的搜索结果、MP3文件链接和歌词（如您需要私有部署的话），我这里用的是flask来进行部署。
- **flask文件夹：转发前端请求的后端接口，使用了python的flask框架**
```py
from kw import kwFirstUrl
```
kw.py来自某位未知大佬，详见 [#5](https://github.com/xfmujie/musicBox/issues/5)

- **html文件夹：前端静态页面资源，可直接部署到服务器/虚拟主机上(http协议最佳)**
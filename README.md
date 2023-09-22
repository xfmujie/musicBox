# XF音乐盒


一个在线音乐播放器<br>在线使用：[https://mu-jie.cc/musicBox/](https://mu-jie.cc/musicBox/)

![pagePC](http://ali.mu-jie.cc/img/uipc.jpg)
![pageMbile](http://ali.mu-jie.cc/img/musicBoxUI.jpg)


### 说明
- **flask文件夹：转发前端请求的后端接口，使用了python的flask框架，提供了酷我和网易云的搜索、歌词、mp3的接口，网易云API用的是开源项目[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)，请到app.py查看详细说明**

app.py中
```py
from kw import kwFirstUrl
```
kw.py来自某位未知大佬，详见 [#5](https://github.com/xfmujie/musicBox/issues/5)

- **html文件夹：前端静态页面资源，可直接部署到服务器/虚拟主机上**

## 近期更新
V3.1.9
1. 新增酷我推荐歌单
2. 新增玻璃模糊，可前往[设置>>自定义主题]中开启(背景为自定义图片时模糊效果才比较明显)

V3.1.8
1. 新增网易云推荐歌单

V3.1.7
1. 支持导入网易云歌单

V3.1.6
1. 新增网易云曲库

V3.1.5
1. 播放页面初步完善

V3.1.4
1. 新增系统控制中心歌曲交互卡(支持主流浏览器)
2. 新增系统歌词显示(实验功能，在[设置>>系统歌词显示]中开启)

(以上均只支持电脑端，且系统歌词只支持Chrome、Edge浏览器)

V3.1.3
1. 新增侧边栏
2. 新增歌曲播放页

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



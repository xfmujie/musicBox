log = console.log;
if (window.location.port != '5500') console.log = function () { };

//API BaseURL
var BaseURL = 'https://kwapi-api-iobiovqpvk.cn-beijing.fcapp.run'
// var BaseURL = 'http://127.0.0.1:9000'

// 实例化弹窗对象
var popup = new Popup();

//自动重试的请求函数
function retryRequest(url, maxRetries = 5) {
  let retryCount = 0;
  return new Promise((resolve, reject) => {
    function sendRequest() {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then(data => {
          resolve(data); // 请求成功，将结果返回
        })
        .catch(error => {
          console.log("Error:", error);
          retryCount++;
          if (retryCount < maxRetries) {
            // 延时继续发送请求
            setTimeout(() => {
              sendRequest();
            }, 1200);
          } else {
            reject(new Error("Maximum retries exceeded"));  // 达到最大重试次数，抛出错误
          }
        });
    }
    sendRequest();
  });
}

//判空
function isNull(obj) {
  return (obj == null || obj == '' || obj == undefined || obj == 'null' || obj == 'undefined');
}
//本地存储初始化
function initStorage(obj, val) {
  if (isNull(localStorage.getItem(obj))) {
    localStorage.setItem(obj, val);
    console.log(`<${obj}>初始化: ${localStorage.getItem(obj)}`);
  }
}

/*主题 颜色*/
var theme_btnColor = localStorage.getItem('themeBtnColor');
var theme_lrcColor = localStorage.getItem('themeLrcColor');
var theme_listColor = localStorage.getItem('themeListColor');
var theme_bgImg = localStorage.getItem('themeBgImg');
var theme = {
  //判空
  isNull(obj) {
    return (obj === null || obj === '' || obj === undefined)
  },

  //颜色初始化
  init() {
    if (this.isNull(theme_btnColor)) {
      localStorage.setItem('themeBtnColor', '#a8dbff');
      console.log('按钮颜色初始化');
    } else { console.log(`按钮颜色：${localStorage.getItem('themeBtnColor')}`); }

    if (this.isNull(theme_lrcColor)) {
      localStorage.setItem('themeLrcColor', '#199dfc');
      console.log('歌词颜色初始化');
      theme_lrcColor = localStorage.getItem('themeLrcColor');
      lrc1.style.color = theme_lrcColor;
    } else { console.log(`歌词颜色：${localStorage.getItem('themeLrcColor')}`); }

    if (this.isNull(theme_listColor)) {
      localStorage.setItem('themeListColor', 'rgba(255, 255, 255, 0.5)');
      console.log('列表颜色初始化');
      theme_listColor = localStorage.getItem('themeListColor');
    } else { console.log(`列表颜色：${localStorage.getItem('themeListColor')}`); }

    if (!this.isNull(theme_bgImg)) {
      console.log(`背景图：${localStorage.getItem('themeBgImg')}`);
      document.body.style.backgroundImage = `url('${theme_bgImg}')`;
    }
  },

  //设置选项卡按钮颜色
  setBtn(val) {
    if (val == '0') { localStorage.setItem('themeBtnColor', '#a8dbff'); }
    else { localStorage.setItem('themeBtnColor', val); }
    setBtn_onclick();
  },
  //设置歌词颜色
  setLrc(val) {
    if (val == '0') { localStorage.setItem('themeLrcColor', '#199dfc'); }
    else { localStorage.setItem('themeLrcColor', val); }
    theme_lrcColor = localStorage.getItem('themeLrcColor');
    lrc1.style.color = theme_lrcColor;
    root.style.setProperty('--lrc-HL', theme_lrcColor);
  },
  //设置列表颜色
  setList(val) {
    if (val == '0') { localStorage.setItem('themeListColor', 'rgba(255, 255, 255, 0.5)'); }
    else { localStorage.setItem('themeListColor', val); }
    theme_listColor = localStorage.getItem('themeListColor');
  },
  //设置背景图
  setBgImg(url) {
    if (url == '0') {
      localStorage.setItem('themeBgImg', '');
      document.body.style.backgroundImage = getComputedStyle(root).getPropertyValue('--bg-image');
    } else {
      localStorage.setItem('themeBgImg', url);
      theme_bgImg = localStorage.getItem('themeBgImg');
      document.body.style.backgroundImage = `url('${theme_bgImg}')`;
    }
  }
}

function theme_set(method, val) {
  switch (method) {
    case 'list': theme.setList(val); break;
    case 'btn': theme.setBtn(val); break;
    case 'lrc': theme.setLrc(val); break;
    case 'bg': theme.setBgImg(val); break;
    case 'import':
      theme.setList(JSON.parse(val)["list"]);
      theme.setBtn(JSON.parse(val)["btn"]);
      theme.setLrc(JSON.parse(val)["lrc"]);
      if (!theme.isNull(JSON.parse(val)["bg"])) {
        theme.setBgImg(JSON.parse(val)["bg"]);
      }
      break;
    case 'export':
      var configure = {
        list: theme_listColor,
        btn: theme_btnColor,
        lrc: theme_lrcColor,
        bg: theme_bgImg
      }
      return JSON.stringify(configure);
  }
}
const player = new Plyr('audio');
// 获取Plyr音频播放器控制按钮节点
const controls = document.querySelector('.plyr__controls');
if (!isMobile()) {
  document.getElementsByClassName('plyr__controls__item plyr__volume')[0].style.display = 'flex';
  let btns = document.querySelectorAll('.btn_box,#listBtn,#resultBtn,#boxBtn,#setBtn');
  btns.forEach(function (btn) {
    btn.style.cursor = 'pointer';
  });
}
controls.style.margin = '0';
controls.style.padding = '0';
controls.style.width = '100px';
const plyrEm = document.querySelector('.plyr');
plyrEm.style.width = '100%';

// 下载按钮
function downloadOnclick() {
  if (playingNum == 9999) {
    popup.alert('当前无歌曲播放~');
  }
  else {
    popup.alert(`${songName.innerText}&nbsp;-&nbsp;${singerName.innerText}<br><br>点击右边三个点下载<br><audio controls="controls"><source id="tempAudio" src="${mp3Url}"></audio><br>ios下载通道: <a href="${mp3Url}" target="_blank" rel="noopener noreferrer">点击跳转下载</a>`);
  }
}

// 播放模式按钮
const playbackMode = document.createElement("button");
var modeFlag = localStorage.getItem('modeFlag');
if (modeFlag == null) { modeFlag = 0; }
var orderSvg = '<i class="fa fa-bars"></i>';
var loopSvg = '<i class="fa fa-undo"></i>';
function modeDisplay() {
  if (modeFlag == 0) {
    document.querySelector("#loopBtn").innerHTML = orderSvg;
  } else {
    document.querySelector("#loopBtn").innerHTML = loopSvg;
  }
}
modeDisplay();
function playbackModeOnclick() {
  if (modeFlag == 0) {
    playbackMode.innerHTML = loopSvg;
    localStorage.setItem('modeFlag', 1);
    modeFlag = localStorage.getItem('modeFlag');
  }
  else {
    playbackMode.innerHTML = orderSvg;
    localStorage.setItem('modeFlag', 0);
    modeFlag = localStorage.getItem('modeFlag');
  }
  modeDisplay();
}

//我的喜欢按钮
function likeOnclick() {
  iframe.likeListAdd();
}

//选择显示列表/内容
function opBarChangeOfPosition(i) {
  theme_btnColor = localStorage.getItem('themeBtnColor');
  document.querySelector('#opBar').style.transform = `translate(${(i - 1) * 76 + 1}px, 0)`;
  document.querySelector('#opBar').style.backgroundColor = theme_btnColor;
}
function listBtn_onclick() {
  displayFlag = 'play';
  //高亮当前按钮
  opBarChangeOfPosition(1);
  iframe.displayChange('play');
  opBtnNow = 0;
}
function resultBtn_onclick() {
  displayFlag = 'search';
  opBarChangeOfPosition(2);
  iframe.displayChange('search');
  opBtnNow = 1;
}
function boxBtn_onclick() {
  displayFlag = 'box';
  opBarChangeOfPosition(3);
  iframe.displayChange('box');
  opBtnNow = 2;
}
function setBtn_onclick() {
  displayFlag = 'set';
  opBarChangeOfPosition(4);
  iframe.displayChange('set');
  opBtnNow = 3;
}

//当前播放的列表
function list_now(flag) {
  if (iframe.playFlag == 'like') {
    listBtnName = '喜欢';
  } else {
    listBtnName = '列表';
  }
  if (flag == 0) {
    listBtn.innerHTML = listBtnName + '<i class="fa fa-music"></i>';
    listBtn.style.color
    resultBtn.innerHTML = "搜索";
  }
  else if (flag == 1) {
    resultBtn.innerHTML = '搜索<i class="fa fa-music"></i>';
    listBtn.innerHTML = listBtnName;
  }
  else {
    listBtn.innerHTML = flag;
  }
}



// 播放器
controls.style.backgroundColor = 'rgba(181, 232, 255, 0)'; // 背景颜色
controls.style.borderRadius = "0px"
controls.style.height = "30px";
controls.style.width = "100%";
// 检查是否为移动设备
function isMobile() {
  return /mobile|android|iphone|ipad|ipod|blackberry|opera mini|iemobile|webos/.test(navigator.userAgent.toLowerCase());
}


//全局变量定义
var lrc = [{ "lineLyric": "昔枫音乐盒", "time": "2" }, { "lineLyric": "VIP音乐解析", "time": "4" }];
var lrc_count = 0;
var mp3Url = "";
var displayFlag = 'play';
var music_box = document.getElementById('music_box');
var lrc1 = document.getElementById('lrc1');
var lrc2 = document.getElementById('lrc2');
var cover = document.getElementById('cover');
var songName = document.getElementById('songName');
var singerName = document.getElementById('singerName');
var dialog = document.getElementById('dialog');
var SearchContent = document.getElementById('search_box');
var listBtn = document.getElementById('listBtn');
var resultBtn = document.getElementById('resultBtn');
var setBtn = document.getElementById('setBtn');
var boxBtn = document.getElementById('boxBtn');
var audioPlayer = document.getElementById('music');
var sug = document.getElementById('sug');
var iframe = document.getElementById('iframe').contentWindow;
var root = document.documentElement;
var setTimer = 0;
var setTimedFlag = false;
var version_span = document.getElementById('version_span');
var Version = '3.2.1';
var timeCount;
var opBtnNow = 0;
var lrcLastNum = 0;
var lrcCurrentLine = 0;
var timeUpdateAllow = true;
var lrcSelectFlag = false;
var lrcLastNumForNotification = 0;
var lrcCurrentLineForNotification = 0;

//音频播放监听与更新歌词
lrc1.style.color = theme_lrcColor;
root.style.setProperty('--lrc-HL', theme_lrcColor);
player.on('timeupdate', event => {
  var plyr_time = event.detail.plyr.currentTime;  // 当前时间（单位：秒）
  // var plyr_duration = event.detail.plyr.duration;  // 音频总时长（单位：秒）

  // 找当前行歌词(音乐盒内)

  lrcLastNum = lrc.findIndex((lrc) => {
    return Math.floor(parseFloat(lrc.time)) >= plyr_time;
  });
  lrcLastNum = lrcLastNum == -1 ? 1 : lrcLastNum;
  // 歌词更新
  if (lrcCurrentLine != lrcLastNum) {
    lrcUpdate(lrcCurrentLine);
  }

  lrcCurrentLine = lrcLastNum;

  //  找当前行歌词(系统歌词)
  if ('Notification' in window && playingNum != 9999 && lrcSelectFlag) {
    lrcLastNumForNotification = lrc.findIndex((lrc) => {
      return Math.floor(parseFloat(lrc.time)) >= plyr_time + 1;
    });
    lrcLastNumForNotification = lrcLastNumForNotification == -1 ? 1 : lrcLastNumForNotification;
    if (lrcCurrentLineForNotification != lrcLastNumForNotification) {
      let lrcShowNotification = new Notification(`${songName.innerText} - ${singerName.innerText}`, {
        body: `${lrc[lrcCurrentLineForNotification]["lineLyric"]}`,
        tag: `lrc`,
        renotify: true,
      });
      lrcShowNotification.close();
    }
    lrcCurrentLineForNotification = lrcLastNumForNotification;
  }

});

//物理按键监听
document.getElementById('search_box').addEventListener('keydown', function (event) { // 监听键盘按下事件
  if (event.key === 'Enter') { // 如果按下的是回车键
    search_onclick();
  }
})


function getMusic(rid, isWyy = false) {
  let baseUrl = '';
  baseUrl = isWyy ? BaseURL + '/wyy' : BaseURL;
  //获取歌词
  retryRequest(`${baseUrl}/lrc?rid=${rid}`)
    .then(data => {
      document.querySelector('#lrc_p').innerHTML = '';
      // console.log("Data:", data);
      lrc = JSON.parse(data);
      for (let i in lrc) {
        document.querySelector('#lrc_p').innerHTML += `<p>${lrc[i]["lineLyric"]}</p>`;
        if (window.innerWidth < 960 && !isMobile()) document.querySelectorAll('#lrc_p p').forEach(p => p.classList.add('lrc_p_p'));
      }
      if (lrc == null) {
        lrc = [{ "lineLyric": "纯音乐 请欣赏", "time": "999" }]
      }
    })
    .catch(error => {
      console.log("Error:", error);
      lrc = [{ "lineLyric": "", "time": "5" }, { "lineLyric": "歌词获取出错，请稍后重试", "time": "999" }]
    });

  //获取歌曲链接
  retryRequest(`${baseUrl}/mp3?rid=${rid}`)
    .then(data => {
      console.log(data);
      if (data.includes('版权')) {
        popup.alert('这首歌无播放权限！');
      }
      else {
        mp3Url = data;
        console.log(mp3Url);
        audioPlayer.src = mp3Url;
        audioPlayer.play();
      }
    })
    .catch(error => {
      console.log("Error:", error);
    });
}

//切换歌曲
function switchSongs(parameter) {
  getMusic(parameter["rid"], 'iswyy' in parameter);
  lrcLastNum = 0;
  lrcCurrentLine = 0;
  lyricsScrolling(0);
  audioPlayer.pause();
  lrc = [{ "lineLyric": "歌词加载中……", "time": "2" }, { "lineLyric": "", "time": "4" }];
  cover.src = parameter["pic"];
  var name = parameter['name'];
  var singer = parameter['artist'];
  songName.innerHTML = name.slice(0, 15 + (name.length - name.replace(/&[a-z]+;/g, " ").length));
  singerName.innerHTML = singer.slice(0, 15 + (singer.length - singer.replace(/&[a-z]+;/g, " ").length));
  document.title = `${name.replace(/&[a-z]+;/g, " ")} - ${singer.replace(/&[a-z]+;/g, " ")}  (昔枫音乐盒)`;

  document.querySelector('#cover2').src = parameter["pic"];
  document.querySelector('#sidebarSongName').innerHTML = name;
  document.querySelector('#sidebarSingerName').innerHTML = singer;
  document.querySelector('#lrc_p').innerHTML = '<p>歌词加载中……</p>';
  if ('mediaSession' in navigator) {
    mediaSessionUpdate();
  }
  root.style.setProperty('--music-cover', `${parameter["pic"]}`);
  setTimeout(() => {
    let playPageSongListAllP = document.querySelectorAll('#play_page_song_list p');
    for (let i = 0; i < playPageSongListAllP.length; i++) {
      if (playPageSongListAllP[i].classList.contains("play_page_song_list_HL")) {
        playPageSongListAllP[i].classList.remove("play_page_song_list_HL");
      }
    }
    playPageSongListAllP[playingNum].classList.add("play_page_song_list_HL");
  }, 200);

}

let searchSourceChangeFlag = false;
function search_onclick() {
  if (SearchContent.value == "") {
    popup.alert('请输入歌曲/歌手');
  }
  else if ((SearchContent.value != iframe.oldContent) || searchSourceChangeFlag) {
    iframe.pageNum = 1;
    iframe.getSearchResult(SearchContent.value);
    popup.msg('<br><br><div class="loader"></div><br><br>', 10, function () {
      popup.alert('出错了！');
    });
    searchSourceChangeFlag = false;
  }
}

//等待iframe加载完成
function onIFrameLoaded(iframe, callback) {
  function iframeLoaded() {
    // 取消事件监听器，避免重复执行
    iframe.removeEventListener('load', iframeLoaded);
    // 执行回调函数
    callback();
  }
  if (iframe.attachEvent) {
    // IE浏览器
    iframe.attachEvent('onload', iframeLoaded);
  } else {
    // 其他浏览器
    iframe.addEventListener('load', iframeLoaded);
  }
}
var myIframe = document.getElementById('iframe');
onIFrameLoaded(myIframe, function () {
  console.log('iframe已加载完成');
  theme.init();
  listBtn_onclick();
  iframe.document.getElementById('version').innerHTML = Version;

  if ('Notification' in window && !isMobile()) {
    console.log('支持Notifications API');
  }
  else {
    iframe.document.querySelector('#pcShowLrc_box').style.display = 'none';
  }
});

function inputBlur() {
  SearchContent.blur();
}

/*听歌时长的初始化与获取*/
initStorage('playTime', 0);

//定时关闭
function setTimedStop() {
  if (!(/^\d+$/.test(iframe.document.getElementById('setTimer').value))) {
    popup.alert('请输入正确的数字');
    return;
  }
  setTimer = (iframe.document.getElementById('setTimer').value) * 60 + getTimestamp();
  if (iframe.document.getElementById('setTimer').value == '0') {
    setTimedFlag = false;
    iframe.document.getElementById('timerTips').innerHTML = '定时已关闭';
  }
  else {
    setTimedFlag = true;
    popup.alert(`将于${iframe.document.getElementById('setTimer').value}分钟后停止播放`);
    iframe.document.getElementById('timerTips').innerHTML = '定时已开启';
  }
}
//获取时间戳
function getTimestamp() {
  let now = new Date();
  let timestamp = Math.round(now.getTime() / 1000);
  return timestamp;
}
// 监听音频播放状态
audioPlayer.addEventListener('play', function () {
  document.querySelector('#PlayStatus').innerHTML = '<i class="fa fa-pause"></i>';
  if (playingNum == 9999) {
    popup.alert('当前无歌曲播放~');
    audioPlayer.pause();
    timeCount = function () { };
  }
  else {
    clearInterval(timeCount);
    timeCount = setInterval(function () {
      let seconds = parseInt(localStorage.getItem("playTime"));
      localStorage.setItem('playTime', seconds += 1);
      iframe.loadplayTime(getPlayTime());
      if (getTimestamp() > setTimer && setTimedFlag) {
        audioPlayer.pause();
        iframe.document.getElementById('timerTips').innerHTML = '定时结束 已停止播放';
        setTimedFlag = false;
      } else if (setTimedFlag) {
        let timeDifference = setTimer - getTimestamp();
        let hours = Math.floor(timeDifference / 3600);
        let minutes = Math.floor((timeDifference - (hours * 3600)) / 60);
        let sec = Math.floor(timeDifference % 60);
        iframe.document.getElementById('timerTips').innerHTML = `将于${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}后停止播放`
      }
    }, 1000);
  }
});
audioPlayer.addEventListener("pause", function () {
  document.querySelector('#PlayStatus').innerHTML = '<i class="fa fa-play"></i>';
  clearInterval(timeCount);
});
//获取
function getPlayTime() {
  let seconds = parseInt(localStorage.getItem("playTime"));
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - (hours * 3600)) / 60);
  let sec = seconds % 60;
  let result = "";
  if (hours > 0) {
    result += hours + "小时";
  }
  else result += '0小时';
  if (minutes > 0) {
    result += minutes + "分钟";
  }
  else result += '0分钟';
  result += sec + "秒";
  return result;
}
//每月置零一次时长
var currentDate = new Date();
if (`${currentDate.getMonth()}` !== localStorage.getItem('Zeroing')) {
  // 置零
  localStorage.setItem('playTime', 0);
  localStorage.setItem('Zeroing', currentDate.getMonth());
}

//音乐盒缓存
//初始化
initStorage('musicBoxList', '[]');

//版本升级消息
if (localStorage.getItem('Version') !== Version) {
  popup.alert(`<font color="#323232">v${Version} 更新<br><br>1. 新增网易云歌单搜索<br>2. 优化播放页歌曲进度条样式<br><a target="_blank" href="https://mu-jie.cc/musicBoxUpdate/">查看历史更新</a></font>`);
  localStorage.setItem('Version', Version)
}
version_span.innerHTML = Version;

//访问量统计(个人搭建，不支持其他url)
if (window.location.href == 'https://mu-jie.cc/musicBox/' || window.location.href == 'http://localhost:5930/') {
  fetch(`${BaseURL}/visits/`)
    .then(response => response.text())
    .then(data => {
      console.log(data);
      document.getElementById('visits_span').innerHTML = data;
    })
    .catch(error => console.error(error));
}

if (window.location.href == 'https://music-box-lilac.vercel.app/') {
  dialog.close();
  popup.alert('该页面为测试版，请点击<br><a href="https://mu-jie.cc/musicBox/">https://mu-jie.cc/musicBox/</a>访问正式版本<br>国内无需魔法即可直接访问');
}



window.addEventListener('error', function (event) {
  var target = event.target;
  if (!isMobile() && (target.nodeName === 'AUDIO' && target.error !== null && audioPlayer.src.includes('mp3'))) {
    console.log('音频资源加载失败：', target.src);
    popup.alert('受浏览器限制，播放音频需要用户设置网站权限<br><a class="link" target="_blank" href="https://mu-jie.cc/static-pages/网站权限.html">查看设置步骤</a>');
  }
}, true);


function playReset() {
  audioPlayer.src = 'https://ali.mu-jie.cc/static/null.mp3';
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.autoplay = false;
  lrc_count = 0;
  songName.innerHTML = '歌曲';
  singerName.innerHTML = '歌手';
  document.title = '昔枫音乐盒';
  lrc = [{ "lineLyric": "昔枫音乐盒", "time": "2" }, { "lineLyric": "VIP音乐解析", "time": "4" }];
  cover.src = 'https://ali.mu-jie.cc/img/cover01.png';
  iframe.lastNum = 9999;
  playingNum = 9999;
  clearInterval(timeCount);
  iframe.pagePX = 0;
  document.querySelector('#sidebarSongName').innerHTML = '昔枫音乐盒';
  document.querySelector('#sidebarSingerName').innerHTML = 'VIP音乐解析';
  document.querySelector('#lrc_p').innerHTML = '<p>该页面正在开发中</p><p>可能存在Bug</p>';
  document.querySelector('#cover2').src = 'https://ali.mu-jie.cc/img/cover01.png';
  lrcCurrentLine = 0;
  lrcUpdate(0);
  root.style.setProperty('--music-cover', `url('https://ali.mu-jie.cc/img/cover01.png')`);
  setTimeout(() => {
    playPageSongListUpdate(playList);
  }, 100);

}

/* window.addEventListener('message', function (event) {
  var data = event.data; // 获取子页面发送的数据
  // console.log(data);
  if (data.function == 'switchSongs') {
    switchSongs(data);
  }
}); */


//上一首/下一首
var playingNum = 9999;
var playListFlag = 'play';
var searchList;
var playList = JSON.parse(localStorage.getItem('playList'));
var switchSongDelay;
function nextPlay(flag) {
  clearTimeout(switchSongDelay);
  if (flag == 'next') {
    if (playListFlag == 'play' && playingNum + 1 < playList.length) {
      var nextNum = playingNum + 1;
      playingNum = playingNum + 1;
    }
    else if (playListFlag == 'play' && playingNum + 1 >= playList.length) {
      nextNum = 0;
      playingNum = 0;
    }
    else if (playListFlag == 'search' && playingNum + 1 < searchList.length) {
      nextNum = playingNum + 1;
      playingNum = playingNum + 1;
    }
    else if (playListFlag == 'search' && playingNum + 1 >= searchList.length) {
      nextNum = 0;
      playingNum = 0;
    }
  } else {
    if (playListFlag == 'play' && playingNum == 0) {
      var nextNum = playList.length - 1;
      playingNum = playList.length - 1;
    }
    else if (playListFlag == 'play' && playingNum != 0) {
      nextNum = playingNum - 1;
      playingNum = playingNum - 1;
    }
    else if (playListFlag == 'search' && playingNum == 0) {
      nextNum = searchList.length - 1;
      playingNum = searchList.length - 1;
    }
    else if (playListFlag == 'search' && playingNum != 0) {
      nextNum = playingNum - 1;
      playingNum = playingNum - 1;
    }
  }

  if (playListFlag == 'play') {
    var List = JSON.parse(localStorage.getItem('playList'));
    pic = List[nextNum]["pic"];
    if (displayFlag == 'play') {
      iframe.pagePX = playingNum * 68 - 90;
    }
  } else {
    List = searchList;
    var pic = List[nextNum]["pic"];
    pic = pic.replace(/\/\d+\//, "/300/");
    if (displayFlag == 'search') {
      iframe.SearchPagePX = (playingNum - 2) * 68;
    }
  }
  switchSongDelay = setTimeout(() => {
    /* console.log(List);
    console.log(parameter); */
    switchSongs(List[nextNum]);
  }, 300);
  if (displayFlag == 'play' && playListFlag == 'play') listBtn_onclick();
  if (displayFlag == 'search' && playListFlag == 'search') resultBtn_onclick();
}

//播放结束
audioPlayer.addEventListener('ended', function () {
  /* console.log('end'); */
  if (modeFlag == 0) {
    console.log('已自动下一首');
    nextPlay('next');
  }
  else {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    lrc_count = 0;
  }
});


// 请求 Wake Lock
/* navigator.wakeLock.request('screen')
  .then((wakeLock) => {
    console.log('成功获取 Wake Lock');
  }) */


// 屏幕滑动
let startX = 0;
// let startY = 0;
let opBtnFunc = [
  function () { listBtn_onclick() },
  function () { resultBtn_onclick() },
  function () { boxBtn_onclick() },
  function () { setBtn_onclick() },
]
iframe.addEventListener('touchstart', (event) => {
  startX = event.touches[0].clientX;
  // startY = event.touches[0].clientY;
});
iframe.addEventListener('touchmove', (event) => {
  const currentX = event.touches[0].clientX;
  // const currentY = event.touches[0].clientY;
  const deltaX = currentX - startX;
  // const deltaY = currentY - startY;
  if (deltaX > 200) {
    console.log('左滑');
    startX = event.touches[0].clientX;
    /* console.log(startX); */
    if (opBtnNow != 0) opBtnFunc[opBtnNow - 1]();
  }
  else if (deltaX < -200) {
    console.log('右滑');
    startX = event.touches[0].clientX;
    /* console.log(startX); */
    if (opBtnNow + 1 < opBtnFunc.length) opBtnFunc[opBtnNow + 1]();
  }
});

let sidebar = document.querySelector('.sidebar');
let overlay;  //半透明遮罩
// 侧边栏呼出/收起
function menu_onclick(isHash = false) {
  // console.log(sidebar.style.left);
  // 检测是否已经呼起
  if (['1%', '0px'].includes(sidebar.style.left)) {
    returnToSidebarOnclick();
    document.querySelector("body > div.search > div.menu > button").innerHTML = '<i class="fa fa-bars"></i>';
    if (window.innerWidth < 960) {
      sidebar.style.left = '-100%';
      overlay.remove();
      if (!isHash) history.go(-1);
    }
    else {
      sidebar.style.left = '-32%';
    }
  }
  else {
    document.querySelector("body > div.search > div.menu > button").innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
    if (window.innerWidth < 960) {
      overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.right = '0';
      overlay.style.width = `calc(100%)`; //  - ${document.querySelector('.sidebar').offsetWidth}px
      overlay.style.height = '100%';
      // overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // 设置为半透明的黑色
      overlay.style.backdropFilter = 'blur(10px)';
      overlay.style.zIndex = '1';
      document.body.appendChild(overlay);
      sidebar.style.left = '0px';
      overlay.addEventListener('click', () => {
        menu_onclick();
        overlay.remove();
      });
      window.location.hash = '#sidebar';
    }
    else {
      sidebar.style.left = '0px';
    }
  }
}
// 桌面设备但视窗宽度小于960
if (window.innerWidth < 960 && !isMobile()) document.querySelectorAll('#sidebar_op div').forEach(div => div.classList.add('sidebar_div'));


// 歌词滚动
document.querySelector('#lrc_p').innerHTML = '<p>该页面正在开发中</p><p>可能存在Bug</p>';
lyricsScrolling(0);
function lyricsScrolling(i) {
  try {
    if (timeUpdateAllow) {
      var sidebarLrc = document.getElementById("sidebarLrc");
      var sidebarLrc_p = document.querySelectorAll('#sidebarLrc p')[i];
      // 计算子元素相对于父级元素的偏移量
      var offsetTop = sidebarLrc_p.offsetTop;
      var parentHeight = sidebarLrc.offsetHeight;
      var childHeight = sidebarLrc_p.offsetHeight;
      var centerOffset = (parentHeight - childHeight) / 2;
      // 将滚动条滚动到垂直居中位置
      sidebarLrc.scrollTop = offsetTop - centerOffset + 20;
    }
  }
  catch {
    return;
  }
}

//歌词更新
lrcUpdate(0);
function lrcUpdate(lrcCurrentLine) {
  /* console.log(lrcCurrentLine); */
  if (lrcCurrentLine == -1) return;

  //播放页面滚动歌词
  lyricsScrolling(lrcCurrentLine);
  try {
    let lrc_p = document.querySelectorAll('#lrc_p p');
    for (let i = 0; i < lrc_p.length; i++) {
      if (lrc_p[i].classList.contains("lrcHL")) {
        lrc_p[i].classList.remove("lrcHL");
      }
    }
    lrc_p[lrcCurrentLine].classList.add("lrcHL");
  }
  catch { }

  //首页歌词
  lrc1.innerHTML = lrc[lrcCurrentLine]["lineLyric"].slice(0, 50);
  if (lrcCurrentLine + 1 < lrc.length) {
    lrc2.innerHTML = lrc[lrcCurrentLine + 1]["lineLyric"].slice(0, 50);
    if ((lrc1.innerHTML.length > 20 || lrc2.innerHTML.length > 20) && isMobile()) {
      lrc1.style.fontSize = "12px";
      lrc2.style.fontSize = "12px";
    }
    else {
      lrc1.style.fontSize = "15px";
      lrc2.style.fontSize = "15px";
    }
  }
  if (lrcCurrentLine + 1 == lrc.length) {
    lrc2.innerHTML = '--end--';
  }
}

// 桌面设备自动打开侧边栏
// if (window.innerWidth >= 960) menu_onclick();


function playOrPauseOnclick() {
  if (audioPlayer.paused) audioPlayer.play();
  else audioPlayer.pause();
}

// 格式化时间
function formatTime(seconds) {
  if (seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  else {
    return '00:00';
  }
}

// 播放页音频进度条
let progressAutoEnable = true;
let progress = document.getElementById('progress');
let timeLabel = document.getElementById('time-label');
(function () {
  audioPlayer.addEventListener('timeupdate', function () {
    if (audioPlayer.currentTime && progressAutoEnable) {
      var progressPercentage = audioPlayer.currentTime * 100 / audioPlayer.duration;
      progress.value = progressPercentage;
      progressUpdate();
      // progress.style.width = progressPercentage + '%';
      timeLabel.innerHTML = formatTime(audioPlayer.currentTime);
      document.querySelector('#duration').innerHTML = formatTime(audioPlayer.duration);
    }
  });
})();

// 进度条拖动中
progress.addEventListener("input", function () {
  audioPlayer.pause();
  progressUpdate();
  progressAutoEnable = false;
  timeLabel.innerHTML = formatTime((progress.value / 100) * audioPlayer.duration);
  setTimeout(() => {
    progressAutoEnable = true;
  }, 500);
});

// 进度条拖动后
function progressOnchange() {
  audioPlayer.play();
  console.log(123);
  timeUpdateAllow = false;
  let currentTime = (progress.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = currentTime;
  lrcLastNum = lrc.findIndex((lrc) => {
    return Math.floor(parseFloat(lrc.time)) >= currentTime;
  });
  lrcLastNum = lrcLastNum == -1 ? 1 : lrcLastNum;
  /*     console.log(currentTime);
      console.log(lrcLastNum); */
  lrcUpdate(lrcLastNum - 1);
  setTimeout(() => {
    timeUpdateAllow = true;
  }, 500);
}

// 更新进度条背景色
function progressUpdate() {
  var leftColor = cssVar.get('--progress--leftColor');
  var rightColor = cssVar.get('--progress--rightColor');
  progress.style.background = `linear-gradient(to right, ${leftColor} ${progress.value}%, ${rightColor} ${progress.value}%)`;
}


// 系统音频交互
function mediaSessionUpdate() {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: document.querySelector('#sidebarSongName').innerHTML.replace(/&[a-z]+;/g, " "),
    artist: document.querySelector('#sidebarSingerName').innerHTML.replace(/&[a-z]+;/g, " "),
    album: '昔枫音乐盒',
    artwork: [{ src: cover.src, sizes: '120x120', type: 'image/png' }]
  });
}

// 判断当前Web Media Session API是否可用
if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', function () {
    audioPlayer.play();
    mediaSessionUpdate();
  });
  navigator.mediaSession.setActionHandler('pause', function () {
    audioPlayer.pause();
    mediaSessionUpdate();
  });
  navigator.mediaSession.setActionHandler('previoustrack', function () {
    nextPlay('prev');
    mediaSessionUpdate();
  });
  navigator.mediaSession.setActionHandler('nexttrack', function () {
    nextPlay('next');
    mediaSessionUpdate();
  });
}


/* 人为滚动禁用自动滚动 */
let scrollTimeout = 0;
// 歌词鼠标滚动
let mouseScrollUnits = 0;
document.getElementById('sidebarLrc').addEventListener('mousewheel', handleScroll);
document.getElementById('sidebarLrc').addEventListener('DOMMouseScroll', handleScroll); // 兼容 Firefox
function handleScroll(event) {
  deltaY = event.wheelDelta || -event.detail;
  mouseScrollUnits++;
  if (mouseScrollUnits > 3) {
    console.log('鼠标滚动');
    timeUpdateAllow = false;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      timeUpdateAllow = true;
      mouseScrollUnits = 0;
    }, 3000);
  }
}
// 歌词触摸滚动
let startY = 0;
document.getElementById('sidebarLrc').addEventListener('touchstart', (event) => {
  startY = event.touches[0].clientY;
});
document.getElementById('sidebarLrc').addEventListener('touchmove', (event) => {
  const currentY = event.touches[0].clientY;
  const deltaY = currentY - startY;
  if (Math.abs(deltaY) > 100) {
    console.log('触摸滚动');
    timeUpdateAllow = false;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      timeUpdateAllow = true;
    }, 3000);
  }
});


// 点击歌词播放
document.getElementById('lrc_p').addEventListener('click', function (event) {
  if (event.target.tagName === 'P') {
    let clickNum = Array.from(document.querySelectorAll('#lrc_p p')).indexOf(event.target);
    if (clickNum != lrcCurrentLine - 1 && playingNum != 9999) {
      console.log(clickNum);
      lrcCurrentLine = clickNum;
      audioPlayer.currentTime = parseFloat(lrc[clickNum]["time"]);
      timeUpdateAllow = true;
      audioPlayer.play();
    }
  }
});


// 播放页面
let sidebar2 = document.querySelector('.sidebar2');
/* playPageOpenOrClose(); */
if (window.innerWidth >= 960) {
  setTimeout(() => {
    sidebar2.style.position = 'absolute';
  }, 1000);
}
function playPageOpenOrClose(isHash = false) {
  // 检测是否已经呼起
  if (['1%', '0px'].includes(sidebar2.style.right)) {
    document.body.style.overflow = '';
    if (window.innerWidth < 960) {
      sidebar2.style.right = '-100%';
      if (!isHash) {
        history.go(-1);
      }
    }
    else {
      sidebar2.style.right = '-32%';
    }
  }
  else {
    if (window.innerWidth < 960) {
      document.body.style.overflow = 'hidden';
      sidebar2.style.right = '0px';
      window.location.hash = '#play-page';
    }
    else {
      sidebar2.style.right = '0px';
    }
  }
}

window.addEventListener('hashchange', function () {
  var hash = location.hash;
  if (hash == '' && sidebar.style.left == '0px') menu_onclick(true);
  if (hash == '' && sidebar2.style.right == '0px') playPageOpenOrClose(true);
  if (hash == '#sidebar' && sidebar2.style.right == '0px') playPageOpenOrClose(true);
  if (hash == '#play-page' && playPageSongListElem.style.bottom == '-1px') playListBtnOnclick(true);
});


// 播放页歌曲列表
let playPageSongListElem = document.querySelector('.play_page_song_list');
playPageSongListUpdate(playList);
function playPageSongListUpdate(playList) {
  if (!playList) {
    document.querySelector('#play_page_song_list').innerHTML = '<br><span style="position:absolute; bottom:40vh; left:calc(50% - 60px);">当前列表无歌曲</span>';
    return;
  }
  document.querySelector('#play_page_song_list').innerHTML = '';
  playList.forEach(function (song, num) {
    /*     console.log(song);
        console.log(num); */
    document.querySelector('#play_page_song_list').innerHTML += `<p><span>${(num + 1).toString().padStart(2, '0')}</span>${song.name}<br><span>${(num + 1).toString().padStart(2, '0')}</span><span style="font-size:0.7rem;">${song.artist}</span></p>`;  /*  */
    if (num + 1 == playList.length) document.querySelector('#play_page_song_list').innerHTML += '<br><br>';
  });

  if (playingNum != 9999) {
    setTimeout(() => {
      let playPageSongListAllP = document.querySelectorAll('#play_page_song_list p');
      for (let i = 0; i < playPageSongListAllP.length; i++) {
        if (playPageSongListAllP[i].classList.contains("play_page_song_list_HL")) {
          playPageSongListAllP[i].classList.remove("play_page_song_list_HL");
        }
      }
      playPageSongListAllP[playingNum].classList.add("play_page_song_list_HL");
    }, 200);
  }

  if (window.innerWidth < 960 && !isMobile()) document.querySelectorAll('#play_page_song_list p').forEach(list_p => list_p.classList.add("play_page_song_list_p"));
}

// 播放页歌曲列表显示
let overlay2;
function playListBtnOnclick(isHash = false) {
  if (playPageSongListElem.style.bottom == '-1px' || playPageSongListElem.style.top == '30%') {
    overlay2.remove();
    if (window.innerWidth < 960) {
      playPageSongListElem.style.top = 'unset';
      playPageSongListElem.style.bottom = '-80%';
      if (!isHash) history.go(-1);
    }
    else {
      playPageSongListElem.style.bottom = 'unset';
      playPageSongListElem.style.top = '100%';
    }
  }
  else {
    overlay2 = document.createElement('div');
    overlay2.style.position = 'absolute';
    overlay2.style.top = '0';
    overlay2.style.bottom = '0';
    overlay2.style.width = '100%';
    overlay2.style.height = '100%';
    overlay2.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 设置为半透明的黑色
    overlay2.style.zIndex = '1';
    document.querySelector('.sidebar2').appendChild(overlay2);
    overlay2.addEventListener('click', () => {
      playListBtnOnclick();
      overlay2.remove();
    });
    if (window.innerWidth < 960) {
      playPageSongListElem.style.top = 'unset';
      playPageSongListElem.style.bottom = '-1px';
      window.location.hash = '#playPageSongList';
    }
    else {
      playPageSongListElem.style.bottom = 'unset';
      playPageSongListElem.style.top = '30%';
    }
    if (playingNum != 9999) playListScrolloo(playingNum);
  }
}

function playListScrolloo(i) {
  try {
    var playListDiv = document.getElementById("play_page_song_list");
    var playListSong = document.querySelectorAll('#play_page_song_list p')[i];
    // 计算子元素相对于父级元素的偏移量
    var offsetTop = playListSong.offsetTop; // 
    var parentHeight = playListDiv.offsetHeight;
    var childHeight = playListSong.offsetHeight;
    var centerOffset = (parentHeight - childHeight) / 2;
    // 将滚动条滚动到垂直居中位置
    playListDiv.scrollTop = offsetTop - centerOffset + 10;
  }
  catch {
    return;
  }

}

// 点击歌曲播放
document.getElementById('play_page_song_list').addEventListener('click', function (event) {
  if (event.target.tagName === 'P') {
    let clickNum = Array.from(document.querySelectorAll('#play_page_song_list p')).indexOf(event.target);
    console.log(clickNum);
    if (playListFlag == 'play') {
      switchSongs(playList[clickNum]);
      playingNum = clickNum;
      listBtn_onclick();
    }
    else {
      switchSongs(searchList[clickNum]);
      playingNum = clickNum;
      search_onclick();
    }

  }
});

// 画饼
/* huabing = document.querySelector('#huabing');
huabing.innerHTML = '画饼区(不一定实现)<br><br><del>1. 对接网易云实现腾讯网易双曲库<br>(网易VIP只能播30秒)</del><br><br><del>2. 网易歌单导入</del><br><br>3. 歌曲推荐、歌单推荐';
huabing.addEventListener('click', () => {
  if (huabing.style.height == 'max-content') huabing.style.height = '20px';
  else huabing.style.height = 'max-content';
}); */


// 网易云
initStorage('isWyy', 'false');
var isWyy = localStorage.getItem('isWyy');
console.log(isWyy);
document.querySelector('#searchSource').innerHTML = localStorage.getItem('isWyy') == 'true' ? '网易云' : '酷我';
function searchSourceChange() {
  if (localStorage.getItem('isWyy') == 'true') {
    localStorage.setItem('isWyy', 'false');
    document.querySelector('#searchSource').innerHTML = '酷我';
  }
  else {
    localStorage.setItem('isWyy', 'true');
    document.querySelector('#searchSource').innerHTML = '网易云';
  }
  isWyy = localStorage.getItem('isWyy');
  searchSourceChangeFlag = true;
}

//css变量访问与设置
var cssVar = {
  get(Var) {
    return getComputedStyle(root).getPropertyValue(Var);
  },
  set(Var, newVal) {
    root.style.setProperty(Var, newVal);
  }
}

//网易云歌单推荐
function wyySongListRecommend() {
  document.querySelector('#sidebar_op_wyySongList').style.left = '10px';
  document.querySelector('#sidebar_op').style.left = cssVar.get('--sidebarEl1-closeLeft');
  if (window.innerWidth < 960) {
    document.querySelector('.sidebar').style.width = 'calc(100% - 20px)';
  }

  //进入页面时加载推荐歌单
  if (kwOrwyySongList.length == 0) {
    // popup.alert('歌单推荐开发中，当前只能一键添加歌单，后续会丰富交互体验');
    selectInit();
  }
}

//返回侧边栏
function returnToSidebarOnclick() {
  document.querySelector('#sidebar_op').style.left = '10px';
  document.querySelector('#sidebar_op_wyySongList').style.left = cssVar.get('--sidebarEl2-closeLeft');
  if (window.innerWidth < 960) {
    document.querySelector('.sidebar').style.width = '80%';
  }
}

let songListSelect = document.querySelector('#songListSelect');

//发送请求获取推荐歌单列表
let kwOrwyySongList = [];
function getSongList(src, type = 'recommend', key = '') {
  let url = '';
  if (!key)
    url = `${BaseURL}/songlist?src=${src}&type=${type.replace('推荐歌单', 'recommend')}`;
  else
    url = `${BaseURL}/songlist/search?key=${key}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      kwOrwyySongList = data;
      generateGrid();
      document.querySelector('#songListGridDiv .loader').style.display = 'none';
    });
}

// 创建歌单板块
function createPlaylistItem(imageUrl, title) {
  let bgColor = ['#D4E4F5', '#FCE9E7', '#E6E2F3', '#F7EFD0', '#E5F3F1'];
  const item = document.createElement('div');
  item.classList.add('grid-item');

  const image = document.createElement('img');
  image.style.backgroundColor = bgColor[Math.floor(Math.random() * bgColor.length)];
  image.src = imageUrl;
  item.appendChild(image);

  const caption = document.createElement('p');
  caption.textContent = title;
  item.appendChild(caption);

  return item;
}

// 动态生成瀑布流
function generateGrid() {
  const gridContainer = document.getElementById('gridContainer');
  // 生成歌单板块
  kwOrwyySongList.forEach(list => {
    let pic = songListSelect.value == 'wyy' ? list.picUrl : list.pic.replace('kwcdn.kuwo.cn', 'kuwo.cn');
    const playlistItem = createPlaylistItem(pic, list.name);
    playlistItem.setAttribute("title", list.name);
    // playlistItem.setAttribute("data-clipboard-text", `https://music.163.com/playlist?id=${list.id}`);
    gridContainer.appendChild(playlistItem);
  });
}

document.querySelector('#gridContainer').addEventListener('click', function (event) {
  let clickNum = Array.from(document.querySelectorAll(`#gridContainer .grid-item ${event.target.tagName}`)).indexOf(event.target);
  console.log(clickNum);
  popup.confirm('将歌单一键添加到音乐盒？')
    .then(isEnter => {
      if (isEnter) {
        let src = songListSelect.value == 'wyy' ? 'https://music.163.com/playlist?id=' : 'http://www.kuwo.cn/playlist_detail/';
        iframe.getSongList(true, `${src}${kwOrwyySongList[clickNum]["id"]}`);
      }
    })
});

// 歌单推荐状态(网易OR酷我)本地存储初始化
initStorage('recommend', 'kw');
songListSelect.selectedIndex = localStorage.getItem('recommend') == 'kw' ? 0 : 1;


function jumpToSetupOnclick() {
  if (window.innerWidth < 960) menu_onclick();
  setBtn_onclick();
}

// 玻璃模糊效果
function enableGlass(isEnable) {
  if (isEnable) {
    cssVar.set('--blur--5px-', 'blur(5px)');
    cssVar.set('--blur--10px-', 'blur(10px)');
    cssVar.set('--blur--15px-', 'blur(15px)');
    cssVar.set('--blur--20px-', 'blur(20px)');
    document.querySelector('.sidebar').style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    document.querySelector('.sidebar2').style.background = 'rgba(255, 255, 255, 0.7)';
    document.querySelector('.music_box').style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
  }
  else {
    cssVar.set('--blur--5px-', 'unset');
    cssVar.set('--blur--10px-', 'unset');
    cssVar.set('--blur--15px-', 'unset');
    cssVar.set('--blur--20px-', 'unset');
    document.querySelector('.sidebar').style.backgroundColor = 'rgb(252, 252, 252)';
    document.querySelector('.sidebar2').style.background = 'linear-gradient(to bottom, #f8fdff, #d9edff)';
    document.querySelector('.music_box').style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  }
}

let opContent = {
  'kw': [
    {
      "categories": "推荐",
      "subCategories": [
        { "name": "推荐歌单", "typeid": "推荐歌单" }
      ]
    },
    {
      "categories": "主题",
      "subCategories": [
        { "name": "经典", "typeid": "1265" },
        { "name": "抖音", "typeid": "2189" },
        { "name": "情歌", "typeid": "2200" },
        { "name": "BGM", "typeid": "2199" },
        { "name": "游戏", "typeid": "1877" },
        { "name": "怀旧", "typeid": "155" },
        { "name": "合唱", "typeid": "2201" },
        { "name": "网络", "typeid": "621" },
        { "name": "儿童", "typeid": "171" },
        { "name": "ACG", "typeid": "181" },
        { "name": "影视", "typeid": "180" },
        { "name": "网红", "typeid": "1879" },
        { "name": "翻唱", "typeid": "1848" },
      ]
    },
    {
      "categories": "心情",
      "subCategories": [
        { "name": "伤感", "typeid": "146" },
        { "name": "解压", "typeid": "62" },
        { "name": "励志", "typeid": "58" },
        { "name": "开心", "typeid": "143" },
        { "name": "甜蜜", "typeid": "137" },
        { "name": "兴奋", "typeid": "139" },
        { "name": "安静", "typeid": "67" },
        { "name": "思念", "typeid": "160" },
      ]
    },
    {
      "categories": "场景",
      "subCategories": [
        { "name": "开车", "typeid": "376" },
        { "name": "运动", "typeid": "366" },
        { "name": "睡眠", "typeid": "354" },
        { "name": "跳舞", "typeid": "378" },
        { "name": "学习", "typeid": "1876" },
        { "name": "清晨", "typeid": "353" },
        { "name": "KTV", "typeid": "361" },
        { "name": "店铺专用", "typeid": "263" },
        { "name": "校园", "typeid": "382" },
        { "name": "旅行", "typeid": "375" },
        { "name": "工作", "typeid": "386" },
        { "name": "广场舞", "typeid": "334" },
        { "name": "通勤", "typeid": "2202" },
        { "name": "宅家", "typeid": "2203" }
      ]
    },
    {
      "categories": "年代",
      "subCategories": [
        { "name": "70后", "typeid": "637" },
        { "name": "80后", "typeid": "638" },
        { "name": "90后", "typeid": "639" },
        { "name": "00后", "typeid": "640" }
      ]
    },
    {
      "categories": "语言",
      "subCategories": [
        { "name": "华语", "typeid": "37" },
        { "name": "粤语", "typeid": "13" },
        { "name": "欧美", "typeid": "35" },
        { "name": "韩语", "typeid": "1093" },
        { "name": "日语", "typeid": "1091" },
        { "name": "小语种", "typeid": "12" }
      ]
    },
    {
      "categories": "曲风流派",
      "subCategories": [
        { "name": "流行", "typeid": "393" },
        { "name": "DJ", "typeid": "168" },
        { "name": "古风", "typeid": "127" },
        { "name": "佛乐", "typeid": "220" },
        { "name": "轻音乐", "typeid": "173" },
        { "name": "纯音乐", "typeid": "577" },
        { "name": "电子", "typeid": "391" },
        { "name": "喊麦", "typeid": "216" },
        { "name": "3D", "typeid": "1366" },
        { "name": "器乐", "typeid": "578" },
        { "name": "摇滚", "typeid": "389" },
        { "name": "民歌", "typeid": "1921" },
        { "name": "民谣", "typeid": "392" },
        { "name": "古典", "typeid": "390" },
        { "name": "嘻哈", "typeid": "387" },
        { "name": "乡村", "typeid": "399" },
        { "name": "爵士", "typeid": "397" },
        { "name": "R&B", "typeid": "394" }
      ]
    },
  ],
  'wyy': [
    {
      "categories": "推荐",
      "subCategories": ['推荐歌单']
    },
    {
      "categories": "语种",
      "subCategories": ['华语', '欧美', '日语', '韩语', '粤语']
    },
    {
      "categories": "风格",
      "subCategories": ['流行', '摇滚', '民谣', '电子', '舞曲', '说唱', '轻音乐', '爵士', '乡村', 'R&B/Soul', '古典', '民族', '英伦', '金属', '朋克', '蓝调', '雷鬼', '世界音乐', '拉丁', 'New Age', '古风', '后摇', 'Bossa Nova']
    },
    {
      "categories": "场景",
      "subCategories": ['清晨', '夜晚', '学习', '工作', '午休', '下午茶', '地铁', '驾车', '运动', '旅行', '散步', '酒吧']
    },
    {
      "categories": "情感",
      "subCategories": ['怀旧', '清新', '浪漫', '伤感', '治愈', '放松', '孤独', '感动', '兴奋', '快乐', '安静', '思念']
    },
    {
      "categories": "主题",
      "subCategories": ['综艺', '影视原声', 'ACG', '儿童', '校园', '游戏', '70后', '80后', '90后', '网络歌曲', 'KTV', '经典', '翻唱', '吉他', '钢琴', '器乐', '榜单', '00后']
    },
    {
      "categories": "搜索",
      "subCategories": ['搜索歌单']
    },
  ]
};

// 分类选择选项初始化
function selectInit() {
  let src = songListSelect.value;
  document.querySelector('#categoriesSelect1').innerHTML = '';
  document.querySelector('#categoriesSelect2').innerHTML = '';
  opContent[src].forEach(op => {
    document.querySelector('#categoriesSelect1').innerHTML += `<option>${op['categories']}</option>`
  });
  opContent[src][0]['subCategories'].forEach(op => {
    let opName = src == 'kw' ? op['name'] : op;
    document.querySelector('#categoriesSelect2').innerHTML += `<option>${opName}</option>`;
  });
  localStorage.setItem('recommend', src);
  loadSongList(src);
}

// 一级分类选择，改变二级分类选项，并加载第1个二级分类歌单
function categoriesSelect() {
  let srcSelect = songListSelect.value;
  let selectedIndex1 = document.querySelector('#categoriesSelect1').selectedIndex;
  document.querySelector('#categoriesSelect2').innerHTML = '';
  opContent[srcSelect][selectedIndex1]['subCategories'].forEach(op => {
    let opName = srcSelect == 'kw' ? op['name'] : op;
    document.querySelector('#categoriesSelect2').innerHTML += `<option>${opName}</option>`
  });
  if (selectedIndex1 != 6 || srcSelect == 'kw') {
    document.querySelectorAll('.grid-item').forEach(el => el.remove());
    document.querySelector('#songListGridDiv .loader').style.display = 'unset';
    let type = '';
    if (srcSelect == 'kw')
      type = opContent['kw'][selectedIndex1]['subCategories'][0]['typeid'];
    else
      type = opContent['wyy'][selectedIndex1]['subCategories'][0];
    getSongList(srcSelect, type);
  }
  else {
    popup.prompt('输入歌单名称/关键词')
      .then(key => {
        if (key) {
          document.querySelectorAll('.grid-item').forEach(el => el.remove());
          document.querySelector('#categoriesSelect2').innerHTML = '';
          document.querySelector('#categoriesSelect2').innerHTML += `<option>${key}</option>`;
          document.querySelector('#songListGridDiv .loader').style.display = 'unset';
          getSongList('wyy', 'search', key);
        }
        else {
          document.querySelector('#categoriesSelect2').innerHTML = '';
          // document.querySelector('#categoriesSelect2').innerHTML += `<option>已取消搜索</option>`;
        }
      });
  }
}

// 二级分类选择，获取该分类歌单
function subCategoriesSelect() {
  loadSongList(songListSelect.value);
}

function loadSongList(src) {
  document.querySelectorAll('.grid-item').forEach(el => el.remove());
  document.querySelector('#songListGridDiv .loader').style.display = 'unset';
  let selectedIndex1 = document.querySelector('#categoriesSelect1').selectedIndex;
  let selectedIndex2 = document.querySelector('#categoriesSelect2').selectedIndex;
  let type = '';
  if (src == 'kw') {
    type = opContent['kw'][selectedIndex1]['subCategories'][selectedIndex2]['typeid'];
  }
  else {
    type = opContent['wyy'][selectedIndex1]['subCategories'][selectedIndex2];
  }
  getSongList(src, type);
}

function songListSearch() {
  if (songListSelect.selectedIndex == 1) {
    document.querySelector('#categoriesSelect1').selectedIndex = 6;
    categoriesSelect();
  }
  else {
    popup.alert('酷我不支持歌单搜索~');
  }
}

// disableGlass();
//调用子页面函数
//iframe.函数名()
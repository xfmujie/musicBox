console.log = function () { };

/*主题 颜色*/
var theme_btnColor = localStorage.getItem('themeBtnColor');
var theme_lrcColor = localStorage.getItem('themeLrcColor');
var theme_listColor = localStorage.getItem('themeListColor');
var theme_bgImg = localStorage.getItem('themeBgImg');
class Theme {
  //判空
  isNull(obj) {
    return (obj === null || obj === '' || obj === undefined)
  }
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
  }

  //设置选项卡按钮颜色
  setBtn(val) {
    if (val == '0') { localStorage.setItem('themeBtnColor', '#a8dbff'); }
    else { localStorage.setItem('themeBtnColor', val); }
    setBtn_onclick();
  }
  //设置歌词颜色
  setLrc(val) {
    if (val == '0') { localStorage.setItem('themeLrcColor', '#199dfc'); }
    else { localStorage.setItem('themeLrcColor', val); }
    theme_lrcColor = localStorage.getItem('themeLrcColor');
    lrc1.style.color = theme_lrcColor;
  }
  //设置列表颜色
  setList(val) {
    if (val == '0') { localStorage.setItem('themeListColor', 'rgba(255, 255, 255, 0.5)'); }
    else { localStorage.setItem('themeListColor', val); }
    theme_listColor = localStorage.getItem('themeListColor');
  }
  //设置背景图
  setBgImg(url) {
    if (url == '0') {
      localStorage.setItem('themeBgImg', '');
      document.body.style.backgroundImage = root.getPropertyValue('--bg-image');
    } else {
      localStorage.setItem('themeBgImg', url);
      theme_bgImg = localStorage.getItem('themeBgImg');
      document.body.style.backgroundImage = `url('${theme_bgImg}')`;
    }
  }
}
const theme = new Theme();
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
      theme.setBgImg(JSON.parse(val)["bg"]);
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
  dialogDisplay(`${songName.innerText}&nbsp;-&nbsp;${singerName.innerText}<br><br>点击右边三个点下载<br><audio controls="controls"><source id="tempAudio" src="${mp3Url}"></audio><br>ios下载通道: <a href="${mp3Url}" target="_blank" rel="noopener noreferrer">点击跳转下载</a>`);
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
  dialogDisplay('『我的喜欢』即将开发……');
}

//选择显示列表/内容
//按钮高亮与取消高亮
class Highlight {
  yes(obj) {
    theme_btnColor = localStorage.getItem('themeBtnColor');
    obj.style.backgroundColor = theme_btnColor;
    obj.style.fontSize = "14px";
    obj.style.color = "rgb(0, 0, 0)";
  }
  no(obj) {
    obj.style.backgroundColor = "rgba(250, 250, 250, 0)";
    obj.style.fontSize = "12px";
    obj.style.color = "rgb(95, 95, 95)";
  }
}
const HL = new Highlight();
function listBtn_onclick() {
  displayFlag = 0;
  //高亮当前按钮
  HL.yes(listBtn);
  //取消高亮其他3个按钮
  HL.no(resultBtn);
  HL.no(setBtn);
  HL.no(boxBtn);
  iframe.displayChange('play');
}
function resultBtn_onclick() {
  displayFlag = 1;
  HL.yes(resultBtn);
  HL.no(listBtn);
  HL.no(setBtn);
  HL.no(boxBtn);
  iframe.displayChange('search');
}
function setBtn_onclick() {
  displayFlag = 999;
  HL.yes(setBtn);
  HL.no(resultBtn);
  HL.no(listBtn);
  HL.no(boxBtn);
  iframe.displayChange('set');
}
function boxBtn_onclick() {
  displayFlag = 999;
  HL.yes(boxBtn);
  HL.no(setBtn);
  HL.no(resultBtn);
  HL.no(listBtn);
  iframe.displayChange('box');
}

//当前播放的列表
function list_now(flag) {
  if (flag == 0) {
    listBtn.innerHTML = '列表<i class="fa fa-music"></i>';
    listBtn.style.color
    resultBtn.innerHTML = "搜索";
  }
  else {
    resultBtn.innerHTML = '搜索<i class="fa fa-music"></i>';
    listBtn.innerHTML = "列表";
  }
}

//弹窗
function dialogDisplay(content) {
  dialog.innerHTML = content + '<p><br><div><button id="closeBtn">关闭</button></div>';
  dialog.showModal();
  var closeBtn = document.getElementById('closeBtn');
  closeBtn.style.height = "30px";
  closeBtn.style.width = "50%";
  closeBtn.style.outline = "0";
  closeBtn.style.borderRadius = "20px";
  closeBtn.style.backgroundColor = "rgba(255,180,180,0.5)";
  closeBtn.style.border = "0px";
  closeBtn.addEventListener('touchstart', function () {
    closeBtn.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
  })
  closeBtn.addEventListener('mousedown', function () {
    closeBtn.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
  })
  closeBtn.addEventListener('mouseup', function () {
    closeBtn.style.backgroundColor = 'rgba(0,0,0,0)';
  });
  closeBtn.onclick = function () {
    dialog.close();
  }
}

//无按钮弹窗
function dialog_none_btn(action, content = "") {
  if (action == 'open') {
    dialog.innerHTML = content;
    dialog.showModal();
  }
  else {
    dialog.close();
  }
}

// 播放器
controls.style.backgroundColor = 'rgba(181, 232, 255, 0)'; // 背景颜色
controls.style.borderRadius = "0px"
controls.style.height = "30px";
controls.style.width = "100%";
// 检查是否为移动设备
function isMobile() {
  return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('Mobile') !== -1;
}


//全局变量定义
var lrc = [{ "lineLyric": "歌词加载中……", "time": "2" }, { "lineLyric": "", "time": "4" }];
var lrc_count = 0;
var mp3Url = "";
var displayFlag = 0;
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
var root = getComputedStyle(document.documentElement);
var setTimer = 0;
var setTimedFlag = false;
var version_span = document.getElementById('version_span');
var Version = '3.0.9';

//音频播放监听与更新歌词
lrc1.style.color = theme_lrcColor;
player.on('timeupdate', event => {
  if (lrc_count - 10 > 0) {
    var time_front_10 = Math.floor(parseFloat(lrc[lrc_count - 10]["time"])); // 向下取整，得到整数格式
  }
  if (lrc_count - 5 > 0) {
    var time_front_5 = Math.floor(parseFloat(lrc[lrc_count - 5]["time"])); // 向下取整，得到整数格式
  }
  var time_front = Math.floor(parseFloat(lrc[lrc_count]["time"])); // 向下取整，得到整数格式
  if (lrc_count + 1 < lrc.length) {
    var time_after = Math.floor(parseFloat(lrc[lrc_count + 1]["time"])); // 向下取整，得到整数格式
  }
  if (lrc_count + 5 < lrc.length) {
    var time_after_5 = Math.floor(parseFloat(lrc[lrc_count + 5]["time"])); // 向下取整，得到整数格式
  }
  if (lrc_count + 10 < lrc.length) {
    var time_after_10 = Math.floor(parseFloat(lrc[lrc_count + 10]["time"])); // 向下取整，得到整数格式
  }
  var plyr_time = event.detail.plyr.currentTime;  // 当前时间（单位：秒）
  var plyr_duration = event.detail.plyr.duration;  // 音频总时长（单位：秒）
  if (plyr_time > 3 && plyr_time == plyr_duration) {
    if (modeFlag == 1) {
      event.detail.plyr.currentTime = 0;
      event.detail.plyr.play();
      lrc_count = 0;
    }
    else {
      console.log('已自动下一首');
      iframe.nextPlay(1);
    }
  }
  lrc1.innerHTML = lrc[lrc_count]["lineLyric"].slice(0, 50);
  if (lrc_count + 1 < lrc.length) {
    lrc2.innerHTML = lrc[lrc_count + 1]["lineLyric"].slice(0, 50);
    if ((lrc1.innerHTML.length > 20 || lrc2.innerHTML.length > 20) && isMobile()) {
      lrc1.style.fontSize = "12px";
      lrc2.style.fontSize = "12px";
    }
    else {
      lrc1.style.fontSize = "15px";
      lrc2.style.fontSize = "15px";
    }
  }
  if (lrc_count + 1 == lrc.length) {
    lrc2.innerHTML = '--end--';
  }
  if (plyr_time > time_after && lrc_count < lrc.length) lrc_count++;
  if (plyr_time < time_front && lrc_count > 0) lrc_count--;
  if (plyr_time > time_after_5 && lrc_count + 5 < lrc.length) lrc_count += 5;
  if (plyr_time < time_front_5 && lrc_count - 5 > 0) lrc_count -= 5;
  if (plyr_time > time_after_10 && lrc_count + 10 < lrc.length) lrc_count += 10;
  if (plyr_time < time_front_10 && lrc_count - 10 > 0) lrc_count -= 10;
});

//物理按键监听
document.addEventListener('keydown', function (event) { // 监听键盘按下事件
  if (event.key === 'Enter') { // 如果按下的是回车键
    search_onclick();
  }
})


function getMusic(rid) {
  //获取歌词
  var xhrLrc = new XMLHttpRequest();
  xhrLrc.open('get', 'http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/lrc/?rid=' + rid);
  xhrLrc.send();
  xhrLrc.onreadystatechange = function () {
    if (xhrLrc.readyState == 4 && xhrLrc.status == 200) {
      lrc = JSON.parse(xhrLrc.responseText);
      if (lrc == null) {
        lrc = [{ "lineLyric": "纯音乐 请欣赏", "time": "999" }]
      }
    }
    else if (xhrLrc.status == 433) {
      lrc = [{ "lineLyric": "", "time": "5" }, { "lineLyric": "歌词获取出错，请稍后重试", "time": "999" }]
    }
  }

  //获取歌曲链接
  var xhrSong = new XMLHttpRequest();
  xhrSong.open('get', 'http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/rid/?rid=' + rid);
  xhrSong.send();
  xhrSong.onreadystatechange = function () {
    if (xhrSong.readyState == 4 && xhrSong.status == 200) {
      mp3Url = xhrSong.responseText;
      playerPlay(mp3Url);
    }
  }
}


//播放音乐
function playerPlay(url) {
  audioPlayer.src = url;
  audioPlayer.play();
}

//切换歌曲
function switchSongs(parameter) {
  lrc_count = 0;
  audioPlayer.pause();
  lrc = [{ "lineLyric": "歌词加载中……", "time": "2" }, { "lineLyric": "", "time": "4" }];
  cover.src = parameter["pic"];
  var name = parameter['name'];
  var singer = parameter['artist'];
  songName.innerHTML = name.slice(0, 15 + (name.length - name.replace(/&[a-z]+;/g, " ").length));
  singerName.innerHTML = singer.slice(0, 15 + (singer.length - singer.replace(/&[a-z]+;/g, " ").length));
  document.title = `XF音乐盒(${name.replace(/&[a-z]+;/g, " ")})`;
  getMusic(parameter["rid"]);
}

function search_onclick() {
  if (SearchContent.value == "") {
    dialogDisplay('请输入歌曲/歌手');
  }
  else {
    let reg = /#\d{5}/;
    if (reg.test(SearchContent.value)) {
      dialogDisplay('搜索歌单请前往『音乐盒』')
    } else {
      dialogDisplay('歌曲搜索功能维护中……');
      return;
      iframe.pageNum = 1;
      iframe.getSearchResult(SearchContent.value);
      dialog_none_btn(action = 'open', content = '正在搜索……');
    }
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
// 使用实例
var myIframe = document.getElementById('iframe');
onIFrameLoaded(myIframe, function () {
  console.log('iframe已加载完成');
  // 执行其他逻辑
  theme.init();
  listBtn_onclick();
});

function inputBlur() {
  SearchContent.blur();
}

/*听歌时长的初始化与获取*/
if (localStorage.getItem('playTime') === null || localStorage.getItem('playTime') === undefined) {
  localStorage.setItem('playTime', 0);
  console.log('听歌时长初始化')
}
//定时关闭
function setTimedStop() {
  if (!(/^\d+$/.test(iframe.document.getElementById('setTimer').value))) {
    dialogDisplay('请输入正确的数字');
    return;
  }
  setTimer = (iframe.document.getElementById('setTimer').value) * 60 + getTimestamp();
  if (iframe.document.getElementById('setTimer').value == '0') {
    setTimedFlag = false;
    iframe.document.getElementById('timerTips').innerHTML = '定时已关闭';
  }
  else {
    setTimedFlag = true;
    dialogDisplay(`将于${iframe.document.getElementById('setTimer').value}分钟后停止播放`);
    iframe.document.getElementById('timerTips').innerHTML = '定时已开启';
  }
}
//获取时间戳
function getTimestamp() {
  let now = new Date();
  let timestamp = Math.round(now.getTime() / 1000);
  return timestamp;
}
//计时
audioPlayer.addEventListener('play', function () {
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
});
audioPlayer.addEventListener("pause", function () {
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
if (localStorage.getItem('musicBoxList') == null) {
  localStorage.setItem('musicBoxList', "[]");
}

//版本升级消息
if (localStorage.getItem('Version') !== Version) {
  dialogDisplay(`<font color="#323232">v${Version}更新<br><br>1.修复一些问题 提高兼容性<br>2.APP上线 听歌更方便<a target="_blank" href="http://ali.mu-jie.cc/static/%E6%98%94%E6%9E%AB%E9%9F%B3%E4%B9%90%E7%9B%92.apk"><br>点击下载</a>(仅安卓)<br>或前往『设置→关于』下载</font>`);
  //dialogDisplay(`<font color="#323232">音乐盒APP 听歌更方便<a target="_blank" href="http://ali.mu-jie.cc/static/%E6%98%94%E6%9E%AB%E9%9F%B3%E4%B9%90%E7%9B%92.apk"><br>点击下载</a>(仅安卓)<br>或前往『设置→关于』下载</font>`);
  localStorage.setItem('Version', Version)
}
version_span.innerHTML = '3.0.9';

//访问量统计(个人搭建，不支持其他url)
if (window.location.href == 'https://mu-jie.cc/musicBox/') {
  fetch('http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/visits/')
    .then(response => response.text())
    .then(data => {
      console.log(data);
      document.getElementById('visits_span').innerHTML = data;
    })
    .catch(error => console.error(error));
}

if (window.location.href == 'https://music-box-lilac.vercel.app/') {
  dialog.close();
  dialogDisplay('该页面为测试版，请点击<br><a href="https://mu-jie.cc/musicBox/">https://mu-jie.cc/musicBox/</a>访问正式版本<br>国内无需魔法即可直接访问');
}

const like = document.querySelector("#cover");
like.addEventListener('dblclick', likeOnclick);

//调用子页面函数
//iframe.函数名()



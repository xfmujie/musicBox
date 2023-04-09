const player = new Plyr('audio');
// 获取Plyr音频播放器控制按钮节点
const controls = document.querySelector('.plyr__controls');

// 创建下载按钮
const download = document.createElement("button");
download.style.width = "30px";
download.style.height = "28px";
download.style.border = "0px";
download.innerHTML = '<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 480 560"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M2 334.5c-3.8 8.8-2 19 4.6 26l136 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l136-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L128 0C110.3 0 96 14.3 96 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"/></svg>';
download.style.backgroundColor = "rgba(0,0,0,0)";  // 设置背景颜色
download.style.borderRadius = "3px";
download.style.fill = "rgba(74, 84, 100, 0.9)";
download.addEventListener('touchstart', function () {
  download.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
})
download.addEventListener('mousedown', function () {
  download.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
})
download.addEventListener('mouseup', function () {
  download.style.backgroundColor = 'rgba(0,0,0,0)';
});
download.onclick = function () {
  // 下载点击
  dialogDisplay('点击右边三个点下载<br><p><br><audio controls="controls"><source id="tempAudio" src="' + mp3Url + '"></audio>');
}

// 创建播放模式按钮
const playbackMode = document.createElement("button");
var modeFlag = localStorage.getItem('modeFlag');
if (modeFlag == null) { modeFlag = 0; }
var orderSvg = '<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>';
var loopSvg = '<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M109.7 160H160c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V64C0 46.3 14.3 32 32 32s32 14.3 32 32v51.2L81.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L109.7 160z"/></svg>';
playbackMode.style.width = "30px";
playbackMode.style.weight = "28px";
playbackMode.style.border = "0px";
playbackMode.style.backgroundColor = "rgba(0,0,0,0)";  // 设置背景颜色
playbackMode.style.borderRadius = "3px";
playbackMode.style.fill = "rgba(74, 84, 100, 0.9)";
playbackMode.addEventListener('touchstart', function () {
  playbackMode.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
})
playbackMode.addEventListener('mousedown', function () {
  playbackMode.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
})
playbackMode.addEventListener('mouseup', function () {
  playbackMode.style.backgroundColor = 'rgba(0,0,0,0)';
});
if (modeFlag == 0) {
  playbackMode.innerHTML = orderSvg;
}
else {
  playbackMode.innerHTML = loopSvg;
}
playbackMode.onclick = function () {
  //播放模式点击
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
}

// 创建上一首按钮
const previous = document.createElement("button");
previous.style.width = "30px";
previous.style.weight = "28px";
previous.style.border = "0px";
previous.innerHTML = '<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7V416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V96C0 78.3 14.3 64 32 64s32 14.3 32 32V214.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96V214.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96V416c0 12.4-7.2 23.7-18.4 29z"/></svg>';
previous.style.backgroundColor = "rgba(0,0,0,0)";  // 设置背景颜色
previous.style.borderRadius = "3px";
previous.style.fill = "rgba(74, 84, 100, 0.9)";
previous.addEventListener('touchstart', function () {
  previous.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
})
previous.addEventListener('mousedown', function () {
  previous.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
})
previous.addEventListener('mouseup', function () {
  previous.style.backgroundColor = 'rgba(0,0,0,0)';
});
previous.onclick = function () {
  //上一首点击
  //alert('上一首');
  //dialogDisplay('上一首');
  document.getElementById('iframe').contentWindow.nextPlay(0);
}


// 创建下一首按钮
const next = document.createElement("button");
next.style.width = "30px";
next.style.weight = "28px";
next.style.border = "0px";
next.innerHTML = '<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7V416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7V416c0 17.7 14.3 32 32 32s32-14.3 32-32V96c0-17.7-14.3-32-32-32s-32 14.3-32 32V214.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96V214.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96V416c0 12.4 7.2 23.7 18.4 29z"/></svg>';
next.style.backgroundColor = "rgba(0,0,0,0)";  // 设置背景颜色
next.style.borderRadius = "3px";
next.style.fill = "rgba(74, 84, 100, 0.9)";
next.addEventListener('touchstart', function () {
  next.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
})
next.addEventListener('mousedown', function () {
  next.style.backgroundColor = 'rgba(0, 179, 255, 0.6)';
})
next.addEventListener('mouseup', function () {
  next.style.backgroundColor = 'rgba(0,0,0,0)';
});
next.onclick = function () {
  //下一首点击
  //alert('下一首');
  //dialogDisplay('下一首');
  document.getElementById('iframe').contentWindow.nextPlay(1);
}

//将新增按钮放置到html
controls.appendChild(download);
controls.appendChild(previous);
controls.appendChild(playbackMode);
controls.appendChild(next);

//选择列表
function listBtn_onclick() {
  listBtn.style.backgroundColor = "#e5f1fa";
  listBtn.style.fontSize = "14px";
  listBtn.style.color = "rgb(0, 0, 0)";
  resultBtn.style.backgroundColor = "rgba(250, 250, 250, 0)";
  resultBtn.style.fontSize = "12px";
  resultBtn.style.color = "rgb(95, 95, 95)";
  document.getElementById('iframe').contentWindow.displayChange('play');
}
function resultBtn_onclick() {
  resultBtn.style.backgroundColor = "#e5f1fa";
  resultBtn.style.fontSize = "14px";
  resultBtn.style.color = "rgb(0, 0, 0)";
  listBtn.style.backgroundColor = "rgba(250, 250, 250, 0)";
  listBtn.style.fontSize = "12px";
  listBtn.style.color = "rgb(95, 95, 95)";
  document.getElementById('iframe').contentWindow.displayChange('search');
}

//当前播放的列表
function list_now(flag) {
  if (flag == 0) {
    listBtn.innerHTML = "播放列表🎵";
    resultBtn.innerHTML = "搜索结果";
  }
  else {
    resultBtn.innerHTML = "搜索结果🎵";
    listBtn.innerHTML = "播放列表";
  }
}


//弹窗  ❌
function dialogDisplay(content) {
  dialog.innerHTML = content + '<p><br><div><button id="closeBtn">关闭</button></div>';
  dialog.showModal();
  var closeBtn = document.getElementById('closeBtn');
  closeBtn.style.height = "30px";
  closeBtn.style.width = "50%";
  closeBtn.style.outline = "0";
  closeBtn.style.borderRadius = "20px";
  //closeBtn.style.marginLeft = "25%";
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
let lrc = [{ "lineLyric": "歌词加载中……", "time": "2" }, { "lineLyric": "", "time": "4" }];
var lrc_count = 0;
var mp3Url = "";
var lrc1 = document.getElementById('lrc1');
var lrc2 = document.getElementById('lrc2');
var cover = document.getElementById('cover');
var songName = document.getElementById('songName');
var singerName = document.getElementById('singerName');
var dialog = document.getElementById('dialog');
var SearchContent = document.getElementById('search_box');
var listBtn = document.getElementById('listBtn');
var resultBtn = document.getElementById('resultBtn');


//音频播放监听与更新歌词
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
      document.getElementById('iframe').contentWindow.nextPlay(1);
    }
  }
  lrc1.innerHTML = lrc[lrc_count]["lineLyric"].slice(0, 50);
  if (lrc_count + 1 < lrc.length) {
    lrc2.innerHTML = lrc[lrc_count + 1]["lineLyric"].slice(0, 50);
    if ((lrc1.innerHTML.length > 15 || lrc2.innerHTML.length > 15) && isMobile()) {
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
  xhrLrc.open('get', 'https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=' + rid + '&httpsStatus=1&reqId=4af22230-c8bd-11ed-af8a-55d47a6ff667');
  xhrLrc.send();
  xhrLrc.onreadystatechange = function () {
    if (xhrLrc.readyState == 4 && xhrLrc.status == 200) {
      var lrcJson = JSON.parse(xhrLrc.responseText);
      lrc = lrcJson["data"]["lrclist"];
      if (lrc == null) {
        lrc = [{ "lineLyric": "纯音乐 请欣赏", "time": "999" }]
      }
    }
  }

  //获取歌曲链接
  var xhrSong = new XMLHttpRequest();
  xhrSong.open('get', 'https://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/rid/?rid=' + rid);
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
  var audioPlayer = document.getElementById('music');
  audioPlayer.src = url;
  audioPlayer.pause();
  audioPlayer.play();
}

//切换歌曲
function switchSongs(parameter) {
  lrc_count = 0;
  cover.src = parameter["pic"];
  var name = parameter['name'];
  var singer = parameter['artist'];
  songName.innerHTML = name.slice(0, 15 + (name.length - name.replace(/&[a-z]+;/g, " ").length));
  singerName.innerHTML = singer.slice(0, 15 + (singer.length - singer.replace(/&[a-z]+;/g, " ").length));
  lrc = [{ "lineLyric": "歌词加载中……", "time": "2" }, { "lineLyric": "", "time": "4" }];
  getMusic(parameter["rid"]);
}

function search_onclick() {
  if (SearchContent.value == "") {
    dialogDisplay('请输入歌曲/歌手~');
  }
  else {
    document.getElementById('iframe').contentWindow.getSearchResult(SearchContent.value);
    dialog_none_btn(action = 'open', content = '正在搜索……');
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
  listBtn_onclick();
});

function inputBlur() {
  SearchContent.blur();
}



//调用子页面函数
//document.getElementById('iframe').contentWindow.函数名()

//获取搜索结果
function getSearchResult(SearchContent) {
  var xhrList = new XMLHttpRequest();
  let name = SearchContent;
  if (SearchContent !== oldContent) {
    pageNum = 1;
  }
  xhrList.open('get', `http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/?name=${name}&pn=${pageNum}`);
  xhrList.send();
  waitTime();  //计时
  xhrList.onreadystatechange = function () {
    if (xhrList.readyState == 4 && xhrList.status == 200) {
      window.parent.dialog_none_btn(action = 'close');
      clearTimeout(timer);
      count = 0;
      window.parent.inputBlur();
      if (JSON.parse(xhrList.responseText)[0] === undefined) {
        window.parent.dialogDisplay('没有更多歌曲~');
        pageNum--;
        return;
      }
      searchList = JSON.parse(xhrList.responseText);
      remove();
      displayChange('search');  //更换显示内容
      window.parent.resultBtn_onclick();  //自动点击搜索结果
      scrollToTop();
      oldContent = SearchContent;

    }
    else if (xhrList.status == 433) {
      clearTimeout(timer);
      count = 0;
      window.parent.dialog_none_btn(action = 'close');
      window.parent.dialog_none_btn(action = 'open', content = '出错了，请重新搜索~');
      autoCLose = true;
      waitTime();
    }
  }
}


//等待
function waitTime() {
  timer = setTimeout(waitTime, 200);
  count++;
  console.log(count);
  if (autoCLose == true && count > 7) {
    window.parent.dialog_none_btn(action = 'close');
    clearTimeout(timer);
    count = 0;
    autoCLose = false;
  }
  else {
    if (count > 25) {
      window.parent.dialog_none_btn(action = 'close');
      window.parent.dialog_none_btn(action = 'open', content = '出错了，请重试~');
      clearTimeout(timer);
      count = 0;
      autoCLose = true;
      waitTime();
    }
  }
}

//显示列表
function cloned(clonedList) {
  console.log(clonedList);
  for (let i = 0; i < clonedList.length; i++) {
    var originalDiv = document.getElementById('song_box');    // 获取原始div元素
    originalDiv.style.backgroundColor = window.parent.localStorage.getItem('themeListColor');
    var clonedDiv = originalDiv.cloneNode(true);    // 复制原始div元素及其所有子元素和属性
    clonedDiv.classList.remove('song_box');               // 移除克隆节点上的旧类名
    clonedDiv.classList.add('new_song_box');                  // 添加克隆节点上的新类名
    var iStr = i.toString();
    clonedDiv.style.display = "flex";
    //获取元素
    var songNameld = clonedDiv.querySelector('.songName');
    var del_btnid = clonedDiv.querySelector('#del_btn');
    var play_btnid = clonedDiv.querySelector('#play_btn');
    //更改元素id
    songNameld.setAttribute('id', `songName${iStr}`);
    del_btnid.setAttribute('id', `del_btn${iStr}`);
    play_btnid.setAttribute('id', `play_btn${iStr}`)
    //更改元素内容
    let songNum = clonedDiv.querySelector('#songNum');
    songNum.textContent = (i + 1).toString().padStart(2, '0'); // 将数字转换成字符串并在左侧填充0以达到2位整数的效果;
    if (i == lastRid && (playListFlag == window.parent.displayFlag)) {
      songNum.innerHTML = '<i class="fa fa-music"></i>';
      songNum.style.color = 'rgb(0, 179, 255)';
      songNum.style.fontSize = '20px';
    }  
  
    var name = clonedList[i]['name'];
    var singer = clonedList[i]['artist'];
    clonedDiv.querySelector(`#songName${iStr}`).innerHTML = name.slice(0, 20 + (name.length - name.replace(/&[a-z]+;/g, " ").length)) + '<br><p class="singerName">' + singer.slice(0, 25 + (singer.length - singer.replace(/&[a-z]+;/g, " ").length)) + '</p>';
    document.body.appendChild(clonedDiv);// 将克隆的div元素添加到页面上
  }
}

//清空显示
function remove() {
  if (isAgain) {
    // 获取所有类名为'my-class'的元素
    var elements = document.querySelectorAll('.new_song_box');
    // 遍历元素并删除它们
    elements.forEach(function (element) {
      element.remove(); // 删除元素
    });
  }
}

//操作按钮按下（对播放列表操作，设置缓存）
function add_del_onclick() {
  for (let i = 0; i < displayList.length; i++) {
    document.getElementById(`del_btn${i}`).onclick = function () {
      console.log(`add_del_${i}按下了`)

      if (displayFlag === 'search') {
        var pic = displayList[i]["pic"];
        pic = pic.replace(/\/\d+\//, "/300/");
        var addSong = {
          "rid": displayList[i]["rid"],
          "pic": pic,
          "name": displayList[i]["name"],
          "artist": displayList[i]["artist"]
        }
        playList.push(addSong);
        localStorage.setItem('playList', JSON.stringify(playList));
        window.parent.dialogDisplay(`<font size="2px color="#696969">已添加</font><br><font color="#199dfc">${displayList[i]["name"]}(${displayList[i]["artist"]})</font><br><font size="2px color="#696969">到播放列表</font>`)
        //console.log(playList);
      }
      if (displayFlag === 'play') {
        playList.splice(i, 1);
        localStorage.setItem('playList', JSON.stringify(playList));
        console.log(playList);
        displayChange('play');
      }
      if (displayFlag === 'box') {

        let isEnter = confirm(`是否移除歌单《${JSON.parse(window.parent.localStorage.getItem('musicBoxList'))[i]['name']}》？（移除后仍可搜索歌单ID号添加）`);
        if (isEnter) {
          musicBoxList.splice(i, 1);
          window.parent.localStorage.setItem('musicBoxList', JSON.stringify(musicBoxList));
          console.log(musicBoxList);
          displayChange('box');
        }
      }
    }
  }
}

//播放按钮按下
function play_btn_onclick() {
  for (let i = 0; i < displayList.length; i++) {
    document.getElementById(`play_btn${i}`).onclick = function () {
      if (displayFlag !== 'box') {
        console.log(`play_${i}按下了`)
        var pic = displayList[i]["pic"];
        pic = pic.replace(/\/\d+\//, "/300/");
        var parameter = {
          "rid": displayList[i]["rid"],
          "pic": pic,
          "name": displayList[i]["name"],
          "artist": displayList[i]["artist"]
        }
        console.log(displayList);
        console.log(parameter);
        window.parent.switchSongs(parameter);
        lastRid = i;
        if (displayFlag == 'play') {
          playListFlag = 0;
          window.parent.list_now(0);
          window.parent.listBtn_onclick();
        }
        else {
          playListFlag = 1;
          playPage = pageNum;
          window.parent.list_now(1);
          window.parent.resultBtn_onclick();
        }
      } else {
        console.log(`选中歌单${(i + 1).toString()}`);
        let isEnter = confirm("是否覆盖当前播放列表？");
        if (isEnter) {
          localStorage.setItem('playList', window.parent.JSON.stringify(JSON.parse(localStorage.getItem('musicBoxList'))[i]['list']));
        }
        else {
          let list = JSON.parse(window.parent.localStorage.getItem('musicBoxList'))[i]['list'];
          for (let i = 0; i < list.length; i++) {
            playList.push(list[i]);
          }
          localStorage.setItem('playList', JSON.stringify(playList));
          window.parent.dialogDisplay('已添加该歌单到播放列表');
        }
        window.parent.listBtn_onclick();
      }
    }
  }
}

//上一首/下一首触发
function switchSongs(flag) {
  if (flag) {
    if (playListFlag == 0 && lastRid + 1 < playList.length) {
      var nextRid = lastRid + 1;
      lastRid = lastRid + 1;
    }
    else if (playListFlag == 0 && lastRid + 1 >= playList.length) {
      nextRid = 0;
      lastRid = 0;
    }
    else if (playListFlag == 1 && lastRid + 1 < searchList.length) {

      nextRid = lastRid + 1;
      lastRid = lastRid + 1;
    }
    else if (playListFlag == 1 && lastRid + 1 >= searchList.length) {
      nextRid = 0;
      lastRid = 0;
    }
  }
  else {
    if (playListFlag == 0 && lastRid == 0) {
      var nextRid = playList.length - 1;
      lastRid = playList.length - 1;
    }
    else if (playListFlag == 0 && lastRid != 0) {
      nextRid = lastRid - 1;
      lastRid = lastRid - 1;
    }
    else if (playListFlag == 1 && lastRid == 0) {
      nextRid = searchList.length - 1;
      lastRid = searchList.length - 1;
    }
    else if (playListFlag == 1 && lastRid != 0) {
      nextRid = lastRid - 1;
      lastRid = lastRid - 1;
    }
  }
  return nextRid;
}


//上一首/下一首开始播放
function nextPlay(flag) {
  var nextRid = switchSongs(flag);
  if (playListFlag) {
    var List = searchList;
    var pic = List[nextRid]["pic"];
    pic = pic.replace(/\/\d+\//, "/300/");
    if (displayFlag == 'search') {
      window.parent.resultBtn_onclick();
    }
  }
  else {
    List = playList;
    pic = List[nextRid]["pic"];
    if (displayFlag == 'play') {
      window.parent.listBtn_onclick();
    }
  }

  var parameter = {
    "rid": List[nextRid]["rid"],
    "pic": pic,
    "name": List[nextRid]["name"],
    "artist": List[nextRid]["artist"]
  }
  console.log(List);
  console.log(parameter);
  window.parent.switchSongs(parameter);
}


//更换显示列表
function displayChange(flag) {
  if (flag == 'play') {
    document.getElementById('del_btn').innerHTML = '<i class="fa fa-trash-o"></i>';
    document.getElementById('play_btn').innerHTML = '<i class="fa fa-play-circle">';
    remove();
    playList = JSON.parse(localStorage.getItem('playList'));
    displayList = playList;
    set.style.display = 'none';
    box.style.display = 'none';
    page_num.style.display = 'none';
    if (playList.length > 0) {
      saveBtn.style.display = 'block';
      clearBtn.style.display = 'block';
    } else {
      saveBtn.style.display = 'none';
      clearBtn.style.display = 'none';
    }
    cloned(displayList);
    isAgain = true;
    play_btn_onclick();
    add_del_onclick();
    displayFlag = 'play';
  }
  else if (flag == 'search') {
    document.getElementById('del_btn').innerHTML = '<i class="fa fa-plus"></i>';
    document.getElementById('play_btn').innerHTML = '<i class="fa fa-play-circle">';
    remove();
    set.style.display = 'none';
    box.style.display = 'none';
    saveBtn.style.display = 'none';
    clearBtn.style.display = 'none';
    displayList = searchList;
    cloned(displayList);
    isAgain = true;
    play_btn_onclick();
    add_del_onclick();
    displayFlag = 'search';
    if (displayList.length > 0) {
      page_num.style.display = 'inline';
      document.documentElement.style.setProperty('--list-lenght', `${displayList.length}`);
      document.getElementById('pageNum').innerHTML = `${pageNum}`
    }
  }
  else if (flag == 'box') {
    document.getElementById('del_btn').innerHTML = '<i class="fa fa-trash-o"></i>';
    document.getElementById('play_btn').innerHTML = '<i class="fa fa-plus"></i>';
    remove();
    set.style.display = 'none';
    box.style.display = 'block';
    saveBtn.style.display = 'none';
    clearBtn.style.display = 'none';
    page_num.style.display = 'none';
    musicBoxList = JSON.parse(window.parent.localStorage.getItem('musicBoxList'));
    displayList = musicBoxList;
    cloned(displayList);
    //console.log(displayList);
    isAgain = true;
    play_btn_onclick();
    add_del_onclick();
    displayFlag = 'box';
  }
  else if (flag == 'set') {
    remove();
    box.style.display = 'none';
    set.style.display = 'block';
    saveBtn.style.display = 'none';
    clearBtn.style.display = 'none';
    page_num.style.display = 'none';
    loadplayTime(window.parent.getPlayTime());
  }
}


//全局变量定义
var displayList = [];
var playList = JSON.parse(localStorage.getItem('playList'));
var searchList = [];
var count = 0;
var timer = 0;
var autoCLose = false;
var isAgain = false;
var displayFlag = 'play';
var playListFlag = 0;
var lastRid = 999;
var strayBirdsYiyan = "";
var set = document.getElementById('set_box');
var box = document.getElementById('box_box');
var playTime = document.getElementById('play_time');
var yiyan = document.getElementById('yiyan');
var saveBtn = document.getElementById('saveList');
var clearBtn = document.getElementById('clear');
var musicBoxList = [];
var idSearch = document.getElementById('idValue');
var page_num = document.getElementById('page_num');
var pageNum = 1;
var oldContent = '';
var playPage = 0;

//缓存初始化
if (localStorage.getItem('playList') == null) {
  localStorage.setItem('playList', "[]");
  displayChange('play');

  console.log('缓存空空如也');
}
function loadplayTime(time) {
  playTime.innerHTML = `本月已为你播放:<br>${time}`;
}


/*飞鸟集一言*/
getStrayBirds();
function getStrayBirds() {
  var xhrGetStrayBirds = new XMLHttpRequest();
  xhrGetStrayBirds.open('get', 'https://api.mu-jie.cc/stray-birds/range?from=1&type=json');
  xhrGetStrayBirds.send();
  xhrGetStrayBirds.onreadystatechange = function () {
    if (xhrGetStrayBirds.readyState == 4 && xhrGetStrayBirds.status == 200) {
      strayBirdsYiyan = JSON.parse(xhrGetStrayBirds.responseText);
      yiyan.innerHTML = `${strayBirdsYiyan["cn"]}<br>——泰戈尔《飞鸟集》【${strayBirdsYiyan["num"]}】`;
    }
  }
}

/*确定颜色 主题*/
var a = document.getElementsByTagName('a');
var setVal = document.getElementsByClassName('set_val');
function set_a_enter(i) {
  switch (i) {
    //set_a_0
    case 0: if (setVal[i].value !== '') {
      window.parent.theme_set('list', setVal[i].value);
      if (setVal[i].value == '0') {
        window.parent.dialogDisplay(`列表颜色已重置`);
      }
      else {
        window.parent.dialogDisplay(`列表颜色已设置为${setVal[i].value}`);
      }
      setVal[i].value = '';
    }
      break;
    //set_a_1
    case 1: if (setVal[i].value !== '') {
      window.parent.theme_set('btn', setVal[i].value);
      if (setVal[i].value == '0') {
        window.parent.dialogDisplay(`选项卡颜色已重置`);
      }
      else {
        window.parent.dialogDisplay(`选项卡颜色已设置为${setVal[i].value}`);
      }
      setVal[i].value = '';
    }
      break;
    //set_a_2
    case 2: if (setVal[i].value !== '') {
      window.parent.theme_set('lrc', setVal[i].value);
      if (setVal[i].value == '0') {
        window.parent.dialogDisplay(`歌词高亮颜色已重置`);
      }
      else {
        window.parent.dialogDisplay(`歌词高亮颜色已设置为${setVal[i].value}`);
      }
      setVal[i].value = '';
    }
      break;
    //set_a_3
    case 3: if (setVal[i].value !== '') {
      window.parent.theme_set('bg', setVal[i].value);
      if (setVal[i].value == '0') {
        window.parent.dialogDisplay(`背景图片已重置`);
      }
      else {
        window.parent.dialogDisplay(`背景图片已设置为<br><img  height="220px" src="${setVal[i].value}"/>`);
      }
      setVal[i].value = '';
    }
      break;
    //set_a_4
    case 4: var val = prompt("将主题参数粘贴到此处", "");
      if (val !== null && val !== '') {
        window.parent.theme_set('import', val);
      }
      break;
    //set_a_5
    case 5: window.parent.dialogDisplay(`全选复制以下主题参数：<br><br><input type='text' style='width: 100%; height: 30px;' value='${window.parent.theme_set('export')}'>`);
  }
}
function clear_onclick() {
  let isEnter = confirm("是否清空当前播放列表？");
  if (isEnter) {
    localStorage.setItem('playList', '[]');
    displayChange('play');
  }
}

/*音乐盒（歌单）*/
function save_onclick() {
  let name = prompt("设置歌单名称", "");
  if (name) {
    importFromPlay(name);
  }
}

//从播放列表保存歌单到云端和本地音乐盒
function importFromPlay(name) {
  let list = {
    'name': name,
    'list': displayList
  }
  var musicBoxData = new XMLHttpRequest();
  musicBoxData.open('post', 'http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/music-box-list/?method=post');
  musicBoxData.setRequestHeader('Content-Type', 'application/json');
  musicBoxData.send(JSON.stringify(list));
  window.parent.dialog_none_btn(action = 'open', content = '正在添加……');
  musicBoxData.onreadystatechange = function () {
    if (musicBoxData.readyState == 4 && musicBoxData.status == 200) {
      window.parent.dialog_none_btn(action = 'close');
      list = {
        'name': name,
        //此处artist为歌单的ID号
        'artist': `ID${musicBoxData.responseText}`,
        'list': displayList
      };
      window.parent.dialogDisplay(`<font size="2px color="#696969">歌单</font><br><font color="#199dfc">《${name}》</font><br><font size="2px color="#696969">已保存到音乐盒</font>`);
      musicBoxList = JSON.parse(window.parent.localStorage.getItem('musicBoxList'));
      musicBoxList.push(list);
      window.parent.localStorage.setItem('musicBoxList', JSON.stringify(musicBoxList));
      window.parent.boxBtn_onclick();
    }
  }
}

function onkey(event) {
  // 判断按下的键是否是 Enter 键，键码为 13
  if (event.keyCode === 13) {
    getSongList();
  }
}

//从云端获取歌单
function getSongList() {
  let ID = idSearch.value;
  let reg1 = /^\d{5}/;
  let reg2 = /\d{10,}/g;
  let par = '';
  if (!reg1.test(ID) && !reg2.test(ID)) {
    window.parent.dialogDisplay('请输入正确的歌单ID (如: 10000)<br>或酷我歌单链接');
    return;
  }
  if (reg1.test(ID))
    par = `/music-box-list/?method=get&id=${ID}`;
  else
    par = `/kuwolist/?id=${ID.match(reg2)[0]}`;
  var getMusicBoxList = new XMLHttpRequest();
  getMusicBoxList.open('get', `http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com${par}`);
  getMusicBoxList.send();
  window.parent.dialog_none_btn(action = 'open', content = '正在加载歌单……');
  getMusicBoxList.onreadystatechange = function () {
    if (getMusicBoxList.readyState == 4 && getMusicBoxList.status == 200) {
      window.parent.dialog_none_btn('close');
      let responseText = JSON.parse(getMusicBoxList.responseText);
      if (responseText["results"][0] !== undefined) {
        console.log(responseText["results"][0]);
        window.parent.dialogDisplay(`<font size="2px color="#696969">歌单</font><br><font color="#199dfc">《${responseText["results"][0]["Name"]}》</font><br><font size="2px color="#696969">已保存到本地音乐盒</font>`);
        list = {
          'name': responseText["results"][0]["Name"],
          //此处artist为歌单的ID号
          'artist': `ID${responseText["results"][0]["ID"]}`,
          'list': responseText["results"][0]["List"]
        };
        musicBoxList = JSON.parse(window.parent.localStorage.getItem('musicBoxList'));
        musicBoxList.push(list);
        window.parent.localStorage.setItem('musicBoxList', JSON.stringify(musicBoxList));
        window.parent.boxBtn_onclick();
      } else {
        window.parent.dialogDisplay('歌单不存在~');
      }
    }
  }
}

function flippingPages(flag) {
  if (playListFlag && pageNum == playPage) {
    let isEnter = confirm('正在播放搜索列表，翻页会影响轮播体验，是否继续？');
    if (isEnter == false) {
      return;
    }
  }
  if (flag) {
    pageNum++;
    getSearchResult(oldContent);
    window.parent.dialog_none_btn(action = 'open', content = `<font size="2px color="#696969">正在加载第 </font><font color="#199dfc">${pageNum}</font><font size="2px color="#696969"> 页</font>`);
  }
  else if (pageNum > 1) {
    pageNum--;
    getSearchResult(oldContent);
    window.parent.dialog_none_btn(action = 'open', content = `<font size="2px color="#696969">正在加载第 </font><font color="#199dfc">${pageNum}</font><font size="2px color="#696969"> 页</font>`);
  }
}

// 滚动到顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth' // 平滑滚动
  });
}

//调用父页面函数
//window.parent.函数名();
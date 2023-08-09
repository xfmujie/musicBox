if (window.location.href !== 'http://127.0.0.1:5500/html/songList.html') console.log = function () { };

//获取搜索结果
function getSearchResult(SearchContent) {
  var xhrList = new XMLHttpRequest();
  let name = SearchContent;
  if (SearchContent !== oldContent) {
    pageNum = 1;
  }
  xhrList.open('get', `${BaseURL}/search/${name}/${pageNum}`);
  xhrList.send();
  xhrList.onreadystatechange = function () {
    if (xhrList.readyState == 4 && xhrList.status == 200) {
      window.parent.popup.msgClose();
      window.parent.inputBlur();
      if (JSON.parse(xhrList.responseText)[0] === undefined) {
        window.parent.popup.msg('没有更多歌曲~');
        pageNum--;
        return;
      }
      searchList = JSON.parse(xhrList.responseText);
      window.parent.searchList = JSON.parse(xhrList.responseText);
      remove();
      displayChange('search');  //更换显示内容
      window.parent.resultBtn_onclick();  //自动点击搜索结果
      scrollToTop();
      oldContent = SearchContent;
    }
    if (xhrList.status >= 400) {
      window.parent.popup.msgClose();
      window.parent.popup.msg('出错了！');
    }
  }
}



//显示列表
function cloned(clonedList) {
  console.log(clonedList);
  for (let i = 0; i < clonedList.length; i++) {
    var originalDiv = document.getElementById('song_box');    // 获取原始div元素
    originalDiv.style.backgroundColor = localStorage.getItem('themeListColor');
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
    if (window.parent.displayFlag == 'search') songNum.textContent = ((pageNum - 1) * 30 + i + 1).toString().padStart(2, '0');
    else songNum.textContent = (i + 1).toString().padStart(2, '0');
    if (i == window.parent.playingNum && (playListFlag == window.parent.displayFlag)) {
      songNum.innerHTML = '<i class="fa fa-music"></i>';
      songNum.style.color = 'rgb(0, 179, 255)';
      songNum.style.fontSize = '20px';
    }

    var name = clonedList[i]['name'];
    var singer = clonedList[i]['artist'];
    clonedDiv.querySelector(`#songName${iStr}`).innerHTML = name.slice(0, 20 + (name.length - name.replace(/&[a-z]+;/g, " ").length)) + '<br><p class="singerName">' + singer.slice(0, 25 + (singer.length - singer.replace(/&[a-z]+;/g, " ").length)) + '</p>';
    document.body.appendChild(clonedDiv);// 将克隆的div元素添加到页面上
  }
  window.scrollTo(0, scrollToPx);
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
        if (playFlag == 'like') {
          window.parent.popup.alert('『喜欢』模式下无法进行此操作~');
        }
        else {
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
          window.parent.popup.alert(`<font size="2px color="#696969">已添加</font><br><font color="#199dfc">${displayList[i]["name"]}(${displayList[i]["artist"]})</font><br><font size="2px color="#696969">到播放列表</font>`);
          //console.log(playList);
        }
      }
      if (displayFlag === 'play') {
        if (playFlag !== 'like') {
          playList.splice(i, 1);
          localStorage.setItem('playList', JSON.stringify(playList));
          if (playListFlag == 'play') {
            if (i < window.parent.playingNum) window.parent.playingNum--;
            else if (i == window.parent.playingNum) window.parent.playReset();
          }
          console.log(playList);
          pagePX = pagePX = window.scrollY;
          displayChange('play');
        } else {
          window.parent.popup.confirm(`是否从『喜欢』中移除《${playList[i]['name']}》？`)
            .then(isEnter => {
              if (isEnter) {
                let list = {
                  'name': '我的喜欢',
                  'artist': ``,
                  'list': playList
                }
                playList.splice(i, 1);
                localStorage.setItem('playList', JSON.stringify(playList));
                if (playListFlag == 'play') {
                  if (i < window.parent.playingNum) window.parent.playingNum--;
                  else if (i == window.parent.playingNum) window.parent.playReset();
                }
                console.log(playList);
                pagePX = window.scrollY;
                displayChange('play');
                musicBoxList = JSON.parse(localStorage.getItem('musicBoxList'));
                musicBoxList.splice(0, 1, list);
                localStorage.setItem('musicBoxList', JSON.stringify(musicBoxList));
              }
            });
        }
      }
      if (displayFlag === 'box') {
        if (i !== 0) {
          window.parent.popup.confirm(`是否移除歌单《${JSON.parse(localStorage.getItem('musicBoxList'))[i]['name']}》？（移除后仍可搜索歌单ID号添加）`)
            .then(isEnter => {
              if (isEnter) {
                musicBoxList.splice(i, 1);
                localStorage.setItem('musicBoxList', JSON.stringify(musicBoxList));
                console.log(musicBoxList);
                displayChange('box');
              }
            });
        }
        else {
          window.parent.popup.confirm(`是否清空『我的喜欢』？`)
            .then(isEnter => {
              if (isEnter) {
                likeList('clear', []);
                if (playFlag == 'like') {
                  localStorage.setItem('playList', window.parent.JSON.stringify(JSON.parse(localStorage.getItem('musicBoxList'))[0]['list']));
                  window.parent.listBtn_onclick();
                  window.parent.playReset();
                }
              }
            });
        }
      }
    }
  }
}

//播放按钮按下
function play_btn_onclick() {
  /* window.parent.popup.alert('音乐盒维护中……');
  return; */
  for (let i = 0; i < displayList.length; i++) {
    document.getElementById(`play_btn${i}`).onclick = function () {
      if (displayFlag !== 'box') {
        console.log(`play_${i}按下了`)
        var pic = displayList[i]["pic"];
        pic = pic.replace(/\/\d+\//, "/300/");
        var parameter = {
          rid: displayList[i]["rid"],
          pic: pic,
          name: displayList[i]["name"],
          artist: displayList[i]["artist"],
        }
        console.log(displayList);
        console.log(parameter);
        window.parent.switchSongs(parameter);
        // window.parent.postMessage(parameter, '/');
        window.parent.playingNum = i;
        if (displayFlag == 'play') {
          playListFlag = 'play';
          window.parent.playListFlag = 'play';
          window.parent.list_now(0);
          pagePX = window.scrollY;
          SearchPagePX = 0;
          displayChange('play');
        }
        else {
          playListFlag = 'search';
          window.parent.playListFlag = 'search';
          playPage = pageNum;
          window.parent.list_now(1);
          SearchPagePX = window.scrollY;
          pagePX = 0;
          displayChange('search');
        }
      }
      else {
        if (i !== 0) {
          playFlag = 'normal';
          document.getElementById('clear').innerHTML = '清空播放列表';
          window.parent.list_now('列表');
          console.log(`选中歌单${(i + 1).toString()}`);
          window.parent.popup.confirm("是否覆盖当前播放列表？")
            .then(isEnter => {
              if (isEnter) {
                localStorage.setItem('playList', window.parent.JSON.stringify(JSON.parse(localStorage.getItem('musicBoxList'))[i]['list']));
                if (playListFlag == 'play') window.parent.playReset();
                window.parent.listBtn_onclick();
              }
              else {
                let list = JSON.parse(localStorage.getItem('musicBoxList'))[i]['list'];
                for (let i = 0; i < list.length; i++) {
                  playList.push(list[i]);
                }
                localStorage.setItem('playList', JSON.stringify(playList));
                window.parent.popup.alert('已添加该歌单到播放列表');
                window.parent.listBtn_onclick();
              }
            });
        }
        else {
          window.parent.popup.confirm("将覆盖当前播放列表，是否继续？")
            .then(isEnter => {
              if (isEnter) {
                playFlag = 'like';
                window.parent.list_now('喜欢');
                document.getElementById('clear').innerHTML = '<i class="fa fa-chevron-left"></i> 返回列表';
                localStorage.setItem('playList', window.parent.JSON.stringify(JSON.parse(localStorage.getItem('musicBoxList'))[0]['list']));
                if (playListFlag == 'play') window.parent.playReset();
                window.parent.listBtn_onclick();
              }
            });
        }
      }
    }
  }
}






function playListPageEmDisplay(display) {
  saveBtn.style.display = display;
  clearBtn.style.display = display;
  /* likeBtn.style.display = display; */
}

//更换显示列表
function displayChange(flag) {
  if (flag == 'play') {
    document.getElementById('del_btn').innerHTML = '<i class="fa fa-trash-o"></i>';
    document.getElementById('play_btn').innerHTML = '<i class="fa fa-play-circle">';
    remove();
    playList = JSON.parse(localStorage.getItem('playList'));
    window.parent.playList = playList;
    displayList = playList;
    set.style.display = 'none';
    box.style.display = 'none';
    page_num.style.display = 'none';
    if (playList.length > 0 || playFlag == 'like') {
      playListPageEmDisplay('inline');
    } else {
      playListPageEmDisplay('none');
    }
    scrollToPx = pagePX;
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
    playListPageEmDisplay('none');
    displayList = searchList;
    scrollToPx = SearchPagePX;
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
    box.style.display = 'inline';
    playListPageEmDisplay('none');
    page_num.style.display = 'none';
    musicBoxList = JSON.parse(localStorage.getItem('musicBoxList'));
    displayList = musicBoxList;
    cloned(displayList);
    //console.log(displayList);
    isAgain = true;
    play_btn_onclick();
    add_del_onclick();
    displayFlag = 'box';
    window.scrollTo(0, 0);
  }
  else if (flag == 'set') {
    remove();
    box.style.display = 'none';
    set.style.display = 'inline';
    playListPageEmDisplay('none');
    page_num.style.display = 'none';
    loadplayTime(window.parent.getPlayTime());
    window.scrollTo(0, 0);
  }
}


//全局变量定义
var displayList = [];
var playList = JSON.parse(localStorage.getItem('playList'));
var searchList = [];
var isAgain = false;
var displayFlag = 'play';
var playListFlag = 'play';
var strayBirdsYiyan = "";
var set = document.getElementById('set_box');
var box = document.getElementById('box_box');
var playTime = document.getElementById('play_time');
var yiyan = document.getElementById('yiyan');
var saveBtn = document.getElementById('saveList');
var clearBtn = document.getElementById('clear');
var likeBtn = document.getElementById('like');
var musicBoxList = [];
var idSearch = document.getElementById('idValue');
var page_num = document.getElementById('page_num');
var pageNum = 1;
var oldContent = '';
var playPage = 0;
var pagePX = 0;
var SearchPagePX = 0;
var scrollToPx = 0;
var playFlag = 'normal';
var copyCententFlag = '';
var BaseURL = window.parent.BaseURL;

//缓存初始化
if (localStorage.getItem('playList') == null) {
  localStorage.setItem('playList', "[]");
  displayChange('play');

  console.log('缓存空空如也');
}
function loadplayTime(time) {
  playTime.innerHTML = `本月已为你播放:<br>${time}`;
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
        window.parent.popup.alert(`列表颜色已重置`);
      }
      else {
        window.parent.popup.alert(`列表颜色已设置为${setVal[i].value}`);
      }
      setVal[i].value = '';
    }
      break;
    //set_a_1
    case 1: if (setVal[i].value !== '') {
      window.parent.theme_set('btn', setVal[i].value);
      if (setVal[i].value == '0') {
        window.parent.popup.alert(`选项卡颜色已重置`);
      }
      else {
        window.parent.popup.alert(`选项卡颜色已设置为${setVal[i].value}`);
      }
      setVal[i].value = '';
    }
      break;
    //set_a_2
    case 2: if (setVal[i].value !== '') {
      window.parent.theme_set('lrc', setVal[i].value);
      if (setVal[i].value == '0') {
        window.parent.popup.alert(`歌词高亮颜色已重置`);
      }
      else {
        window.parent.popup.alert(`歌词高亮颜色已设置为${setVal[i].value}`);
      }
      setVal[i].value = '';
    }
      break;
    //set_a_3
    case 3: if (setVal[i].value !== '') {
      window.parent.theme_set('bg', setVal[i].value);
      if (setVal[i].value == '0') {
        window.parent.popup.alert(`背景图片已重置`);
      }
      else {
        window.parent.popup.alert(`背景图片已设置为<br><img  height="220px" src="${setVal[i].value}"/>`);
      }
      setVal[i].value = '';
    }
      break;
  }
}

function theme_onclick(flag) {
  if (flag == 'export') {
    copyCententFlag = 'theme';
    document.querySelectorAll('.export_btn')[1].setAttribute("data-clipboard-text", window.parent.theme_set('export'));
  }
  else {
    window.parent.popup.prompt("将主题参数粘贴到此处")
      .then(val => {
        if (val !== null && val !== '') {
          try {
            let obj = JSON.parse(val);
            if ('bg' in obj) {
              window.parent.theme_set('import', val);
            }
            else {
              window.parent.popup.alert('粘贴数据有误！');
            }
          }
          catch (error) {
            window.parent.popup.alert('粘贴数据有误！');
          }
        }
      });
  }
}

function clear_onclick() {
  if (playFlag !== 'like') {
    window.parent.popup.confirm("是否清空当前播放列表？")
      .then(isEnter => {
        if (isEnter) {
          localStorage.setItem('playList', '[]');
          displayChange('play');
          if (playListFlag == 'play') window.parent.playReset();
        }
      });
  }
  else {
    playFlag = 'normal';
    window.parent.popup.alert('已恢复普通列表模式~');
    document.getElementById('clear').innerHTML = '清空播放列表';
    window.parent.list_now('列表');
  }
}

/*音乐盒（歌单）*/
function save_onclick() {
  window.parent.popup.prompt('设置歌单名称')
    .then(value => {
      if (value) {
        importFromPlay(value);
      }
    });
}

//从播放列表保存歌单到云端和本地音乐盒
function importFromPlay(name) {
  let list = {
    'name': name,
    'list': displayList
  }
  var musicBoxData = new XMLHttpRequest();
  musicBoxData.open('post', `${BaseURL}/music-box-list/?method=post`);
  musicBoxData.setRequestHeader('Content-Type', 'application/json');
  musicBoxData.send(JSON.stringify(list));
  window.parent.popup.msg('正在添加……', 5, function () {
    window.parent.popup.alert('添加超时, 请重试');
  });
  musicBoxData.onreadystatechange = function () {
    if (musicBoxData.readyState == 4 && musicBoxData.status == 200) {
      window.parent.popup.msgClose();
      list = {
        'name': name,
        //此处artist为歌单的ID号
        'artist': `ID${musicBoxData.responseText}`,
        'list': displayList
      };
      window.parent.popup.alert(`<font size="2px color="#696969">歌单</font><br><font color="#199dfc">《${name}》</font><br><font size="2px color="#696969">已保存到音乐盒</font>`);
      musicBoxList = JSON.parse(localStorage.getItem('musicBoxList'));
      musicBoxList.push(list);
      localStorage.setItem('musicBoxList', JSON.stringify(musicBoxList));
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
    window.parent.popup.alert('请输入正确的歌单ID (如: 10000)<br>或酷我歌单链接');
    return;
  }
  if (reg1.test(ID))
    par = `music-box-list/?method=get&id=${ID}`;
  else
    par = `kuwolist/?id=${ID.match(reg2)[0]}`;

  var getMusicBoxList = new XMLHttpRequest();
  getMusicBoxList.open('get', `${BaseURL}/${par}`);
  getMusicBoxList.send();
  window.parent.popup.msg('正在加载歌单……', 5, function () {
    window.parent.popup.alert('加载超时, 请重试');
  });
  getMusicBoxList.onreadystatechange = function () {
    if (getMusicBoxList.readyState == 4 && getMusicBoxList.status == 200) {
      window.parent.popup.msgClose();
      let responseText = JSON.parse(getMusicBoxList.responseText);
      if (responseText["results"][0] !== undefined) {
        console.log(responseText["results"][0]);
        window.parent.popup.alert(`<font size="2px color="#696969">歌单</font><br><font color="#199dfc">《${responseText["results"][0]["Name"]}》</font><br><font size="2px color="#696969">已保存到本地音乐盒</font>`);
        list = {
          'name': responseText["results"][0]["Name"],
          //此处artist为歌单的ID号
          'artist': `ID${responseText["results"][0]["ID"]}`,
          'list': responseText["results"][0]["List"]
        };
        musicBoxList = JSON.parse(localStorage.getItem('musicBoxList'));
        musicBoxList.push(list);
        localStorage.setItem('musicBoxList', JSON.stringify(musicBoxList));
        window.parent.boxBtn_onclick();
        idSearch.value = '';
      } else {
        window.parent.popup.alert('歌单不存在~');
      }
    }
  }
}

function flippingPages(flag) {
  function a() {
    if (flag) {
      pageNum++;
      getSearchResult(oldContent);
      window.parent.popup.msg(`<font size="2px color="#696969">正在加载第 </font><font color="#199dfc">${pageNum}</font><font size="2px color="#696969"> 页</font>`, 10, function () {
        pageNum--;
        window.parent.popup.alert('加载超时, 请重试');
      });
    }
    else if (pageNum > 1) {
      pageNum--;
      getSearchResult(oldContent);
      window.parent.popup.msg(`<font size="2px color="#696969">正在加载第 </font><font color="#199dfc">${pageNum}</font><font size="2px color="#696969"> 页</font>`, 10, function () {
        pageNum++;
        window.parent.popup.alert('加载超时, 请重试');
      });
    }
  }
  if (playListFlag && pageNum == playPage) {
    window.parent.popup.confirm('正在播放搜索列表，翻页会影响轮播体验，是否继续？')
      .then(isEnter => {
        if (isEnter) {
          a();
        }
      });
  } else {
    a();
  }

}

// 滚动到顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
  });
}

// 复制主题参数到剪贴板
let clipboard = new ClipboardJS('.export_btn');
clipboard.on('success', function (e) {
  console.log('已复制文本：' + e.text);
  //window.parent.popup.alert(`已复制文本：${e.text}`);
  if (copyCententFlag == 'theme') {
    window.parent.popup.alert('主题参数复制成功！');
  }
  else {
    window.parent.popup.alert('备份数据复制成功！');
  }
  e.clearSelection();
});
clipboard.on('error', function (e) {
  console.error('出错了：' + e.action);
  window.parent.popup.alert('出错了！');
});

function likeList(initFlag = 'init', list) {
  let likeInit = {
    'name': '我的喜欢',
    'artist': ``,
    'list': []
  }
  musicBoxList = JSON.parse(localStorage.getItem('musicBoxList'));
  if (musicBoxList.length == 0) {
    musicBoxList.push(likeInit);
  }
  else if (musicBoxList[0].name !== '我的喜欢') {
    musicBoxList.unshift(likeInit);
  } else if (initFlag !== 'init') {
    let newLikeList = {
      'name': '我的喜欢',
      'artist': ``,
      'list': list
    }
    musicBoxList.splice(0, 1, newLikeList);
  }
  localStorage.setItem('musicBoxList', JSON.stringify(musicBoxList));
}

function likeListAdd() {
  if (window.parent.playingNum !== 999) {
    list = JSON.parse(localStorage.getItem('musicBoxList'))[0].list;
    if (playListFlag == 'play') {
      if (playList.length > window.parent.playingNum) {
        list.push(playList[window.parent.playingNum]);
        window.parent.popup.alert(`<font size="2px color="#696969">已添加</font><br><font color="#199dfc">${playList[window.parent.playingNum]["name"]}(${playList[window.parent.playingNum]["artist"]})</font><br><font size="2px color="#696969">到『喜欢』</font>`);
      }
    } else {
      list.push(searchList[window.parent.playingNum]);
      window.parent.popup.alert(`<font size="2px color="#696969">已添加</font><br><font color="#199dfc">${searchList[window.parent.playingNum]["name"]}(${searchList[window.parent.playingNum]["artist"]})</font><br><font size="2px color="#696969">到『喜欢』</font>`);
    }
    likeList('add', list);
    if (playFlag == 'like') {
      localStorage.setItem('playList', window.parent.JSON.stringify(JSON.parse(localStorage.getItem('musicBoxList'))[0]['list']));
      window.parent.listBtn_onclick();
    }
  }
  else {
    window.parent.popup.alert('当前无歌曲播放~');
  }
}
likeList('init');

function backup_onclick(flag) {
  if (flag == 'export') {
    copyCententFlag = 'export';
    let backupData = JSON.stringify({
      playList: JSON.parse(localStorage.getItem('playList')),
      musicBoxList: JSON.parse(localStorage.getItem('musicBoxList'))
    });
    document.querySelectorAll('.export_btn')[0].setAttribute("data-clipboard-text", backupData);
  }
  else {
    window.parent.popup.prompt("将备份数据粘贴到此处")
      .then(val => {
        if (val !== null && val !== '') {
          try {
            let obj = JSON.parse(val);
            if ('musicBoxList' in obj && 'playList' in obj) {
              localStorage.setItem('playList', JSON.stringify(obj.playList));
              localStorage.setItem('musicBoxList', JSON.stringify(obj.musicBoxList));
              window.parent.popup.alert('列表与歌单恢复成功！');
            }
            else {
              window.parent.popup.alert('粘贴数据有误！');
            }
          }
          catch (error) {
            window.parent.popup.alert('粘贴数据有误！');
          }
        }
      });

  }
}

/* window.addEventListener('message', function (event) {
  var data = event.data; // 获取父页面发送的数据
  console.log(data);
  if (data.function == 'nextPlay') {
    nextPlay(data.flag);
  }
}); */
//调用父页面函数
//window.parent.函数名();
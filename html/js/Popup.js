/**
 * @file Popup.js
 * @description 利用html的<dialog>标签实现常用模态弹窗显示
 * @author 昔枫沐杰
 * @github https://github.com/xfmujie/html-popup
 * @date 创建日期: 2023/7/30
 */

class Popup {
  // 初始化
  constructor() {
    const popupStyle = document.createElement("style");
    popupStyle.innerHTML = `dialog {
      color: #3b3b3b;
      background-color: rgb(252, 252, 252);
      box-shadow: 0 0 2px rgba(85, 85, 85, 0.7);
      border-radius: 15px;
      transition-duration: 200ms;
      border-width: 0px;
      border-color: #ffffff;
      min-width: 280px;
      max-width: 80vw;
      word-wrap: break-word;
      white-space: normal;
      text-align: center;
      animation: scaleAnimation 100ms;
      animation-timing-function: ease-out;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    @keyframes scaleAnimation {
      from {
        transform: scale(0.9);
      }
    
      to {
        transform: scale(1);
      }
    }
    
    dialog::backdrop {
      backdrop-filter: brightness(0.8) blur(0.8px);
      animation: blurAnimation 200ms;
      animation-timing-function: ease-out;
    }
    
    @keyframes blurAnimation {
      from {
        backdrop-filter: brightness(1) blur(0px);
      }
    
      to {
        backdrop-filter: brightness(0.8) blur(0.8px);
      }
    }
    
    .popupConfirmButton,
    .popupCancelButton {
      height: 35px;
      width: 100px;
      outline: 0;
      border-radius: 20px;
      background-color: rgb(12, 160, 255);
      color: #ffffff;
      border: 0;
      transition-duration: 50ms;
    }
    
    .popupConfirmButton:active {
      background-color: rgb(0, 150, 243);
    }
    
    .popupCancelButton {
      background-color: #f0f0f0;
      color: #000000;
    }
    
    .popupCancelButton:active {
      background-color: rgb(225, 225, 225);
    }
    
    #dialogInputText {
      padding-left: 10px;
      outline: 0;
      border-radius: 10px;
      border: 0;
      background-color: #ededed;
      height: 35px;
      width: calc(100% - 10px);
    }`;
    document.head.appendChild(popupStyle);
    this.dialog = document.createElement("dialog");
    document.body.appendChild(this.dialog);
  }

  // 提示弹窗
  alert(prompt) {
    this.dialog.innerHTML = `${prompt}<br><br><div><button class="popupConfirmButton">知道了</button></div>`;
    this.dialog.showModal();
    document.querySelector('.popupConfirmButton').addEventListener('click', () => {
      this.dialog.close();
    });
  }

  // 确认弹窗
  confirm(prompt) {
    this.dialog.innerHTML = `${prompt}<br><br><button class="popupCancelButton">取消</button>&emsp;<button class="popupConfirmButton">确定</button>`;
    this.dialog.showModal();
    return new Promise((resolve) => {
      document.querySelector('.popupConfirmButton').focus();
      document.querySelector('.popupConfirmButton').addEventListener('click', () => {
        resolve(true);
        this.dialog.close();
      });
      document.querySelector('.popupCancelButton').addEventListener('click', () => {
        resolve(false);
        this.dialog.close();
      });
    });
  }

  //文本输入弹窗
  prompt(prompt) {
    this.dialog.innerHTML = `<span id="promptContent">${prompt}</span><br><br><input type="text" id="dialogInputText" value=""><p><br><button class="popupCancelButton">取消</button>&emsp;<button class="popupConfirmButton">确定</button>`;
    this.dialog.showModal();
    return new Promise((resolve) => {
      document.querySelector('.popupConfirmButton').addEventListener('click', () => {
        if (document.getElementById('dialogInputText').value !== '') {
          resolve(document.getElementById('dialogInputText').value);
          this.dialog.close();
        } else {
          document.querySelector('#promptContent').style.color = '#f31b1b';
          document.querySelector('#dialogInputText').focus();
        }
      });
      document.querySelector('.popupCancelButton').addEventListener('click', () => {
        resolve(null);
        this.dialog.close();
      });
      this.dialog.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          if (document.querySelector('.popupConfirmButton') && document.querySelector('.popupConfirmButton').offsetParent !== null) {
            document.querySelector('.popupConfirmButton').focus();
          }
        }
      });
    });
  }

  // 消息弹窗
  msg(prompt, autoCloseTime = 1, callback = function () { }) {
    this.dialog.innerHTML = prompt;
    this.dialog.showModal();
    if (autoCloseTime) {
      this.timeOut = setTimeout(() => {
        this.dialog.close();
        callback();
      }, autoCloseTime * 1000);
    }
  }

  // 关闭消息弹窗
  msgClose() {
    clearTimeout(this.timeOut);
    this.dialog.close();
  }

}
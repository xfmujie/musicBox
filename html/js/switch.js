// 开关组件
class switchBtn {
  constructor(id) {
    this.id = id;
    document.querySelector(`#${this.id}`).innerHTML = '<div class="switch-body switch-state"><div class="switch-circular"></div>';
    this.switchState = document.querySelector(`#${id} .switch-state`);
    document.querySelector(`#${this.id} .switch-body .switch-circular`).style.position = 'relative';
    this.set(false);
    this.switchState.addEventListener('click', () => {
      if (this.state) this.set(false);
      else this.set(true);
    });
    if (/mobile|android|iphone|ipad|ipod|blackberry|opera mini|iemobile|webos/.test(navigator.userAgent.toLowerCase())) {
      document.querySelector('.switch-body').style.cursor = 'unset';
    }
  }
  set(state) {
    if (state) {
      this.switchState.classList.remove('switch-body-off');
      this.switchState.classList.add('switch-body-on');
      document.querySelector(`#${this.id} .switch-body .switch-circular`).style.left = 'calc(100% - 16px)';
      this.state = true;
    }
    else {
      this.switchState.classList.remove('switch-body-on');
      this.switchState.classList.add('switch-body-off');
      document.querySelector(`#${this.id} .switch-body .switch-circular`).style.left = '0px';
      this.state = false;
    }
  }
}
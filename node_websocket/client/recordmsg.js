/*
 * @Description: des
 * @Date: 2020-06-02 09:35:32
 * @Author: LB
 */
let curUse = null;
let curSends = [];

var app = new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!',
      users: [
        'aa',
        'bb',
        'cc'
      ],
      sends: [
        'aa', 'bb', 'cc'
      ],

      // type 1 自己信息, 0 其他人信息
      fileMegs: [

      ]
    }
  },
  mounted() {
  },
  methods: {
    addFileMsg(blob) {
      const url = (window.URL || webkitURL).createObjectURL(blob);
      const fileMsg = {
        name: Date.now(),
        url,
        type: 1
      };
      this.fileMegs.push(fileMsg);
    },
    getUse() {
      const doms = document.getElementsByClassName('use');
      for (let i = 0; i < doms.length; i++) {
        const { checked, value } = doms[i];
        console.log(checked, value);
        if (checked) {
          curUse = value;
          return;
        }
      }
    },
    getSends() {
      const doms = document.getElementsByClassName('send');
      curSends = [];
      for (let i = 0; i < doms.length; i++) {
        const { checked, value } = doms[i];
        if (checked && value !== curUse) {
          curSends.push(value);
        }
      }
    },
    soundRecordEvent(e) {
      const opt = e.target.dataset.opt;
      const that = this;
      if (!opt) { return; }
      switch (opt) {
        case 'online':
          this.getUse();
          this.getSends();
          if(!curUse){
            alert('请选择账号');
          }
          const url = 'ws://192.168.205.104:8001';
          // 创建连接，监听相关事件，处理 onmessage 接收信息
          _createWSconnection(url, (msg) => {
            console.log('onMsg', msg);
            const other = 1;
            this.addFileMsg(msg, other);
          });
          // 创建录音实例
          _createRecorderEntity();
          _openRecorder();
          break;
        case 'start':

          _recorder.start();
          break;
        case 'stop':
          console.log('stop');
          // 获取到录音数据 blob
          _recorder.stop(
            function success(blob, duration) {
              const self = 0;
              that.addFileMsg(blob, self);
              const reader = new FileReader();
              reader.onload = function (e) {
                console.log(reader.result);
                const params = {
                  from: curUse,
                  to: curSends,
                  file: reader.result
                };
                const msg = JSON.stringify(params);
                _wsSend(msg);
              }
              reader.readAsDataURL(blob);

            },
            function fail(msg) {
              console.log('录音失败:' + msg);
            }
          );
          break;
        case 'close':
          console.log('close');
          _recorder.close();
          break;
        case 'play':
          console.log('play');
          const fileBytesList = _fileQueue.map(file => {
            let array = new Uint8Array(file);
            return array;
          });
          // 合并成功
          const successFn = function (fileBytes, duration, info) {
            console.log('Mp3Merge successFn');
            /*   const audio = document.createElement('audio');
              audio.controls = true;
              document.body.appendChild(audio);
              const blob = new Blob([fileBytes]);
              // 简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
              audio.src = (window.URL || webkitURL).createObjectURL(blob);
              audio.play(); */
          };
          console.log('Mp3Merge');

          _mp3Merge(fileBytesList, successFn);
          break;
        default:
          break;
      }
    }
  }
});
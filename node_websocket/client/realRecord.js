/*
 * @Description: des
 * @Date: 2020-06-02 09:35:32
 * @Author: LB
 */
let curUse = null;
let curSends = [];
let audioDom = null;
let isFirst = true;

var app = new Vue({
  el: '#app',
  data() {
    return {
      from: 'test',
      vedioURL:'',
      users: ['aa', 'bb', 'cc'],
      sends: ['aa', 'bb', 'cc'],

      // 音频播放列表
      fileMegs: [],
    };
  },
  mounted() {
    const that = this;
    const fileMegs = this.fileMegs;
    audioDom = this.$refs.audio;
    audioDom.loop = false;
    audioDom.autoplay = true;
    audioDom.onended = function () {
      if (fileMegs.length > 0) {
        fileMegs.shift();
        audioDom.autoplay = true;
        const [url] = fileMegs;
        that.vedioURL = url;
      }
    }
  },
  methods: {
    addFileMsg(base64) {
      console.log();
      this.fileMegs.push(base64);
      if(isFirst){
        this.vedioURL =  base64;
        audioDom.autoplay = true;
      }
      
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
      if (!opt) {
        return;
      }
      switch (opt) {
        case 'online':
          this.getUse();
          this.getSends();
          if (!curUse) {
            alert('请选择账号');
          }
          const url = 'ws://:8001';
          // 创建连接，监听相关事件，处理 onmessage 接收信息
          _createWSconnection(url, (msg) => {
            const { from, file } = JSON.parse(msg);
            this.addFileMsg(file);
          });
          const isReal = true;
          // 创建录音实例
          _createRecorderEntity(isReal);
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
              const self = 1;
              const reader = new FileReader();
              reader.onload = function (e) {
                console.log(reader.result);
                const base64 = reader.result;
                const params = {
                  from: curUse,
                  to: curSends,
                  file: base64,
                };
                const msg = JSON.stringify(params);
                that.addFileMsg('me',base64, msgType.SELF);
                _wsSend(msg);
              };
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
        default:
          break;
      }
    },
  },
});

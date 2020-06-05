/*
 * @Description: des
 * @Date: 2020-06-02 09:35:32
 * @Author: LB
 */
let curUse = null;
let curSends = [];
// type 1 自己信息, 0 其他人信息
const msgType = {
  SELF: 1,
  OTHER: 0
}

const chat = Chat;


var app = new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!',
      users: ['aa', 'bb', 'cc'],
      sends: ['aa', 'bb', 'cc'],

      // type 1 自己信息, 0 其他人信息
      fileMegs: [],

      isOnline: false,
      isOnRoom: false,
      isRecorder: false
    };
  },
  computed: {
    lineBtn() {
      return this.isOnline ? '下线' : '上线';
    },
    linkBtn() {
      return this.isLink ? '销毁' : '创建';
    },
    recorderBtn() {
      return this.isRecorder ? '开始' : '结束';
    }
  },
  mounted() {
    const url = 'ws://192.168.0.103:8001';
    const that = this;
    chat._initRecordChat(url, function onVideoMessage(from, msg) {

      that.addVideoFileMsg(msg, from, msgType.OTHER);
    });
    chat._createRecorder();
  },
  methods: {
    addVideoFileMsg(base64, name, type) {
      const url = base64;
      const fileMsg = {
        name,
        url,
        type
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

    setLine() {
      this.isOnline = !this.isOnline;
      if (this.isOnline) {
        this.online();
      } else {
        this.offline();
      }
    },
    setLink() {
      if (!this.isLink) {
        this.createLink();
      } else {
        this.destroyLink();
      }
    },

    online() {
      this.getUse();
      if (!curUse) {
        console.log('no account');
        return;
      }
      chat._openRecorder();
      chat._createWS();
      chat._online(curUse);
    },

    createLink() {
      this.getSends();
      if (curSends.length === 0) {
        console.log('no select sends');
        return;
      }
      chat._createRoom(curSends);
      this.isLink = chat._getRoomStatus();
    },

    destroyLink() {
      this.isLink = false;
      chat._destroyRoom();
    },

    startRecorder() {
      this.isRecorder = true;
      chat._startRecorder();
    },

    stopRecorder() {
      this.isRecorder = false;
      const that = this;
      chat._stopRecoder(function getRcorder(fileBase64) {
        that.addVideoFileMsg(fileBase64, curUse, msgType.SELF);
      });
    },

    offline() {
      chat._offline();
      this.isOnline = false;
    }
  },
});

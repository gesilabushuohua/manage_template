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
  OTHER: 0,
};

// 聊天状态
const SYSTEMTEXT = {
  offline: 0,
  online: 1,
  createRoom: 2,
  inroom: 3,
  outroom: 4,
  destroyRoom: 5,
  onchat: 6,
};

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
      isLink: false,
      isRecorder: false,
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
      return this.isRecorder ? '结束' : '开始';
    },
  },
  mounted() {
    const url = 'ws://192.168.0.103:8001';
    const that = this;
    const onChatStatus = this.onChatStatus;
    console.log(chat);
    chat.initRecordChat(
      url,
      function onVideoMessage(from, msg) {
        that.addVideoFileMsg(msg, from, msgType.OTHER);
      },
      onChatStatus
    );
    chat.createWS();
    chat.createRecorder();
  },
  methods: {
    addVideoFileMsg(base64, name, type) {
      const url = base64;
      const fileMsg = {
        name,
        url,
        type,
      };
      this.fileMegs.push(fileMsg);
    },

    // 监听状态
    onChatStatus(command) {
      switch (command) {
        case SYSTEMTEXT.online:
          this.isOnline = true;
          break;
        case SYSTEMTEXT.offline:
          this.isOnline = false;
          break;
        case SYSTEMTEXT.createRoom:
          this.isLink = true;
          break;
        case SYSTEMTEXT.inroom:
          console.log('sends is occupy');
          break;
        case SYSTEMTEXT.outroom:
          this.isLink = false;
          break;
        case SYSTEMTEXT.destroyRoom:
          this.isLink = false;
          break;
        default:
          break;
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

    setLine() {
      if (this.isOnline) {
        this.offline();
      } else {
        this.online();
      }
    },
    setLink() {
      if (this.isLink) {
        this.destroyLink();
      } else {
        this.createLink();
      }
    },

    online() {
      this.getUse();
      if (!curUse) {
        console.log('no account');
        return;
      }
      chat.openRecorder();
      chat.online(curUse);
    },

    createLink() {
      this.getSends();
      if (curSends.length === 0) {
        console.log('no select sends');
        return;
      }
      chat.createRoom(curSends);
    },

    destroyLink() {
      chat.destroyRoom();
    },

    startRecorder() {
      this.isRecorder = true;
      chat.startRecorder();
    },

    stopRecorder() {
      this.isRecorder = false;
      const that = this;
      chat.stopRecoder(function getRcorder(fileBase64) {
        that.addVideoFileMsg(fileBase64, curUse, msgType.SELF);
      });
    },

    offline() {
      chat.offline();
      this.isOnline = false;
    },
  },
});

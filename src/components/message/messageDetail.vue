<script setup>

import EmojiPicker from "vue3-emoji-picker";
import {markRaw, nextTick, onBeforeUpdate, onMounted, reactive, ref, toRaw, watch} from "vue";
import useMessageStore from "@/store/messageStore.js";
import {aGetUserMessages, aSelectUserInfoByID, aUserMess} from "@/api/api.js";
import {store} from "xijs";
import useUserStore from "@/store/userStore.js";
import {useRoute} from "vue-router";
import MyMess from "@/components/message/myMess.vue";
import ReplayMess from "@/components/message/replayMess.vue";
import LikesMess from "@/components/message/likesMess.vue";
import SysMess from "@/components/message/sysMess.vue";

/*let token = store.get('access_token').value
let url = "ws://127.0.0.1:8800/ws/server"
let ws = new WebSocket(url, [token]);*/
const route = useRoute()

// const userStore = useUserStore()
// const messageStore = useMessageStore();
// const emojiLogo = ref()
// let clickEmo = ref(false)
let textCount = ref(0)
let disabledPost = ref(true)
let itemIndex = ref(0)
let opList = ref(["我的消息", "回复我的", "我收到的赞", "系统消息",])
// const chatScrollbar = ref()
const opMeList = ref([
  {id: 0, name: '我的消息', component: markRaw(MyMess)},
  {id: 1, name: '回复我的', component: markRaw(ReplayMess)},
  {id: 2, name: '我收到的赞', component: markRaw(LikesMess)},
  {id: 3, name: '系统消息', component: markRaw(SysMess)}])

/*let messageForm = reactive({
  poster_ID: '',
  recipient_ID: '',
  post_time: '2024',
  message: '',
  messageType: '',
})
let recipient = ref({
  user_ID: '',
  user_Name: '',
  user_Avatar: ''
})

let recipientList = ref([{
  user_ID: '',
  user_Name: '',
  user_Avatar: ''
},])

let messList = ref([{
  poster_ID: '',
  poster_Name: '',
  poster_Avatar: '',
  messageText: '',
  post_Time: '',
  messageType: '', // 消息类型：0是文本，1是图片
}])*/
/*watch(() => messageForm.message, (textarea) => {
      textCount.value = textarea.length;
      disabledPost = textCount.value > 500 || textCount.value <= 0;
    }
);*/

//接收到消息
/*ws.onmessage = function (event) {
  const obj = JSON.parse(event.data);
  formatMess(obj)
};*/


onMounted(() => {
  console.log(route.query.index)
  //todo 无法正确切换
  // let newVar = ref(route.query.index)
  // itemIndex.value = Number(newVar.value)
  // getUserMessages()
})

/*
function initMess() {
  if (messageStore.recipient.user_ID.length > 0) {
    recipientList.value.unshift(messageStore.recipient)
  }
  let re = toRaw(recipientList.value[0]);
  recipient.value.user_ID = re.user_ID;
  recipient.value.user_Name = re.user_Name;
  recipient.value.user_Avatar = re.user_Avatar;
  nextTick()
  getMess(recipientList.value[0].user_ID)
}

function getUserMessages() {
  aGetUserMessages().then(resp => {
    if (resp.data.code === 200) {
      recipientList.value = resp.data.data;
      nextTick()
      initMess()
    } else {
      recipientList.value = []
    }
  })
}


function formatMess(data) {
  let userID = data.poster_ID;
  aSelectUserInfoByID(userID).then(resp => {
    if (resp.data.code === 200) {
      recipient.value.user_ID = userID
      recipient.value.user_Name = resp.data.data.user_Name
      recipient.value.user_Avatar = resp.data.data.user_Avatar
      if (recipientList.value.some(item => {
        return item.user_ID === userID;
      })) {
      } else {
        recipientList.value.unshift(recipient.value)
      }
    }
  })
  nextTick()
  getMess(recipient.value.user_ID)
}

// 定义局部自定义指令，这里是在 setup 标签下编写，指令名称以 v 开头，无需额外注册逻辑
const vClickOutside = {
  mounted(el, binding) {
    function eventHandler(e) {
      if (el.contains(e.target) || e.target === emojiLogo.value) {
        return false
      }

      // 如果绑定的参数是函数，正常情况也应该是函数，执行
      if (binding.value && typeof binding.value === 'function') {
        binding.value(e)
      }
    }

    // 用于销毁前注销事件监听
    el.__click_outside__ = eventHandler
    // 添加事件监听
    document.addEventListener('click', eventHandler)
  },
  beforeUnmount(el) {
    // 移除事件监听
    document.removeEventListener('click', el.__click_outside__)
    // 删除无用属性
    delete el.__click_outside__
  }
}

function onClickOutside() {
  // 外部点击时的回调函数
  clickEmo.value = false
}

// 选择emoji后调用的函数
function selectEmoji(emoji) {
  let postComment_text = document.getElementById("message_text")
  let startPos = postComment_text.selectionStart
  let endPos = postComment_text.selectionEnd
  let resultText = postComment_text.value.substring(0, startPos) + emoji.i + postComment_text.value.substring(endPos)
  postComment_text.value = resultText
  postComment_text.focus()
  postComment_text.selectionStart = startPos + emoji.i.length
  postComment_text.selectionEnd = startPos + emoji.i.length
  messageForm.message = resultText

}

function getMess(user_ID) {
  aUserMess(user_ID).then(resp => {
    if (resp.data.code === 200) {
      messList.value = resp.data.data
      console.log(messList.value)
    } else {
      messList.value = []
    }
  })
  setTimeout(() => {
    scrollDown()
  }, 100)
}

function chooseItem(item) {
  recipient.value = item
  getMess(item.user_ID)
}

function deleteMessItem(index) {
  recipientList.value.splice(index, 1)
}

function postMess() {
  messageForm.recipient_ID = recipient.value.user_ID
  messageForm.poster_ID = userStore.user_ID
  messageForm.messageType = "0"
  // ws.send(JSON.stringify(messageForm))
  messageForm.message = '';
  nextTick()
  getMess(recipient.value.user_ID)
}

function scrollDown() {
  let moveTop = (messList.value.length) * 60
  chatScrollbar.value.scrollTop = chatScrollbar.value.setScrollTop(moveTop)
}*/
</script>

<template>
  <div class="message_mod_container">
    <div class="message_mod_op_list">
      <div class="message_mod_logo">
        <svg t="1720944560084" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="6026" width="200" height="200">
          <path
              d="M799.9 681.3c7-0.2 14 1.2 20.7 5.6-24.3-15.6-40.3-42.8-40.3-73.9V439.5c0-127.1-91.9-233.2-214.7-259.3V174c0-32.4-26.2-58.5-58.5-58.5s-58.5 26.2-58.5 58.5v6.2c-122.8 26.1-214.7 132.1-214.7 259.3V613c0 31.1-16.1 58.3-40.3 73.9 6.8-4.4 13.7-5.9 20.7-5.6-21.5 0.1-38.9 17.4-38.9 39s17.4 39 39 39h585.3c21.6 0 39-17.4 39-39 0.1-21.4-17.3-38.9-38.8-39zM507.2 896c53.9 0 97.6-43.7 97.6-97.6H409.6c0 53.9 43.6 97.6 97.6 97.6z"
              fill="#2c2c2c" p-id="6027"></path>
        </svg>
        <span>消息中心</span>
      </div>
      <ul class="op_list_content">
        <li class="op_list_content_item"
            :class="{active:itemIndex===index}"
            v-for="(item,index) in opList"
            @click="itemIndex = index">{{ item }}
        </li>
      </ul>
    </div>
    <div class="message_mod_de">
      <div v-for="item in opMeList">
        <component v-if="itemIndex===item.id" :is="item.component"></component>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message_mod_container {
  display: flex;
  justify-content: center;
  background-image: url("../../photos/background/music80.jpg");
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 830px;
}

.message_mod_op_list {
  width: 10%;
  height: 830px;
  background: rgba(239, 239, 239, 0.76);
  backdrop-filter: blur(2px);
}

.message_mod_logo {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: STXihei, serif;
  font-size: 16px;
  font-weight: 700;
}

.message_mod_logo svg {
  width: 20px;
  height: 20px;
}

.op_list_content {
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.op_list_content_item {
  height: 40px;
  display: flex;
  align-items: center;
  position: relative;
  font-family: STXihei, serif;
  font-size: 17px;
  font-weight: 700;
  color: #505050;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.op_list_content_item.active {
  color: #e58c43;
  border: 0;
}

.op_list_content_item:hover {
  color: #e58c43;
}

.message_mod_de {
  width: 60%;
  height: 790px;
  padding: 20px 20px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.18), rgba(252, 252, 252, 0.71));
  backdrop-filter: blur(5px);
}

</style>
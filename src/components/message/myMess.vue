<script setup>

import EmojiPicker from "vue3-emoji-picker";
import {nextTick, onBeforeUnmount, onMounted, reactive, ref, toRaw, watch} from "vue";
import useMessageStore from "@/store/messageStore.js";
import {aGetUserMessages, aSelectUserInfoByID, aUserMess} from "@/api/api.js";
import {store} from "xijs";
import useUserStore from "@/store/userStore.js";
import {useRoute} from "vue-router";
import useNotiSocketStore from "@/store/notiSocket.js";
import useWebSocketStore from "@/store/webSocketStore.js";


let token = store.get('access_token').value
let url = "ws://127.0.0.1:8800/ws/server"
// let url = "ws://47.120.48.80:8800/ws/server" //todo ECS
// let ws = new WebSocket(url, [token]);
const route = useRoute()

const socketStore = useWebSocketStore();
let ws = socketStore.ws
// console.log(ws)
const userStore = useUserStore()
const messageStore = useMessageStore();
const emojiLogo = ref()
let clickEmo = ref(false)
let textCount = ref(0)
let disabledPost = ref(true)
let chatShade = ref(true)
const chatScrollbar = ref()
//禁用的emoji组
const emojiGroup = ref([
  "animals_nature",
  "activities",
  "travel_places",
  "objects",
  "symbols",
  "flags"
])

let messageForm = reactive({
  poster_ID: '',
  recipient_ID: '',
  post_time: '2024',
  message: '',
  messageType: '',
})
let recipient = ref({
  user_ID: '',
  user_Name: '',
  user_Avatar: '',
})

let recipientList = ref([{
  user_ID: '',
  user_Name: '',
  user_Avatar: '',
}])

let messList = ref([{
  poster_ID: '',
  poster_Name: '',
  poster_Avatar: '',
  messageText: '',
  post_Time: '',
  messageType: '', // 消息类型：0是文本，1是图片
}])
watch(() => messageForm.message, (textarea) => {
      textCount.value = textarea.length;
      disabledPost = textCount.value > 500 || textCount.value <= 0;
    }
);

//todo 接收到消息
ws.onmessage = function (event) {
  const obj = JSON.parse(event.data);
  formatMess(obj)
};


onMounted(() => {
  getUserMessages()
  chatShade.value = false
})

/*//todo 关闭当前的ws
onBeforeUnmount (() => {
  ws.close()
})*/

function initMess() {
  if (messageStore.recipient.user_ID.length > 0) {
    let flag = recipientList.value.some(item => {
      return item.user_ID === messageStore.recipient.user_ID;
    })
    if (!flag) {
      recipientList.value.unshift(messageStore.recipient)
    } else {
      recipient.value.user_ID = messageStore.recipient.user_ID;
      recipient.value.user_Name = messageStore.recipient.user_Name;
      recipient.value.user_Avatar = messageStore.recipient.user_Avatar;
      nextTick()
      getMess(messageStore.recipient.user_ID)
    }
  } else {
    let re = toRaw(recipientList.value[0]);
    recipient.value.user_ID = re.user_ID;
    recipient.value.user_Name = re.user_Name;
    recipient.value.user_Avatar = re.user_Avatar;
    nextTick()
    getMess(recipientList.value[0].user_ID)
  }
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

//处理新消息
function formatMess(data) {

  let userID = data.poster_ID;
  /*  aSelectUserInfoByID(userID).then(resp => {
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
    })*/
  recipient.value.user_ID = userID
  recipient.value.user_Name = data.poster_Name;
  recipient.value.user_Avatar = data.poster_Avatar;
  if (recipientList.value.some(item => {
    return item.user_ID === userID;
  })) {
  } else {
    recipientList.value.unshift(recipient.value)
  }
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

function getMess(user_ID) {//获取相应聊天对象的记录
  aUserMess(user_ID).then(resp => {
    if (resp.data.code === 200) {
      messList.value = resp.data.data
    } else {
      messList.value = []
    }
  })
  setTimeout(() => {
    scrollDown()
  }, 100)
}

function chooseItem(item) {//选择聊天对象
  recipient.value = item
  getMess(item.user_ID)
}

function deleteMessItem(index) {//删除聊天对象
  recipientList.value.splice(index, 1)
}

function getNowFormatDate() {//获取当前时间
  let date = new Date();
  let seperator1 = "-";
  // let seperator2 = ":";
  let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  let strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  /*  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();*/
  return currentdate;
}

function postMess() {//发送消息
  messageForm.recipient_ID = recipient.value.user_ID
  messageForm.poster_ID = userStore.user_ID
  //todo 判断消息类型（图片类型直接发送）
  messageForm.messageType = "0"
  messageForm.post_time = getNowFormatDate()
  ws.send(JSON.stringify(messageForm))
  messageForm.message = '';
  nextTick()
  getMess(recipient.value.user_ID)
}

function scrollDown() {
  let moveTop = (messList.value.length) * 60
  chatScrollbar.value.scrollTop = chatScrollbar.value.setScrollTop(moveTop)
}

</script>

<template>
  <div v-loading="chatShade">
    <div class="message_mod_de_title">
      <span>我的消息</span>
    </div>
    <div class="message_mod_de_content">
      <div class="de_content_user_list">
        <div class="de_content_user_list_title">
          <span>近期消息</span>
        </div>
        <div class="de_content_user_list_content">
          <el-scrollbar>
            <div class="user_list_content_mod"
                 :class="{active:item.user_ID===recipient.user_ID}"
                 v-for="(item,index) in recipientList"
                 @click="chooseItem(item)">
              <div class="delete_BT" @click.stop="deleteMessItem(index)">
                <el-icon>
                  <Close/>
                </el-icon>
              </div>
              <img :src="item.user_Avatar" v-if="item.user_Avatar.length>0">
              <div class="userAvatar_layout" v-else></div>
              <div class="user_info" v-if="item.user_Name.length>0">
                {{ item.user_Name }}
              </div>
              <div v-else class="userName_layout"></div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="message_mod_de_content_chat_mod" v-if="recipientList.length>0">
        <div class="de_content_chat_mod_title">{{ recipient.user_Name }}</div>
        <div class="de_content_chat_mod_content">
          <el-scrollbar ref="chatScrollbar">
            <div v-for="item in messList" style="margin-bottom: 10px" v-if="messList[0].poster_ID.length>0">
              <div class="chat_mod_content_item" v-if="item.poster_ID === recipient.user_ID">
                <img :src="item.poster_Avatar">
                <div class="item_Mess" v-if="item.messageType==='0'">
                  <div class="item_Mess_triangle"></div>
                  <span>{{ item.messageText }}</span>
                </div>
                <img v-if="item.messageType==='1'" class="msg_img" :src="item.messageText">
              </div>
              <div class="chat_mod_content_item_me" v-else>
                <div class="item_Mess_me" v-if="item.messageType==='0'">
                  <span>{{ item.messageText }}</span>
                </div>
                <img v-if="item.messageType==='1'" class="msg_img" :src="item.messageText">
                <img :src="item.poster_Avatar">
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="de_content_chat_mod_write">
          <div class="chat_mod_write_Emoji">
            <img src="/src/photos/logo/emoji.png"
                 @click="clickEmo=!clickEmo" ref="emojiLogo">
            <EmojiPicker
                class="emojiPicker"
                v-click-outside="onClickOutside"
                :class="{activeE:clickEmo}"
                :native="true"
                :hide-search="true"
                :hide-group-icons="true"
                :disable-skin-tones="true"
                :disabled-groups="emojiGroup"
                @select="selectEmoji"/>
          </div>
          <div class="chat_mod_write_input">
                      <textarea class="message_container"
                                id="message_text"
                                v-model="messageForm.message"
                                maxlength="1000"
                                placeholder="说点什么吧"></textarea>
          </div>
          <div class="chat_mod_write_post_bt">
              <span
                  class="textCount_text"
                  :class="{disabled:disabledPost}"
                  v-if="textCount>0">{{ textCount }}</span>
            <button class="post_mess_bt" :disabled="disabledPost" @click="postMess">发送</button>
          </div>
        </div>
      </div>

      <div class="message_mod_de_content_chat_mod_null" v-if="!recipientList.length>0">
        <img src="/src/photos/logo/聊天.png">
        <span>快找小伙伴聊天吧 ( ゜- ゜)つロ</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message_mod_de_title {
  width: auto;
  height: 50px;
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 0 5px 2px #9f9f9f;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-family: STXihei, serif;
  font-size: 17px;
  color: #282828;
}

.message_mod_de_content {
  width: 100%;

  height: 720px;
  display: flex;
  border-radius: 12px;
  background-color: #FFFFFF;
  font-size: 13px;
  color: #666;
  box-shadow: 0 0 5px 2px #9f9f9f;
}

.de_content_user_list {
  width: 25%;
  min-width: 170px;
  height: 100%;
  background: #FFFFFF;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  display: flex;
  flex-direction: column;

}

.de_content_user_list_title {
  padding-left: 24px;
  line-height: 35px;
  height: 36px;
  border-bottom: 1px solid #e9eaec;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overflow: hidden;
}

.de_content_user_list_content {
  height: 684px;
  overflow: hidden;
}

.user_list_content_mod {
  width: auto;
  height: 70px;
  padding: 10px 10px 10px 0px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user_list_content_mod.active {
  border: 0;
  background-color: #e4e5e6;
}

.delete_BT {
  width: 15px;
  height: 15px;
  transform: translate(-35px, 0px);
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.delete_BT:deep(.el-icon svg) {
  width: 15px;
  height: 15px;
}

.user_list_content_mod:hover {
  background-color: #e4e5e6;
}

.user_list_content_mod:hover .delete_BT {
  opacity: 1;
  transform: translate(0px, 0px);
}

.user_list_content_mod img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.userAvatar_layout {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin-right: 10px;
  background: #f0f0f1;
}

.userName_layout {
  width: 50%;
  height: 20px;
  background: #f0f0f1;
}

.user_info {
  width: 50%;
  word-wrap: break-word;
  font-family: STXihei, serif;
  font-size: 15px;
}

.message_mod_de_content_chat_mod {
  width: 75%;
  height: 100%;
  background: #f4f5f7;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  display: flex;
  flex-direction: column;
}

.de_content_chat_mod_title {
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e9eaec;
  border-left: 1px solid #e9eaec;
  position: relative;
  text-align: center;
  color: #333;
  background-color: #FFFFFF;
  border-top-right-radius: 12px;
}

.de_content_chat_mod_content {
  height: 459px;
  border-bottom: 1px solid #d4d4d7;
  padding: 20px 0 20px 20px;
}


.chat_mod_content_item {
  display: flex;
  align-items: center;
  justify-content: start;
  min-height: 40px;
}

.chat_mod_content_item img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-right: 15px;
}

.item_Mess {
  min-width: 30px;
  max-width: 280px;
  min-height: 35px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: #ffffff;
  font-family: STXihei, serif;
  color: #262626;
  font-size: 15px;
  padding: 5px 10px;
}

/**
todo 有bug
聊天气泡的箭头
 */
.item_Mess_triangle {
  display: none;
  position: absolute;
  width: 0;
  height: 0;
  transform: translateX(-25px);
  border: 8px solid #e58c43;
  border-color: transparent #e58c43 transparent transparent;
}

.chat_mod_content_item_me {
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: end;
  min-height: 40px;
}

.chat_mod_content_item_me img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-left: 15px;
}

.item_Mess_me {
  min-width: 30px;
  max-width: 280px;
  min-height: 35px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: #e58c43;
  font-family: STXihei, serif;
  color: #ffffff;
  font-size: 15px;
  padding: 5px 10px;
}

/**
todo 有bug
聊天气泡的箭头
 */
.item_Mess_me::before {
  /*  content: "";*/
  width: 10px;
  height: 10px;
  background-color: #e58c43;
}

/**
todo 有bug
聊天气泡的箭头
 */
.item_Mess_me_triangle {
  display: none;
  position: relative;
  width: 0;
  height: 0;
  transform: translateX(30px);
  border: 8px solid #95ec69;
  border-color: transparent transparent transparent #95ec69;
}

.msg_img {
  width: 170px !important;
  height: 170px !important;
  border-radius: 12px !important;
}

.de_content_chat_mod_write {
  border-bottom-right-radius: 12px;
  height: 184px;
}

.chat_mod_write_Emoji {
  padding: 10px 20px;
  display: flex;
}

.chat_mod_write_Emoji img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.emojiPicker {
  width: 280px;
  height: 0;
  z-index: 9;
  position: absolute;
  opacity: 0;
  bottom: 180px;
  /*  transform: scale(0, 0);*/
  transform: translate(10px, -20px);
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.emojiPicker.activeE {
  height: 320px;
  opacity: 1;
  /*  transform: scale(1, 1) translate(10px, -20px);*/
}

.chat_mod_write_input {
  width: 100%;
  height: 100px;
}

.message_container {
  width: 95%;
  height: 100%;
  background-color: transparent;
  color: #000000;
  font-family: STXihei, serif;
  font-size: 16px;
  padding-top: 5px;
  padding-left: 20px;
  padding-right: 20px;
  /*去掉轮廓*/
  outline: none;
  border: 0;
  /*禁止textarea调整大小*/
  resize: none;
}


/*!*textarea去掉滚动条，但仍具有滚动效果*!
.message_container::-webkit-scrollbar {
  width: 0;
  height: 0;
}*/

.chat_mod_write_post_bt {
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0 20px;
  margin-bottom: 10px;
}

.post_mess_bt {
  width: 90px;
  height: 35px;
  margin-left: 20px;
  border: 0 solid;
  border-radius: 10px;
  color: #FFFFFF;
  background: #eca26e;
  transition: all 0.3s ease-in-out;
}

.post_mess_bt:hover {
  background: #e58c43;
}

.textCount_text {
  color: #000000;
  font-size: 12px;
  padding-left: 20px;
}

.textCount_text.disabled {
  color: rgba(220, 25, 25, 0.87);

}

.post_mess_bt:disabled {
  background: #e9e9e9;
  color: #383838;
}

.message_mod_de_content_chat_mod_null {
  width: 75%;
  height: 100%;
  border-left: 1px solid #e9eaec;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8896b8;
  font-size: 14px;
  line-height: 1.5em;
}

.message_mod_de_content_chat_mod_null img {
  width: 300px;
  height: 300px;
}
</style>
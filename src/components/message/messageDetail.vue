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


onMounted(() => {
  itemIndex.value = parseInt(route.query.index)
})

//todo url未改变
function changeIndex(index) {
  itemIndex.value = index
}
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
            @click="changeIndex(index)">{{ item }}
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
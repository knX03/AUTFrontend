<template>
  <!--  <router-view>
    </router-view>-->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
  <music-play></music-play>
</template>
<script setup>
import MusicPlay from "@/views/musicPlay.vue";
import {store} from "xijs";
import {ElNotification} from "element-plus";
import useWebSocketStore from "@/store/webSocketStore.js";
import {h} from "vue";

const socketStore = useWebSocketStore();
if (socketStore.ws.url == null) {
  let token = store.get('access_token').value
  let url = "ws://127.0.0.1:8800/ws/server"
  socketStore.ws = new WebSocket(url, [token])
  /*  console.log("dd")*/
}

//接收到消息
socketStore.ws.onmessage = function (event) {
  const obj = JSON.parse(event.data);
  // console.log(obj)
  ElNotification({
    title: obj.poster_Name,
    // duration: 0,
    dangerouslyUseHTMLString: true,
    message: h('div', {style: "display: flex;align-items: center"}, [
      h('img', {
        src: obj.poster_Avatar,
        style: "height: 35px;width:35px;  border-radius: 50px;margin-right: 10px;",
      }),
      h('label', {style: "width: 224px;font-family: STXihei, serif;" +
            "font-size: 13px;color: black"}, obj.messageText)
    ]),
  })

};


</script>
<style>
body {
  margin: 0;
}

/* 路由切换动画 */
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.3s ease-in-out;
}

/* 可能为enter失效，拆分为 enter-from和enter-to */
/*新页面的进入时*/
.fade-enter-from {
  opacity: 0.5;
  /*  transform: translateY(-30px);*/
}

/*新页面的进入成功时*/
.fade-enter-to {
  opacity: 1;
  /*  transform: translateY(0px);*/
}

/*原页面的离开时*/
.fade-leave-to {
  opacity: 0;
  /*  transform: translateY(30px);*/
}
</style>
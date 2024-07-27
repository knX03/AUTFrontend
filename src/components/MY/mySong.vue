<script setup>
import {getCurrentInstance, markRaw, onMounted, reactive, ref} from "vue";
import axios from "axios";
import bus from "@/eventbus.js";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "@/router/index.js";
import song from "@/components/MY/option/song.vue";
import album from "@/components/MY/option/album.vue";
import playlist from "@/components/MY/option/playlist.vue";
import useMusicPlayStore from "@/store/musicPlayStore.js";

const musicPlayStore = useMusicPlayStore();

const {ctx} = getCurrentInstance()
const topBtn = ref([
  {id: 1, name: '歌曲', component: markRaw(song)},
  {id: 2, name: '歌单', component: markRaw(playlist)},
  {id: 3, name: '专辑', component: markRaw(album)}])

// 默认显示的组件页面
const selectedComponent = ref(song);

// 当前选中按钮
const selectedBtn = ref(1);

// 点击按钮切换事件
const selectChange = (item) => {
  selectedBtn.value = item.id;
  selectedComponent.value = item.component;
}


function downloadFile(filepath) {
  console.log(filepath)
  axios({
    method: 'POST',
    url: 'http://localhost/file/download',
    data: filepath,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'      //改这里就好了
    }
  }).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success('下载成功！')
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
      ElMessage.error('下载失败！')
    }
  })
}
</script>

<template>
  <div class="mySecond_mod">
    <div class="optionList_mod">
      <div class="menu" v-for="item in topBtn"
           :key="item.id"
           @click="selectChange(item)">
        <div class="optionButton" :class="{ 'optionActive': selectedBtn === item.id }">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div>
      <transition name="fade" mode="out-in">
        <KeepAlive>
          <component :is="selectedComponent"></component>
        </KeepAlive>
      </transition>
    </div>
  </div>
</template>
<style scoped>
.optionList_mod {
  width: 380px;
  height: 61px;
  display: flex;
  margin-left: 200px;
  justify-content: space-around;
  align-items: center;
}

.menu {
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu span {
  color: #2c2c2c;
  font-family: 方正粗黑宋简体, serif;
  font-size: 20px;
  cursor: pointer;
}


.optionButton {
  height: 40px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s all ease-in-out;
  cursor: pointer;
}

.optionButton:hover {
  background-color: #e58c43;
  border-radius: 30px;
  transition: 0.5s all ease-in-out;
}

.optionActive {
  height: 40px;
  width: 100px;
  background-color: #e58c43;
  border-radius: 30px;
  cursor: pointer;
}


.el-button--warning img {
  width: 20px;
  height: 20px;
}

/* 路由切换动画 */
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.4s;
}

/*新页面的进入时*/
.fade-enter-from {
  opacity: 0.5;
  transform: translateX(-30px);
}

/*新页面的进入成功时*/
.fade-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

/*原页面的离开时*/
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>


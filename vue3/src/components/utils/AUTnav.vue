<script setup>
import {onMounted, ref, watch} from 'vue';
import bus from "@/eventbus.js";
import axios from "axios";
import {useRoute} from "vue-router";
import useUserStore from '@/store/userStore.js'

const route = useRoute()
const isDot = ref(true)
const drawer = ref(false)
let user = ref(
    {user_Name: '', user_ID: '', user_Avatar: 'src/photos/logo/avatarWhite.png', user_Sex: ''}
)
//使用pinia获得用户数据
const userStore = useUserStore()
onMounted(() => {
  const user_ID = userStore.user_ID
  selectUserDetail(user_ID)
})

function checkMessage(param) {
  if (isDot.value) {
    isDot.value = false;
  }
  drawer.value = !drawer.value;
}

const handleClose = () => {
  drawer.value = !drawer.value;
}

/*用户详情查询*/
function selectUserDetail(user_ID) {
  axios({
    method: 'GET',
    url: 'http://localhost/user/DetailByID?user_ID=' + user_ID,
  }).then(resp => {
    if (resp.data.code === 200) {
      user.value = resp.data.data;
      bus.emit('userInfo', user.value)
    } else if (resp.data.code === 500) {
      console.error(resp.data)
    }
  })
}
</script>

<template>
  <div class="navbar navbar-expand-lg bg-primary navbar-dark">
    <nav class="container">
      <router-link to="/" href="#" class="navbar-brand">
        <img src="../icons/AUT.png">
      </router-link>
      <button class="navbar-toggler border-2" data-bs-target="#aa" data-bs-toggler="collapse">
        <i class="navbar-toggler-icon"></i>
      </button>
      <div class="navbar-collapse collapse " id="navbar_collapse">


        <form id="searchBox" class="d-flex me-auto " role="search">
          <input class="form-control me-2" type="search" placeholder="搜索你想听的音乐" aria-label="Search">
        </form>

        <div class="navbar-nav me-auto">
          <!--todo-->
          <router-link to="/signIn" href="#" class="nav-link">
            我是歌手
          </router-link>
        </div>

        <div id="split" class="navbar-nav">

        </div>

        <ul class="navbar-nav align-items-center">
          <li class="nav-item me-5">
            <router-link to="/myInfo">
              <img class="nav_avatar" :src=user.user_Avatar alt="avatar">
            </router-link>
          </li>
          <li class="nav-item me-5">
            <router-link to="/myInfo">
              <span style="color: black;font-family: 微软雅黑;cursor: pointer">{{ user.user_Name }}</span>
            </router-link>
          </li>
          <li class="nav-item  me-2">
            <div class="message_mod">
              <!--todo-->
              <el-badge :is-dot="isDot" class="item" style="width: 1.4em;">
                <Message style="width: 1.3em; height: 1.3em; margin-right: 8px;" @click="checkMessage"/>
              </el-badge>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
  <el-drawer
      v-model="drawer"
      title="消息通知"
      :before-close="handleClose"
  >
    <template #header="{ close, titleId, titleClass }">
      <span :id="titleId" :class="titleClass" style="font-weight: 900;font-size: large;color: #e58c43">消息通知!</span>
    </template>
    <div></div>
  </el-drawer>
</template>

<style scoped src="../css/AUTnav.css"></style>
<style scoped>
</style>
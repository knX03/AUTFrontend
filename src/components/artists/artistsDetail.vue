<script setup>
import {computed, onMounted, ref} from "vue";
import router from "@/router/index.js";
import {store} from "xijs";
import {aGetSingerByUser, aUserDetail} from "@/api/api.js";
import bus from "@/eventbus.js";
import {ElNotification} from "element-plus";

let userInfoEx = ref(true)

let user = ref({
  user_ID: '',
  user_Name: 'User',
  user_Avatar: '/src/photos/logo/avatarWhite.png',
})
let isTop = ref(false)


onMounted(() => {
  getUserInfo()
})

const toUserInfo = () => {
  router.push({
    path: '/myInfo',
  })
}


//用户详情
function getUserInfo() {
  aUserDetail().then(resp => {
    if (resp.data.code === 200) {
      user.value = resp.data.data
      bus.emit('userInfo', user.value)
    }
  })
}

function logOff(user_ID) {
  userInfoEx.value = false
}

function signIn() {
  userInfoEx.value = true
}

function changeTitleA(value) {
  if (value.scrollTop === 0) {
    isTop = false
  } else {
    isTop = true
  }
}

//进行申请
function toApply() {
  let singerToken = store.get('access_singer_token').value
  if (singerToken === null) {
    aGetSingerByUser().then(resp => {
      if (resp.data.code === 200) {
        store.set("access_singer_token", resp.data.data, Date.now() + 1000 * 60 * 60 * 24 * 7)
        //todo 跳转有bug，会进行两次路由访问
        ElNotification({
          title: '您已经是音乐人啦1！',
          type: 'success',
          duration: 2000,
          position: 'top-left',
        })
      } else {
        router.push({
          path: '/applyArtist',
        })
      }
    }).catch(resp => {
      router.push({
        path: '/applyArtist',
      })
    })
  } else {
    ElNotification({
      title: '您已经是音乐人啦2！',
      type: 'success',
      duration: 2000,
      position: 'top-left',
    })
  }
}
</script>

<template>
  <el-scrollbar
      height="918px"
      @scroll="changeTitleA">
    <div class="pageA_mod">
      <el-affix :offset="0" class="taContainer">
        <div class="titleA_mod" :class="{top:isTop}">
          <div class="logoA">
            <router-link to="/">
              <img src="/src/photos/logo/AUT音乐.png">
            </router-link>
          </div>
          <div class="infoA" :class="{top:isTop}" v-if="userInfoEx">
            <div class="avatarAName_mod" @click="toUserInfo()">
              <img :src=user.user_Avatar>
              <span>{{ user.user_Name }}</span>
            </div>
            <el-divider direction="vertical"/>
            <div style="cursor: pointer;" @click="logOff(user.user_ID)">
              <span>退出</span>
            </div>
          </div>
          <div class="signInA_mod" id="SA_mod" v-if="!userInfoEx">
            <el-button type="warning" plain round @click="signIn()">登录</el-button>
          </div>
        </div>
      </el-affix>
      <div class="textA_mod">
        <img src="/src/photos/logo/dream.png">
      </div>
      <div class="textA_mod">
        <img src="/src/photos/logo/dream.png">
      </div>
      <div class="applyBt_mod" @click="toApply()">
        立即入驻
      </div>
      <div class="textA_mod">
        <img src="/src/photos/logo/dream.png">
      </div>
      <div class="textA_mod">
        <img src="/src/photos/logo/dream.png">
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped>
body {
  width: 100%;
  height: 100%;
}

.pageA_mod {
  min-height: 918px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url("/src/photos/background/music80.jpg");
  background-size: cover;
}

.taContainer {
  width: 100%;
  height: 70px;
}

.titleA_mod {
  background-color: transparent;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.5s ease-in-out;
  backdrop-filter: blur(2px);
}


.logoA {
  margin-left: 100px;
}

.logoA img {

}

.infoA {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-right: 200px;
  min-width: 150px;
}

.el-divider--vertical {
  border-left: 1px #bdbdbd var(--el-border-style);
}


.infoA span {
  font-family: STXihei, serif;
  color: #c4c4c4;
}

.infoA span:hover {
  color: #eeeeee;
}

.avatarAName_mod {
  min-width: 80px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatarAName_mod img {
  height: 35px;
  width: 35px;
  border-radius: 50%;
  margin-right: 10px;
}

.signInA_mod {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-right: 200px;
  min-width: 150px;
}

#SA_mod :deep(.el-button:focus, .el-button:hover) {
  border-color: #e58c43;
  background-color: #e58c43;
  outline: 0;
  transition: all 0.5s ease-in-out;
}

.textA_mod {
  width: 500px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


.applyBt_mod {
  width: 250px;
  height: 70px;
  background-color: #e58c43;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: SimHei, serif;
  font-size: 30px;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

.applyBt_mod:hover {
  color: #FFFFFF;
}

/*导航栏离开顶部的样式*/
.titleA_mod.top {
  background-color: rgba(24, 24, 24, 0.83);
  backdrop-filter: blur(2px);
  opacity: 1;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.5s ease-in-out;
}

.infoA.top span {
  color: #c4c4c4;
}

.infoA.top span:hover {
  color: #FFFFFF;
}

.infoA.top .el-divider--vertical {
  border-left: 1px #c4c4c4 var(--el-border-style);
}
</style>
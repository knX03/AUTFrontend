<script setup>
import {computed, onMounted, ref} from "vue";
import router from "@/router/index.js";
import {aUserDetail} from "@/api/api.js";
import bus from "@/eventbus.js";

let userInfoEx = ref(true)
let user = ref({
  user_Name: '',
  user_Avatar: '/src/photos/logo/avatarWhite.png',
})
const toUserInfo = () => {
  /* router.push({
     path: '/myInfo',
   })*/
}

onMounted(() => {
  getUserInfo()
})

//用户详情
function getUserInfo() {
  aUserDetail().then(resp => {
    if (resp.data.code === 200) {
      user.value = resp.data.data
      bus.emit('userInfo', user.value)
    }
  })
}

function logOff() {
  userInfoEx.value = false
}

function signIn() {
  userInfoEx.value = true
}
</script>

<template>
  <div class="artNav_mod">
    <div class="logoA">
      <router-link to="/">
        <img src="/src/photos/logo/AUT音乐.png">
      </router-link>
      <div class="optionNav_mod">
        <router-link to="/artHome">
          <span>首页</span>
        </router-link>
        <router-link to="/artHome">
          <span>帮助中心</span>
        </router-link>
        <router-link to="/artists">
          <span>关于我们</span>
        </router-link>
      </div>
    </div>
    <div class="infoNav_mod" v-if="userInfoEx">
      <!--todo 下拉菜单等待重构-->
      <el-dropdown>
        <div class="avatarAName_mod" @click="toUserInfo()">
          <img :src=user.user_Avatar>
          <span>{{ user.user_Name }}</span>
          <div class="dropdown_mod_user">
          </div>
          <el-icon style="color:#FFFFFF;" class="el-icon--right">
            <arrow-down/>
          </el-icon>
        </div>
        <template #dropdown id="eme">
          <el-dropdown-menu>
            <el-dropdown-item>个人资料</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="signInA_mod" id="SA_mod" v-if="!userInfoEx">
      <el-button type="warning" plain round @click="signIn()">登录</el-button>
    </div>
  </div>
</template>

<style scoped>

/*导航栏离开顶部的样式*/
.artNav_mod {
  background-color: rgb(0, 0, 0);
  backdrop-filter: blur(2px);
  opacity: 1;
  width: 100%;
  min-width: 850px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.5s ease-in-out;
}


.logoA {
  margin-left: 7rem;
  display: flex;
  align-items: center;
}

.optionNav_mod {
  margin-left: 5rem;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.optionNav_mod a {
  text-decoration: none;
}

.optionNav_mod span {
  font-family: "微软雅黑 Light", serif, serif;
  color: #b2b2b2;
  font-weight: 700;
  font-size: 17px;
}

.optionNav_mod span:hover {
  color: #c4c4c4;
}

.infoNav_mod {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-right: 9rem;
  min-width: 150px;
}

.infoNav_mod span {
  font-family: "微软雅黑 Light", serif, serif;
  font-weight: 700;
  font-size: small;
  color: #b2b2b2;
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

#SA_mod :deep(.el-button:focus, .el-button:hover ) {
  border-color: #e58c43;
  background-color: #e58c43;
  outline: 0;
  transition: all 0.5s ease-in-out;
}

/*下拉菜单的样式修改*/
:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: #fff4ec;
  color: #e58c43;
}

</style>
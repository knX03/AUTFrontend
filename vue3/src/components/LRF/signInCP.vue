<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {ElMessageBox, ElNotification} from "element-plus";
import router from "@/router/index.js";
import useUserStore from '@/store/userStore.js'


let userStore = useUserStore()
let loading = ref(false)
let showbox = ref(false)
let signInButText = ref("登录")
let userForm = reactive({
  user_Email: '',
  user_Password: '',
  remFlag: false,
})

onMounted(() => {
  getCookie()
})


/*获取cookie的数据*/
function getCookie() {
  axios({
    method: 'GET',
    url: 'http://localhost/user/cookie'
  }).then(resp => {
    if (resp.data.data.user_Email.length > 0) {
      userForm = resp.data.data
      userForm.remFlag = true;
    }
  })
}

/*验证邮箱*/
function verifyEmail() {
  axios({
    method: 'POST',
    url: 'http://localhost/user/ifExist',
    data: userForm
  }).then(resp => {
    if (resp.data.code === 301) {
      userForm.user_Email = ''
      ElNotification({
        title: '提示信息',
        message: "邮箱不存在，请输入已注册的邮箱！",
        type: 'error'
      })
    }
  })
}


/*登录提交*/
function submitForm() {
  loading.value = true
  signInButText.value = "登录中"
  axios({
    method: 'POST',
    url: 'http://localhost/user/userLogin',
    data: userForm,
  }).then(resp => {
    loading.value = false
    signInButText.value = "登录"
    if (resp.data.code === 200) {
      selectUserInfoByID(resp.data.data)
      router.push({
        path: '/',
        query: {user_ID: resp.data.data}
      })
    } else {
      signInButText.value = "登录"
      ElMessageBox.confirm(resp.data.msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        userForm.user_email = ""
        userForm.user_password = ""
      })
    }
  })
}

/*空值判断*/
function ifEmpty() {
  if (userForm.user_Email.length <= 0) {
    ElNotification({
      title: '提示信息',
      message: "账号为空，请先输入账号！",
      type: 'error'
    })
  } else if (userForm.user_Password.length <= 0) {
    ElNotification({
      title: '提示信息',
      message: "密码为空，请先输入密码！",
      type: 'error'
    })
  } else {
    submitForm()
  }
}

function selectUserInfoByID(ID) {
  axios({
    method: 'GET',
    url: 'http://localhost/user/DetailByID?user_ID=' + ID,
  }).then((resp) => {
    if (resp.data.code === 200) {
      userStore.$state = resp.data.data
      console.log(userStore)
    } else {
      console.error(resp.data.msg)
    }
  })
}
</script>

<template>
  <div class="loginBack_mod" v-loading="loading">
    <div v-if="showbox" class="backMask_mod">
    </div>
    <div class="login_form_mod">
      <div class="nav_mod">
        <router-link to="/">
          <img src="/src/photos/logo/AUT.png"/>
        </router-link>
      </div>
      <div class="login_form">
        <div class="account_mod">
          <span class="account_text">账号</span>
          <el-input class="account_in"
                    v-model="userForm.user_Email"
                    style="width: 185px"
                    placeholder="E-mail"
                    @blur="verifyEmail"
          />
          <!--
          <input class="account_in" type="text" v-model="userForm.user_Email" @blur="verifyEmail">
          -->
        </div>
        <div class="password_mod">
          <span class="password_text">密码</span>
          <el-input class="password_in"
                    v-model="userForm.user_Password"
                    style="width: 185px"
                    placeholder="Password"
          />
          <!--<input class="password_in" type="password" v-model="userForm.user_Password">-->
        </div>
        <div class="rememberPassword_mod">
          <div class="rememberPassword">
            <!--<input class="rememberPassword_box" type="checkbox" v-model="userForm.remFlag"/>-->
            <el-checkbox v-model="userForm.remFlag" size="large"/>
            <span class="remPassword_text">记住密码</span>
          </div>
          <span class="forgetPassword_mod">
          <router-link to="forgetPass">忘记密码</router-link>
          </span>
        </div>
        <button ref="signInBut" class="signIn_mod" @click="ifEmpty">{{ signInButText }}
        </button>
        <router-link class="signUp_mod" to="/signUp">没有账号?</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

/*登录页面背景*/
.loginBack_mod {
  background: url('/src/photos/background/music80.jpg') no-repeat fixed center center;
  /*图片地址 不重复 水平位置居中 垂直位置居中*/
  /*把背景图片放大到适合元素容器的尺寸，图片比例不变*/
  background-size: cover;
  /*animation: frams 30s infinite;*/
  /*先执行一遍动画，然后再反向执行一遍动画*/
  animation-direction: alternate;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1200px;
  margin: 0 auto;
}

/*背景遮罩*/
.backMask_mod {
  background-color: black;
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 1;
  opacity: 0.3;
}

/*背景动画*/
@keyframes frams {
  0% {
    background: url('/src/photos/background/music10.jpg') no-repeat center center;

    background-attachment: fixed;
    background-size: cover;


  }
  20% {
    background: url('/src/photos/background/music30.jpg') no-repeat center center;

    background-attachment: fixed;
    background-size: cover;

  }
  40% {
    background: url('/src/photos/background/music60.jpg') no-repeat center center;

    background-attachment: fixed;
    background-size: cover;

  }
  60% {
    background: url('/src/photos/background/music70.jpg') no-repeat center center;

    background-attachment: fixed;
    background-size: cover;

  }
  100% {
    background: url('/src/photos/background/music80.jpg') no-repeat center center;

    background-attachment: fixed;
    background-size: cover;

  }
}

/*登陆表单*/
.login_form_mod {
  background: #FFFFFF33;
  width: 430px;
  height: 500px;
  display: flex;
  flex-direction: column;
  z-index: 2;
  align-items: center;
  border-radius: 10px;
  color: #FFFFFF;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  box-shadow: inset 0 0 6px 5px #FFFFFF33;
}

/**标题栏*/
.nav_mod {
  z-index: 3;
  margin-top: 20px;
}

.login_form {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.account_mod {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.account_text {
  font-family: STXihei, serif;
  font-size: large;
}

/*账号输入框*/
.account_in {
  margin-left: 10px;
  width: 180px;
  border-radius: 8px;
}


.password_mod {
  margin-top: 50px;
  display: flex;
  align-items: center;
}

.password_text {
  font-family: STXihei, serif;
  font-size: large;
}

/*密码输入框*/
.password_in {
  margin-left: 10px;
  width: 180px;
  border-radius: 8px;
}


/*记住密码*/
.rememberPassword_mod {
  width: 100%;
  margin-top: 20px;
  padding-left: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rememberPassword {
  display: flex;
  align-items: center;
}

.remPassword_text {
  margin-left: 10px;
  font-family: STXihei, serif;
  font-size: medium;
}

.rememberPassword_box {

}

/*登录按钮*/
.signIn_mod {
  margin-top: 50px;
  height: 35px;
  width: 90px;
  background-color: #d4b73d;
  border: 0;
  border-radius: 5px;
  font-family: STXihei, serif;
  transition: 1s all ease-in-out;
}

.signIn_mod:hover {
  transition: 1s all ease-in-out;
  margin-left: 0;
  width: 200px;
  box-shadow: 0 0 10px 8px #3969b4;
}


/*忘记密码*/
.forgetPassword_mod {

}

.forgetPassword_mod a {
  color: #8DB799;
  text-decoration: none;
  font-size: x-small;
  transition: 0.5s all ease-in-out;
}

.forgetPassword_mod a:hover {
  color: #e58c43;
  transition: 0.5s all ease-in-out;
}

/*注册链接*/
.signUp_mod {
  position: relative;
  top: 40px;
  color: #8DB799;
  text-decoration: none;
  transition: 0.5s all ease-in-out;
}

.signUp_mod:hover {
  color: #e58c43;
  transition: 0.5s all ease-in-out;
}
</style>
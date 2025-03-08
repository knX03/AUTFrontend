<script setup>
import {markRaw, onBeforeUpdate, onMounted, reactive, ref, watch} from "vue";
import {ElMessageBox, ElNotification} from "element-plus";
import {
  aFollowUser, aGetSumFollowAndFan,
  aIfFollowUser,
  aSelectUserInfoByID,
  aUserUnfollowFan
} from "@/api/api.js";
import {useRoute, useRouter} from "vue-router";
import {ChatLineRound, CloseBold, WarnTriangleFilled} from "@element-plus/icons-vue";
import followForm from "@/components/SecondPage/userDetail/otherForm/followForm.vue";
import fansForm from "@/components/SecondPage/userDetail/otherForm/fansForm.vue";
import useFlagStore from "@/store/flagStore.js";
import useMessageStore from "@/store/messageStore.js";
import CreateList from "@/components/SecondPage/userDetail/CreateList.vue";
import LikeList from "@/components/SecondPage/userDetail/LikeList.vue";

const bg_info = ref()
const router = useRouter()
const messageStore = useMessageStore();
const route = useRoute()
const flagStore = useFlagStore();
const user_ID = route.query.user_ID
let sex_logo = ref("")
let ifFollow = ref(false)
let user = ref({
  user_ID: '',
  user_Name: '',
  user_Sex: '',
  user_Age: '',
  user_Birthday: '',
  user_Avatar: '/src/photos/logo/avatarWhite.png',
  user_Introduction: '',
})

let messageForm = reactive({
  poster_ID: '',
  recipient_ID: '',
  message: '',
  post_time: '',
})
let sumFollowAndFan = ref({
  followSum: 0,
  fanSum: 0
})


const detailForm = ref([
  {id: 1, name: '关注', component: markRaw(followForm)},
  {id: 2, name: '粉丝', component: markRaw(fansForm)}])

// 默认显示的组件页面
const selComponent = ref();

//监听关注与粉丝的变化
watch(() => flagStore.flag, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    getSumFollowAndFan(user_ID)
  }
},)

onMounted(() => {
  selectUserDetail(user_ID)
  ifFollowUser(user_ID)
  getSumFollowAndFan(user_ID)
})

onBeforeUpdate(() => {
  bg_info.value.style.backgroundImage = "url(" + user.value.user_Avatar + ")";
})


/* 用户详情查询*/
function selectUserDetail(user_ID) {
  aSelectUserInfoByID(user_ID).then(resp => {
    if (resp.data.code === 200) {
      user.value = resp.data.data;
      changeSexLogo()
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

function getSumFollowAndFan(userID) {
  aGetSumFollowAndFan(userID).then(resp => {
    if (resp.data.code === 200) {
      sumFollowAndFan.value = resp.data.data
    }
  })
}

function ifFollowUser(ID) {
  aIfFollowUser(ID).then(resp => {
    ifFollow.value = resp.data.data;
  })
}

/*不同的性别对应不同的logo*/
function changeSexLogo() {
  switch (user.value.user_Sex) {
    case '男':
      sex_logo.value = "src/photos/logo/boy.png"
      break
    case '女':
      sex_logo.value = "src/photos/logo/girl.png"
      break
    case '外星人':
      sex_logo.value = "src/photos/logo/alien.png"
      break
    case '沃尔玛':
      sex_logo.value = "src/photos/logo/wal.png"
      break
    case '不被定义的':
      sex_logo.value = "src/photos/logo/alien.png"
      break
  }
}

function followDetail() {
  flagStore.flag = true
  selComponent.value = detailForm.value[0].component;

}

function fansDetail() {
  flagStore.flag = true
  selComponent.value = detailForm.value[1].component;
}

function otherAccount() {
  console.log("aaa")
}

function followUser(ID) {
  aFollowUser(ID).then(resp => {
    if (resp.data.code === 200) {
      ElNotification({
        title: "关注成功！",
        type: 'success',
        duration: 2000,
      })
      ifFollowUser(ID)
      getSumFollowAndFan(user_ID)
    }
  })
}

function unFollowUser(ID) {
  ElMessageBox.confirm('确认取消关注该好友吗？', {
    confirmButtonText: '仍然取消',
    cancelButtonText: '继续关注',
    type: 'warning',
  }).then(_ => {
    aUserUnfollowFan(ID).then(resp => {
      if (resp.data.code === 200) {
        ElNotification({
          title: "已取关！",
          type: 'success',
          duration: 2000,
        })
        ifFollowUser(ID)
        getSumFollowAndFan(user_ID)
      } else {
        console.log(resp.data.msg)
      }
    })
  }).catch(_ => {
  });
}


//私信
function postMess() {
  let index = '0';
  messageStore.recipient.user_ID = user.value.user_ID
  messageStore.recipient.user_Name = user.value.user_Name
  messageStore.recipient.user_Avatar = user.value.user_Avatar
  router.push({
    path: '/message',
    query: {index}
  })
}


</script>

<template>
  <div ref="bg_info" class="bg_mod">
    <div class="bg_shade">
      <!--用户资料-->
      <div class="userInfo_mod">
        <div class="userAvatar_mod">
          <img :src="user.user_Avatar">
        </div>
        <div class="nameAndOther_mod">
          <div class="username_mod">{{ user.user_Name }}</div>
          <div class="InfoLogo">
            <img id="sexLogo" :src=sex_logo alt="">
          </div>
          <div class="followAndFans_mod">
            <span @click="followDetail()">{{ sumFollowAndFan.followSum }} 关注</span>
            <span @click="fansDetail()">{{ sumFollowAndFan.fanSum }} 粉丝</span>
          </div>
          <div class="userIntroduction_mod" v-if="![null,''].includes(user.user_Introduction)">
            <el-tooltip
                class="box-item"
                :content="user.user_Introduction"
                placement="right"
                effect="light"
            >
              <span>简介：{{ user.user_Introduction }}</span>
            </el-tooltip>
          </div>
          <div class="dOption_mod">
            <el-button type="danger" round v-if="!ifFollow" @click="followUser(user.user_ID)"> + 关注</el-button>
            <el-button type="danger" round v-if="ifFollow" @click="unFollowUser(user.user_ID)">
              <el-icon>
                <Switch/>
              </el-icon>
              已关注
            </el-button>
            <el-button type="info" @click="postMess()">
              <el-icon>
                <ChatLineRound/>
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <div v-if="flagStore.flag">
        <KeepAlive>
          <component :is="selComponent" :user_ID=user_ID></component>
        </KeepAlive>
      </div>
      <CreateList></CreateList>
      <LikeList></LikeList>
    </div>
  </div>
</template>

<style scoped>
.bg_mod {
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

.bg_shade {
  width: 100%;
  background: linear-gradient(transparent, white, white, white);
  backdrop-filter: blur(200px);
}

/**
个人资料模块
 */

/*用户资料*/
.userInfo_mod {
  width: auto;
  height: 240px;
  display: flex;
  align-items: center;
  padding-left: 90px;
}

/*用户头像模块*/
.userAvatar_mod {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
}

.userAvatar_mod img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  transition: 5s all ease-in-out;
}

.userAvatar_mod img:hover {
  transition: 0.5s all ease-in-out;
  transform: scale(1.2, 1.2);
}

.nameAndOther_mod {
  min-width: 300px;
  /* height: 224px; */
  padding-top: 10px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.nameAndOther_mod span {
  font-family: STXihei, serif;
  color: #000000;
  font-size: small;
}

.username_mod {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 5px;
}


.InfoLogo {
  width: 125px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-bottom: 5px;
}

.InfoLogo img {
  width: 22px;
  height: 22px;
  /*  margin-left: 10px;*/
  border-radius: 50%;
  transition: 0.5s all ease-in-out;
  animation-play-state: paused;
}

.InfoLogo img:hover {
  animation: rotation 0.5s linear infinite;
  transition: 0.5s all ease-in-out;
}

/*性别logo动画旋转*/
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/*关注与粉丝模块*/
.followAndFans_mod {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100px;
  margin-bottom: 5px;
  color: #000000;
}

.followAndFans_mod span {
  font-family: STXihei, serif;
  font-weight: 800;
  font-size: 14px;
}

.userIntroduction_mod {
  font-family: STXihei, serif;
  color: #ffffff;
  font-size: 15px;
  white-space: nowrap; /*强制单行显示*/
  text-overflow: ellipsis; /*超出部分省略号表示*/
  overflow: hidden; /*超出部分隐藏*/
  max-width: 1000px; /*设置显示的最大宽度*/
  display: inline-block;
  margin-bottom: 15px;
}


.dOption_mod {
  width: 10rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dOption_mod .el-button + .el-button {
  margin-left: 0px;
}

</style>
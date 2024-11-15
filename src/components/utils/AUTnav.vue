<script setup>
import {onBeforeMount, onMounted, reactive, ref, watch} from 'vue';
import bus from "@/eventbus.js";
import axios from "axios";
import {useRouter} from "vue-router";
import useUserStore from '@/store/userStore.js'
import useMusicPlayStore from "@/store/musicPlayStore.js";
import useSearchStore from "@/store/searchStore.js";
import useMessageStore from "@/store/messageStore.js";
import {
  aDelHistory,
  aGetSingerByUser, aGetSumFollowAndFan, aHotSearch,
  aIfMy,
  aLogOff, aSearch, aSearchDetail, aSearchHistory, aSinLogOff,
  aUserDetail
} from "@/api/api.js";
import {ElMessageBox, ElNotification} from "element-plus";
import {store} from "xijs";
import {Message} from "@element-plus/icons-vue";
import message from "@/components/utils/message.vue"

//使用pinia获得用户数据
const userStore = useUserStore()
const musicPlayStore = useMusicPlayStore();
const searchStore = useSearchStore();
const messageStore = useMessageStore();

const router = useRouter()
const userID = ""
let opList = ref(["我的消息", "回复我的", "我收到的赞", "系统消息",])
let isDot = ref(true)
let showSearchF = ref(false) //展示搜索模块
const searchS = ref(); // 搜索栏
let searchHistory = ref([]) // 搜索历史
let searchHot = ref(['大利空', '阿', '按规划规范', '按规范', '公司法的', '放到', '发到付']) // 搜索推荐 由Redis得到
let searchText = ref(searchStore.searchValue) // 搜索词
let searchRes = ref() //搜索结果
let avatarFlag = ref(false)
let user = ref(
    {user_Name: '', user_ID: '', user_Avatar: 'src/photos/logo/avatarWhite.png', user_Sex: ''}
)
let sumFollowAndFan = ref({
  followSum: 0,
  fanSum: 0
})


onMounted(() => {
  //store:js工具库所封装的localStorage（可实现过期时间）
  let token = store.get('access_token').value
  let stoken = store.get('access_singer_token').value
  selectUserDetail()
  gSearchHistory()
  hotSearch()
  getSumFollowAndFan(userID)
})

const toUserInfo = (user_ID) => {
  aIfMy(user_ID).then(resp => {
    if (resp.data.data) {
      router.push({
        path: '/myInfo',
      })
    } else {
      router.push({
        path: '/userDetail',
        query: {user_ID}
      })
    }
  })
}

const toUser = () => {
  router.push({
    path: '/myInfo',
  })
}

function toArtists() {
  musicPlayStore.play = false
  let singerToken = store.get('access_singer_token').value
  if (singerToken === null) {
    aGetSingerByUser().then(resp => {
      if (resp.data.code === 200) {
        store.set("access_singer_token", resp.data.data, Date.now() + 1000 * 60 * 60 * 24 * 7)
        //todo 跳转有bug，会进行两次路由访问
        router.go({
          path: '/artHome',
        })
      } else {
        router.push({
          path: '/artists',
        })
      }
    }).catch(resp => {
      router.push({
        path: '/artists',
      })
    })
  } else {
    router.push({
      path: '/artHome',
    })
  }
}

function checkMessage(index) {
  router.push({
    path: '/message',
    query: {index}
  })
  messageStore.showMess = !messageStore.showMess
  if (isDot.value) {
    isDot.value = false;
  }
}


function selectUserDetail() {
  aUserDetail().then(resp => {
    if (resp.data.code === 200) {
      user.value = resp.data.data
      bus.emit('userInfo', user.value)
      userStore.$state = resp.data.data
    } else if (resp.data.code === 401) {
      console.error(resp.data.msg)
    }
  }).catch(resp => {
    console.error(resp)
  })
}


function logOff() {
  let token = store.get('access_token').value
  let singerToken = store.get('access_singer_token').value
  if (singerToken != null) {
    aSinLogOff(singerToken).then(resp => {
      if (resp.data.code === 200) {
        store.remove("access_singer_token")
      }
    })
  }
  if (token != null) {
    aLogOff(token).then(resp => {
      if (resp.data.code === 200) {
        store.remove("access_token")
        userStore.$reset()
        router.push({
          path: '/signIn',
        })
      }
    }).catch(resp => {
      ElNotification({
        title: '登录信息过期!',
        type: 'error'
      })
      store.remove("access_token")
      userStore.$reset()
      setTimeout(() => {
        router.push({
          path: '/signIn',
        })
      }, 1000)
    })
  } else {
    ElNotification({
      title: '请先登录!',
      type: 'error',
      position: 'top-left',
      duration: 2000
    })
  }
}


//登录
function toSignIn() {
  let token = store.get('access_token').value
  if (token != null) {
    ElNotification({
      title: '您已登录!',
      type: 'success',
      position: 'top-left',
      duration: 2000
    })
  } else {
    router.push({
      path: '/signIn',
    })
  }
}


function search() {
  if (searchText.value != null && searchText.value.length > 0) {
    aSearch(searchText.value).then(resp => {
      searchRes.value = resp.data.data
    })
  }
}

function enterSearch(e) {
  if (e.keyCode === 13 || e.keyCode === 100) {
    searchDetail(searchText.value)
  }

}

function focusSearch() {
  search()
  showSearchF.value = true
}

function gSearchHistory() {
  aSearchHistory().then(resp => {
    if (resp.data.code === 200) {
      searchHistory.value = resp.data.data
    } else {
      searchHistory.value = []
    }
  })
}

function hotSearch() {
  aHotSearch().then(resp => {
    if (resp.data.code === 200) {
      searchHot.value = resp.data.data
    } else {
      searchHot.value = []
    }
  })
}

//清空搜索历史
function delSeaHistory() {
  ElMessageBox.alert('确定清空全部历史记录吗？', {
    confirmButtonText: '确定',
  }).then(resp => {
    searchHistory.value = []
    aDelHistory().then(resp => {
      if (resp.data.code === 200) {
        console.log("SUCCESS")
      }
    })
  })
}

function showSearchS() {
  return searchText.value.length > 0;
}

// 定义局部自定义指令，这里是在 setup 标签下编写，指令名称以 v 开头，无需额外注册逻辑
const vClickOutside = {
  mounted(el, binding) {
    function eventHandler(e) {


      if (el.contains(e.target) || e.target === searchS.value) {
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
  showSearchF.value = false
}

function searchDetail(data) {
  searchText.value = data
  search()
  showSearchF.value = false
  aSearchDetail(data).then(resp => {
    gSearchHistory()
    searchStore.searchValue = data
    router.push({
      path: '/searchDetail',
      query: {data}
    })
  })
}

function avatarOver() {
  avatarFlag.value = true
}

function getSumFollowAndFan(userID) {
  aGetSumFollowAndFan(userID).then(resp => {
    if (resp.data.code === 200) {
      sumFollowAndFan.value = resp.data.data
    }
  })
}
</script>

<template>
  <div class="nav_container">
    <router-link to="/" href="#" class="navbar_logo">
      <img src="../icons/AUT.png">
    </router-link>
    <div id="searchBox" class="navbar_searchBox">
      <input v-model="searchText"
             @input="search()"
             ref="searchS"
             @focus="focusSearch"
             @keydown="enterSearch"
             class="navbar_search_input" placeholder="搜索你想听的音乐"
             aria-label="Search">

      <div class="search_mod"
           :class={activeS:showSearchF}
           v-click-outside="onClickOutside"
      >
        <el-scrollbar>
          <div v-show="searchText.length > 0">
            <span class="search_mod_title">猜你想搜</span>
            <div class="search_mod_show">
                <span v-for="item in searchRes" @click="searchDetail(item)">
                  {{ item }}
                </span>
            </div>
          </div>
          <div class="search_mod_show_home" v-show="searchText.length === 0">
            <div class="search_mod_show_history" v-show="searchHistory.length> 0">
              <div class="search_mod_show_history_title">
                <span>搜索历史</span>
                <el-icon class="search_mod_show_history_delBT" @click="delSeaHistory()">
                  <Delete/>
                </el-icon>
              </div>
              <div class="search_history_bt_mod">
                <div class="search_history_bt" v-for="item in searchHistory">
                  <span class="search_history_bt_text" @click="searchDetail(item)">{{ item }}</span>
                </div>
              </div>
            </div>
            <div class="search_mod_show_recom">
                  <span class="search_mod_show_recom_title">
                    热搜榜</span>
              <div class="search_mod_show_recom_form">
                <div class="search_mod_show_recom_form_item"
                     v-for="(item,index) in searchHot"
                     @click="searchDetail(item)">
                  <span class="item_index" :class="{red:index<3}">{{ index + 1 }}</span>
                  <span style="max-width:250px">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="navbar_singer_mod" @click="toArtists">
      我是歌手
    </div>
    <div class="navbar_split"></div>
    <div class="navbar_option_mod">
      <img class="nav_avatar"
           @mouseover="avatarOver"
           @mouseout="avatarFlag=false"
           :src=user.user_Avatar
           :class="{aActive:avatarFlag}"
           alt="avatar">
      <div class="userInfoOP_mod"
           @mouseover="avatarOver"
           @mouseout="avatarFlag=false"
           :class="{oActive:avatarFlag}">
        <span class="borderText" style="margin-bottom: 15px">{{ user.user_Name }}</span>
        <div class="userInfoOP_mod_fans">
          <div class="userInfoOP_mod_fans_item"><span class="borderText">关注</span>
            {{ sumFollowAndFan.followSum }}<span></span></div>
          <div class="userInfoOP_mod_fans_item"><span class="borderText">粉丝</span>
            {{ sumFollowAndFan.fanSum }}<span></span></div>
        </div>
        <div class="userInfoOP_mod_DE" @click="toUser">
          <div style="display: flex;align-items: center">
            <el-icon style="margin-right: 10px">
              <UserFilled/>
            </el-icon>
            <span>个人中心</span>
          </div>
          <span> > </span>
        </div>
        <div class="userInfoOP_mod_split"></div>
        <div class="userInfoOP_mod_EX" @click="logOff()">
          <el-icon style="margin-right: 10px">
            <Promotion/>
          </el-icon>
          <span>退出登录</span>
        </div>
      </div>
      <div class="message_mod">
        <el-badge :is-dot="isDot" class="item" style="width: 1.4em;">
          <Message style="width: 1.3em; height: 1.3em; margin-right: 8px;" @click="checkMessage(0)"/>
        </el-badge>
      </div>
      <div class="op_list_container">
        <div class="at_message_mod_op_list">
          <div class="op_list_item"
               v-for="(item,index) in opList"
               @click="checkMessage(index)">
            {{ item }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped src="../css/AUTnav.css"></style>
<style scoped>

</style>
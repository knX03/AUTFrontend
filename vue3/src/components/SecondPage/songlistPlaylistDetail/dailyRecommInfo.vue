<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import bus from "@/eventbus.js";
import axios from "axios";
import {ElMessage} from "element-plus";
import useUserStore from '@/store/userStore.js'

const userStore = useUserStore();
const userID = userStore.user_ID;
const route = useRoute()
let collectBT = ref(true)
let disabled = ref(false)
let creator = ref("")
let creator_Avatar = ref('src/photos/logo/avatarWhite.png')
let new_playlist_Cover = ref("")
let colletBUTX = ref("收藏")

let songPlaylists = ref({
  playlist_ID: '',
  create_By: '',
  create_Time: '',
  playlist_Name: '',
  new_playlist_Name: '',
  playlist_Cover: '',
  playlist_introduction: '',
  playlist_label: '',
})
let playlistFrom = ref({
  playlist_ID: '',
  create_By: '',
  create_Time: '',
  playlist_Name: '',
  new_playlist_Name: '',
  playlist_Cover: '',
  playlist_introduction: '',
  playlist_label: '',
})

let songList = ref([{
  song_Name: '',
  singer_ID: '',
  album_ID: '',
  song_cover: '',
}])

onMounted(() => {
  let FPlaylist_ID = 10000
  selectDetail(FPlaylist_ID)
})

/*根据跳转的歌单ID查询歌单详情*/
function selectDetail(data) {
  axios({
    method: 'get',
    url: 'http://localhost/songPlaylist/DetailByID?playlist_ID=' + data,
  }).then(resp => {
    if (resp.data.code === 200) {
      songPlaylists.value = resp.data.data;
      new_playlist_Cover.value = resp.data.data.playlist_Cover;
      playlistFrom.value = songPlaylists.value;
      editInfo(userID)
      selectCreatorDetail(resp.data.data.create_By)
      ifCollectPlaylist(songPlaylists.value.playlist_ID, userID)
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*创建者详情查询*/
function selectCreatorDetail(create_By) {
  axios({
    method: 'GET',
    url: 'http://localhost/user/DetailByID?user_ID=' + create_By,
  }).then(resp => {
    if (resp.data.code === 200) {
      creator.value = resp.data.data.user_Name
      creator_Avatar.value = resp.data.data.user_Avatar
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

function editInfo(user_ID) {
  collectBT.value = user_ID !== songPlaylists.value.create_By;
}

/*查询歌单是否收藏*/
function ifCollectPlaylist(playlist_ID, user_ID) {
  axios({
    method: 'GET',
    url: 'http://localhost/songPlaylist/ifCollectPlaylist?playlist_ID=' + playlist_ID + "&user_ID=" + user_ID,
  }).then(resp => {
    if (resp.data.code === 302) {
      disabled.value = true;
      colletBUTX.value = "已收藏"
    } else if (resp.data.code === 200) {
      disabled.value = false;
    }
  })
}

function /*收藏歌单*/
collectPlaylist(row) {
  axios({
    method: 'GET',
    url: 'http://localhost/songPlaylist/collectPlaylist?playlist_ID=' + row + "&user_ID=" + userID,
  }).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success(resp.data.msg)
      disabled.value = true;
      colletBUTX.value = "已收藏"
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}
</script>

<template>
  <div class="first_mod">

    <img :src="songPlaylists.playlist_Cover" class="cover_mod">

    <div class="option_mod">
      <div class="basicInfo_mod">
        <label class="playListName_mod">{{ songPlaylists.playlist_Name }}</label>
      </div>
      <div class="userInfo_mod">
        <!--todo 歌单创建者的信息(附带跳转)-->
        <img :src="creator_Avatar" @click="toUserInfo(creator)">
        <label class="userName_mod" @click="toUserInfo(creator)">
          {{ creator }}
        </label>
        <label class="creatTime_mod">{{ songPlaylists.create_Time }} 创建</label>
      </div>
      <!--todo 播放和下载功能待实现-->
      <div class="playAndLoad_mod">
        <el-button type="warning">
          <img src="/src/photos/logo/playWhite.png">
          <label>播放全部</label>
        </el-button>
        <el-button type="info">
          <img src="/src/photos/logo/downLoadWhite.png">
          <label>下载</label>
        </el-button>
      </div>
      <div class="collect_mod" v-if="collectBT">
        <el-button type="info" :disabled="disabled" @click="collectPlaylist(songPlaylists.playlist_ID)">
          <img src="/src/photos/logo/collect.png">
          {{ colletBUTX }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.first_mod {
  width: 100%;
  height: 250px;
  background-image: linear-gradient(to right, #4b5cc4, #e4c6d0);
}

/*歌单封面*/
.cover_mod {
  width: 200px;
  height: 200px;
  border-radius: 30px;
  position: relative;
  top: 50%;
  left: 18%;
  transform: translate(-50%, -50%);
}

/*选项模块*/
.option_mod {

  height: 250px;

  position: absolute;
  top: 79px;
  left: 430px;
}

/*歌单基础信息*/
.basicInfo_mod {
  width: 250px;
  height: 40px;

  display: flex;
  position: relative;
  top: 30px;
  justify-content: space-evenly;
  align-items: center;
}

.playListName_mod {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: white;
}

/*用户信息模块*/
.userInfo_mod {
  width: 206px;
  height: 30px;
  position: relative;
  top: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 15px;
}

.userInfo_mod img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;

}

.userInfo_mod label {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #ffffff;
}

.userName_mod {
  cursor: pointer;
}

/*播放和下载按钮*/
.playAndLoad_mod {
  width: 233px;
  height: 50px;
  position: absolute;
  bottom: 24px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}

.playAndLoad_mod label {
  font-family: STXihei, serif;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.playAndLoad_mod img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.playAndLoad_mod .el-button {
  color: #FFF;
  border-radius: 12px;

}

.playAndLoad_mod .el-button span {
  display: flex;
  align-items: center;
  justify-content: center;
}

/*播放按钮*/
.playAndLoad_mod .el-button--warning {

}

/*下载按钮*/
.playAndLoad_mod .el-button--info {

  color: #FFF;
  backdrop-filter: blur(8px);
  background: #FFFFFF33;
}

/*收藏按钮*/
.collect_mod {
  width: 80px;
  position: relative;
  top: 114px;
  left: 241px;
}


.collect_mod .el-button > span {
  font-family: STXihei, serif;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.collect_mod img {
  width: 20px;
  height: 20px;
}

.collect_mod .el-button {
  color: #FFF;
  border-radius: 12px;
}

.collect_mod .el-button span {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
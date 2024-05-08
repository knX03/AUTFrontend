<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import bus from "@/eventbus.js";
import {useRoute} from "vue-router";
import useUserStore from '@/store/userStore.js'

const userStore = useUserStore()
const route = useRoute()
let dialogVisible = ref(false)
let messageCode = ref("")
let disabled = ref(false)
let colletBUTX = ref("收藏")
let user = ref({user_ID: '', user_name: ''})
let album = ref({
  album_ID: '',
  album_Name: '',
  album_Cover: '',
  create_Time: '',
  singer_name: '',
  singer_ID: '',
  album_Introduction: '',
})

let singer = ref({
  singer_Name: '',
  singer_Avatar: ''
})
const userID = userStore.user_ID;


onMounted(() => {
  let FAlbum_ID = route.query.album_ID
  bus.emit('album_ID', FAlbum_ID)
  ifCollectAlbum(FAlbum_ID, userID)
  selectDetailAlbum(FAlbum_ID)
})


/*专辑详情查询*/
function selectDetailAlbum(FAlbum_ID) {
  axios({
    method: 'get',
    url: 'http://localhost/album/selectDetail?album_ID=' + FAlbum_ID,
  }).then(resp => {
    if (resp.data.code === 200) {
      album.value = resp.data.data;
      /*查询歌手详细信息*/
      selectSingerDetail(resp.data.data.singer_ID)
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*歌手详情查询*/
function selectSingerDetail(singer_ID) {
  axios({
    method: 'GET',
    url: 'http://localhost/singer/selectSingerDetail?singer_ID=' + singer_ID,
  }).then(resp => {
    if (resp.data.code === 200) {
      singer.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

/*查询专辑是否收藏*/
function ifCollectAlbum(album_ID, user_ID) {
  axios({
    method: 'GET',
    url: 'http://localhost/album/ifCollectAlbum?album_ID=' + album_ID + "&user_ID=" + user_ID,
  }).then(resp => {
    if (resp.data.code === 302) {
      colletBUTX.value = "已收藏"
      disabled.value = true;
    } else if (resp.data.code === 200) {
      disabled.value = false;
    }
  })
}

function
collectAlbum(row) {
  axios({
    method: 'GET',
    url: 'http://localhost/album/collectAlbum?album_ID=' + row + "&user_ID=" + userID,
  }).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success("收藏成功！")
      colletBUTX.value = "已收藏"
      disabled.value = true;
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}


</script>

<template>
  <div class="first_mod">
    <img :src="album.album_Cover" class="Cover_mod">
    <div class="albumInfo_mod">
      <div class="basicInfo_mod">
        <label>{{ album.album_Name }}</label>
      </div>
      <div class="ALSingerInfo_mod">
        <img :src="singer.singer_Avatar">
        <span>{{ singer.singer_Name }}</span>
        <span style="color: #8a8a8a">{{ album.create_Time }}发布</span>
      </div>
      <!--todo 播放、下载功能待实现-->
      <div class="playAndLoad_mod">
        <el-button type="warning">
          <img src="/src/photos/logo/playWhite.png">
          <span>播放全部</span>
        </el-button>
        <el-button type="info" :disabled="disabled" @click="collectAlbum(album.album_ID)">
          <img src="/src/photos/logo/collect.png">
          {{ colletBUTX }}
        </el-button>
        <el-button type="info">
          <img src="/src/photos/logo/downLoadWhite.png">
          <span>下载</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.first_mod {
  width: 1684px;
  height: 250px;
  background-color: #f7f9fc;
}

/*专辑封面*/
.Cover_mod {
  width: 200px;
  height: 200px;
  border-radius: 30px;
  position: relative;
  top: 50%;
  left: 18%;
  transform: translate(-50%, -50%);
}

/*选项模块*/
.albumInfo_mod {
  height: 250px;
  position: absolute;
  top: 79px;
  left: 430px;
}

/*歌单基础信息*/
.basicInfo_mod {
  width: 185px;
  height: 40px;
  display: flex;
  position: relative;
  top: 30px;
  left: 10px;
  align-items: center;
}

.basicInfo_mod label {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: #000000;
}

/*用户信息模块*/
.ALSingerInfo_mod {
  width: 160px;
  height: 30px;
  position: relative;
  top: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 10px;
}

.ALSingerInfo_mod img {
  height: 20px;
  width: 20px;
  border-radius: 50%;
}

.ALSingerInfo_mod span {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #444444;
}


/*播放和下载按钮*/
.playAndLoad_mod {
  width: 350px;
  height: 50px;
  position: absolute;
  bottom: 24px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}

.playAndLoad_mod span {
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

/*下载按钮*/
.playAndLoad_mod .el-button--info {
  color: #FFF;
}
</style>
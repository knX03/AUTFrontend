<script setup>

import {onBeforeUpdate, onMounted, ref} from "vue";
import axios from "axios";
import {ElMessage, ElNotification} from "element-plus";
import {useRoute} from "vue-router";
import {
  aCollectAlbum,
  aDeleteAlbum,
  aIfCollectAlbum,
  aSelectDetailAlbum,
  aSelectSingerDetail,
  aSongByAlbum
} from "@/api/api.js";
import router from "@/router/index.js";

import useMusicPlayStore from "@/store/musicPlayStore.js";
import AlbumSongList from "@/components/SecondPage/albumDetail/albumSongList.vue";

const musicPlayStore = useMusicPlayStore();
const route = useRoute()
const bg_info = ref()
let ifCollect = ref(false)
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
  singer_ID: '',
  singer_Name: '',
  singer_Avatar: ''
})
let songList = ref([{
  song_ID: '',
  song_Name: '',
  singer_ID: '',
  singer_Name: '',
  album_ID: '',
  album_Name: '',
  song_cover: '',
  song_Directory: '',
}])

const toSinger = (singer_ID) => {
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}
onMounted(() => {
  const FAlbum_ID = route.query.album_ID
  ifCollectAlbum(FAlbum_ID)
  selectDetailAlbum(FAlbum_ID)
  selectSongByAlbum(FAlbum_ID)
})
onBeforeUpdate(() => {
  bg_info.value.style.backgroundImage = "url(" + album.value.album_Cover + ")";
})

/*专辑详情查询*/
function selectDetailAlbum(FAlbum_ID) {
  aSelectDetailAlbum(FAlbum_ID).then(resp => {
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
  aSelectSingerDetail(singer_ID).then(resp => {
    if (resp.data.code === 200) {
      singer.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

/*根据跳转的专辑名字查询歌曲*/
function selectSongByAlbum(data) {
  aSongByAlbum(data).then(resp => {
    if (resp.data.code === 200) {
      songList.value = resp.data.data;
    } else if (resp.data.code === 500) {
      ElMessage({
        message: "error",
        type: "error",
      })
      console.log(resp.data.msg)
    }
  })
}

/*查询专辑是否收藏*/
function ifCollectAlbum(album_ID) {
  aIfCollectAlbum(album_ID).then(resp => {
    if (resp.data.code === 302) {
      colletBUTX.value = "已收藏"
      ifCollect.value = true;
    } else if (resp.data.code === 200) {
      ifCollect.value = false;
    }
  }).catch(resp => {
    console.log(resp)
  })
}

function
collectAlbum(row) {
  aCollectAlbum(row).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success("收藏成功！")
      colletBUTX.value = "已收藏"
      ifCollect.value = true;
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}

function delColAlbum(row) {
  aDeleteAlbum(row).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success('删除成功！')
      colletBUTX.value = "收藏"
      ifCollect.value = false;
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}

//播放全部歌曲
function playAll() {
  musicPlayStore.play = false
  musicPlayStore.play = true
  musicPlayStore.index = -2
  musicPlayStore.index = 0
  musicPlayStore.songList = songList.value
}
</script>

<template>
  <div ref="bg_info" class="bg_mod">
    <div class="bg_shade">
      <div class="first_mod">
        <img :src="album.album_Cover" class="Cover_mod">
        <div class="albumInfo_mod">
          <div class="basicInfo_mod">
            <span>{{ album.album_Name }}</span>
          </div>
          <div class="ALSingerInfo_mod">
            <img :src="singer.singer_Avatar" style="cursor: pointer" @click="toSinger(singer.singer_ID)">
            <span style="cursor: pointer" @click="toSinger(singer.singer_ID)">{{ singer.singer_Name }}</span>
            <span style="color: #000000">{{ album.create_Time }} 发布</span>
          </div>
          <!--todo 下载功能待实现-->
          <div class="playAndLoad_mod">
            <el-button type="warning" @click="playAll()">
              <img src="/src/photos/logo/playWhite.png">
              <span>播放全部</span>
            </el-button>
            <el-button type="info" v-if="!ifCollect" @click="collectAlbum(album.album_ID)">
              <img src="/src/photos/logo/collect.png">
              {{ colletBUTX }}
            </el-button>
            <el-button type="warning" v-if="ifCollect" @click="delColAlbum(album.album_ID)">
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
      <AlbumSongList></AlbumSongList>
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
  background: linear-gradient(rgba(245, 245, 245, 0.3), white, white, white);
  backdrop-filter: blur(200px);
}

.first_mod {
  /*  width: 100%;*/
  height: 240px;
  display: flex;
  align-items: center;
  padding-left: 11%;
}

/*专辑封面*/
.Cover_mod {
  width: 200px;
  height: 200px;
  border-radius: 30px;
}

/*选项模块*/
.albumInfo_mod {
  min-width: 300px;
  max-width: 1200px;
  /*  transform: translateY(-10px);*/
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/*歌单基础信息*/
.basicInfo_mod {
  max-width: 450px;
  height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.basicInfo_mod span {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: #000000;
}


/*用户信息模块*/
.ALSingerInfo_mod {
  width: 160px;
  height: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 10px;
  margin-bottom: 15px;
}

.ALSingerInfo_mod img {
  height: 20px;
  width: 20px;
  border-radius: 50%;
}

.ALSingerInfo_mod span {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #000000;
}

.ALSingerInfo_mod span:hover {
  color: #ffffff;
}

/*播放和下载按钮*/
.playAndLoad_mod {
  max-width: 300px;
  height: 50px;
  display: flex;
  justify-content: space-between;
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
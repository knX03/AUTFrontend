<script setup>


import {onBeforeUpdate, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {aFollowUser, aIfFollowUser, aSelectSingerDetail, aSongBySinger, aUserUnfollowFan} from "@/api/api.js";
import router from "@/router/index.js";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";

import useMusicPlayStore from "@/store/musicPlayStore.js";
import SingerSongList from "@/components/SecondPage/singerDetail/songList.vue";

const musicPlayStore = useMusicPlayStore();
const route = useRoute()
const bg_info = ref()
let user = ref(
    {user_Name: '', user_ID: ''}
)
let singer = ref({
  user_ID: '',
  singer_ID: '',
  singer_Name: '',
  singer_Avatar: '',
  singer_Age: '',
  singer_Introduction: '',
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
let ifFolSinger = ref(false)

const toUserInfo = (user_ID) => {
  router.push({
    path: '/userDetail',
    query: {user_ID}
  })
}

onMounted(() => {
  let FSinger_ID = route.query.singer_ID
  selectSingerDetail(FSinger_ID)
  selectSongBySinger(FSinger_ID)
})

onBeforeUpdate(() => {
  bg_info.value.style.backgroundImage = "url(" + singer.value.singer_Avatar + ")";
})

/*歌手详情查询*/
function selectSingerDetail(singer_ID) {
  aSelectSingerDetail(singer_ID).then(resp => {
    if (resp.data.code === 200) {
      singer.value = resp.data.data;
      ifFollowSinger(singer.value.user_ID)
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

/*根据跳转的歌手名字查询歌曲*/
function selectSongBySinger(data) {
  aSongBySinger(data).then(resp => {
    if (resp.data.code === 200) {
      songList.value = resp.data.data;
    } else if (resp.data.code === 500) {
      ElMessage.error("error")
      console.log(resp.data.msg)
    }
  })
}

function ifFollowSinger(ID) { //ID为歌手相应的用户ID
  aIfFollowUser(ID).then(resp => {
    ifFolSinger.value = resp.data.data;
  })
}

function followSinger(ID) {
  aFollowUser(ID).then(resp => {
    if (resp.data.code === 200) {
      ifFolSinger.value = true
      ElNotification({
        title: "关注成功！",
        type: 'success',
        duration: 2000,
      })
    }
  })
}

function unFollowSinger(ID) {
  ElMessageBox.confirm('确认取消关注该好友吗？', {
    confirmButtonText: '仍然取消',
    cancelButtonText: '继续关注',
    type: 'warning',
  }).then(_ => {
    aUserUnfollowFan(ID).then(resp => {
      if (resp.data.code === 200) {
        ifFolSinger.value = false
        ElNotification({
          title: "已取关！",
          type: 'success',
          duration: 2000,
        })
      } else {
        console.log(resp.data.msg)
      }
    })
  }).catch(_ => {
  });
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

        <img :src="singer.singer_Avatar" class="Avatar_mod">

        <div class="singerInfo_mod">
          <div class="basicInfo_mod">
            <label class="singerName_mod">{{ singer.singer_Name }}</label>
          </div>
          <div class="singerNameEN_mod">
            <span>{{ singer.singer_Name }}</span>
            <span class="toSingerU_mod" @click="toUserInfo(singer.user_ID)">个人页 ></span>
          </div>
          <!--todo 下载功能待实现-->
          <div class="playAndLoad_mod" id="PAL_mod">
            <el-button type="warning" @click="playAll()">
              <img src="/src/photos/logo/playWhite.png">
              <span>播放全部</span>
            </el-button>
            <el-button type="warning" plain v-if="!ifFolSinger" @click="followSinger(singer.user_ID)">
              <el-icon>
                <Plus/>
              </el-icon>
              &nbsp;关注
            </el-button>
            <el-button type="warning" v-if="ifFolSinger" @click="unFollowSinger(singer.user_ID)">
              <el-icon>
                <Check/>
              </el-icon>
              &nbsp;关注
            </el-button>
          </div>
        </div>
      </div>
      <singer-song-list></singer-song-list>
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

/**
歌手信息部分
 */
.first_mod {
  height: 240px;
  display: flex;
  align-items: center;
  padding-left: 11%;
}

/*歌手海报*/
.Avatar_mod {
  width: 200px;
  height: 200px;
  border-radius: 30px;
}

/*选项模块*/
.singerInfo_mod {
  min-width: 300px;
  max-width: 1200px;
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

.singerName_mod {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: #000000;
}

/*用户信息模块*/
.singerNameEN_mod {
  width: 160px;
  height: 30px;
  display: flex;
  justify-content: left;
  align-items: center;
  left: 15px;
  margin-bottom: 15px;
}


.singerNameEN_mod span {
  font-family: STXihei, serif;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.82);
}

.toSingerU_mod {
  margin-left: 20px;
  cursor: pointer;
}

.toSingerU_mod:hover {
  color: #ffffff;
}


/*播放和下载按钮*/
.playAndLoad_mod {
  width: 233px;
  height: 50px;
  display: flex;
  align-items: center;

}

.playAndLoad_mod span {
  font-family: STXihei, serif;
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.playAndLoad_mod img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

#PAL_mod :deep(.el-button) {
  border-radius: 12px;
}


#PAL_mod :deep(.el-button span) {
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>
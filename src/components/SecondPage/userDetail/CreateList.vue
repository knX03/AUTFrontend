<script setup>

import {getCurrentInstance, onMounted, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import bus from "@/eventbus.js";
import router from "@/router/index.js";
import {aSelectCreateDetail} from "@/api/api.js";
import {useRoute} from "vue-router";

const route = useRoute()
const {ctx} = getCurrentInstance()
let creatList = ref([{
  playlist_ID: '',
  playlist_Name: '',
  playlist_Cover: '',
}])

let CSwitch = ref(true)
const toPlaylist = (playlist_ID) => {
  router.push({
    path: '/playlistDetails',
    query: {playlist_ID}
  })
}

onMounted(() => {
  const userID = route.query.user_ID
  selectCreateDetail(userID)

})

/*用户创建的歌单详情*/
function selectCreateDetail(userID) {
  aSelectCreateDetail(userID).then(resp => {
    if (resp.data.code === 200) {
      creatList.value = resp.data.data
      if (creatList.value.length === 0) {
        CSwitch.value = false
      }
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}
</script>

<template>
  <!--创建的歌单-->
  <div class="createSongPlaylistsInfo_mod">
    <span class="titleSong_mod">TA创建的歌单</span>
    <div v-if="CSwitch" class="songListInfo_mod">
      <!--点击跳转歌单详情并传送关键值-->
      <div v-for="list in creatList">
        <div class="songPlaylistsCover_mod" @click="toPlaylist(list.playlist_ID)">
          <img :src="list.playlist_Cover"/>
        </div>
        <span class="songPlaylistsName_mod">{{ list.playlist_Name }}</span>
      </div>
    </div>
    <div v-if="!CSwitch" class="createList_null_logo">
      <img src="/src/photos/logo/没有更多笔记.png">
      <div class="createList_null_tip">用户暂未创建歌单</div>
    </div>
  </div>
</template>

<style scoped>
/*创建的歌单列表*/
.createSongPlaylistsInfo_mod {
  height: auto;
  margin-bottom: 50px;
  padding-top: 20px;
  padding-left: 70px;
}

/*标题*/
.titleSong_mod {
  font-family: STXihei, serif;
  font-size: 20px;
  font-weight: 900;
  color: #000000;
  margin-left: 20px;
}

/*歌单列表模块*/
.songListInfo_mod {
  max-height: 405px;
  overflow: auto;
  width: 100%;
  padding-top: 5px;
  padding-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;


}

/*歌单封面*/
.songPlaylistsCover_mod {
  height: 150px;
  width: 150px;
  max-width: 150px;
  max-height: 150px;
  overflow: hidden;
  border-radius: 12px;
  margin: 20px 20px 10px;
  cursor: pointer;
}

.songPlaylistsCover_mod img {
  height: 150px;
  width: 150px;
  border-radius: 12px;
  background-color: #C0C4CC;
  transition: 0.5s all ease-in-out;
}

.songPlaylistsCover_mod:hover img {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}


.songPlaylistsName_mod {
  font-family: STXihei, serif;
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  margin-left: 25px;
}

.createList_null_logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.createList_null_tip {
  font-family: STXihei, serif;
  font-size: 15px;
  font-weight: 600;
}
</style>
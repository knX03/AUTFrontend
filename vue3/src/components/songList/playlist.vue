<script setup>


import {onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";

let SPlist = ref([
  {
    playlist_ID: '',
    playlist_Name: '',
    playlist_Cover: '',
  },
])

onMounted(() => {
  selectALlPlaylist()
})

/*查询所有歌单*/
function selectALlPlaylist() {
  axios({
    method: 'get',
    url: 'http://localhost/songPlaylist/allPlaylists',
  }).then(resp => {
    if (resp.data.code === 200) {
      SPlist.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*歌单详情跳转*/
function toSongPlaylist(row) {
  router.push({
    path: '/playlistDetails',
    query: {ID: row}
  })
}


</script>

<template>
  <div class="playlist_mod">
    <div class="playlist_container">
      <div class="songPlaylist_mod" v-for="item in SPlist">
        <div class="img_container" @click="toSongPlaylist(item.playlist_ID)">
          <img :src="item.playlist_Cover">
          <div class="playlist_name_action">
            {{ item.playlist_Name }}
          </div>
        </div>
        <span @click="toSongPlaylist(item.playlist_ID)">{{ item.playlist_Name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
列表部分
 */
.playlist_mod {
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 600px;
}

.playlist_container {
  margin-top: 15px;
  max-width: 1400px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}


.songPlaylist_mod {
  height: 250px;
  border-radius: 12px;
  margin-top: 10px;
  margin-left: 20px;
}

.img_container {
  width: 220px;
  height: 220px;
  overflow: hidden;
  border-radius: 12px;
}

.img_container img {
  width: 220px;
  height: 220px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.5s all ease-in-out;
}

.img_container:hover img {
  transition: 0.5s all ease-in-out;
  transform: scale(1.1, 1.1);
}

.playlist_name_action {
  font-family: "微软雅黑 Light", serif;
  background: transparent;
  width: 100%;
  height: 50%;
  transition: 2s all ease-in-out;
  translate: 0 20px;
}

.img_container:hover .playlist_name_action {
  width: 100%;
  height: 50%;
  backdrop-filter: blur(8px);
  transition: 0.2s all ease-in-out;
  color: #ffffff;
  font-size: 30px;
  font-weight: 900;
  padding-left: 15px;
  translate: 0 -100px;
  box-shadow: 0 0 20px 0 #bebebe;
  cursor: pointer;
}

.songPlaylist_mod span {
  display: flex;
  font-family: "微软雅黑 Light", serif;
  font-size: 16px;
  margin-left: 15px;
  margin-top: 15px;
  cursor: pointer;
  color: #000000;
  transition: 0.5s all ease-in-out;
}

.songPlaylist_mod span:hover {
  transition: 0.5s all ease-in-out;
  transform: scale(1.1, 1.1);
  color: #75c1c4;
}
</style>
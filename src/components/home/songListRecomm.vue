<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {aChangeDailyList, aNineRandomPlaylist} from "@/api/api.js";

const router = useRouter()
let songList = ref([
  {create_By: '', playlist_ID: '', playlist_Name: '', playlist_Cover: ''},
])
//当前日期
const date = ref(new Date());
const month = ref(date.value.getMonth() + 1)
const today = ref(date.value.getDate())
const day = ref(month.value.toString() + "/" + today.value.toString())
const dailyRe = ref(
    {url: 'src/photos/Daily/' + today.value + '.png', today: day}
)

/*
const dailyRe = ref(
    {url: '/assets/Daily/' + today.value + '.png', today: day} //todo ECS
)*/

const toPlaylist = (playlist_ID) => {
  router.push({
    path: '/playlistDetails',
    query: {playlist_ID}
  })
}

const toDaily = (playlist_ID) => {
  router.push({
    path: '/dailyRecomm',
    query: {playlist_ID}
  })
}


onMounted(() => {
  changeDailyList()
  selectSongPlaylist()
})

/*展示随机十个歌单*/
function selectSongPlaylist() {
  aNineRandomPlaylist().then(resp => {
    if (resp.data.code === 200) {
      songList.value = resp.data.data
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

//根据日常修改日推
function changeDailyList() {
  aChangeDailyList().then(resp => {
    if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

</script>

<template>
  <div class="container_mod">
    <span class="title">歌单推荐</span>
    <div class="songList_mod">
      <div class="dailyRe" @click="toPlaylist(10000)">
        <div class="daily_container">
          <img :src=dailyRe.url>
        </div>
        <div class="name_action">{{ dailyRe.today }}</div>
        <div class="create_name">by: AUTMusic</div>
      </div>
      <div class="songListRe" v-for="item in songList">
        <div class="songList_container" @click="toPlaylist(item.playlist_ID)">
          <img :src=item.playlist_Cover>
        </div>
        <div class="name_action">{{ item.playlist_Name }}</div>
        <div class="create_name">by: {{ item.create_By }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container_mod {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(#f3f3f3, #fafafa);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-family: SimHei, serif;
  font-weight: 900;
  font-size: 33px;
  margin-top: 50px;
}

.songList_mod {
  width: 80%;
  height: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.dailyRe {
  width: 150px;
  max-width: 200px;
  max-height: 200px;
  /*超出部分隐藏*/
  margin: 20px;
}

.dailyRe span {
  font-family: STXihei, serif;
  font-weight: 900;
  font-size: 15px;
}

.daily_container {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 12px;
}

.dailyRe img {
  background: #7d8561;
  height: 150px;
  width: 150px;
  transition: 0.5s all ease-in-out;
  cursor: pointer;
  border-radius: 20px;
}

.dailyRe:hover img {
  transition: all 0.5s ease;
  transform: scale(1.2, 1.2);
}

.songListRe {
  width: 150px;
  margin: 20px;
}

.songList_container {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 12px;
}

.songListRe img {
  height: 150px;
  width: 150px;
  background-color: #C0C4CC;
  transition: 0.5s all ease-in-out;
  cursor: pointer;
  border-radius: 12px;
}


.songListRe:hover img {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}

.name_action {
  font-family: STXihei, serif;
  font-weight: 900;
  font-size: 15px;
}

.create_name {
  font-family: STXihei, serif;
  font-weight: 900;
  font-size: 12px;
  color: #777777;
}

</style>
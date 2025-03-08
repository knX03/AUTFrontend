<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import {aTenRandomAlbum} from "@/api/api.js";


let albumList = ref([
  {album_ID: '', album_Name: '', singer_ID: '', singer_name: '', album_Cover: ''},
])

const toAlbum = (album_ID) => {
  router.push({
    path: '/albumDetail',
    query: {album_ID}
  })
}
const toSinger = (singer_ID) => {
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}

onMounted(() => {
  selectAlbum()
})

/*展示随机九个专辑*/
function selectAlbum() {
  aTenRandomAlbum().then(resp => {
    if (resp.data.code === 200) {
      albumList.value = resp.data.data
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}
</script>

<template>
  <div class="container_mod">
    <span class="title">专辑推荐</span>
    <div class="albumList_mod">
      <div class="albumRe" v-for="item in albumList">
        <div class="albumRe_con" @click="toAlbum(item.album_ID)">
          <img class="albumCover" :src=item.album_Cover alt="">
        </div>
        <div class="albumName" @click="toAlbum(item.album_ID)">{{ item.album_Name }}</div>
        <div class="singer" @click="toSinger(item.singer_ID)">by: {{ item.singer_name }}</div>
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

.albumList_mod {
  width: 80%;
  height: 80%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.albumRe {
  width: 150px;
  max-width: 200px;
  max-height: 200px;
  /*超出部分隐藏*/
  overflow: hidden;
  margin: 20px;
}
.albumRe_con{
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 12px;
}

.albumCover {
  height: 150px;
  width: 150px;
  background-color: #C0C4CC;
  transition: 0.5s all ease-in-out;
  cursor: pointer;
  border-radius: 12px;
}

.albumRe:hover .albumCover {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}


.albumName {
  font-family: STXihei, serif;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
}

.singer {
  font-family: STXihei, serif;
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  color: #777777;
}

.albumRe:hover .album_text {
  backdrop-filter: blur(8px);
  bottom: 100px;
  transition: 0.1s all ease-in-out;
}

</style>
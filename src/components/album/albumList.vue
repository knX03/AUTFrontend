<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import {aSelectAllAlbum} from "@/api/api.js";

let albumList = ref([
  {
    singer_name: '',
    singer_ID: '',
    album_ID: '',
    album_Name: '',
    album_Cover: '',
  },
])

onMounted(() => {
  selectAllAlbum()
})

/*查询所有*/
function selectAllAlbum() {
  aSelectAllAlbum().then(resp => {
    if (resp.data.code === 200) {
      albumList.value = resp.data.data
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*专辑详情跳转*/
function toAlbum(row) {
  router.push({
    path: '/albumDetail',
    query: {album_ID: row}
  })
}

/*歌手详情跳转*/
const toSinger = (singer_ID) => {
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}
</script>

<template>
  <div class="album_mod">
    <div class="albumList_container">
      <div class="albumList_mod" v-for="item in albumList">
        <div class="img_container" @click="toAlbum(item.album_ID)">
          <img :src="item.album_Cover">
        </div>
        <div class="album_Name_mod" @click="toAlbum(item.album_ID)">{{ item.album_Name }}</div>
        <div class="singerName_mod" @click="toSinger(item.singer_ID)">by: {{ item.singer_name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
列表部分
 */
.album_mod {
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 600px;
  margin-bottom: 15px;
}

.albumList_container {
  margin-top: 15px;
  max-width: 1400px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}


.albumList_mod {
  border-radius: 12px;
  margin-top: 20px;
  margin-left: 40px;
}

.img_container {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 12px;
}

.img_container img {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.5s all ease-in-out;
}

.img_container:hover img {
  transition: 0.5s all ease-in-out;
  transform: scale(1.1, 1.1);
}


.album_Name_mod {
  font-family: STXihei, serif;
  font-size: 15px;
  margin-top: 10px;
  cursor: pointer;
  color: #000000;
}

.singerName_mod {
  font-family: STXihei, serif;
  font-size: 12px;
  cursor: pointer;
  color: #777777;
}
</style>
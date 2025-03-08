<script setup>
import {onActivated, onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import useUserStore from '@/store/userStore.js'
import {aSelectLikePlaylist} from "@/api/api.js";

const userStore = useUserStore()
const user_ID = ''
let likeList = ref([{
  create_By: '',
  playlist_ID: '',
  playlist_Name: '',
  playlist_Cover: '',
}])

let LSwitch = ref(true)

const toPlaylist = (playlist_ID) => {
  if (playlist_ID === 10000) {
    router.push({
      path: '/dailyRecomm',
      query: {playlist_ID}
    })
  } else {
    router.push({
      path: '/playlistDetails',
      query: {playlist_ID}
    })
  }
}

onMounted(() => {
  selectLikeDetail(user_ID)
})


/*用户收藏的歌单详情*/
function selectLikeDetail(user_ID) {
  aSelectLikePlaylist(user_ID).then(resp => {
    if (resp.data.code === 200) {
      likeList.value = resp.data.data
      console.log(likeList.value)
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}
</script>

<template>
  <!--收藏的歌单-->
  <div class="likeInfo_mod">
    <label class="titleLike_mod">我收藏的歌单</label>
    <div class="likeListInfo_mod">
      <div v-for="list in likeList">
        <div class="songPlaylistsCover_mod" @click="toPlaylist(list.playlist_ID)">
          <img :src="list.playlist_Cover"/>
        </div>
        <div class="songPlaylistsName_mod">
          {{ list.playlist_Name }}
          <div class="createBy_mod">by: {{ list.create_By }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

/*收藏的歌单列表*/
.likeInfo_mod {
  width: auto;
  height: auto;
  padding-bottom: 20px;
  padding-top: 20px;
  padding-left: 70px;
}

/*标题*/
.titleLike_mod {
  font-family: STXihei, serif;
  font-size: 20px;
  font-weight: 900;
  color: #000000;
  margin-bottom: 10px;
}

/*歌单收藏列表*/
.likeListInfo_mod {
  width: 100%;
  /* height: 100%;*/
  padding-top: 5px;
  padding-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.likeListInfo_mod a {
  text-decoration: none;
  border-radius: 20px;
}

.likeListInfo_mod a:hover {
  /*background-color: #e8e5e5;*/
}

/*歌单封面*/
.songPlaylistsCover_mod {
  height: 150px;
  width: 150px;
  max-width: 200px;
  max-height: 200px;
  /*超出部分隐藏*/
  overflow: hidden;
  border-radius: 20px;
  margin: 20px 20px 10px;
  cursor: pointer;

}

.songPlaylistsCover_mod img {
  height: 150px;
  width: 150px;
  border-radius: 20px;
  background-color: #7d8561;
  transition: 0.5s all ease-in-out;

}

.songPlaylistsCover_mod:hover img {
  transition: all 0.6s ease;
  transform: scale(1.2, 1.2);
}


.songPlaylistsName_mod {
  font-family: STXihei, serif;
  font-size: 15px;
  font-weight: 900;
  color: #000000;
  margin-left: 25px;
  cursor: pointer;
}

.createBy_mod {
  font-size: 12px;
  color: #777777;
  cursor: default;
}
</style>
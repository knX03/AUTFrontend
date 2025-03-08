<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import {aSelectLikePlaylist} from "@/api/api.js";
import {useRoute} from "vue-router";

const route = useRoute()
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
  const userID = route.query.user_ID
  selectLikeDetail(userID)
})

/*用户收藏的歌单详情*/
function selectLikeDetail(userID) {
  aSelectLikePlaylist(userID).then(resp => {
    if (resp.data.code === 200) {
      likeList.value = resp.data.data
      if (likeList.value.length === 0) {
        LSwitch.value = false
      }
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}
</script>

<template>
  <!--收藏的歌单-->
  <div class="likeInfo_mod">
    <span class="titleLike_mod">TA收藏的歌单</span>
    <div v-if="LSwitch" class="likeListInfo_mod">
      <div v-for="list in likeList">
        <router-link to="#" @click="toPlaylist(list.playlist_ID)">
          <div class="songPlaylistsCover_mod">
            <img :src="list.playlist_Cover"/>
          </div>
          <div class="songPlaylistsName_mod">{{ list.playlist_Name }}
            <div class="createBy_mod">by: {{ list.create_By }}</div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="!LSwitch" class="likeList_null_logo">
      <img src="/src/photos/logo/没有更多笔记.png">
      <div class="likeList_null_tip">用户暂未收藏歌单</div>
    </div>
  </div>
</template>
<style scoped>

/*收藏的歌单列表*/
.likeInfo_mod {
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
  margin-left: 20px;
}

/*歌单收藏列表*/
.likeListInfo_mod {
  max-height: 405px;
  overflow: auto;
  width: 100%;
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
  max-width: 150px;
  max-height: 150px;
  /*超出部分隐藏*/
  overflow: hidden;
  border-radius: 12px;
  margin: 20px 20px 10px;

}

.songPlaylistsCover_mod img {
  height: 150px;
  width: 150px;
  border-radius: 12px;
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
  font-weight: 600;
  color: #000000;
  margin-left: 25px;
}

.createBy_mod {
  font-size: 12px;
  color: #777777;
}

.likeList_null_logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.likeList_null_tip {
  font-family: STXihei, serif;
  font-size: 15px;
  font-weight: 600;
}
</style>
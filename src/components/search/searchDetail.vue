<script setup>
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import useSearchStore from "@/store/searchStore.js";
import Backtop from "@/components/utils/backtop.vue";
import {aDeleteLikeSong, aLikeSong, aSearchALL, aSelectLikeSong} from "@/api/api.js";
import {ElMessage, ElNotification} from "element-plus";
import useMusicPlayStore from "@/store/musicPlayStore.js";
import songSearchD from "@/components/search/searchSong.vue"
import searchSingerD from "@/components/search/searchSinger.vue"
import searchAlbumD from "@/components/search/searchAlbum.vue"
import searchSPD from "@/components/search/searchSP.vue"
import searchUserD from "@/components/search/searchUser.vue"
import bus from "@/eventbus.js";
import router from "@/router/index.js";

const musicPlayStore = useMusicPlayStore();
const route = useRoute()
const searchStore = useSearchStore();

watch(() => searchStore.searchValue, (newValue, OldValue) => {
  searchValueDetail(newValue)
}, {deep: true});
let sV = ref('')
const type = ref([
  {index: 'all', name: '综合'},
  {index: 'song', name: '单曲'},
  {index: 'singer', name: '歌手'},
  {index: 'album', name: '专辑'},
  {index: 'sp', name: '歌单'},
  {index: 'user', name: '用户'}])
let contentType = ref('all')
sV.value = route.query.data
let songSearch = ref([])
let singerSearch = ref([])
let albumSearch = ref([])
let spSearch = ref([])
let userSearch = ref([])


onMounted(() => {
  searchValueDetail(route.query.data)
})

function searchValueDetail(searchValue) {
  sV.value = searchValue
  aSearchALL(sV.value).then(resp => {
    if (resp.data.code === 200) {
      songSearch.value = resp.data.data[0]
      singerSearch.value = resp.data.data[1]
      albumSearch.value = resp.data.data[2]
      spSearch.value = resp.data.data[3]
      userSearch.value = resp.data.data[4]
      bus.emit("songSearch", songSearch.value)
      bus.emit("singerSearch", singerSearch.value)
      bus.emit("albumSearch", albumSearch.value)
      bus.emit("spSearch", spSearch.value)
      bus.emit("userSearch", userSearch.value)
    }
  })
}

function handleSelect(index) {
  contentType.value = index
  setTimeout(() => {
    const anchor = document.getElementById(index);
    if (anchor) {
      anchor.scrollIntoView({behavior: 'smooth'});
    }
  }, 100)
}

//播放音乐
function playMusic(index) {
  musicPlayStore.play = false
  musicPlayStore.play = true
  musicPlayStore.index = -2
  musicPlayStore.index = index
  musicPlayStore.songList = songSearch.value
}

const toSinger = (singer_ID) => {
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}
</script>

<template>
  <div class="search_mod_container">
    <div class="box_mod">
      <div class="search_mod_title">
        <div>
        <span class="search_mod_title_text">
          <span class="search_mod_title_v">{{ sV }}</span> 的相关搜索如下</span>
        </div>
        <div class="search_mod_title_select">
          <el-menu
              :default-active="contentType"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
          >
            <el-menu-item v-for="item in type" :index="item.index">{{ item.name }}
              <span v-if="item.index === contentType" class="line_ac"></span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="search_mod_all_content">
        <div class="search_list_mod_content"
             @click="toSinger(item.singer_ID)"
             v-for="item in singerSearch">
          <div style="display:flex;">
            <img :src="item.singer_Avatar">
            <div class="search_list_mod_info">
              <div><span> 歌手：{{ item.singer_Name }}</span></div>
            </div>
          </div>
        </div>
        <div class="search_list_mod_content" v-for="item in spSearch">
          <div style="display:flex;">
            <img :src="item.playlist_Cover">
            <div class="search_list_mod_info">
              <div><span> 歌单：{{ item.playlist_Name }}</span></div>
              <div class="search_list_mod_info_se">
              <span style="max-width: 150px;
                           white-space: nowrap;
                           text-overflow: ellipsis;
                           overflow: hidden;">
                {{ item.playlist_Introduction }}</span>
                <span> {{ item.create_Time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box_mod" id="song">
      <span class="search_list_mod_title">歌曲 ></span>
      <div>
        <KeepAlive>
          <component :is="songSearchD"></component>
        </KeepAlive>
      </div>
    </div>
    <div class="box_mod" id="singer">
      <span class="search_list_mod_title">歌手 ></span>
      <div>
        <KeepAlive>
          <component :is="searchSingerD"></component>
        </KeepAlive>
      </div>
    </div>
    <div class="box_mod" id="album">
      <span class="search_list_mod_title">专辑 ></span>
      <div>
        <KeepAlive>
          <component :is="searchAlbumD"></component>
        </KeepAlive>
      </div>
    </div>
    <div class="box_mod" id="sp">
      <span class="search_list_mod_title">歌单 ></span>
      <div>
        <KeepAlive>
          <component :is="searchSPD"></component>
        </KeepAlive>
      </div>
    </div>
    <div class="box_mod" id="user">
      <span class="search_list_mod_title">用户 ></span>
      <div>
        <KeepAlive>
          <component :is="searchUserD"></component>
        </KeepAlive>
      </div>
    </div>

  </div>
</template>

<style scoped>
.search_mod_container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f6fa;
}

.search_mod_container:deep(.el-scrollbar) {
  width: 80%;
}

.box_mod {
  width: 80%;
  height: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 0 6px 1px #ececec;
  background-color: #ffffff;
}

.search_mod_title {
  display: flex;
  flex-direction: column;
}

.search_mod_title_v {
  color: #000000;
  font-size: 25px;
  font-family: STXihei, serif;
  margin-right: 10px;
}

.search_mod_title_text {
  display: flex;
  align-items: center;
  color: #343434;
  font-size: 15px;
  font-family: STXihei, serif;
}

.search_mod_title_select {

}

/*菜单样式覆写*/
.search_mod_title_select:deep(.el-menu--horizontal.el-menu) {
  border: 0;
}

.search_mod_title_select :deep(.el-menu--horizontal>.el-menu-item) {
  height: 40px;
  padding-left: 0;
  padding-right: 30px;
  font-family: STXihei, serif;
  font-weight: bolder;
  font-size: 15px;
  color: #000000;
  display: block;
  transition: 0.5s all ease-in-out;
}

.search_mod_title_select :deep(.el-menu--horizontal .el-menu-item:not(.is-disabled):hover) {
  color: #e58c43;
  background-color: transparent;
}

.search_mod_title_select :deep(.el-menu--horizontal .el-menu-item:not(.is-disabled):focus) {
  color: #e58c43;
  background-color: transparent;
}

.search_mod_title_select :deep(.el-menu--horizontal>.el-menu-item.is-active) {
  border-bottom: 0 transparent;
  color: #e58c43 !important;
}

.line_ac {
  display: block;
  width: 25px;
  height: 5px;
  background-color: #e58c43;
  border-radius: 12px;
  position: relative;
  left: 2px;
  bottom: 10px;
}

.search_mod_all_content {
  width: 100%;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.search_list_mod_content {
  width: 45%;
  height: 80px;
  border-radius: 12px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
}

.search_list_mod_content:hover {
  background-color: #f5f6fa;
}

.search_list_mod_content img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  margin-right: 20px;
}

.search_list_mod_info {
  display: flex;
  max-width: 80%;
  flex-direction: column;
}

.search_list_mod_info span {
  font-family: STXihei, serif;
}

.search_list_mod_info_se {
  display: flex;
  justify-content: space-between;
}

.search_list_mod_info_se span {
  color: #676767;
  font-size: 13px;
  margin-right: 20px;
}

.search_list_mod_title {
  font-weight: bolder;
  font-family: STXihei, serif;
  font-size: 17px;
}

</style>
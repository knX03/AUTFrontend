<script setup>
import {
  aCollectSongToPlaylist,
  aDeleteLikeSong,
  aIfExistSong,
  aLikeSong,
  aSelectCreateDetail,
  aSelectLikeSong
} from "@/api/api.js";
import {ElMessage, ElNotification} from "element-plus";
import {defineProps, onMounted, ref} from "vue";
import bus from "@/eventbus.js";
import useMusicPlayStore from "@/store/musicPlayStore.js";

const musicPlayStore = useMusicPlayStore();
let songSearch = ref([])
bus.on("songSearch", data => {
  songSearch.value = data
})
let myLikeSong = ref([])
let dialogVisible = ref(false)
let CLSong = ref({playlist_ID: '', song_ID: '',})
const user_ID = '';
let creatList = ref([{
  playlist_ID: '',
  playlist_Name: '',
  playlist_Cover: '',
}])
onMounted(() => {
  selectLikeSong()
  selectCreateDetail()
})

/*查询喜欢的歌曲*/
function selectLikeSong() {
  aSelectLikeSong().then(resp => {
    if (resp.data.code === 200) {
      myLikeSong.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  }).catch(resp => {
    console.error(resp)
  })
}

//播放音乐
function playMusic(index) {
  musicPlayStore.play = false
  musicPlayStore.play = true
  musicPlayStore.index = -2
  musicPlayStore.index = index
  musicPlayStore.songList = songSearch.value
}

function likeSong(row) {
  aLikeSong(row).then(resp => {
    if (resp.data.code === 200) {
      myLikeSong.value = resp.data.data
      selectLikeSong()
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

function dislikeSong(row) {
  aDeleteLikeSong(row).then(resp => {
    if (resp.data.code === 200) {
      selectLikeSong()
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

/*查询用户所创建的歌单*/
function selectCreateDetail() {
  aSelectCreateDetail(user_ID).then(resp => {
    if (resp.data.code === 200) {
      creatList.value = resp.data.data
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

//收藏歌曲开关
function beforeCL(row) {
  dialogVisible.value = true;
  CLSong.value.song_ID = row;
}

/*检查歌曲是否已收藏*/
function ifExistSong() {
  if (CLSong.value.playlist_ID === "") {
    ElMessage.error("请选择收藏的歌单！")
    return;
  }
  aIfExistSong(CLSong.value.playlist_ID, CLSong.value.song_ID).then(resp => {
    if (resp.data.code === 302) {
      ElMessage.error(resp.data.msg)
      CLSong.value.playlist_ID = '';
      dialogVisible.value = false;
    } else if (resp.data.code === 200) {
      collectSongToPlaylist()
    }
  })
}

function selectSP(playlist_ID) {
  CLSong.value.playlist_ID = playlist_ID;
}

/*收藏歌曲至指定歌单*/
function collectSongToPlaylist() {
  aCollectSongToPlaylist(CLSong.value.playlist_ID, CLSong.value.song_ID).then(resp => {
    if (resp.data.code === 200) {
      dialogVisible.value = false;
      CLSong.value.playlist_ID = '';
      ElMessage.success('收藏成功！')
    }
  })
}
</script>

<template>
  <div class="search_list_mod">
    <div class="search_list_song_mod_content"
         v-if="songSearch.length>0"
         v-for="(item,index) in songSearch">
      <div style="display:flex;">
        <img class="play_bt" src="/src/photos/logo/playGray.png" alt="" @click="playMusic(index)">
        <img :src="item.song_Cover" class="search_list_mod_songCover" alt="">
        <div class="search_list_mod_info">
          <div><span>{{ item.song_Name }}</span></div>
        </div>
      </div>
      <div class="option_mod">
        <img src="/src/photos/logo/like.png" @click="likeSong(item.song_ID)"
             v-if="myLikeSong.indexOf(item.song_ID)===-1">
        <img src="/src/photos/logo/喜欢.png" @click="dislikeSong(item.song_ID)"
             v-if="myLikeSong.indexOf(item.song_ID)!==-1">
        <el-icon class="folderAdd" size="20px" @click="beforeCL(item.song_ID)">
          <FolderAdd/>
        </el-icon>
      </div>
    </div>
    <div class="search_list_mod_null_content" v-else>
      <img src="/src/photos/logo/暂无搜索内容.png">
      <span>暂无搜索内容</span>
    </div>
  </div>

  <!--收藏歌曲至歌单-->
  <div class="collectToPL">
    <el-dialog
        title="收藏"
        v-model="dialogVisible"
        width="50%"
    >
      <el-form :model="CLSong" label-width="120px">
        <el-form-item label="选择歌单：">
          <div class="sp_list"
               :class="{activeS:item.playlist_ID === CLSong.playlist_ID}"
               v-for="(item , index) in creatList"
               @click="selectSP(item.playlist_ID)">
            <img :src=item.playlist_Cover>
            <span class="sp_list_text"
                  :class="{activeS:item.playlist_ID === CLSong.playlist_ID}"> {{ item.playlist_Name }}</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="ifExistSong()">收藏</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
.search_list_mod {
  width: 100%;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.search_list_song_mod_content {
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

.search_list_song_mod_content:hover {
  background-color: #f5f6fa;
}

.search_list_song_mod_content img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  margin-right: 20px;
}

.search_list_mod_songCover {
  border-radius: 12px !important;
}

/*喜欢按钮*/
.option_mod {
  display: flex;
  align-items: center;
  justify-content: left;
  opacity: 0;
  transition: all 0.5s ease-in-out;
}

.option_mod img {
  height: 20px;
  width: 20px;
  cursor: pointer;
  transition: 0.5s all ease-in-out;
}

.option_mod img:hover {
  transition: 0.2s all ease-in-out;
  transform: scale(1.1, 1.1);
}

.folderAdd {
  transition: 0.5s all ease-in-out;
}

.folderAdd:hover {
  transition: 0.2s all ease-in-out;
  transform: scale(1.1, 1.1);
}

.play_bt {
  position: absolute;
  background: rgba(255, 255, 255, 0.89);
  height: 30px !important;
  width: 30px !important;
  transform: translate(15px, 15px) scale(0, 0);
  opacity: 0;
  transition: 0.5s all ease-in-out;
}

.search_list_song_mod_content:hover .play_bt {
  transform: translate(15px, 15px) scale(1, 1);
  opacity: 1;
}

.search_list_song_mod_content:hover .option_mod {
  transform: scale(1, 1);
  opacity: 1;
}

/*收藏音乐模块*/
.collectToPL {

}

/*按钮样式*/
.collectToPL .el-button--primary {
  margin-left: 30px;
  background-color: #e58c43;
  border-color: #e58c43;
}

.collectToPL .el-button--primary:hover {
  background-color: #fff4ea;
  border-color: #fff4ea;
  color: #e58c43;
}

.collectToPL .el-button:hover {
  background-color: #fff4ea;
  border-color: #fff4ea;
  color: #e58c43;
}

.sp_list {
  width: 150px;
  border-radius: 12px;
  margin-right: 25px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.sp_list:hover {
  background-color: #efefefdb;
}

.sp_list.activeS {
  background-color: #efefefdb;
}


.sp_list img {
  width: 120px;
  height: 120px;
  border-radius: 12px;
}

.sp_list_text {
  color: #1e1e1e;
  font-size: 16px;
  font-weight: bolder;
  font-family: STXihei, serif;
}

.sp_list_text.activeS {
  color: #e58c43;
}

.collectToPL:deep(.el-dialog) {
  border-radius: 12px;
}

.search_list_mod_null_content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: STXihei, serif;
}

.search_list_mod_null_content img {
  width: 300px;
  height: 300px;
}
</style>
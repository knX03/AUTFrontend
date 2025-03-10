<script setup>

import {onMounted, ref, watch} from "vue";
import {ElMessage, ElNotification} from "element-plus";
import {aAlbumBySinger, aWorkBySinger} from "@/api/api.js";

let songList = ref([{
  song_ID: "",
  song_Cover: "",
  song_Name: "",
  album_Name: "",
  examine: ""
}])
let albumList = ref([
  {
    album_ID: '',
    album_Name: '',
    album_Cover: '',
    create_Time: '',
    album_Introduction: '',
  },
])
let page = ref(1)
const workMan_List = ref()
const ALMan_List = ref()


onMounted(() => {
  selectSongBySinger()
  selectAlbumSinger()
})

/*根据跳转的歌手名字查询歌曲*/
function selectSongBySinger() {
  aWorkBySinger().then(resp => {
    if (resp.data.code === 200) {
      songList.value = resp.data.data;
      for (let i = 0; i < songList.value.length; i++) {
        if (songList.value[i].examine === "1") {
          songList.value[i].examine = "在线"
        } else if (songList.value[i].examine === "0") {
          songList.value[i].examine = "待审核"
        } else {
          songList.value[i].examine = "下架"
        }
      }
    } else if (resp.data.code === 500) {
      ElMessage.error("error")
      console.log(resp.data.msg)
    }
  })
}

function selectAlbumSinger() {
  aAlbumBySinger().then(resp => {
    if (resp.data.code === 200) {
      albumList.value = resp.data.data
      console.log(albumList.value)
    } else if (resp.data.code === 500) {
      ElMessage.error("error")
      console.log(resp.data.msg)
    }
  })
}

function downLine(song_ID, index) {
  if (songList.value[index].examine === "待审核") {
    ElNotification({
      title: '歌曲待管理员审核',
      type: 'error',
      position: 'top-right',
    })
    return
  }
  songList.value[index].examine = "下线"
}

function releaseSong(song_ID, index) {
  if (songList.value[index].examine === "待审核") {
    ElNotification({
      title: '歌曲待管理员审核',
      type: 'error',
      position: 'top-right',
    })
    return
  }
  songList.value[index].examine = "在线"
}
</script>

<template>
  <div class="box_mod">
    <el-tooltip
        class="box-item"
        effect="dark"
        content="选择歌曲或专辑"
        placement="top-start"
    >
      <div class="ManTitle_mod">
        <el-dropdown
            trigger="click">
          <div class="option_dm">
            <span v-if="page===1">歌曲</span>
            <span v-else>专辑</span>
            <div class="division_dm"></div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :class="{wActive: page===1}" @click="page=1">歌曲</el-dropdown-item>
              <el-dropdown-item :class="{wActive: page===2}" @click="page=2">专辑</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-tooltip>
    <transition name="fade" mode="out-in">
      <div class="workMan_List_mod" ref="workMan_List" v-if="page===1">
        <div class="workMan_List title">
          <div class="wlt_item">#</div>
          <div class="wlt_item" style="width: 32%">曲名</div>
          <div class="wlt_item" style="width: 32%">专辑</div>
          <div class="wlt_item" style="width: 10%">状态</div>
          <div class="wlt_item" style="width: 10%;border: 0">选择</div>
        </div>
        <div class="workMan_List" v-for="(item,index) in songList">
          <div class="wlt_item list">{{ index + 1 }}</div>
          <div class="wlt_item list name" style="width: 32%">
            <img :src=item.song_Cover>
            <div>{{ item.song_Name }}</div>
          </div>
          <div class="wlt_item list" style="width: 32%">{{ item.album_Name }}</div>
          <div class="wlt_item list" style="width: 10%">{{ item.examine }}</div>
          <div class="wlt_item list" style="width: 10%">
            <div class="wlt_item_option">
              <el-button type="warning" plain @click="downLine(item.song_ID,index)">下线</el-button>
              <el-button type="info" plain @click="releaseSong(item.song_ID,index)">发布</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="ALMan_List_mod" ref="ALMan_List" v-else>
        专辑
        <div class="ALMan_List">
          <div class="workMan_List title">
            <div class="wlt_item">#</div>
            <div class="wlt_item" style="width: 38%">专辑</div>
            <div class="wlt_item" style="width: 36%">简介</div>
            <div class="wlt_item" style="width: 14%;border: 0">发布时间</div>
          </div>
          <div class="workMan_List" v-for="(item,index) in albumList">
            <div class="wlt_item list">{{ index + 1 }}</div>
            <div class="wlt_item list name" style="width: 38%">
              <img :src=item.album_Cover>
              <div>{{ item.album_Name }}</div>
            </div>
            <div class="wlt_item list" style="width: 36%">{{ item.album_Introduction }}</div>
            <div class="wlt_item list" style="width: 14%">{{ item.create_Time }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/*盒子模块*/
.box_mod {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 0 6px 1px #ececec;
  margin-bottom: 20px;
  padding: 20px 30px;
}

.ManTitle_mod {
  width: 10%;
}

.option_dm {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 45px;
  cursor: pointer;
  font-family: STXihei, serif;
  font-weight: bolder;
  font-size: 20px;
  color: black;
}

.division_dm {
  width: 44px;
  height: 3px;
  border-radius: 30px;
  background-color: #4d4d4d;
}

/*修改下来菜单的样式*/
:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: #fff4ec;
  color: #e58c43;
}

:deep(.el-dropdown-menu) {
  width: 80px;
}

:deep(.el-dropdown-menu__item) {
  width: 80px;
  height: 30px;
  font-family: STXihei, serif;
  font-weight: bolder;
  font-size: 15px;
}

:deep(.el-dropdown-menu__item.wActive) {
  color: #e58c43;
}

:deep( .el-popper) {
  position: absolute !important;
  left: 704px !important;
}

.workMan_List_mod {
  margin-top: 10px;
  max-width: 100%;
}

.workMan_List {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #c5c5c5;
}

.wlt_item {
  width: 2rem;
  min-height: 3rem;
  display: flex;
  align-items: center;
  font-family: STXihei, serif;
  font-weight: bold;
  font-size: 16px;
  border-right: 1px solid #808080;
  padding-left: 10px;
}

.wlt_item.list {
  border: 0;
  min-height: 4rem;
}

.wlt_item.list.name {
  display: flex;
  align-items: center;
}

.wlt_item.list.name img {
  border-radius: 50px;
  width: 50px;
  height: 50px;
  margin-right: 20px;
}

.wlt_item_option {
  display: flex;
}

.ALMan_List_mod {
  margin-top: 10px;
  max-width: 100%;
}

/* 切换动画 */
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s;
}

/*新页面的进入时*/
.fade-enter-from {
  opacity: 0.5;
  transform: rotateX(-45deg);
}

/*新页面的进入成功时*/
.fade-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

/*原页面的离开时*/
.fade-leave-to {
  opacity: 0;
  transform: rotateX(45deg);
}
</style>
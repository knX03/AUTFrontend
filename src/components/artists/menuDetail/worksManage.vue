<script setup>

import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {aWorkBySinger} from "@/api/api.js";

let songList = ref([{
  song_Cover: "",
  song_Name: "",
  album_Name: "",
  examine: ""
}])
onMounted(() => {
  selectSongBySinger()
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

</script>

<template>
  <div class="box_mod">
    <div class="ManTitle_mod">歌曲</div>
    <div class="workMan_List_mod">
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
          <div>

          </div>
        </div>
      </div>
    </div>
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
  font-family: STXihei, serif;
  font-weight: bolder;
  font-size: 20px;
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
</style>
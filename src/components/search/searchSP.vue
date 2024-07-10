<script setup>
import {onMounted, ref} from "vue";
import bus from "@/eventbus.js";
import router from "@/router/index.js";

let spSearch = ref([])
let exSP = ref(true)
bus.on("spSearch", data => {
  spSearch.value = data
})
onMounted(() => {
  ifExSP()
})

function ifExSP() {
  if (spSearch.value.length === 0) {
    exSP.value = false
  }
}

const toSP = (playlist_ID) => {
  router.push({
    path: '/playlistDetails',
    query: {playlist_ID}
  })
}
</script>

<template>
  <div class="search_list_mod">
    <div class="search_list_sp_mod_content"
         @click="toSP(item.playlist_ID)"
         v-if="spSearch.length>0"
         v-for="(item,index) in spSearch">
      <img :src="item.playlist_Cover">
      <span>{{ item.playlist_Name }}</span>
      <span class="se_text">{{ item.playlist_Introduction }}</span>
    </div>
    <div class="search_list_mod_null_content" v-else>
      <img src="/src/photos/logo/暂无搜索内容.png">
      <span>暂无搜索内容</span>
    </div>
  </div>
</template>

<style scoped>
.search_list_mod {
  width: 100%;
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
}


.search_list_sp_mod_content {
  width: 200px;
  max-height: 260px;
  padding: 5px 5px 5px 15px;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.search_list_sp_mod_content:hover {
  background-color: #f5f6fa;
  color: #e58c43;
}

.search_list_sp_mod_content img {
  height: 170px;
  width: 170px;
  border-radius: 12px;
}

.search_list_sp_mod_content span {
  font-family: STXihei, serif;
  font-size: 16px;
  font-weight: bolder;
  margin-top: 5px;
}

.se_text {
  font-size: 12px !important;
  color: #8b8b8be8 !important;
  white-space: nowrap; /*强制单行显示*/
  text-overflow: ellipsis; /*超出部分省略号表示*/
  overflow: hidden; /*超出部分隐藏*/
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
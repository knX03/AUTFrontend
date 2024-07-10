<script setup>
import bus from "@/eventbus.js";
import {ref} from "vue";
import router from "@/router/index.js";

let singerSearch = ref([])
bus.on("singerSearch", data => {
  singerSearch.value = data
})

const toSinger = (singer_ID) => {
  router.push({
    path: '/singerDetail',
    query: {singer_ID}
  })
}
</script>

<template>
  <div class="search_list_mod">
    <div class="search_list_singer_mod_content"
         @click="toSinger(item.singer_ID)"
         v-if="singerSearch.length>0"
         v-for="(item,index) in singerSearch">
      <img :src="item.singer_Avatar">
      <span>{{ item.singer_Name }}</span>
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

.search_list_singer_mod_content {
  width: 180px;
  max-height: 210px;
  padding: 5px 5px;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.search_list_singer_mod_content:hover {
  background-color: #f5f6fa;
  color: #e58c43;
}

.search_list_singer_mod_content img {
  height: 140px;
  width: 140px;
  border-radius: 50%;
}

.search_list_singer_mod_content span {
  font-family: STXihei, serif;
  font-size: 16px;
  margin-top: 10px;
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
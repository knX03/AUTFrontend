<script setup>
import {onMounted, ref} from "vue";
import bus from "@/eventbus.js";
import router from "@/router/index.js";

let userSearch = ref([])
bus.on("userSearch", data => {
  userSearch.value = data
})

const toUser = (user_ID) => {
  router.push({
    path: '/userDetail',
    query: {user_ID}
  })
}
</script>

<template>
  <div class="search_list_mod">
    <div class="search_list_user_mod_content"
         v-if="userSearch.length>0"
         @click="toUser(item.user_ID)"
         v-for="(item,index) in userSearch">
      <img :src="item.user_Avatar">
      <span>{{ item.user_Name }}</span>
      <span class="se_userIntro" v-if="item.user_Introduction">{{ item.user_Introduction }}</span>
      <span class="se_userIntro" v-else>这个人什么也没有留下✏</span>
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

.search_list_user_mod_content {
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

.search_list_user_mod_content:hover {
  background-color: #f5f6fa;
  color: #e58c43;
}

.search_list_user_mod_content img {
  height: 140px;
  width: 140px;
  border-radius: 50%;
}

.search_list_user_mod_content span {
  font-family: STXihei, serif;
  font-size: 16px;
  margin-top: 10px;
}

.se_userIntro {
  width: 150px;
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
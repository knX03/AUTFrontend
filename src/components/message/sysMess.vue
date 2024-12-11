<script setup>

import {onMounted, reactive, ref} from "vue";
import {aGetSysMess} from "@/api/api.js";

let sysMessList1 = reactive([{
  mess_title: 'AUT音乐',
  mess_text: '按时间大手大脚拉萨看  \n 得见爱丽丝飞机拉萨附近assaldksa;l杜拉斯的就拉上asdasldjsa的拉萨大家埃里克森',
  mess_time: '2024-03-04 10:20:11',
},
  {
    mess_title: 'AUT音乐',
    mess_text: '按时间大手大脚拉萨看  \n 得见爱丽丝飞机拉萨附近assaldksa;l杜拉斯的就拉上asdasldjsa的拉萨大家埃里克森',
    mess_time: '2024-03-04 10:20:11',
  },
  {
    mess_title: 'AUT音乐',
    mess_text: '按时间大手大脚拉萨看  \n 得见爱丽丝飞机拉萨附近assaldksa;l杜拉斯的就拉上asdasldjsa的拉萨大家埃里克森',
    mess_time: '2024-03-04 10:20:11',
  },
  {
    mess_title: 'AUT音乐',
    mess_text: '按时间大手大脚拉萨看  \n 得见爱丽丝飞机拉萨附近assaldksa;l杜拉斯的就拉上asdasldjsa的拉萨大家埃里克森',
    mess_time: '2024-03-04 10:20:11',
  },
  {
    mess_title: 'AUT音乐',
    mess_text: '按时间大手大脚拉萨看  \n 得见爱丽丝飞机拉萨附近assaldksa;l杜拉斯的就拉上asdasldjsa的拉萨大家埃里克森',
    mess_time: '2024-03-04 10:20:11',
  },
  {
    mess_title: 'AUT音乐',
    mess_text: '按时间大手大脚拉萨看  \n 得见爱丽丝飞机拉萨附近assaldksa;l杜拉斯的就拉上asdasldjsa的拉萨大家埃里克森',
    mess_time: '2024-03-04 10:20:11',
  },
  {
    mess_title: 'AUT音乐',
    mess_text: '按时间大手大脚拉萨看  \n 得见爱丽丝飞机拉萨附近assaldksa;l杜拉斯的就拉上asdasldjsa的拉萨大家埃里克森',
    mess_time: '2024-03-04 10:20:11',
  },
  {
    mess_title: 'AUT音乐',
    mess_text: '按时间大手大脚拉萨看  \n 得见爱丽丝飞机拉萨附近assaldksa;l杜拉斯的就拉上asdasldjsa的拉萨大家埃里克森',
    mess_time: '2024-03-04 10:20:11',
  },
  {
    mess_title: 'AUT音乐',
    mess_text: '按时间大手大脚拉萨看  \n 得见爱丽丝飞机拉萨附近assaldksa;l杜拉斯的就拉上asdasldjsa的拉萨大家埃里克森',
    mess_time: '2024-03-04 10:20:11',
  },])
let sysMessList = ref([{
  mess_title: '',
  mess_text: '',
  mess_time: '',
}])
onMounted(() => {
  getSysMess()
})

/*获取系统消息*/
function getSysMess() {
  aGetSysMess().then(resp => {
    sysMessList.value = resp.data.data
    console.log(sysMessList)
  })
}
</script>

<template>
  <div class="message_mod_de_title">
    <span>系统消息</span>
  </div>
  <div class="sysMess_mod_card_container">
    <el-scrollbar>
      <div class="sysMess_mod_card" v-for="item in sysMessList">
        <div class="card_title">
          <span style="font-weight: bolder;margin-right: 15px">{{ item.mess_title }}</span>
          <span style="font-size: 14px;color: #a1a1a1">{{ item.mess_time }}</span>
        </div>
        <div class="card_content">
          <span>{{ item.mess_text }}</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.message_mod_de_title {
  width: auto;
  z-index: 11;
  height: 50px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 0 5px 2px #9f9f9f;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-family: STXihei, serif;
  font-size: 17px;
  color: #505050;
}

.sysMess_mod_card_container {
  padding-top: 10px;
  padding-bottom: 10px;
  height: 746px;
  border-radius: 12px;
}

.sysMess_mod_card {
  width: auto;
  min-height: 70px;
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 0 5px 2px #9f9f9f;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
}

.card_title {
  font-family: STXihei, serif;
  font-size: 17px;
  color: black;
  margin-bottom: 10px;
}

.card_content {
  font-family: STXihei, serif;
  font-size: 15px;
  color: #888888;
}
</style>
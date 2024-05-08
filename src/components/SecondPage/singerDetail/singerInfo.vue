<script setup>


import {onMounted, ref} from "vue";
import axios from "axios";
import bus from "@/eventbus.js";
import {useRoute} from "vue-router";


const route = useRoute()
let user = ref(
    {user_Name: '', user_ID: ''}
)
let singer = ref({
  singer_ID: '',
  singer_Name: '',
  singer_Avatar: '',
  singer_Age: '',
  singer_Introduction: '',
})


onMounted(() => {
  let FSinger_ID = route.query.singer_ID
  selectSingerDetail(FSinger_ID)
})


/*歌手详情查询*/
function selectSingerDetail(singer_ID) {
  axios({
    method: 'GET',
    url: 'http://localhost/singer/selectSingerDetail?singer_ID=' + singer_ID,
  }).then(resp => {
    if (resp.data.code === 200) {
      singer.value = resp.data.data;
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}
</script>

<template>
  <div class="first_mod">

    <img :src="singer.singer_Avatar" class="Avatar_mod">

    <div class="singerInfo_mod">
      <div class="basicInfo_mod">
        <label class="singerName_mod">{{ singer.singer_Name }}</label>
      </div>
      <div class="singerNameEN_mod">
        <span>{{ singer.singer_Name }}</span>
      </div>
      <!--todo 播放和下载功能待实现-->
      <div class="playAndLoad_mod">
        <el-button type="warning">
          <img src="/src/photos/logo/playWhite.png">
          <span>播放全部</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
歌手信息部分
 */
.first_mod {
  width: 1684px;
  height: 250px;
  background-color: #f7f9fc;
}

/*歌手海报*/
.Avatar_mod {
  width: 200px;
  height: 200px;
  border-radius: 30px;
  position: relative;
  top: 50%;
  left: 18%;
  transform: translate(-50%, -50%);
}

/*选项模块*/
.singerInfo_mod {
  height: 250px;
  position: absolute;
  top: 79px;
  left: 430px;
}

/*歌单基础信息*/
.basicInfo_mod {
  width: 185px;
  height: 40px;
  display: flex;
  position: relative;
  top: 30px;
  left: 10px;
  align-items: center;
}

.singerName_mod {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: #000000;
}

/*用户信息模块*/
.singerNameEN_mod {
  width: 160px;
  height: 30px;
  position: relative;
  top: 40px;
  display: flex;
  justify-content: left;
  align-items: center;
  left: 15px;
}


.singerNameEN_mod span {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #3f3f3f;
}


/*播放和下载按钮*/
.playAndLoad_mod {
  width: 233px;
  height: 50px;
  position: absolute;
  bottom: 24px;
  display: flex;
  align-items: center;

}

.playAndLoad_mod span {
  font-family: STXihei, serif;
  color: #000000;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.playAndLoad_mod img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.playAndLoad_mod .el-button {
  color: #FFF;
  border-radius: 12px;

}

.playAndLoad_mod .el-button span {
  display: flex;
  align-items: center;
  justify-content: center;
}

/*播放按钮*/
.playAndLoad_mod .el-button--warning {

}

</style>
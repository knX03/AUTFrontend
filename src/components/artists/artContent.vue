<script setup>
import {markRaw, onMounted, reactive, ref, watch} from "vue";
import homeMenu from "@/components/artists/menuDetail/homeMenu.vue";
import worksManage from "@/components/artists/menuDetail/worksManage.vue";
import dataMenu from "@/components/artists/menuDetail/dataMenu.vue";
import publishWorks from "@/components/artists/menuDetail/publishWorks.vue";
import {store} from "xijs";
import {aGetArtists} from "@/api/api.js";
import router from "@/router/index.js";
import useArtistStore from "@/store/artistStore.js";

const artistStore = useArtistStore();
let singer = ref({singer_ID: '', singer_Name: '', singer_Avatar: ''})
let comIndex = ref("1")
const menuRouteList = ref([
  {id: 4, name: '发布作品', component: markRaw(publishWorks)},
  {id: 1, name: '首页', component: markRaw(homeMenu)},
  {id: 2, name: '作品管理', component: markRaw(worksManage)},
  {id: 3, name: '数据中心', component: markRaw(dataMenu)},
])

// 默认显示的组件页面
const selectedComponent = ref(homeMenu);

onMounted(() => {
  let singerToken = store.get('access_singer_token').value
  if (singerToken !== null) {

  }
  singerInfo()
})

function selectChange(index) {
  artistStore.artistComIndex = index
  comIndex.value = index.toString()
  selectedComponent.value = menuRouteList.value[index].component
}

function publishing() {
  comIndex.value = "0"
  selectedComponent.value = menuRouteList.value[0].component
}

//歌手详情
function singerInfo() {
  aGetArtists().then(resp => {
    singer.value = resp.data.data
  })
}

//监听组件切换
watch(() => artistStore.artistComIndex, (newValue, OldValue) => {
  selectChange(newValue)
});
</script>

<template>
  <div class="artContent_mod">
    <div class="artMenu_mod" id="artmenu">
      <div class="artInfo">
        <img :src=singer.singer_Avatar>
        <span>{{ singer.singer_Name }}</span>
        <el-button type="warning" plain round @click="publishing">发布作品</el-button>
      </div>
      <el-menu
          :default-active=comIndex
          class="el-menu-vertical-demo"
          @select="selectChange"
      >
        <el-menu-item index="1">
          <el-icon>
            <Menu/>
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon>
            <StarFilled/>
          </el-icon>
          <span>作品管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon>
            <Platform/>
          </el-icon>
          <span>数据分析</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="menuDetail_mod">
      <transition name="artC" mode="out-in">
        <el-scrollbar>
          <KeepAlive>
            <component :is="selectedComponent" :singer="singer"></component>
          </KeepAlive>
        </el-scrollbar>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.artContent_mod {
  /*  height: 834px;*/
  height: 90vh;
  min-height: 390px;
  min-width: 850px;
  background-color: #f5f6fa;
  display: flex;
  padding-top: 20px;
  padding-left: 12%;
}

.artMenu_mod {
  background-color: #FFFFFF;
  height: 97%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 6px 1px #ececec;
}


.artInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  height: 180px;
  margin-bottom: 20px;
}

.artInfo img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.artInfo span {
  font-family: STXihei, serif;
  font-weight: bold;
}

#artmenu :deep(.el-menu) {
  border-right: 0px;
  transition: all 0.5s ease-in-out;
  width: 200px;
}

#artmenu :deep(.el-menu-item.is-active) {
  color: #e58c43;
  background-color: #f9f9f9;
  transition: all 0.5s ease-in-out;
}

#artmenu :deep(.el-menu-item:hover) {
  background-color: #f9f9f9;
  transition: all 0.5s ease-in-out;
}

.menuDetail_mod {
  margin-left: 20px;
  width: 70%;
  border-radius: 12px;
}


/* 切换动画 */
/* artC-transform */
.artC-leave-active,
.artC-enter-active {
  transition: all 1s;
}

/*新页面的进入时*/
.artC-enter-from {
  opacity: 0.5;
  transform: rotateX(-90deg);
}

/*新页面的进入成功时*/
.artC-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

/*原页面的离开时*/
.artC-leave-to {
  opacity: 0;
  transform: rotateX(90deg);
}
</style>
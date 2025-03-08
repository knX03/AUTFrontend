<script setup>
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {aSongDE} from "@/api/api.js";
import {useRoute} from "vue-router";
import useMusicPlayStore from "@/store/musicPlayStore.js";

const musicPlayStore = useMusicPlayStore();
const route = useRoute()
const record_needle = ref()
const cover = ref()//歌曲封面
const bg_info = ref()
const lyricUl = ref()
let currentTimeIndex = ref()
let wordFlag = ref(0);
let moveY = ref(0)
//歌曲信息
let song = ref({
  song_ID: '',
  song_Name: '',
  singer_ID: '',
  singer_name: '',
  album_ID: '',
  album_name: '',
  song_Cover: '/src/photos/logo/唱片.png',
  song_Directory: '',
  lyric: '',
})
let dataStr = ref()
let songWord = ref([])

onMounted(() => {
  const songID = route.query.song_ID
  initPlayerDE(songID)
})


/**
 * 初始化页面
 * await的含义为等待。意思就是代码需要等待await后面的函数运行完并且有了返回结果之后，才继续执行下面的代码。
 * @param songID 歌曲ID
 * @returns {Promise<void>}
 */
async function initPlayerDE(songID) {
  if (musicPlayStore.playing === true) {
    record_needle.value.style.transform = "rotate(32deg)"
    cover.value.style.animationPlayState = ''
  } else {
    record_needle.value.style.transform = "rotate(0deg)"
    cover.value.style.animationPlayState = 'paused'
  }
  await songDetail(songID)
  if (dataStr.value !== null) {
    await formatLyric();
    await findTime()
  }
}

async function songDetail(ID) {
  await aSongDE(ID).then(resp => {
    if (resp.data.code === 200) {
      song.value = resp.data.data
      bg_info.value.style.backgroundImage = "url(" + "/" + song.value.song_Cover + ")";
    }
  })
  dataStr.value = song.value.lyric
  if (dataStr.value == null) {
    wordWatch()                     //清除监听器
  } else {
    moveWord()
  }
}


/**
 * 将歌词字符串解析为歌词数组
 * @returns array 如： [{ time: "31.52", words: "你是 遥遥的路" }]
 */
const formatLyric = () => {
  // 定义一个暂存变量接收日期字符串
  let timeStr = "";
  let index = 0;
  // 把歌词数组用换行符\n分割成数组
  dataStr.value.split("\n").forEach((item) => {
    // 去除最后一行分割的空字符串
    if (item === "") return;
    // item 如 "[00:31.52]你是 遥遥的路"
    // parts 如 ["[00:31.52","你是 遥遥的路"]
    const parts = item.split("]");
    // timeStr 如 00:31.52
    timeStr = parts[0].slice(1);
    // 空歌词不要
    if (parts[1] !== " " && parts[1] !== "") {
      songWord.value.push({
        index: index,
        time: parseTime(timeStr),
        content: parts[1],
      });
      index++;
    }
  });
};
/**
 * 将时间字符串解析为秒
 * @param {*} timeStr 时间字符串
 * @returns 秒
 */
const parseTime = (timeStr) => {
  const parts = timeStr.split(".");
  const parts1 = parts[0].split(":");
  return +parts1[0] * 60 + +parts1[1];
};

/**
 * 寻找进入页面时最近的歌词时间
 */
function findTime() {
  let tempCT
  let index = musicPlayStore.currentTime.match(/(\d{2}):(\d{2})/);
  if (index) {
    const [, minutes, seconds] = index
    // 将时间戳转换为秒
    tempCT = parseInt(minutes) * 60 + parseInt(seconds)
  }
  let flag = true
  while (flag) {
    songWord.value.forEach((item) => {
      if (item.time === tempCT) {
        wordFlag.value = item.index
        flag = false;
      }
    })
    tempCT--;
  }
  moveWord();
}

// 歌词滚动
function moveWord() {
  let moveTop = (wordFlag.value - 7) * 35;
  lyricUl.value.scrollTop = lyricUl.value.setScrollTop(moveTop)
}

//todo 点击歌词改变进度条(未完全测试) ,需在歌词处新增播放的ui
function clickWord(index) {
  wordFlag.value = index
  musicPlayStore.otherCurrentTime = songWord.value[index].time
}


//监听音乐播放
watch(() => musicPlayStore.playing, (newValue, OldValue) => {
  if (newValue === true) {
    record_needle.value.style.transform = "rotate(32deg)"
    cover.value.style.animationPlayState = ''
  } else {
    record_needle.value.style.transform = "rotate(0deg)"
    cover.value.style.animationPlayState = 'paused'
  }
}, {deep: true});


//监听歌曲变化
watch(() => musicPlayStore.index, (newValue, OldValue) => {
  song.value = musicPlayStore.songList[newValue]
  bg_info.value.style.backgroundImage = "url(" + "/" + song.value.song_Cover + ")";
}, {deep: true});

//歌词高亮停留，与歌词偏移
const wordWatch = watch(() => musicPlayStore.currentTime, (newValue, OldValue) => {
  let index = newValue.match(/(\d{2}):(\d{2})/);
  if (index) {
    const [, minutes, seconds] = index
    //点击进度条时滚动歌词
    if (currentTimeIndex.value + 1 < parseInt(minutes) * 60 + parseInt(seconds)) {
      findTime()
    } else if (currentTimeIndex.value - 1 > parseInt(minutes) * 60 + parseInt(seconds)) {
      findTime()
    }
    // 将时间戳转换为秒
    currentTimeIndex.value = parseInt(minutes) * 60 + parseInt(seconds)
    // console.log("wordf" + wordFlag.value)
    // console.log("s" + songWord.value[wordFlag.value + 1].time)
    //滚动歌词
    if (currentTimeIndex.value === songWord.value[wordFlag.value + 1].time) {
      wordFlag.value++;
      moveWord()
    }
    // console.log("wordf" + wordFlag.value)
    // console.log(currentTimeIndex.value)
  }
}, {deep: true});
</script>

<template>
  <div ref="bg_info" class="bg_mod">
    <div class="bg_shade">
      <!--todo 歌曲详情-->
      <div class="playerDE_mod">
        <div class="playerDE_mod_info">
          <div class="playerDE_mod_info_cover">
            <div class="cover_record_needle" ref="record_needle">
              <img src="/src/photos/logo/needle.png">
            </div>
            <div class="cover_container" ref="cover">
              <div class="cover_record">
                <img :src="song.song_Cover" class="cover_record_img">
              </div>
            </div>
          </div>
          <div class="playerDE_mod_info_text">
            <div class="playerDE_mod_info_text_title">
              <span>{{ song.song_Name }}</span>
            </div>
            <div class="playerDE_mod_info_text_moInfo">
              <span style="margin-right: 10px">专辑：<span>{{ song.album_name }}</span></span>
              <span>歌手：<span>{{ song.singer_name }}</span></span>
            </div>
            <div class="playerDE_mod_info_text_songWord" v-if="song.lyric!==null">
              <el-scrollbar ref="lyricUl" height="500px">
                <div v-for="(item,index) in songWord"
                     class="songWord_item"
                     :class="{playing:item.index===wordFlag}"
                     @click="clickWord(index)"
                >{{ item.content }}
                </div>
              </el-scrollbar>
            </div>
            <div class="playerDE_mod_info_text_NoSongWord" v-else>
              <div>暂无歌词,欣赏音乐</div>
            </div>
          </div>
        </div>
        <div class="playerDE_mod_player">

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg_mod {
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  background: rgba(87, 87, 87, 0.76);
}

.bg_shade {
  width: 100%;
  background: rgba(87, 87, 87, 0.76);
  backdrop-filter: blur(60px);
}

.playerDE_mod {
  width: 100%;
  height: 830px;
}

.playerDE_mod_info {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*歌曲封面*/
.playerDE_mod_info_cover {
  width: 800px;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cover_record_needle {
  width: 300px;
  height: 150px;
  position: relative;
  left: 150px;
  top: 20px;
  transform-origin: top left;
  transform: rotate(32deg);
  transition: all 0.5s ease-in-out;
  z-index: 3;
}

.cover_record_needle img {
  width: 100%;
  height: 100%;
}


.cover_container {
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 1px #e5e5e5 solid;
  background: rgba(229, 229, 229, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease-in-out;
  animation: rotation 20s linear infinite;
}

/*歌曲封面的旋转动画*/
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cover_record {
  width: 470px;
  height: 470px;
  border-radius: 50%;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover_record_img {
  width: 360px;
  height: 360px;
  background: #F4D5B7;
  border-radius: 50%;
}

/*--------------------------------------------*/


/*歌曲信息与歌词*/
.playerDE_mod_info_text {
  width: 800px;
  height: 800px;
  padding: 20px 10px;
}

.playerDE_mod_info_text_title {
  display: flex;
  align-items: center;
  max-width: 500px;
  font-family: STXihei, serif;
  font-weight: bolder;
  font-size: 26px;
  color: #FFFFFF;
  margin-bottom: 10px;
}

.playerDE_mod_info_text_moInfo {
  min-width: 200px;
  max-width: 500px;
  display: flex;
  align-items: center;
  font-family: STXihei, serif;
  font-size: 14px;
  color: #d7d7d7;
  margin-bottom: 10px;
}

.playerDE_mod_info_text_songWord {
  width: 450px;
  height: 600px;
  margin-top: 4rem;
}

.playerDE_mod_info_text_NoSongWord {
  width: 450px;
  height: 600px;
  margin-top: 4rem;
  color: white;
  font-family: STXihei, serif;
  font-size: 25px;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
}

.playerDE_mod_info_text_songWord :deep(.el-scrollbar__view) {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
}

.songWord_item {
  height: 25px;
  font-family: STXihei, serif;
  font-size: 17px;
  transition: all 0.3s ease-in-out;
  color: #ffffff;
  z-index: 3;
  margin-bottom: 10px;
}

.songWord_item.playing {
  transform: scale(1.2, 1.2);
  color: #e58c43;
}

.songWord_item:hover {
  transform: scale(1.2, 1.2);
  color: #e58c43;
  cursor: pointer;
}

/*--------------------------------------------*/
.playerDE_mod_player {

}
</style>
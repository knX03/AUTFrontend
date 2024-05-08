<script setup>


import {getCurrentInstance, onMounted, ref} from "vue";
import bus from "@/eventbus.js";
import axios from "axios";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import useUserStore from '@/store/userStore.js'

const userStore = useUserStore();
const userID = userStore.user_ID;
const {ctx} = getCurrentInstance()
const route = useRoute()
let dialogVisible = ref(false)
let showEdit = ref(true)
let collectBT = ref(true)
let disabled = ref(false)
let messageCode = ref("")
let fileList = ref([])
let fileType = ref(["png", "jpg", "jpeg"])
let fileSize = ref(50)
let fileName = ref("")
let creator = ref("aa")
let creator_Avatar = ref('src/photos/logo/avatarWhite.png')
let new_playlist_Cover = ref("")
let colletBUTX = ref("收藏")

let user = ref(
    {user_Name: '', user_ID: '', user_Avatar: 'src/photos/logo/avatarWhite.png', user_Sex: ''}
)

let songPlaylists = ref({
  playlist_ID: '',
  create_By: '',
  create_Time: '',
  playlist_Name: '',
  playlist_Cover: '',
  playlist_introduction: '',
  playlist_label: '',
})
let playlistForm = ref({
  playlist_ID: '',
  create_By: '',
  create_Time: '',
  playlist_Name: '',
  playlist_Cover: '',
  playlist_introduction: '',
  playlist_label: '',
})

let songList = ref([{
  song_Name: '',
  singer_ID: '',
  album_ID: '',
  song_cover: '',
}])

onMounted(() => {
  let FPlaylist_ID = route.query.playlist_ID
  selectDetail(FPlaylist_ID)
})

/*根据跳转的歌单ID查询歌单详情*/
function selectDetail(data) {
  axios({
    method: 'get',
    url: 'http://localhost/songPlaylist/DetailByID?playlist_ID=' + data,
  }).then(resp => {
    if (resp.data.code === 200) {
      songPlaylists.value = resp.data.data;
      new_playlist_Cover.value = resp.data.data.playlist_Cover;
      playlistForm.value = songPlaylists.value;
      editInfo(userID)
      selectCreatorDetail(resp.data.data.create_By)
      ifCollectPlaylist(songPlaylists.value.playlist_ID, userID)
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*创建者详情查询*/
function selectCreatorDetail(create_By) {
  axios({
    method: 'GET',
    url: 'http://localhost/user/DetailByID?user_ID=' + create_By,
  }).then(resp => {
    if (resp.data.code === 200) {
      creator.value = resp.data.data.user_Name
      creator_Avatar.value = resp.data.data.user_Avatar
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

function editInfo(user_ID) {
  showEdit.value = user_ID === songPlaylists.value.create_By;
  collectBT.value = user_ID !== songPlaylists.value.create_By;
}


/*查询歌单是否收藏*/
function ifCollectPlaylist(playlist_ID, user_ID) {
  axios({
    method: 'GET',
    url: 'http://localhost/songPlaylist/ifCollectPlaylist?playlist_ID=' + playlist_ID + "&user_ID=" + user_ID,
  }).then(resp => {
    if (resp.data.code === 302) {
      colletBUTX.value = "已收藏"
      disabled.value = true;
    } else if (resp.data.code === 200) {
      disabled.value = false;
    }
  })
}

function /*收藏歌单*/
collectPlaylist(row) {
  axios({
    method: 'GET',
    url: 'http://localhost/songPlaylist/collectPlaylist?playlist_ID=' + row + "&user_ID=" + userID,
  }).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success(resp.data.msg)
      colletBUTX.value = "已收藏"
      disabled.value = true;
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

function /*检查歌单名是否存在*/
checkPlaylistName(row) {
  if (row == null) {
    ElMessage.error("名称不能为空！")
  }
  axios({
    method: 'GET',
    url: 'http://localhost/songPlaylist/checkPlaylistName?playlist_Name=' + row,
  }).then(resp => {
    if (resp.data.code === 302) {
      ElMessage.error(resp.data.msg)
      playlistForm.value.playlist_Name = ''
    } else if (resp.data.code === 200) {
    }
  })
}

/*修改歌单资料*/
function changePlaylistInfo() {
  playlistForm.value.playlist_Cover = new_playlist_Cover.value;
  if (playlistForm.value.playlist_Name == null) {
    ElMessage.error('重申一遍！名称不能为空！')
    return;
  }
  axios({
    method: 'post',
    url: 'http://localhost/songPlaylist/changePlaylistInfo',
    data: playlistForm.value,
  }).then(resp => {
    if (resp.data.code === 200) {
      dialogVisible.value = false
      ElMessage.success(resp.data.msg)
      selectDetail(songPlaylists.value.playlist_ID)
    } else if (resp.data.code === 500) {
      dialogVisible.value = false
      ElMessage.error(resp.data.msg)
    }
  })
}

function /*上传封面前的验证*/
beforeUpload(file) {
  if (file.type !== "" || file.type != null || file.type !== undefined) {
    //截取文件的后缀，判断文件类型
    const FileExt = file.name.replace(/.+\./, "").toLowerCase();
    //计算文件的大小
    const isLt5M = file.size / 1024 / 1024 < 20; //这里做文件大小限制
    //如果大于50M
    if (!isLt5M) {
      ElMessage('上传文件大小不能超过 20MB!');
      return false;
    }
    //如果文件类型不在允许上传的范围内
    if (fileType.value.indexOf(FileExt) !== -1) {
      new_playlist_Cover.value = URL.createObjectURL(new Blob([file]));//赋值图片的url，用于图片回显功能
      return true;
    } else {
      ElMessage.error("上传文件格式不正确!");
      return false;
    }

  }
}

function /*上传封面*/
uploadCover(item) {
  ElMessage.success("封面正在上传！")
  //上传文件的需要formdata类型;所以要转
  let FormDatas = new FormData()
  FormDatas.append('file', item.file);
  axios({
    method: 'post',
    url: 'http://localhost/songPlaylist/uploadCover',
    headers: ctx.headers,
    data: FormDatas
  }).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success("封面上传成功！")
    } else {
      ElMessage({
        message: "上传失败！",
        duration: 1000
      });
    }
  })

}
</script>

<template>
  <div class="first_mod">

    <img :src="songPlaylists.playlist_Cover" class="cover_mod">

    <div class="option_mod">
      <div class="basicInfo_mod">
        <label class="playListName_mod">{{ songPlaylists.playlist_Name }}</label>
        <img v-show="showEdit" src="/src/photos/logo/editGray.png" class="editInfo_mod"
             @click="dialogVisible=true">
      </div>
      <div class="userInfo_mod">
        <!--todo 歌单创建者的信息(附带跳转)-->
        <img :src="creator_Avatar" @click="toUserInfo(creator)">
        <label class="userName_mod" @click="toUserInfo(creator)">
          {{ creator }}
        </label>
        <label class="creatTime_mod">{{ songPlaylists.create_Time }} 创建</label>
      </div>
      <!--todo 播放和下载功能待实现-->
      <div class="playAndLoad_mod">
        <el-button type="warning">
          <img src="/src/photos/logo/playWhite.png">
          <label>播放全部</label>
        </el-button>
        <el-button type="info">
          <img src="/src/photos/logo/downLoadWhite.png">
          <label>下载</label>
        </el-button>
      </div>
      <!-- 收藏歌单功能-->
      <div class="collect_mod" v-if="collectBT">
        <el-button type="info" :disabled="disabled"
                   @click="collectPlaylist(songPlaylists.playlist_ID)">
          <img src="/src/photos/logo/collect.png">
          {{ colletBUTX }}
        </el-button>
      </div>
    </div>
  </div>


  <!--编辑歌单资料-->
  <div class="editUserInfo" id="edituserinfo">
    <el-dialog
        title="编辑个人信息"
        v-model="dialogVisible"
        width="50%"
    >
      <div class="editForm" id="editform">
        <el-form :model="playlistForm" label-width="80px">
          <el-form-item label="名称：" id="playlist_Name">
            <el-input size="large" v-model="playlistForm.playlist_Name"
                      @blur="checkPlaylistName(playlistForm.playlist_Name)"></el-input>
          </el-form-item>
          <el-form-item label="简介：" id="eidtplaylist_introduction">
            <el-input size="large" type="textarea" v-model="playlistForm.playlist_introduction"
                      placeholder="200"></el-input>
          </el-form-item>
          <!--todo 标签模块暂时不需完善-->
          <el-form-item label="标签">
            <el-select size="large" v-model="playlistForm.playlist_label" placeholder="选择标签">
              <el-option label="流行" value="shanghai"></el-option>
              <el-option label="摇滚" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="large" @click="dialogVisible = false">取消</el-button>
            <el-button size="large" type="primary" @click="changePlaylistInfo()">保存</el-button>
          </el-form-item>
        </el-form>

        <div class="editCover">
          <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="uploadCover"
          >
            <img :src="new_playlist_Cover" class="Cover">
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<style scoped>
.first_mod {
  width: 100%;
  height: 250px;
  background-image: linear-gradient(to right, #ED5736, #25F8CD);
}

/*歌单封面*/
.cover_mod {
  width: 200px;
  height: 200px;
  border-radius: 30px;
  position: relative;
  top: 50%;
  left: 18%;
  transform: translate(-50%, -50%);
}

/*选项模块*/
.option_mod {

  height: 250px;

  position: absolute;
  top: 79px;
  left: 430px;
}

/*歌单基础信息*/
.basicInfo_mod {
  width: 300px;
  height: 40px;

  display: flex;
  position: relative;
  top: 30px;
  justify-content: space-evenly;
  align-items: center;
}

.playListName_mod {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: white;
}

/*编辑选项*/
.editInfo_mod {
  width: 30px;
  height: 30px;
  cursor: pointer;
}


/*用户信息模块*/
.userInfo_mod {
  width: 206px;
  height: 30px;
  position: relative;
  top: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 15px;
}

.userInfo_mod img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;

}

.userInfo_mod label {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #ffffff;
}

.userName_mod {
  cursor: pointer;
}

/*播放和下载按钮*/
.playAndLoad_mod {
  width: 233px;
  height: 50px;
  position: absolute;
  bottom: 24px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}

.playAndLoad_mod label {
  font-family: STXihei, serif;
  color: white;
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

/*下载按钮*/
.playAndLoad_mod .el-button--info {

  color: #FFF;
  backdrop-filter: blur(8px);
  background: #FFFFFF33;
}

/*收藏按钮*/
.collect_mod {
  width: 90px;
  position: relative;
  top: 114px;
  left: 241px;
}

.collect_mod .el-button > span {
  font-family: STXihei, serif;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.collect_mod img {
  width: 20px;
  height: 20px;
  /*  cursor: pointer;*/
}

.collect_mod .el-button {
  color: #FFF;
  border-radius: 12px;
}

.collect_mod .el-button span {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style src="../../css/secondPage/playDetail/playlistInfoEdit.css"></style>
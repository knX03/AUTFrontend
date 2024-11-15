<script setup>

import ARTnav from "@/components/artists/ARTnav.vue";
import {onMounted, ref} from "vue";
import {ElMessage, ElNotification} from "element-plus";
import bus from "@/eventbus.js";
import {aApplySinger, aUploadAlCover, aUploadSGAvatar} from "@/api/api.js";
import {store} from "xijs";
import router from "@/router/index.js";

let fileCoType = ref(["png", "jpg", "jpeg"])
let user = ref({user_Name: '', user_Avatar: '',})
let agreeApplyLet = ref(false)
let applyFlag = ref(false)
let singer = ref({
  singer_Name: '',
  singer_Age: '',
  singer_Sex: '',
  singer_Avatar: '',
  singer_Introduction: '',
  singer_Type: '',
  singer_Address: '',
  singer_Lang: ''
})
const loadAll = () => {
  return [
    {value: '中国大陆'},
    {value: '香港'},
    {value: '台湾'},
    {value: '澳门'},
    {value: '美国'},
    {value: '英国'},
    {value: '日本'}
  ]
}
//回显头像
let tempSingerAvatar = ref("/src/photos/logo/avatarWhite.png")
const restaurants = ref([])

onMounted(() => {
  restaurants.value = loadAll()
  bus.on('userInfo', data => {
    user.value = data
    tempSingerAvatar.value = user.value.user_Avatar
    singer.value.singer_Avatar = user.value.user_Avatar
  })
})

//上传封面前的验证
function beforeUpCover(file) {
  if (file.type !== "" || file.type != null || file.type !== undefined) {
    //截取文件的后缀，判断文件类型
    const FileExt = file.name.replace(/.+\./, "").toLowerCase();
    //计算文件的大小
    const isLt5M = file.size / 1024 / 1024 < 20; //这里做文件大小限制
    //如果大于200M
    if (!isLt5M) {
      ElMessage({
        message: "上传文件大小不能超过 20MB!",
        type: 'error',
      })
      return false;
    }
    //如果文件类型不在允许上传的范围内
    if (fileCoType.value.indexOf(FileExt) !== -1) {
      tempSingerAvatar.value = URL.createObjectURL(new Blob([file]));//赋值图片的url，用于图片回显功能
      return true;
    } else {
      ElMessage.error("上传文件格式不正确!");
      return false;
    }
  }
}

//上传封面
function uploadCover(item) {
  let aFormData = new FormData()
  aFormData.append("singerAvatar", item.file)
  aUploadSGAvatar(aFormData).then(resp => {
    if (resp.data.code === 200) {
      singer.value.singer_Avatar = resp.data.data;
    }
  })
}

function handleClick() {
  setTimeout(() => {
    console.log(singer.value.singer_Type)
  }, 10)
}

function handleSelect() {
  console.log(singer.value.singer_Address)
}

function querySearch(queryString, callback) {
  const results = restaurants.value
  callback(results)
}

function applySinger() {
  if (!agreeApplyLet.value) {
    ElNotification({
      title: '请确认阅读平台协议',
      type: 'error',
      duration: 1000,
      position: 'top-left',
    })
    return;
  }
  aApplySinger(singer.value).then(resp => {
    if (resp.data.code === 200) {
      applyFlag.value = true;
      store.set("access_singer_token", resp.data.data,
          Date.now() + 1000 * 60 * 60 * 24 * 7)
      setTimeout(() => {
        ElNotification({
          title: '你已成为AUT音乐人',
          type: 'success',
          duration: 1000,
          position: 'top-left',
        })
      }, 2000)
      router.go({
        path: '/artHome',
      })
    } else {
      console.log(resp.data)
    }
  })
}
</script>

<template>
  <ARTnav></ARTnav>
  <div class="apply_page_mod">
    <div class="apply_mod" v-if="!applyFlag">
      <el-scrollbar>
        <span class="apply_mod_title">欢迎入驻AUT音乐</span>
        <div class="apply_form_container">
          <span class="apply_form_title">Hello &nbsp;&nbsp; {{ user.user_Name }}</span>
          <el-divider/>
          <div class="apply_form">
            <div class="af_item">
              <span>昵称</span>
              <el-input v-model="singer.singer_Name" style="width: 300px" placeholder="昵称"/>
            </div>
            <div class="af_item">
              <span>头像</span>
              <div class="upAvatar_mod">
                <el-upload
                    class="avatar-uploader"
                    accept="image/jpg, image/jpeg, image/png"
                    :show-file-list="false"
                    :before-upload="beforeUpCover"
                    :http-request="uploadCover"
                >
                  <img v-if="tempSingerAvatar" :src="tempSingerAvatar" class="avatar"/>
                  <span style="margin-left: 30px">
                  <el-icon><UploadFilled/></el-icon>上传</span>
                </el-upload>
              </div>
            </div>
            <div class="af_item">
              <span>年龄</span>
              <el-input v-model="singer.singer_Age"
                        style="width: 150px"
                        placeholder="年龄"/>
            </div>
            <div class="af_item">
              <span>性别</span>
              <div>
                <el-select v-model="singer.singer_Sex"
                           style="width: 150px"
                           clearable
                           placeholder="您的性别">
                  <el-option label="男" value="男"/>
                  <el-option label="女" value="女"/>
                  <el-option label="沃尔玛" value="沃尔玛"/>
                  <el-option label="外星人" value="外星人"/>
                </el-select>
              </div>
            </div>
            <div class="af_item">
              <span>类型</span>
              <div class="singerType_selector">
                <el-tabs type="card" id="langType_tab"
                         v-model="singer.singer_Type"
                         class="demo-tabs"
                         @tab-click="handleClick">
                  <el-tab-pane label="男" name="男歌手" :key="1">男</el-tab-pane>
                  <el-tab-pane label="女" name="女歌手" :key="2">女</el-tab-pane>
                  <el-tab-pane label="组合" name="组合" :key="3">组合</el-tab-pane>
                  <el-tab-pane label="乐队" name="乐队" :key="4">乐队</el-tab-pane>
                </el-tabs>
              </div>
            </div>
            <div class="af_item">
              <span>语言</span>
              <div>
                <el-select v-model="singer.singer_Lang"
                           style="width: 150px"
                           clearable
                           placeholder="您的语言">
                  <el-option label="华语" value="华语"/>
                  <el-option label="欧美" value="欧美"/>
                  <el-option label="日本" value="日本"/>
                  <el-option label="韩国" value="韩国"/>
                  <el-option label="其他" value="其他"/>
                </el-select>
              </div>
            </div>
            <div class="af_item">
              <span>地区</span>
              <div>
                <el-autocomplete
                    v-model="singer.singer_Address"
                    :fetch-suggestions="querySearch"
                    clearable
                    class="inline-input w-100"
                    placeholder="输入您的地区"
                    @select="handleSelect"
                />
              </div>
            </div>
            <div class="af_item">
              <span>简介</span>
              <div class="singerIntro_mod">
                <el-input
                    v-model="singer.singer_Introduction"
                    type="textarea"
                    maxlength="200"
                    placeholder="您的简介"
                    show-word-limit/>
              </div>
            </div>
          </div>
        </div>
        <div class="APButton_mod">
          <el-checkbox v-model="agreeApplyLet" size="large">
            我已阅读<span style="color: #e58c43">《AUT音乐平台服务协议》</span>
          </el-checkbox>
          <el-button type="warning" round @click="applySinger()">提交审核</el-button>
        </div>
      </el-scrollbar>
    </div>
    <div v-if="applyFlag" class="applyAF_mod">
      <span class="apply_mod_title">欢迎入驻AUT音乐</span>
      <div class="applyAF_mod_container">
        <span class="apply_mod_title" style="color:#e58c43">提交成功</span>
        <img style="margin-top: 50px" src="/src/photos/logo/提交成功.png">
      </div>
    </div>
  </div>
</template>

<style scoped>
.apply_page_mod {
  width: 100%;
  height: 847px;
  background-color: #f5f6fa;
  display: flex;
  justify-content: center;
}

.apply_mod {
  width: 70%;
  padding-top: 30px;
}

.apply_mod_title {
  font-family: STXihei, serif;
  font-weight: bolder;
  font-size: 25px;
}

.apply_form_container {
  width: auto;
  max-height: 815px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 0 5px 5px #eaeaeabd;
  margin-top: 20px;
  padding: 30px 90px;
}

.apply_form_title {
  font-family: fantasy;
  font-weight: bolder;
  font-size: 23px;
}

.apply_form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.af_item {
  width: 80%;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}

.af_item span {
  display: inline-block;
  font-family: STXihei, serif;
  font-size: 18px;
  margin-right: 60px;
}

.af_item:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #e58c43 inset;
}

.af_item:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #e58c43 inset;
}

.af_item:deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #e58c43 inset;
}


.upAvatar_mod {

}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #d0d0d0;
}

.singerType_selector {
  display: flex;
  align-items: center;
}


/*选择器样式覆写*/
.singerType_selector :deep(.el-tabs__header) {
  border: 0;
  margin: 0;
  height: auto;
}

.singerType_selector :deep(.el-tabs__header .el-tabs__nav) {
  border: 0;
}

.singerType_selector :deep(.el-tabs__item) {
  width: 60px;
  height: 30px;
  border-radius: 34px;
  border: 1px solid #d0d0d0;
  background-color: rgba(234, 234, 234, 0.31);
  margin-right: 20px;
  transition: 0.5s all ease-in-out;
  font-size: 12px;
}

.singerType_selector :deep(.el-tabs__item:hover) {
  color: #e58c43;
  background-color: rgba(227, 149, 91, 0.34);
  transition: 0.5s all ease-in-out;
}

.singerType_selector :deep(.el-tabs__item.is-active) {
  color: #e58c43;
  background-color: rgba(227, 149, 91, 0.34);
}

.singerType_selector :deep(.el-tabs__content) {
  display: none;
}

/*简介输入框*/
.singerIntro_mod :deep(.el-textarea__inner) {
  width: 300px;
  height: 100px;
  max-height: 150px;
}

.singerIntro_mod :deep(.el-textarea .el-input__count ) {
  position: absolute;
  font-size: 12px;
  line-height: 14px;
  bottom: 10px;
  left: 245px;
  right: inherit;
}

.APButton_mod {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

/*同意选项模块*/

.APButton_mod :deep(.el-checkbox.is-bordered.is-checked) {
  border-color: #e58c43;
}

.APButton_mod :deep(.el-checkbox__inner:hover) {
  border-color: #e58c43;
}

.APButton_mod :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #e58c43;
  border-color: #e58c43;
}

.APButton_mod :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #606266;
}

.applyAF_mod {
  width: 70%;
  padding-top: 30px;
}


.applyAF_mod_container {
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 0 5px 5px #eaeaeabd;
  margin-top: 20px;
  padding: 30px 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.applyAF_mod_container img {
  width: 400px;
  height: 400px;
}
</style>
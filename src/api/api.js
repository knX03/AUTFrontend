// src/http/api.js
import Service from './axios.js'

//get模板
export const getTest = data => {
    return Service({
        url: '/user/DetailByID?user_ID=' + data,
        method: 'GET',

    })
}
//post模板
export const postTest = data => {
    return Service({
        url: '',
        method: 'POST',
        data
    })
}
export const aTest = data => {
    return Service({
        url: '/user/test',
        method: 'POST',
    })
}
/*User-----------------------------------------------------------*/
//验证邮箱
export const aVerifyEmail = data => {
    return Service({
        url: '/user/ifExist',
        method: 'POST',
        data
    })
}

//密码登录
export const aUserLogin = data => {
    return Service({
        url: '/user/userLogin',
        method: 'POST',
        data
    })
};

//验证码登录
export const aUserLoginCode = data => {
    return Service({
        url: '/user/userLoginCode',
        method: 'POST',
        data
    })
};

//忘记密码
export const aUserForget = data => {
    return Service({
        url: '/user/userForget',
        method: 'POST',
        data
    })
};


export const aUserReg = data => {
    return Service({
        url: '/user/userReg',
        method: 'POST',
        data
    })
};
//根据ID查找UserInfo
export const aSelectUserInfoByID = data => {
    return Service({
        url: '/user/DetailByID?user_ID=' + data,
        method: 'GET',
    })
}
//获取cookie
export const aGetCookie = data => {
    return Service({
        url: '/user/cookie',
        method: 'GET',

    })
}
//生成验证码
export const aGenerateCode = data => {
    return Service({
        url: '/user/generateCode',
        method: 'POST',
        data
    })
}

//用户的详情
export const aUserDetail = data => {
    return Service({
        url: '/user/userDetail',
        method: 'GET',
    })
}

//检查用户名
export const aCheckName = data => {
    return Service({
        url: '/user/checkName?user_Name=' + data,
        method: 'GET',

    })
}

//修改用户信息
export const aChangeUserInfo = data => {
    return Service({
        url: '/user/changeUserInfo',
        method: 'POST',
        data
    })
}

//用户退出登录
export const aLogOff = data => {
    return Service({
        url: '/user/logOff?user_token=' + data,
        method: 'GET',

    })
}

//获取用户的关注数与粉丝数
export const aGetSumFollowAndFan = data => {
    return Service({
        url: '/user/getSumFollowAndFan?user_ID=' + data,
        method: 'GET',
    })
}


//获取用户的粉丝
export const aGetUserFans = data => {
    return Service({
        url: '/user/getUserFans?user_ID=' + data,
        method: 'GET',

    })
}

//用户取消关注粉丝
export const aUserUnfollowFan = (fanID) => {
    return Service({
        url: '/user/userUnfollowFan?fan_id=' + fanID,
        method: 'GET',
    })
}


//获取用户的关注
export const aGetUserFollow = data => {
    return Service({
        url: '/user/getUserFollow?user_ID=' + data,
        method: 'GET',

    })
}


//用户是否关注另一个用户
export const aIfFollowUser = (ID) => {
    return Service({
        url: '/user/ifFollowUser?ID=' + ID,
        method: 'GET',
    })
}
//用户关注另一个用户
export const aFollowUser = (ID) => {
    return Service({
        url: '/user/followUser?ID=' + ID,
        method: 'GET',
    })
}


export const aIfMy = (ID) => {
    return Service({
        url: '/user/ifMy?ID=' + ID,
        method: 'GET',
    })
}

/*songPlaylist---------------------------------------------*/


/*根据跳转的歌单ID查询歌单详情*/
export const aDetailByID = data => {
    return Service({
        url: '/songPlaylist/DetailByID?playlist_ID=' + data,
        method: 'GET',
    })
}

/*查询歌单的标签列表*/
export const aSelectPlaylistTags = data => {
    return Service({
        url: '/songPlaylist/selectPlaylistTags?playlist_ID=' + data,
        method: 'GET',
    })
}

/*检查歌单名是否存在*/
export const aCheckPlaylistName = data => {
    return Service({
        url: '/songPlaylist/checkPlaylistName?playlist_Name=' + data,
        method: 'GET',
    })
}

//查找全部歌单
export const aSelectALlPlaylist = data => {
    return Service({
        url: '/songPlaylist/allPlaylists',
        method: 'GET',
    })
}
//展示随机十个歌单
export const aNineRandomPlaylist = data => {
    return Service({
        url: '/songPlaylist/NineRandomPlaylist',
        method: 'GET',
    })
}

//修改每日歌单
export const aChangeDailyList = data => {
    return Service({
        url: '/songPlaylist/changeDailyList',
        method: 'GET',
    })
}

/*查询用户所创建的歌单*/
export const aSelectCreateDetail = data => {
    return Service({
        url: '/songPlaylist/createPlaylist?user_ID=' + data,
        method: 'GET',
    })
}

//是否收藏了歌单
export const aIfCollectPlaylist = (playlist_ID) => {
    return Service({
        url: '/songPlaylist/ifCollectPlaylist?playlist_ID=' + playlist_ID,
        method: 'GET',
    })
}
//收藏歌单

export const aCollectPlaylist = (playlist_ID) => {
    return Service({
        url: '/songPlaylist/collectPlaylist?playlist_ID=' + playlist_ID,
        method: 'GET',
    })
}

/*检查歌曲是否已收藏*/
export const aIfExistSong = (playlist_ID, song_ID) => {
    return Service({
        url: '/songPlaylist/IESong?playlist_ID=' + playlist_ID + '&song_ID=' + song_ID,
        method: 'GET',
    })
}

/*收藏歌曲至指定歌单*/
export const aCollectSongToPlaylist = (playlist_ID, song_ID) => {
    return Service({
        url: '/songPlaylist/CLSong?playlist_ID=' + playlist_ID + '&song_ID=' + song_ID,
        method: 'GET',
    })
}
/*用户收藏的歌单*/
export const aSelectLikePlaylist = data => {
    return Service({
        url: '/songPlaylist/likePlaylist?user_ID=' + data,
        method: 'GET',
    })
}


/*删除用户收藏的歌单*/
export const aDeletePlaylist = (playlist_ID) => {
    return Service({
        url: '/songPlaylist/deleteLikePlaylist?playlist_ID=' + playlist_ID,
        method: 'GET',
    })
}

/*新建歌单*/
export const aCreateNewPlaylist = data => {
    return Service({
        url: '/songPlaylist/createNewPlaylist',
        method: 'POST',
        data
    })
}

export const aIfMyPlaylist = data => {
    return Service({
        url: '/songPlaylist/ifMyPlaylist?playlist_ID=' + data,
        method: 'GET',
    })
}

/*修改歌单资料*/
export const aChangePlaylistInfo = data => {
    return Service({
        url: '/songPlaylist/changePlaylistInfo',
        method: 'POST',
        data
    })
}
/*根据歌单ID查询歌单内容*/

export const aSelectSongByPlaylist = data => {
    return Service({
        url: '/songPlaylist/selectSongByPlaylist?playlist_ID=' + data,
        method: 'GET',
    })
}

/*根据歌单标签查询*/
export const aSelectPlaylistByTag = data => {
    return Service({
        url: '/songPlaylist/selectPlaylistByTag?playlist_tag=' + data,
        method: 'GET',
    })
}

/*查询所有歌单标签*/
export const aGetAllPLTag = data => {
    return Service({
        url: '/songPlaylist/getAllPLTag',
        method: 'GET',
    })
}

/*Album----------------------------------------------------------*/

export const aSelectAllAlbum = data => {
    return Service({
        url: '/album/allAlbums',
        method: 'GET',
    })
}
export const aTenRandomAlbum = data => {
    return Service({
        url: '/album/TenRandomAlbum',
        method: 'GET',
    })
}


export const aSelectLikeAlbum = data => {
    return Service({
        url: '/album/likeAlbum',
        method: 'GET',
    })
}

export const aDeleteAlbum = (album_ID) => {
    return Service({
        url: '/album/deleteLikeAlbum?album_ID=' + album_ID,
        method: 'PUT',
    })
}

/*专辑详情查询*/
export const aSelectDetailAlbum = data => {
    return Service({
        url: '/album/selectDetail?album_ID=' + data,
        method: 'GET',
    })
}

/*查询专辑是否收藏*/
export const aIfCollectAlbum = (album_ID) => {
    return Service({
        url: '/album/ifCollectAlbum?album_ID=' + album_ID,
        method: 'GET',
    })
}
//收藏专辑
export const aCollectAlbum = (album_ID) => {
    return Service({
        url: '/album/collectAlbum?album_ID=' + album_ID,
        method: 'PUT',
    })
}


export const aGetSingerAlbums = data => {
    return Service({
        url: '/album/getSingerAlbums?singer_ID=' + data,
        method: 'GET',
    })
}

//歌手用户查询自己创建的专辑列表
export const aGetUserAlbums = data => {
    return Service({
        url: '/album/getUserAlbums',
        method: 'GET',
    })
}

/*Song--------------------------------------------------------------*/

/*查询歌曲详情*/
export const aSongDE = data => {
    return Service({
        url: '/song/songDE?songID=' + data,
        method: 'GET',
    })
}
/*查询喜欢的歌曲*/
export const aSelectLikeSong = data => {
    return Service({
        url: '/song/selectLikeSong',
        method: 'GET',
    })
}
/*查询全部喜欢的歌曲进行分页*/
export const aSongByUser = (currentPage, pageSize) => {
    return Service({
        url: '/song/SongByUser?currentPage=' + currentPage + '&pageSize=' + pageSize,
        method: 'GET',
    })
}

//添加喜欢歌曲
export const aLikeSong = (song_ID) => {
    return Service({
        url: '/song/likeSong?song_ID=' + song_ID,
        method: 'GET',
    })
}
/*移除我喜欢*/
export const aDeleteLikeSong = (song_ID) => {
    return Service({
        url: '/song/deleteLikeSong?song_ID=' + song_ID,
        method: 'GET',
    })
}

//专辑的歌曲
export const aSongByAlbum = data => {
    return Service({
        url: '/song/SongByAlbum?album_ID=' + data,
        method: 'GET',
    })
}

//歌手的歌曲
export const aSongBySinger = data => {
    return Service({
        url: '/song/SongBySinger?singer_ID=' + data,
        method: 'GET',
    })
}

/*Singer--------------------------------------------------------------*/
//歌手筛选器
export const aSingerSelector = data => {
    return Service({
        url: '/singer/singerSelector',
        method: 'POST',
        data
    })
}

//查询所有歌手
export const aSelectAllSinger = data => {
    return Service({
        url: '/singer/allSingers',
        method: 'GET',
    })
}

/*歌手详情查询*/
export const aSelectSingerDetail = data => {
    return Service({
        url: '/singer/selectSingerDetail?singer_ID=' + data,
        method: 'GET',
    })
}


//判断用户是否是歌手
export const aGetSingerByUser = data => {
    return Service({
        url: '/singer/getSingerByUser',
        method: 'GET',
    })
}

//歌手信息退出
export const aSinLogOff = data => {
    return Service({
        url: '/singer/sinLogOff?singer_token=' + data,
        method: 'GET',
    })
}

//获取歌手信息
export const aGetArtists = data => {
    return Service({
        url: '/singer/getArtists',
        method: 'GET',
    })
}

//申请成为音乐人
export const aApplySinger = data => {
    return Service({
        url: '/singer/applySinger',
        method: 'POST',
        data
    })
}
//粉丝数据
export const aSelectArtistsFansData = data => {
    return Service({
        url: '/singer/aSelectArtistsFansData',
        method: 'GET',
    })
}
//作品数据
export const aSelectWorkData = data => {
    return Service({
        url: '/singer/aSelectWorkData',
        method: 'GET',
    })
}

//歌曲列表
export const aWorkBySinger = data => {
    return Service({
        url: '/singer/aWorkBySinger',
        method: 'GET',
    })
}

//专辑列表
export const aAlbumBySinger = data => {
    return Service({
        url: '/singer/aAlbumBySinger',
        method: 'GET',
    })
}
/*comment--------------------------------------------------------------*/

//获取相应评论
export const aGetComments = (ID, type) => {
    return Service({
        url: '/comment/getComments?ID=' + ID + '&type=' + type,
        method: 'GET',
    })
}
//发表评论
export const aPostComment = data => {
    return Service({
        url: '/comment/postComment',
        method: 'POST',
        data
    })
}

/*file--------------------------------------------------------------*/

//上传用户头像
export const aUploadUserAvatar = data => {
    return Service({
        url: '/user/uploadAvatar',
        method: 'POST',
        data
    })
}
//上传歌单封面
export const aUploadPlaylistCover = data => {
    return Service({
        url: '/songPlaylist/uploadCover',
        method: 'POST',
        data
    })
}
//上传歌曲数据
export const aUploadSong = data => {
    return Service({
        url: '/file/uploadSong',
        method: 'POST',
        data
    })
}
//上传专辑封面
export const aUploadAlCover = data => {
    return Service({
        url: '/file/uploadAlCover',
        method: 'POST',
        data
    })
}

//上传歌手头像
export const aUploadSGAvatar = data => {
    return Service({
        url: '/file/uploadSGAvatar',
        method: 'POST',
        data
    })
}
/*message---------------------------------------------------------*/

/**
 * 获取当前用户的消息列表
 * @param data
 * @returns {*}
 */
export const aGetUserMessages = data => {
    return Service({
        url: '/message/getUserMessages',
        method: 'GET',
    })
}
export const aMess = data => {
    return Service({
        url: '/msg/send',
        method: 'POST',
        data: data,
    })
}

/**
 * 获取两个用户间的聊天记录
 * @param userID
 * @returns {*}
 */
export const aUserMess = (userID) => {
    return Service({
        url: '/message/UserMess?userID=' + userID,
        method: 'GET',
    })
}

//获取用户系统消息
export const aGetSysMess = () => {
    return Service({
        url: '/message/getSysMess',
        method: 'GET',
    })
}
/*Search----------------------------------------------------------------------------*/

//搜索
export const aSearch = data => {
    return Service({
        url: '/search/' + data,
        method: 'GET',
    })
}

//搜索历史
export const aSearchHistory = (data) => {
    return Service({
        url: '/search/searchHistory',
        method: 'GET',
    })
}

//搜索热榜
export const aHotSearch = (data) => {
    return Service({
        url: '/search/hotSearch',
        method: 'GET',
    })
}

//保存搜索历史
export const aSaveSearchHS = (data) => {
    return Service({
        url: '/search/aSaveSearchHS?searchValue=' + data,
        method: 'GET',
    })
}

//删除搜素历史
export const aDelHistory = (data) => {
    return Service({
        url: '/search/delSearchHistory',
        method: 'PUT',
    })
}
//搜索结果
export const aSearchALL = (data) => {
    return Service({
        url: '/search/searchALL?searchValue=' + data,
        method: 'GET',
    })
}

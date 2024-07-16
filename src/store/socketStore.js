import {defineStore} from "pinia";

const useSocketStore = defineStore(
    'socket',
    {
        state: () => ({
            ws: undefined,
            heartTimeOut: 40000, //监测心跳时间 40秒
            //this.isReConnection = false
            lockReconnect: false, //避免重连
            timerReconnect: undefined,
            timerHeart: undefined,
            timerServerHeart: undefined,
            handClose: false,
            msg: ""
        }),
        actions: {
            connection(url, token) {
                if ("WebSocket" in window) {
                    this.createWebSocket(url, token)

                } else {
                    console.log("您的浏览器不支持websocket通信")
                }
            },

            //初始化
            createWebSocket(url, token) {
                try {
                    this.ws = new WebSocket(url, token)  //

                    this.initWebsocket()

                } catch (e) {
                    console.log("catch eeeee=", e)
                    this.reConnection()
                }
            },

            initWebsocket() {

                //建立连接
                this.ws.onopen = (e) => {

                    //webSocket业务订阅——可以有多个业务
                    this.ws.send("hello server");
                    console.log("连接成功")
                    //连接成功后，需要开启监测心跳
                    this.heartCheck()
                }

                this.ws.onmessage = (messages) => {

                    console.log(messages.data)
                    let msg = messages.data
                    if (msg.includes("{")) {
                        msg = JSON.parse(msg)
                    }
                    this.msg = msg

                    //接收到消息后，需要开启监测心跳
                    this.heartCheck()
                }


                this.ws.onerror = (e) => {       //连不上时onerror 和 onclose 监听同时会捕捉到
                    console.log("连接失败")
                    // 连失败需要重连
                    this.reConnection()
                }

                this.ws.onclose = (e) => {
                    console.log("关闭连接")

                    //是否正常关闭  正常关闭不需要重连， 否则需要重连
                    if (!this.handClose) {
                        this.reConnection()
                    }
                }
            },

            clearTimer() {
                this.timerReconnect && clearTimeout(this.timerReconnect)
                this.timerHeart && clearTimeout(this.timerHeart)
                this.timerServerHeart && clearTimeout(this.timerServerHeart)
            },

            //重连
            reConnection() {
                console.log("重新连接")
                if (this.lockReconnect) {
                    return
                }
                this.lockReconnect = true
                if (this.timerReconnect) {
                    clearTimeout(this.timerReconnect)
                }

                //没连上会一直重连， 设置迟延，避免请求过多
                this.timerReconnect = setTimeout(() => { //setTimeout 到点了执行
                    this.connection()
                    this.lockReconnect = false
                }, 5000);

            },


            //心跳
            heartCheck() {
                console.log("监测心跳")
                if (this.timerHeart) {
                    clearTimeout(this.timerHeart)
                }

                // if(this.timerServerHeart){
                //   clearTimeout(this.timerServerHeart)
                // }

                this.timerHeart = setTimeout(() => {
                    console.log("PING");
                    this.ws.send("PING");

                    // this.timerServerHeart = setTimeout(() => {
                    //   // 断了
                    //   this.ws.close()
                    // }, 5000);

                    this.lockReconnect = false
                }, this.heartTimeOut); //40秒

            },

            //发送消息
            sendMsg(data) {
                console.log("发送消息")
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(data))
                }
            },

            //关闭连接 手动关闭
            closeWs() {
                console.log("手动关闭ws")
                this.handClose = true
                this.clearTimer()
                this.ws.close()
            }
        }
    })

export default useSocketStore

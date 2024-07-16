import {defineStore} from 'pinia';


const useMessStore = defineStore("messageData", {
    state: () => ({
        showMess: false,
        recipient: {
            user_ID: '',
            user_Name: '',
            user_Avatar: ''
        },
        recipientList: [{
            user_ID: '',
            user_Name: '',
            user_Avatar: ''
        },],
        messageList: [{
            user_ID: '',
            user_Name: '',
            user_Avatar: '',
            messageText: '',
            post_Time: ''
        }]
    }),
    persist: {
        enabled: true,
        storage: sessionStorage,
    },

})

export default useMessStore
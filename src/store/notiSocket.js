import {defineStore} from "pinia";

const useNotiSocketStore = defineStore(
    'NotiSocket',
    {
        state: () => ({
            ws: null,
            poster_ID: '',
            poster_Name: '',
            poster_Avatar: '',
            messageText: ""
        }),
    })

export default useNotiSocketStore

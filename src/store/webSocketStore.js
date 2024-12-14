import {defineStore} from "pinia";

const useWebSocketStore = defineStore(
    'webSocket',
    {
        state: () => ({
            ws: null,
            poster_ID: '',
            poster_Name: '',
            poster_Avatar: '',
            messageText: ""
        }),
        persist: {
            enabled: true,
            strategies: [
                {
                    key: 'webSocket',
                    storage: sessionStorage,
                },
            ],
        },
    })

export default useWebSocketStore

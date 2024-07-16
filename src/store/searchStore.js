import {defineStore} from 'pinia';


const useSearchStore = defineStore("searchData", {
    state: () => ({
        searchValue: '',
    }),

})

export default useSearchStore
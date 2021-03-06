import Vue from 'vue'
import Vuex from 'vuex'

import common from './modules/common'
import user from './modules/user'
import sport from './modules/sport'
import travel from './modules/travel'
import detail from './modules/detail'
import tabbarItems from './modules/tabbarItems'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        common,
        user,
        sport,
        travel,
        detail,
        tabbarItems,
    },
    strict: process.env.NODE_ENV !== 'production'
})
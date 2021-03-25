import Vue from 'vue'
import Vuex from 'vuex'
import {
    getUserFromCookie,
    getUserFromSession,
    getTokenFromCookie
} from '@/authentication'
const cookieparser = process.server ? require('cookieparser') : undefined

Vue.use(Vuex)

export const strict = false

export const state = () => ({})

export const mutations = {}

export const actions = {
    async nuxtServerInit({ commit }, { req }) {
        const user = getUserFromCookie(req)
        if (user) {
            await commit('user/setUser', {
                name: user.name,
                email: user.email,
                avatar: user.picture,
                uid: user.user_id
            })
        }
    },
    nuxtClientInit({ commit }, { req }) {}
}

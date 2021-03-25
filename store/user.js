import cookies from 'js-cookie'
import Vue from 'vue'

export const state = () => ({
    currentUser: null,
    currentToken: null
})

export const mutations = {
    setUser(state, user) {
        if (!state.currentUser) state.currentUser = user
        else {
            for (var key in user) {
                Vue.set(state.currentUser, key, user[key])
            }
        }
    },
    setToken(state, token) {
        state.currentToken = token
        cookies.set('access_token', token)
        this.$axios.setToken(token, 'Bearer')
    },
    removeToken(state) {
        state.currentToken = null
        cookies.remove('access_token')
        this.$axios.setToken(false)
    },
    updateCurrentUserData(state, data) {
        for (var key in data) {
            Vue.set(state.currentUser, key, data[key])
        }
    }
}

export const getters = {
    getCurrentUser: state => state.currentUser,
    getUserToken: state => state.currentToken || cookies.get('access_token')
}

export const actions = {
    loginUser({ dispatch, commit }, data) {
        return new Promise((resolve, reject) => {
            this.$fire.auth
                .signInWithEmailAndPassword(data.login, data.password)
                .then(function(result) {
                    dispatch('loginSuccess', result)
                    resolve(result)
                })
                .catch(function(error) {
                    dispatch('loginFailed', error)
                    reject(error)
                })
        })
    },
    loginWithGoogle({ dispatch, commit }) {
        var provider = new this.$fireModule.auth.GoogleAuthProvider()
        return dispatch('loginPopup', provider)
    },
    loginWithFacebook({ dispatch, commit }) {
        var provider = new this.$fireModule.auth.FacebookAuthProvider()
        return dispatch('loginPopup', provider)
    },
    loginWithGithub({ dispatch, commit }) {
        var provider = new this.$fireModule.auth.GithubAuthProvider()
        return dispatch('loginPopup', provider)
    },
    loginWithMicrosoft({ dispatch, commit }) {
        var provider = new this.$fireModule.auth.OAuthProvider('microsoft.com')
        return dispatch('loginPopup', provider)
    },
    loginPopup({ dispatch, commit }, provider) {
        return new Promise((resolve, reject) => {
            this.$fire.auth
                .signInWithRedirect(provider)
                .then(function(result) {
                    resolve(result)
                })
                .catch(function(error) {
                    reject(error)
                })
        })
    },
    createUser({ commit }, data) {
        return new Promise((resolve, reject) => {
            this.$fire.auth
                .createUserWithEmailAndPassword(data.login, data.password)
                .then(function(result) {
                    // dispatch('registerSuccess',result)
                    resolve(result)
                })
                .catch(function(error) {
                    // dispatch('registerFailed',error)
                    reject(error)
                })
        })
    },
    async authUser({ commit }, user) {
        const token = await this.$fire.auth.currentUser.getIdToken(true)
        const userInfo = {
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            uid: user.uid,
            emailVerified: user.emailVerified
        }

        commit('setToken', token)
        commit('setUser', userInfo)
    },
    logoutUser({ commit }) {
        return new Promise((resolve, reject) => {
            this.$fire.auth
                .signOut()
                .then(() => {
                    commit('removeToken')
                    commit('setUser', null)
                    resolve()
                })
                .catch(error => {
                    reject()
                })
        })
    },
    updateUser({ commit }, user) {
        return new Promise((resolve, reject) => {
            this.$fire.auth.currentUser
                .updateProfile({
                    displayName: user.name,
                    photoURL: user.avatar,
                    role: user.role
                })
                .then(function(result) {
                    resolve(result)
                })
                .catch(function(error) {
                    reject(error)
                })
        })
    },
    updateCurrentUserData({ commit }, data) {
        commit('updateCurrentUserData', data)
    }
}

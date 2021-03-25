import https from 'https'

export default function(context) {
    var setAccessToken = () => {
        const token = context.$cookies.get('access_token')
        if (token) {
            context.$axios.setToken(token, 'Bearer')
        }
    }
    setAccessToken()

    context.$axios.defaults.httpsAgent = new https.Agent({
        rejectUnauthorized: false
    })

    if (context.isDev) {
        context.$axios.onRequest(config => {
            console.log(`Making request to [${config.method}] ${config.url}`)
        })
    }

    context.$axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if (code === 400) {
            context.app.$notify.error({
                title: 'Error',
                message: error.response.data,
                position: 'topRight'
            })
        }
        if (code === 401) {
            context.app.$notify.error({
                title: 'Error',
                message: 'Unauthorized',
                position: 'topRight'
            })
            context.store.dispatch('user/logoutUser')
            context.redirect('/signin')
        }
    })
}

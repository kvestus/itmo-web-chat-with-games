import axios from 'axios'

const resource = 'api/users'

export default $axios => ({
    add(userModel) {
        return $axios.$post(`/${resource}`, userModel)
    },

    getUserData() {
        return Promise.resolve({
            uid: '123',
            firstName: 'Sasha',
            lastName: 'Chernigin',
            email: 'email@mail.ru'
        })
        //return $axios.$get(`/${resource}`)
    },

    update(userModel) {
        return $axios.$put(`/${resource}`, userModel)
    }
})

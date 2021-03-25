import createRepository from '~/api/repository.js'
import createUserRepository from '~/api/user.repository.js'

export default (context, inject) => {
    const repositoryWithAxios = createRepository(context.$axios)

    const repositories = {
        users: createUserRepository(context.$axios)
    }

    inject('repositories', repositories)
}

import createRepository from '~/api/repository.js'
import createUserRepository from '~/api/user.repository.js'
import createTicTacToeRepository from '~/api/tictactoe.repository.js'

export default (context, inject) => {
    const repositoryWithAxios = createRepository(context.$axios)

    const repositories = {
        users: createUserRepository(context.$axios),
        ticTacToe: createTicTacToeRepository(context.$axios)
    }

    inject('repositories', repositories)
}

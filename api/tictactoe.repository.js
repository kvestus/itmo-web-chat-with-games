import axios from 'axios'

const resource = 'api/tictactoe'

export default $axios => ({
    add(ticTacToeModel) {
        return $axios.$post(`/${resource}`, ticTacToeModel)
    }
})

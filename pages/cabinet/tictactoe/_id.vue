<template>
    <CabinetContentTemplate :subTitle="subTitle">
        <b-overlay :show="state == 'loading'" rounded="sm">
            <template #overlay>
                <div class="text-center">
                    <b-icon
                        icon="stopwatch"
                        font-scale="3"
                        animation="cylon"
                    ></b-icon>
                    <p id="cancel-label">Please wait...</p>
                </div>
            </template>
            <div v-if="state != 'loading'">
                <b-row>
                    <b-col v-if="!room.finished" md="8" cols="12">
                        <b-row v-for="y in 3" :key="'y' + y">
                            <b-col
                                cols="4"
                                v-for="x in 3"
                                :key="'x' + x + y"
                                class="p-0"
                                :class="'cell-' + (x + (y - 1) * 3)"
                                @click="move(x, y)"
                            >
                                <div
                                    class="game-block"
                                    :class="
                                        cellValues[`${x}-${y}`] == 0 &&
                                        isMyTurnToWalk
                                            ? 'active'
                                            : ''
                                    "
                                >
                                    <span v-if="cellValues[`${x}-${y}`] == 0">
                                    </span>
                                    <span
                                        v-if="cellValues[`${x}-${y}`] == 1"
                                        style="font-size: 35px;"
                                    >
                                        ×
                                    </span>
                                    <span
                                        v-if="cellValues[`${x}-${y}`] == 2"
                                        style="font-size: 35px;"
                                    >
                                        o
                                    </span>
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col
                        v-else
                        md="8"
                        cols="12"
                        class="d-flex align-items-center justify-content-center mb-md-0 mb-4"
                        ><b
                            >Finished, winner:
                            {{
                                room.user1Uid == room.winnerUid
                                    ? 'User-1'
                                    : 'User-2'
                            }}</b
                        ></b-col
                    >
                    <b-col md="4" cols="12" class="chat-clients text-right">
                        <div>
                            <div class="text-center"><b>Players</b></div>
                            <div
                                v-for="(client, index) in players"
                                :key="index + 'tictactoe-user'"
                                class="mt-2 mx-auto"
                            >
                                {{ client.email }}
                            </div>
                        </div>
                        <div>
                            <div class="text-center"><b>Spectators</b></div>
                            <div
                                v-for="(client, index) in spectators"
                                :key="index + 'tictactoe-user'"
                                class="mt-2 mx-auto"
                            >
                                {{ client.email }}
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </b-overlay>
    </CabinetContentTemplate>
</template>

<script>
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { userMixin } from '~/vuex-mixins/user.js'
export default {
    layout: 'cabinet',
    mixins: [userMixin],
    data() {
        return {
            connection: null,
            room: {
                user1Uid: '1',
                user2Uid: '2',
                finished: false,
                winnerUid: null
            },
            moves: [
                /*{
                    positionX: 1,
                    positionY: 1,
                    createdBy: '1'
                }*/
            ],
            cellValues: {
                '1-1': 0,
                '1-2': 0,
                '1-3': 0,
                '2-1': 0,
                '2-2': 0,
                '2-3': 0,
                '3-1': 0,
                '3-2': 0,
                '3-3': 0
            },
            clients: [
                /*{
                    id: 1,
                    uid: 'XOayKVkZZ3Q2YbkbagYDK1zb0xt2',
                    firstName: 'Alexander',
                    lastName: 'Chernigin',
                    email: 'chernigin.boss@gmail.com',
                    roles: 0
                },*/
            ],
            messages: [
                { messageText: 'Welcome to chat', userId: 0 },
                { messageText: 'Welcome to chat', userId: 0 },
                { messageText: 'Welcome to chat', userId: 0 }
            ],
            messageText: '',
            state: 'loading'
        }
    },
    computed: {
        subTitle() {
            return `GL HF`
        },
        roomId() {
            return Number(this.$nuxt._route.params.id)
        },
        players() {
            return this.clients.filter(
                x => x.uid == this.room.user1Uid || x.uid == this.room.user2Uid
            )
        },
        spectators() {
            return this.clients.filter(
                x => x.uid != this.room.user1Uid && x.uid != this.room.user2Uid
            )
        },
        isMyTurnToWalk() {
            return (
                (this.moves.length == 0 &&
                    this.room.user1Uid == this.currentUserUid) ||
                (this.moves.length > 0 &&
                    this.moves[this.moves.length - 1].createdBy !=
                        this.currentUserUid)
            )
        }
    },
    methods: {
        initChatConnection() {
            this.connection = new HubConnectionBuilder()
                .withUrl('http://192.168.0.101:6002/ticTacToeHub', {
                    accessTokenFactory: () => this._userToken
                })
                .configureLogging(LogLevel.None)
                .withAutomaticReconnect()
                .build()

            this.connection.on('GameReady', data => {
                this.room = data.room
                this.moves = data.moves
                this.clients = data.clients
                this.calculateCellValues()
                this.state = 'true'
            })

            this.connection.on('UserJoin', user => {
                if (!this.clients.find(x => x.uid == user.uid))
                    this.clients.push(user)
            })

            this.connection.on('UserLeave', user => {
                this.clients = this.clients.filter(
                    client => client.uid != user.uid
                )
            })

            this.connection.on('UserMove', move => {
                this.moves.push(move)
                this.calculateCellValues()
            })

            this.connection.on('Finish', data => {
                this.room.finished = true
                this.room.winnerUid = data.winner
            })

            this.connection.start().then(() => {
                this.joinToRoom()
            })
        },
        move(x, y) {
            if (!this.isMyTurnToWalk) return
            this.connection.invoke(
                'GoMove',
                this.room.id,
                this.currentUserUid,
                x,
                y
            )
        },
        joinToRoom() {
            this.connection.invoke('JoinToRoom', this.roomId)
        },
        calculateCellValues() {
            for (var move of this.moves) {
                this.cellValues[`${move.positionX}-${move.positionY}`] =
                    move.createdBy == this.room.user1Uid ? 1 : 2
            }
        }
    },
    created() {
        this.clients = []
        if (process.browser) {
            this.initChatConnection()
        }
    },
    beforeDestroy() {
        this.connection.stop()
    }
}
</script>

<style lang="less" scoped>
.game-block {
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.game-block.active {
    cursor: pointer;
}

.game-block.active:hover {
    background: rgba(134, 134, 134, 0.24);
}

.chat-clients {
    overflow-x: hidden;
    overflow-y: auto;
}

.chat-user {
    overflow: hidden;
    text-align: center;
}

.cell-1,
.cell-2,
.cell-3,
.cell-4,
.cell-5,
.cell-6 {
    border-bottom: black solid 1px;
}

.cell-1,
.cell-2,
.cell-4,
.cell-5,
.cell-7,
.cell-8 {
    border-right: black solid 1px;
}
</style>

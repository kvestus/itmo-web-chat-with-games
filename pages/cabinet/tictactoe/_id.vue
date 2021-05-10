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
                    <b-col cols="8">
                        <b-row v-for="x in 3" :key="'x' + x">
                            <b-col
                                cols="4"
                                v-for="y in 3"
                                :key="'y' + x + y"
                                class="p-0"
                            >
                                <div class="game-block">{{ x }},{{ y }}</div>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="4" class="chat-clients text-right">
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
                {
                    positionX: 1,
                    positionY: 1,
                    createdBy: '1'
                }
            ],
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
            return `Bonjour ${this.currentUserFirstName}`
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
        }
    },
    methods: {
        initChatConnection() {
            this.connection = new HubConnectionBuilder()
                .withUrl('http://localhost:6002/ticTacToeHub', {
                    accessTokenFactory: () => this._userToken
                })
                .configureLogging(LogLevel.None)
                .withAutomaticReconnect()
                .build()

            this.connection.on('GameReady', data => {
                this.room = data.room
                this.moves = data.moves
                this.clients = data.clients
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
    cursor: pointer;
    border: black solid 1px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chat-clients {
    overflow-x: hidden;
    overflow-y: auto;
}

.chat-user {
    overflow: hidden;
    text-align: center;
}
</style>

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
                    <b-col md="8" cols="12" class="mb-md-0 mb-4 chat-container">
                        <div>
                            <div
                                v-for="(message, index) in messages"
                                :key="index"
                                :style="
                                    message.createdBy == currentUserUid
                                        ? 'justify-content: flex-end;'
                                        : ''
                                "
                                class="d-flex"
                            >
                                <div
                                    class="message-item"
                                    :class="
                                        message.createdBy == currentUserUid
                                            ? 'mine'
                                            : ''
                                    "
                                >
                                    <span style="white-space: pre-line">{{
                                        message.messageText
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </b-col>
                    <b-col
                        md="4"
                        cols="12"
                        class="chat-clients text-right mb-md-0"
                    >
                        <div class="text-center"><b>Clients</b></div>
                        <b-dropdown
                            v-for="(client, index) in clients"
                            :key="index + 'chat-user'"
                            class="mt-2 mx-auto"
                            :id="'dropdown-1'"
                            :text="client.email"
                            :disabled="client.email == currentUserEmail"
                        >
                            <b-dropdown-item @click="goTicTacToe(client.uid)">
                                Figth Tic Tac Toe
                            </b-dropdown-item>
                        </b-dropdown>
                    </b-col>
                    <div class="d-flex send-message-container">
                        <b-form-input
                            v-model="messageText"
                            placeholder="Write a message..."
                        ></b-form-input>
                        <div class="icon" @click="sendMessage">
                            <b-icon icon="chat" class="icon" />
                        </div>
                    </div>
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
        }
    },
    methods: {
        initChatConnection() {
            this.connection = new HubConnectionBuilder()
                .withUrl('http://192.168.0.101:6002/chatHub', {
                    accessTokenFactory: () => this._userToken
                })
                .configureLogging(LogLevel.None)
                .withAutomaticReconnect()
                .build()

            this.connection.on('ChatReady', data => {
                this.state = 'true'
                this.messages = data.messages.sort(
                    (a, b) => b.id.timestamp - a.id.timestamp
                )
                this.clients = data.clients
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

            this.connection.on('ReceiveMessage', message => {
                this.messages.unshift(message)
            })

            this.connection.on('ReciveOldMessages', messages => {
                this.messages = messages.sort(
                    (a, b) => b.id.timestamp - a.id.timestamp
                )
            })

            this.connection.on('GoTicTacToe', roomId => {
                this.$nuxt.$router.push(`tictactoe/${roomId}`)
            })

            this.connection.start()
        },
        sendMessage() {
            function isNullOrWhitespace(input) {
                if (typeof input === 'undefined' || input == null) return true
                return input.replace(/\s/g, '').length < 1
            }

            if (!isNullOrWhitespace(this.messageText)) {
                this.connection
                    .invoke('SendMessage', this.messageText)
                    .then(() => {
                        this.messageText = ''
                    })
            }
        },
        goTicTacToe(uid) {
            this.$repositories['ticTacToe']
                .add({
                    user1Uid: this.currentUserUid,
                    user2Uid: uid
                })
                .then(roomId => {
                    this.connection
                        .invoke('GoTicTacToe', roomId, uid)
                        .then(() => {
                            this.$nuxt.$router.push(`tictactoe/${roomId}`)
                        })
                })
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
.message-item {
    padding: 20px;
    margin-bottom: 20px;
    position: relative;
    background: rgba(58, 189, 230, 0.705);
    border-radius: 10px;
    padding: 20px;
    border: transparent solid 1px;
    border-radius: 10px 10px 10px 0;
    align-self: flex-start;
    &.mine {
        align-self: flex-end;
        border-radius: 10px 10px 0 10px;
        background: rgba(160, 227, 248, 0.705);
    }
}

.message-item::after {
    content: '';
    width: 10px;
    height: 10px;
    position: absolute;
    bottom: -1px;
    left: -21px;
    border: 10px solid transparent;
    border-right: 10px solid rgba(58, 189, 230, 0.705);
    border-bottom: 10px solid rgba(58, 189, 230, 0.705);
}

.message-item.mine::after {
    content: '';
    width: 10px;
    height: 10px;
    position: absolute;
    bottom: -1px;
    left: unset;
    right: -21px;
    border: 10px solid transparent;
    border-left: 10px solid rgba(160, 227, 248, 0.705);
    border-bottom: 10px solid rgba(160, 227, 248, 0.705);
}

.send-message-container {
    border-top: black solid 1px;
    left: 0;
    bottom: 0;
    position: fixed;
    width: 100%;

    input {
        border: none;
        width: 80%;
    }

    .icon {
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
}

.chat-clients {
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 100px;
}

.chat-user {
    overflow: hidden;
    text-align: center;
}

.chat-container {
    max-height: calc(100vh - 40px - 36px - 24px - 30px);
    overflow: scroll;
}
</style>

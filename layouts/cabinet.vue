<template>
    <div class="d-flex">
        <div class="mobile-sidebar-container"><CabinetSidebarMobile /></div>
        <div class="sidebar-container">
            <CabinetSidebar />
        </div>
        <div class="cabinet-body">
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
                    <CabinetHeader />
                    <nuxt />
                </div>
            </b-overlay>
        </div>
    </div>
</template>

<script>
import { userMixin } from '~/vuex-mixins/user.js'

export default {
    middleware: 'auth',
    mixins: [userMixin],
    data() {
        return {
            state: 'loading'
        }
    },
    mounted() {
        this.getUserModel()
    },
    methods: {
        getUserModel() {
            this.$repositories['users'].getUserData().then(data => {
                if (data == '') {
                    this.addUser()
                } else {
                    this._updateCurrentUserData(data)
                    this.state = 'ready'
                }
            })
        },
        addUser() {
            this.$repositories['users']
                .add({
                    email: this.currentUser.email
                })
                .then(data => {
                    this.getUserModel()
                })
        }
    }
}
</script>

<style lang="less" scoped>
.sidebar-container {
    width: 25%;
    min-width: 250px;
    max-width: 290px;

    @media (max-width: @md) {
        display: none;
    }
}

.cabinet-body {
    width: 75%;
    margin: 40px 60px 0 60px;

    @media (max-width: @md) {
        width: 100%;
        margin: 25px 30px 0 30px;
    }
}

.mobile-sidebar-container {
    display: none;
    @media (max-width: @md) {
        display: block;
    }
}
</style>

<style lang="less">
.cabinet-body {
    .b-overlay-wrap {
        > .b-overlay {
            top: 40vh !important;
        }
    }
}
</style>

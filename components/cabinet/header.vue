<template>
    <header>
        <b-row no-gutters class="w-100">
            <b-col
                cols-sm="4"
                cols-md="2"
                class="title d-flex align-items-center"
                v-b-toggle.sidebar-1
                >{{ title }}</b-col
            >
            <b-col cols-sm="8" cols-md="10" class="avatar-container">
                <b-dropdown
                    size="lg"
                    variant="link"
                    toggle-class="text-decoration-none p-0"
                    no-caret
                    right
                >
                    <template #button-content>
                        <span class="px-2 name">{{ currentUserFullName }}</span>
                        <b-avatar
                            rounded
                            :text="currentUserInitials"
                            size="2rem"
                        ></b-avatar>
                    </template>
                    <b-dropdown-item href="#"
                        ><n-link
                            tag="div"
                            :to="localePath('/cabinet/profile/settings')"
                            class="nav-item"
                        >
                            Profile
                        </n-link></b-dropdown-item
                    >
                    <b-dropdown-item @click="logout">Logout</b-dropdown-item>
                </b-dropdown>
            </b-col>
        </b-row>
    </header>
</template>

<script>
import { userMixin } from '~/vuex-mixins/user.js'
export default {
    mixins: [userMixin],
    computed: {
        title() {
            var el = this.$route.path.split('/')
            if (el[el.length - 2] == 'tictactoe') return 'Tic-tac-toe'
            var str = el[el.length - 1]
            if (str && str.length > 0)
                return str[0].toUpperCase() + str.substring(1)
            return ''
        }
    },
    methods: {
        logout() {
            this._logoutUser().then(() => {
                this.$nuxt.$router.push(this.localePath('index'))
            })
        }
    }
}
</script>

<style lang="less" scoped>
header {
    width: 100%;

    .title {
        font-size: 0.8rem;
        color: rgba(58, 189, 230, 0.705);
        font-weight: bold;
        outline: none !important;

        @media (max-width: @md) {
            text-decoration: underline;
        }
    }

    .avatar-container {
        display: flex;
        flex-flow: row-reverse;
        align-items: center;

        .name {
            color: black;
        }
        span {
            font-size: 0.7rem;
            font-weight: bold;
        }
    }
}
</style>

<template>
    <div class="sidebar">
        <label>MENU</label>
        <div class="nav-items-container">
            <b-row
                no-gutters
                align-v="start"
                class="nav-items-row"
                cols-sm="1"
                cols-md="2"
            >
                <b-col
                    v-for="(navigation, index) in navigations"
                    :key="'navigation' + index"
                    class="nav-item-container"
                    cols="12"
                    md="6"
                >
                    <n-link
                        tag="div"
                        :to="localePath(navigation.path)"
                        class="nav-item"
                        :class="{ active: isActive(navigation) }"
                    >
                        <b-icon :icon="navigation.icon" class="icon" />
                        {{ navigation.title }}
                    </n-link>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
export default {
    props: {},
    components: {},
    data() {
        return {
            navigations: [
                {
                    title: 'Chat',
                    icon: 'chat',
                    path: '/cabinet/chat'
                }
                /*{
                    title: 'Users',
                    icon: 'people',
                    path: '/cabinet/users'
                }*/
            ]
        }
    },
    methods: {
        isActive(navigation) {
            var el = this.$route.path.split('/')
            var path = el[el.length - 1]
            return navigation.title.toLowerCase() == path
        }
    }
}
</script>

<style lang="less">
.sidebar {
    background: rgba(241, 229, 245, 0.295);
    height: 100vh;
    text-align: center;

    label {
        padding-top: 40px;

        @media (max-width: @md) {
            display: none;
        }
    }

    .nav-items-container {
        height: 75%;
        display: flex;
    }

    .nav-items-row {
        margin: auto 10px;
        width: 100%;
    }

    .nav-item-container {
        padding: 5px;
    }

    .nav-item {
        height: 100px;
        width: 100%;
        border: transparent solid 1px;
        border-radius: 13px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        font-size: 0.7rem;
        cursor: pointer;
        color: gray;

        .icon {
            width: 20px;
            height: 20px;
        }

        &:hover {
            .active;
        }

        &.active {
            background: rgba(58, 189, 230, 0.705);
            font-weight: bold;
            color: white;
        }
    }
}
</style>

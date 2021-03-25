<template>
    <div class="main-body">
        <!-- Castom elements -->
        <template>
            <div class="lines">
                <b-row>
                    <b-col v-for="i in 3" :key="'line' + i"></b-col>
                </b-row>
            </div>
            <div
                class="fixed-top rellax"
                data-rellax-speed="-2"
                style="transform: translate3d(0px, 0px, 0px) rotate(45deg);"
            ></div>
        </template>

        <div class="header-container">
            <b-row class="header">
                <b-col cols="5"
                    ><a
                        href="https://github.com/kvestus/itmo-web-chat-with-games"
                        target="_blank"
                        >github</a
                    ></b-col
                >
                <div class="github-underline"></div>
            </b-row>
            <b-row class="name">
                <b-col md="5" cols="12" class="title"
                    ><h1>
                        ITMO Chat
                    </h1></b-col
                >
                <b-col md="6" cols="12" class="d-flex justify-content-end"
                    ><n-link
                        tag="div"
                        :to="localePath('/signin/')"
                        class="nav-item"
                    >
                        <b-button variant="dark" class="mr-2">
                            sign in</b-button
                        > </n-link
                    ><n-link
                        tag="div"
                        :to="localePath('/signup/')"
                        class="nav-item"
                    >
                        <b-button variant="dark"> sign up</b-button>
                    </n-link></b-col
                >
            </b-row>
            <b-row class="w-50 features d-block d-md-flex">
                <b-col>Messenger</b-col>
            </b-row>
        </div>
    </div>
</template>
<script>
import Rellax from 'rellax'
export default {
    mounted() {
        var rellax = new Rellax('.rellax')
    }
}
</script>

<!-- Castom elements -->
<style lang="less">
.lines {
    position: absolute;
    width: 100%;
    height: 100%;
    padding-right: 40px;

    .row {
        width: 100%;
        height: 100%;
        margin-left: auto;
        margin-right: auto;
        > div {
            border-left: 1px rgba(204, 204, 204, 0.521) solid;
        }
        > div:last-child {
            border-right: 1px rgba(204, 204, 204, 0.521) solid;
        }
    }
}

.fixed-top {
    position: absolute;
    width: 600px;
    max-width: 80vw;
    height: 600px;
    max-height: 80vw;
    background: #845eca;
    border-radius: 12px;
    z-index: -1;
    margin-top: -220px;
    margin-left: 100px;

    @media screen and (max-width: 500px) {
        margin-top: 0px;
    }
}
</style>

<style lang="less">
.main-body {
    position: relative;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 20px;
    padding-right: 20px;
}

.header-container {
    height: 100vh;
    width: 100%;
    margin-left: auto;
    margin-right: auto;

    .header {
        padding-top: 50px;
        text-transform: uppercase;
        font-weight: bold;
        position: relative;

        a {
            color: black !important;
        }

        :hover {
            cursor: pointer;
            text-decoration: underline;
            color: black;
        }
    }
    .name {
        margin-top: 100px;
        justify-content: space-between;
        align-items: center;
        text-transform: uppercase;
        font-weight: bold;

        .title {
            font-size: 4rem !important;
        }
    }
    .features {
        margin-top: 30px;
        font-weight: bold;
        font-size: 1.3rem !important;
    }
}

.github-underline {
    position: absolute;
    bottom: -10px;
    left: 15px;
    width: 30px;
    height: 6px;
    background: white;
}
</style>

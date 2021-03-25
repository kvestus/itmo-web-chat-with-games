<template>
    <CabinetContentTemplate :subTitle="subTitle">
        123
    </CabinetContentTemplate>
</template>

<script>
import { userMixin } from '~/vuex-mixins/user.js'
export default {
    layout: 'cabinet',
    mixins: [userMixin],
    computed: {
        subTitle() {
            return `Bonjour ${this.currentUserFirstName}`
        }
    }
}
</script>

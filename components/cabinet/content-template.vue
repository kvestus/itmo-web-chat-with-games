<template>
    <div class="cabinet-lay">
        <div>{{ subTitle }}</div>
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        subTitle: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="less" scoped>
.cabinet-lay {
    .content {
        margin-top: 30px;
    }
}
</style>

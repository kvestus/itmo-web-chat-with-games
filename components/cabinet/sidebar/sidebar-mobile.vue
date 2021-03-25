<template>
    <div>
        <b-sidebar id="sidebar-1" title="Menu" body-class="sidebar" shadow>
            <CabinetSidebarContent />
        </b-sidebar>
    </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.toggle-button {
    position: absolute;
    top: 51px;
    left: 15px;
    font-size: 22px;
}

.sidebar {
    background: none !important;
    height: auto;
}
</style>

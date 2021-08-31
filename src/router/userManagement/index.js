export default [
    {
        path: 'userControl',
        name: 'userControl',
        component: () => import('@/views/userManagement/userControl.vue')
    },
    {
        path: 'adcraft',
        name: 'adcraft',
        component: () => import('@/views/userManagement/adcraft.vue')
    }
]
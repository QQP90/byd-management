export default [
  {
    path: 'projectInitiation',
    name: 'projectInitiation',
    component: () => import('@/views/schedule/projectInitiation.vue')
  },
  {
    path: 'schedulingPlan',
    name: 'schedulingPlan',
    component: () => import('@/views/schedule/schedulingPlan.vue')
  },
  {
    path: 'carManagement',
    name: 'carManagement',
    component: () => import('@/views/schedule/carManagement.vue')
  },
  {
    path: 'agentManagement',
    name: 'agentManagement',
    component: () => import('@/views/schedule/agentManagement.vue')
  },
  {
    path: 'mediaManagement',
    name: 'mediaManagement',
    component: () => import('@/views/schedule/mediaManagement.vue')
  },
  {
    path: 'messageNotification',
    name: 'messageNotification',
    component: () => import('@/views/schedule/messageNotification.vue')
  },
]
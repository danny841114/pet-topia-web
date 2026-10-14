import VendorAdminProfile from '@/views/vendor_admin/VendorAdminProfile.vue'
import VendorAdminActivity from '@/views/vendor_admin/VendorAdminActivity.vue'
import VendorAdminActivityDetail from '@/views/vendor_admin/VendorAdminActivityDetail.vue'
import VendorAdminAddActivity from '@/views/vendor_admin/VendorAdminAddActivity.vue'
import VendorAdminReview from '@/views/vendor_admin/VendorAdminReview.vue'
import VendorAdminActivityReview from '@/views/vendor_admin/VendorAdminActivityReview.vue'
import VendorAdminActivityRegistration from '@/views/vendor_admin/VendorAdminActivityRegistration.vue'
import VendorAdminCalender from '@/views/vendor_admin/VendorAdminCalender.vue'
import VendorAdminCertification from '@/views/vendor_admin/VendorAdminCertification.vue'

export default [
  {
    path: '/vendor/admin/profile',
    name: 'VendorAdminProfile',
    component: VendorAdminProfile,
    meta: {
      title: '商家資料管理 - PetTopia',
      requiresAuth: true,
      role: 'VENDOR',
    },
  },
  {
    path: '/vendor/admin/activity',
    name: 'VendorAdminActivity',
    component: VendorAdminActivity,
    meta: {
      requiresAuth: true,
      role: 'VENDOR',
    },
  },

  {
    path: '/vendor/admin/activity/detail/:id',
    name: 'VendorAdminActivityDetail',
    component: VendorAdminActivityDetail,
  },

  {
    path: '/vendor/admin/activity/add',
    name: 'VendorAdminAddActivity',
    component: VendorAdminAddActivity,
  },

  {
    path: '/vendor/admin/reviews',
    name: 'VendorAdminReview',
    component: VendorAdminReview,
  },

  {
    path: '/vendor/admin/activity/reviews',
    name: 'VendorAdminActivityReview',
    component: VendorAdminActivityReview,
  },

  {
    path: '/vendor/admin/activity/registration/:id',
    name: 'VendorAdminActivityRegistration',
    component: VendorAdminActivityRegistration,
  },

  {
    path: '/vendor/admin/calender',
    name: 'VendorAdminCalender',
    component: VendorAdminCalender,
  },

  {
    path: '/vendor/admin/certification',
    name: 'VendorAdminCertification',
    component: VendorAdminCertification,
  },
]

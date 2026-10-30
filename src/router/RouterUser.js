import Profile from '@/views/user/Profile.vue'
import VendorMember from '@/views/vendor/VendorMember.vue'
import ActivityMember from '@/views/activity/ActivityMember.vue'
import Coupons from '@/views/user/Coupons.vue'
import ChangePassword from '@/views/user/ChangePassword.vue'
import Address from '@/views/user/Address.vue'

export default [
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '會員資料 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/:section',
    name: 'ProfileSection',
    component: Profile,
    meta: {
      title: '會員中心 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/coupons',
    name: 'Coupons',
    component: Coupons,
    meta: {
      title: '我的優惠券 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/management/vendor',
    name: 'VendorManagement',
    component: VendorMember,
    meta: {
      title: '店家紀錄 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/management/activity',
    name: 'ActivityManagement',
    component: ActivityMember,
    meta: {
      title: '活動紀錄 - PetTopia',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: {
      requiresAuth: true,
      title: '更改密碼',
    },
  },
  {
    path: '/profile/address',
    name: 'Address',
    component: Address,
    meta: {
      title: '收貨地址設定 - PetTopia',
      requiresAuth: true,
    },
  },
]

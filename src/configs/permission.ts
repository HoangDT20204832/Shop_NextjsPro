export const PERMISSIONS: any = {
  ADMIN: 'ADMIN.GRANTED',
  BASIC: 'BASIC.PUBLIC',
  DASHBOARD: 'DASHBOARD',
  MANAGE_PRODUCT: {
    PRODUCT: {
      CREATE: 'MANAGE_PRODUCT.PRODUCT.CREATE',
      VIEW: 'MANAGE_PRODUCT.PRODUCT.VIEW',
      UPDATE: 'MANAGE_PRODUCT.PRODUCT.UPDATE',
      DELETE: 'MANAGE_PRODUCT.PRODUCT.DELETE'
    },
    PRODUCT_TYPE: {
      CREATE: 'MANAGE_PRODUCT.PRODUCT_TYPE.CREATE',
      UPDATE: 'MANAGE_PRODUCT.PRODUCT_TYPE.UPDATE',
      DELETE: 'MANAGE_PRODUCT.PRODUCT_TYPE.DELETE'
    }
  },
  SYSTEM: {
    USER: {
      VIEW: 'SYSTEM.USER.VIEW',
      CREATE: 'SYSTEM.USER.CREATE',
      UPDATE: 'SYSTEM.USER.UPDATE',
      DELETE: 'SYSTEM.USER.DELETE'
    },
    ROLE: {
      VIEW: 'SYSTEM.ROLE.VIEW',
      CREATE: 'SYSTEM.ROLE.CREATE',
      UPDATE: 'SYSTEM.ROLE.UPDATE',
      DELETE: 'SYSTEM.ROLE.DELETE'
    }
  },
  MANAGE_ORDER: {
    REVIEW: {
      UPDATE: 'MANAGE_ORDER.REVIEW.UPDATE',
      DELETE: 'MANAGE_ORDER.REVIEW.DELETE'
    },
    ORDER: {
      VIEW: 'MANAGE_ORDER.ORDER.VIEW',
      CREATE: 'MANAGE_ORDER.ORDER.CREATE',
      UPDATE: 'MANAGE_ORDER.ORDER.UPDATE',
      DELETE: 'MANAGE_ORDER.ORDER.DELETE'
    }
  },
  SETTING: {
    PAYMENT_TYPE: {
      CREATE: 'SETTING.PAYMENT_TYPE.CREATE',
      UPDATE: 'SETTING.PAYMENT_TYPE.UPDATE',
      DELETE: 'SETTING.PAYMENT_TYPE.DELETE'
    },
    DELIVERY_TYPE: {
      CREATE: 'SETTING.DELIVERY_TYPE.CREATE',
      UPDATE: 'SETTING.DELIVERY_TYPE.UPDATE',
      DELETE: 'SETTING.DELIVERY_TYPE.DELETE'
    },
    CITY: {
      CREATE: 'CITY.CREATE',
      UPDATE: 'CITY.UPDATE',
      DELETE: 'CITY.DELETE'
    }
  }
}

export const LIST_DATA_PERMISSIONS: any = [
  {
    id: 14,
    name: 'Dashboard',
    isParent: false,
    value: 'DASHBOARD',
    isHideCreate: true,
    isHideUpdate: true,
    isHideDelete: true
  },
  { id: 1, name: 'Manage_product', isParent: true, value: 'MANAGE_PRODUCT' },
  {
    id: 2,
    name: 'Product',
    isParent: false,
    // create : PERMISSIONS.MANAGE_PRODUCT.PRODUCT.CREATE,
    // update : PERMISSIONS.MANAGE_PRODUCT.PRODUCT.UPDATE,
    // delete : PERMISSIONS.MANAGE_PRODUCT.PRODUCT.DELETE,
    // view : PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW,
    parentValue: 'MANAGE_PRODUCT',
    value: 'PRODUCT'
  },
  {
    id: 3,
    name: 'Product_type',
    isParent: false,
    parentValue: 'MANAGE_PRODUCT',
    value: 'PRODUCT_TYPE',
    // isHideView: true
  },
  { id: 4, name: 'System', isParent: true, value: 'SYSTEM' },
  {
    id: 5,
    name: 'User',
    isParent: false,
    parentValue: 'SYSTEM',
    value: 'USER'
  },
  {
    id: 6,
    name: 'Role',
    isParent: false,
    parentValue: 'SYSTEM',
    value: 'ROLE'
  },
  { id: 7, name: 'Manage_order', isParent: true, value: 'MANAGE_ORDER' },
  {
    id: 8,
    name: 'Review',
    isParent: false,
    parentValue: 'MANAGE_ORDER',
    value: 'REVIEW',
    isHideView: true,
    isHideCreate: true
  },
  {
    id: 9,
    name: 'Order',
    isParent: false,
    parentValue: 'MANAGE_ORDER',
    value: 'ORDER'
  },
  { id: 10, name: 'Setting', isParent: true, value: 'SETTING' },
  {
    id: 11,
    name: 'Payment_type',
    isParent: false,
    parentValue: 'SETTING',
    value: 'PAYMENT_TYPE',
    isHideView: true
  },
  {
    id: 12,
    name: 'Delivery_type',
    isParent: false,
    parentValue: 'SETTING',
    value: 'DELIVERY_TYPE',
    isHideView: true
  },
  {
    id: 13,
    name: 'City',
    isParent: false,
    parentValue: 'SETTING',
    value: 'CITY',
    isHideView: true
  }
]

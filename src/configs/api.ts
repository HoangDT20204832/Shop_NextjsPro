// const BASE_URL = process.env.APP_API_URL
export const BASE_URL = process.env.NEXT_PUBLIC_API_HOST

export const API_ENDPOINT = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`
  },
  SYSTEM: {
    ROLE: {
      INDEX: `${BASE_URL}/roles`
    },
    USER: {
      INDEX: `${BASE_URL}/users`
    },
  },
  SETTING: {
    CITY: {
      INDEX: `${BASE_URL}/city`
    },
    DELIVERY_TYPE: {
      INDEX: `${BASE_URL}/delivery-type`
    },
    PAYMENT_TYPE: {
      INDEX: `${BASE_URL}/payment-type`
    }
  },
  MANAGE_PRODUCT: {
    PRODUCT_TYPE: {
      INDEX: `${BASE_URL}/product-types`
    },
    PRODUCT: {
      INDEX: `${BASE_URL}/products`
    },
  },
  MANAGE_ORDER: {
    ORDER: {
      INDEX: `${BASE_URL}/orders`
    },
    REVIEW: {
      INDEX: `${BASE_URL}/reviews`
    }
  },
  PAYMENT: {
    VN_PAY: {
      INDEX: `${BASE_URL}/payment/vnpay`
    }
  }
  
}

// src/utils/mock.ts
import type { License } from '@/types'

/**
 * @description Generates a fake license object that mimics a valid "Pro" license.
 * This is used for the bypass feature to enable Pro features persistently.
 * @returns {License} A mock License object.
 */
export const getFakeProLicense = (): License => {
  return {
    valid: true,
    license_key: {
      status: 'active',
      //@ts-ignore
      expires_at: '2099-12-31T23:59:59Z', // A far future expiration date.
      activation_limit: 999,
      activation_usage: 1,
      test_mode: false,
      created_at: new Date().toISOString(),
      id: 0,
    },
    instance: {
      id: 'bypass-instance',
      name: 'Bypass User',
      createt_at: new Date(),
    },
    meta: {
      store_id: 0,
      product_id: 0,
      order_id: 0,
      order_item_id: 0,
      customer_id: 0,
      customer_name: 'Bypass User',
      customer_email: 'bypass@example.com',
      variant_id: 0,
      variant_name: 'Pro (Bypassed)',
    },
  }
}

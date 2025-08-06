import type { Status } from '@/constants'

export interface Response<T> {
  status: keyof typeof Status | string
  data?: T | null
  error?: string | null
}

interface LicenseInstance {
  createt_at: Date
  id: string
  name: string
}

interface LicenseKey {
  activation_limit: number
  activation_usage: number
  create_at: Date
  expires_at: Date
  id: number
  status: string
  test_mode: boolean
}

interface LicenseMeta {
  customer_email: string
  customer_id: number
  customer_name: string
  order_id: number
  order_item_id: number
  product_id: number
  store_id: number
  variant_id: number
  variant_name: string
}

export interface License {
  activated?: boolean | null
  valid?: boolean | null
  instance?: LicenseInstance | null
  license_key: LicenseKey
  meta: LicenseMeta
}

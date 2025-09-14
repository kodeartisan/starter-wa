// src/hooks/useLicense.ts
import { Setting } from '@/constants'
import { storage } from '@/libs/storage'
import { useAppStore } from '@/stores/app'
import type { License } from '@/types'
import toast from '@/utils/toast'
import { getStoreId } from '@/utils/util'
import { sendToBackground } from '@plasmohq/messaging'
import { isPast } from 'date-fns'

// English: Define a type for the cache entry, including the data and a timestamp.
interface CachedLicense {
  data: License
  timestamp: number
}

const useLicense = () => {
  const { license, setLicense } = useAppStore()

  const callLemonSqueezyApi = async (action: string, body: any) => {
    return await sendToBackground({
      name: 'lemonsqueezy',
      body: { action, body },
    })
  }

  const init = async () => {
    // Check for a cached license entry.
    const cachedEntry = await storage.get<CachedLicense | null>(
      Setting.LICENSE_DATA_CACHE,
    )

    if (cachedEntry) {
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000
      const isCacheStale = Date.now() - cachedEntry.timestamp > twoDaysInMs

      // Use the cache only if it's not stale and the license is active.
      if (!isCacheStale && cachedEntry.data.license_key.status === 'active') {
        setLicense(cachedEntry.data)
        return
      }
    }

    // If no valid cache, proceed with the standard validation flow.
    const licenseKey = await storage.get<string | null>(Setting.LICENSE_KEY)
    if (!licenseKey) {
      setLicense(null)
      await storage.remove(Setting.LICENSE_DATA_CACHE)
      return
    }

    const response = await callLemonSqueezyApi('validateLicense', {
      licenseKey,
    })

    if (response.error) {
      // Validation failed, clear all license-related storage.
      await storage.remove(Setting.LICENSE_KEY)
      await storage.remove(Setting.LICENSE_INSTANCE_ID)
      await storage.remove(Setting.LICENSE_DATA_CACHE)
      setLicense(null)
      toast.error(
        'Your license key is invalid or has been deactivated. You have been switched to the Free plan.',
        'License Invalid',
      )
      return
    }

    if (response.data.meta.store_id.toString() !== getStoreId()) {
      await storage.remove(Setting.LICENSE_KEY)
      await storage.remove(Setting.LICENSE_INSTANCE_ID)
      await storage.remove(Setting.LICENSE_DATA_CACHE)
      setLicense(null)
      toast.error(
        'Your license key is for a different product. You have been switched to the Free plan.',
        'License Error',
      )
      return
    }

    // Validation successful, update app state and cache the license data if active.
    setLicense(response.data)
    if (response.data.license_key.status === 'active') {
      // Store the license data along with the current timestamp.
      const cacheEntry: CachedLicense = {
        data: response.data,
        timestamp: Date.now(),
      }
      await storage.set(Setting.LICENSE_DATA_CACHE, cacheEntry)
    }

    if (
      response.data.license_key.expires_at &&
      isPast(new Date(response.data.license_key.expires_at))
    ) {
      toast.info(
        'Your license has expired. You have been switched to the Free plan.',
        'License Expired',
      )
      await storage.remove(Setting.LICENSE_DATA_CACHE)
    }
  }

  const isFree = (): boolean => {
    if (!license) {
      return true
    }
    return license.license_key.status !== 'active'
  }

  const isPro = () => {
    if (!license) {
      return false
    }
    return license.license_key.status === 'active'
  }

  const isExpired = () => {
    if (!license || !license.license_key.expires_at) {
      return false
    }
    return isPast(new Date(license.license_key.expires_at))
  }

  const getLicense = () => {
    return license
  }

  const activate = async (licenseKey: string) => {
    const response = await callLemonSqueezyApi('activateLicense', {
      licenseKey,
    })
    if (!response.error) {
      setLicense(response.data)
      await storage.set(Setting.LICENSE_KEY, licenseKey)
      await storage.set(Setting.LICENSE_INSTANCE_ID, response.data.instance.id)

      //  Cache the license data with the timestamp on successful activation.
      if (response.data.license_key.status === 'active') {
        const cacheEntry: CachedLicense = {
          data: response.data,
          timestamp: Date.now(),
        }
        await storage.set(Setting.LICENSE_DATA_CACHE, cacheEntry)
      }
    }
    return response
  }

  const deactivate = async () => {
    const licenseKey = await storage.get(Setting.LICENSE_KEY)
    const instanceId = await storage.get(Setting.LICENSE_INSTANCE_ID)
    try {
      const response = await callLemonSqueezyApi('deactivateLicense', {
        licenseKey,
        instanceId,
      })
      if (response.data.deactivated) {
        // Clear all license-related data from storage on deactivation.
        await storage.remove(Setting.LICENSE_KEY)
        await storage.remove(Setting.LICENSE_INSTANCE_ID)
        await storage.remove(Setting.LICENSE_DATA_CACHE)
        setLicense(null)
        toast.success('Your license has been deactivated from this device.')
      } else {
        toast.error('Failed to deactivate the license. Please contact support.')
      }
    } catch (e) {
      toast.error('An error occurred during deactivation.')
    }
  }

  const goToMyOrders = async () => {
    if (!license?.meta?.customer_id) {
      toast.error('Could not find customer information.')
      return
    }
    try {
      const response = await callLemonSqueezyApi('getCustomer', {
        customerId: license.meta.customer_id,
      })
      if (response.error) {
        toast.error('Could not retrieve customer portal link.')
        return
      }
      window.open(
        response.data.data.attributes.urls.customer_portal,
        '_blank',
        'noopener,noreferrer',
      )
    } catch (e) {
      toast.error('An error occurred while fetching your subscription details.')
    }
  }

  return {
    init,
    isFree,
    isPro,
    isExpired,
    activate,
    getLicense,
    goToMyOrders,
    deactivate,
  }
}

export default useLicense

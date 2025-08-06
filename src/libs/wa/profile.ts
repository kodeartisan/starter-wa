import { Action } from '@/constants'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'
import type { BusinessProfileModel } from '@wppconnect/wa-js/dist/whatsapp'

/**
 * Update your business profile
 *
 * @example
 * ```javascript
 * await wa.profile.editBusinessProfile({description: 'New description for profile'});
 * ```
 *
 * ```javascript
 * await wa.profile.editBusinessProfile({categories: {
    id: "133436743388217",
    localized_display_name: "Artes e entretenimento",
    not_a_biz: false,
  }});
 * ```
 *
 * ```javascript
 * await wa.profile.editBusinessProfile({adress: 'Street 01, New York'});
 * ```
 *
 * ```javascript
 * await wa.profile.editBusinessProfile({adress: 'Street 01, New York'});
 * ```
 * 
 * ```javascript
 * await wa.profile.editBusinessProfile({email: 'test@test.com.br'});
 * ```
 * 
 * Change website of profile (max 2 sites)
 * ```javascript
 * await wa.profile.editBusinessProfile({website: [
  "https://www.wppconnect.io",
  "https://www.teste2.com.br",
]});
 * ```
 * 
 * Change businessHours for Specific Hours
 * ```javascript
 * await wa.profile.editBusinessProfile({ businessHours: { 
 * {
      tue: {
        mode: "specific_hours",
        hours: [
          [
            540,
            1080,
          ],
        ],
      },
      wed: {
        mode: "specific_hours",
        hours: [
          [
            540,
            1080,
          ],
        ],
      },
      thu: {
        mode: "specific_hours",
        hours: [
          [
            540,
            1080,
          ],
        ],
      },
      fri: {
        mode: "specific_hours",
        hours: [
          [
            540,
            1080,
          ],
        ],
      },
      sat: {
        mode: "specific_hours",
        hours: [
          [
            540,
            1080,
          ],
        ],
      },
      sun: {
        mode: "specific_hours",
        hours: [
          [
            540,
            1080,
          ],
        ],
      },
    }
  },
  timezone: "America/Sao_Paulo"
  });
 *
 * Change businessHours for Always Opened
 * ```javascript
 * await wa.profile.editBusinessProfile({ businessHours: { 
    {
      mon: {
        mode: "open_24h",
      },
      tue: {
        mode: "open_24h",
      },
      wed: {
        mode: "open_24h",
      },
      thu: {
        mode: "open_24h",
      },
      fri: {
        mode: "open_24h",
      },
      sat: {
        mode: "open_24h",
      },
      sun: {
        mode: "open_24h",
      },
    }
    timezone: "America/Sao_Paulo"
  });
 *
 * Change businessHours for Appointment Only
 * ```javascript
 * await wa.profile.editBusinessProfile({ businessHours: { {
    mon: {
      mode: "appointment_only",
    },
    tue: {
      mode: "appointment_only",
    },
    wed: {
      mode: "appointment_only",
    },
    thu: {
      mode: "appointment_only",
    },
    fri: {
      mode: "appointment_only",
    },
    sat: {
      mode: "appointment_only",
    },
    sun: {
      mode: "appointment_only",
    },
  }
    timezone: "America/Sao_Paulo"
  });
 *
 *
 */
export const editBusinessProfile = async (
  params: BusinessProfileModel,
): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Profile.EDIT_BUSINESS_PROFILE,
    body: params,
  })
}

/**
 * Get your current profile name
 *
 * @example
 * ```javascript
 * const myProfileName = wa.profile.getMyProfileName();
 * ```
 */
export const getMyProfileName = async (): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Profile.GET_MY_PROFILE_NAME,
    body: {},
  })
}

/**
 * Get your current profile picture
 *
 * @example
 * ```javascript
 * await wa.profile.getMyProfilePicture();
 * ```
 */
export const getMyProfilePicture = async (): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Profile.GET_MY_PROFILE_PICTURE,
    body: {},
  })
}

/**
 * Get your current text status
 *
 * @example
 * ```javascript
 * await wa.profile.getMyStatus();
 * ```
 */
export const getMyStatus = async (): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Profile.GET_MY_STATUS,
    body: {},
  })
}

/**
 * Return the current logged user is Bussiness or not
 *
 * @example
 * ```javascript
 * wa.profile.isBusiness();
 * ```
 */
export const isBusiness = async (): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Profile.IS_BUSINESS,
    body: {},
  })
}

/**
 * Remove your profile picture
 *
 * @example
 * ```javascript
 * await wa.profile.removeMyProfilePicture();
 * ```
 */
export const removeMyProfilePicture = async (): Promise<boolean> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Profile.REMOVE_MY_PROFILE_PICTURE,
    body: {},
  })
}

/**
 * Update your current profile name
 *
 * @example
 * ```javascript
 * await wa.profile.setMyProfileName('My new name');
 * ```
 */
export const setMyProfileName = async (name: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Profile.SET_MY_PROFILE_NAME,
    body: {},
  })
}

/**
 * Update your profile picture
 *
 * @example
 * ```javascript
 * await wa.profile.setMyProfilePicture('data:image/jpeg;base64,.....');
 * ```
 */
export const setMyProfilePicture = async (content: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Profile.SET_MY_PROFILE_PICTURE,
    body: content,
  })
}

/**
 * Update your current text status
 *
 * @example
 * ```javascript
 * await wa.profile.setMyStatus('Example text');
 * ```
 */
export const setMyStatus = async (statusText: string): Promise<any> => {
  return await sendToBackgroundViaRelay({
    //@ts-ignore
    name: Action.Profile.SET_MY_STATUS,
    body: statusText,
  })
}

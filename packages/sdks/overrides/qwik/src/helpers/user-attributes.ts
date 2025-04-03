import { noSerialize } from '@builder.io/qwik';
import { isBrowser } from '../functions/is-browser';
import { getCookieSync, setCookie } from './cookie';

export interface UserAttributes {
  [key: string]: any;
}

export const USER_ATTRIBUTES_COOKIE_NAME = 'builder.userAttributes';

// Extend the window interface so we can attach our service to it
declare global {
  interface Window {
    __USER_ATTRIBUTES_SERVICE__?: ReturnType<
      typeof createUserAttributesService
    >;
  }
}

console.log('user-attributes.ts imported');

export function createUserAttributesService() {
  console.log('createUserAttributesService called');
  let canTrack = true;
  const subscribers = new Set<(attrs: UserAttributes) => void>();

  return {
    setUserAttributes(newAttrs: UserAttributes) {
      if (!isBrowser()) {
        return;
      }
      const userAttributes: UserAttributes = {
        ...this.getUserAttributes(),
        ...newAttrs,
      };
      setCookie({
        name: USER_ATTRIBUTES_COOKIE_NAME,
        value: JSON.stringify(userAttributes),
        canTrack,
      });
      console.log('setUserAttributes subscribers', subscribers);
      subscribers.forEach((callback) => callback(userAttributes));
    },

    getUserAttributes() {
      if (!isBrowser()) {
        return {};
      }
      return JSON.parse(
        getCookieSync({ name: USER_ATTRIBUTES_COOKIE_NAME, canTrack }) || '{}'
      );
    },

    subscribeOnUserAttributesChange(callback: (attrs: UserAttributes) => void) {
      console.log('subscribing', callback, subscribers);
      subscribers.add(callback);

      // Return an unsubscribe function, wrapped in noSerialize
      return noSerialize(() => {
        console.log('unsubscribing', callback, subscribers);
        subscribers.delete(callback);
      });
    },

    setCanTrack(value: boolean) {
      canTrack = value;
    },
  };
}

// Create a single service instance for SSR (per request) or re-use the global on the client.
let _userAttributesService: ReturnType<typeof createUserAttributesService>;

if (isBrowser()) {
  console.log(
    'builder.userAttributes cookie: ',
    getCookieSync({ name: USER_ATTRIBUTES_COOKIE_NAME, canTrack: true })
  );
  // On the client, re-use the existing instance if it's on window.
  if (!window.__USER_ATTRIBUTES_SERVICE__) {
    window.__USER_ATTRIBUTES_SERVICE__ = createUserAttributesService();
  }
  _userAttributesService = window.__USER_ATTRIBUTES_SERVICE__;
} else {
  // On the server, create a fresh instance (happens per request).
  _userAttributesService = createUserAttributesService();
}

export const userAttributesService = _userAttributesService;

// Helper for setting user attributes from client code
export const setClientUserAttributes = (attributes: UserAttributes) => {
  console.log('setClientUserAttributes called');
  userAttributesService.setUserAttributes(attributes);
};

console.log('userAttributesService', userAttributesService);

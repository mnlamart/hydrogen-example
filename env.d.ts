/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

// Environment variable types
// Note: Extend HydrogenEnv instead of creating a new Env interface
// to maintain compatibility with Hydrogen's type system
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_STOREFRONT_API_TOKEN: string;
      PUBLIC_STORE_DOMAIN: string;
      PUBLIC_STOREFRONT_ID: string;
      SESSION_SECRET: string;
      // Optional Customer Account API
      PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID?: string;
      PUBLIC_CUSTOMER_ACCOUNT_API_URL?: string;
    }
  }
}

export {};

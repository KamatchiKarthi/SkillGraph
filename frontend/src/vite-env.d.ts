/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

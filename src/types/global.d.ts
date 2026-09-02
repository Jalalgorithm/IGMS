declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

/** Usercentrics CMP, injected by the loader script in index.html. */
interface UsercentricsUi {
  showSecondLayer: () => void;
  showFirstLayer?: () => void;
  acceptAllConsents?: () => Promise<void>;
  denyAllConsents?: () => Promise<void>;
}

interface Window {
  UC_UI?: UsercentricsUi;
}

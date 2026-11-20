export {};

declare global {
  interface Window {
    __initGmaps: () => void;
  }
}

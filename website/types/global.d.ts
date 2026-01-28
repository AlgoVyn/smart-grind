// Global type definitions for SmartGrind application

declare global {
  interface Window {
    SmartGrind: SmartGrindGlobal;
    marked: any;
    Prism: {
      highlight: (code: string, grammar: any, language: string) => string;
      highlightAllUnder: (element: Element) => void;
    };
  }

  interface SmartGrindGlobal {
    app?: any;
    state?: any;
    data?: any;
    renderers?: any;
    api?: any;
    ui?: any;
    utils?: any;
    [key: string]: any;
  }

  interface ImportMetaEnv {
    readonly VITE_API_BASE?: string;
    [key: string]: any;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  const marked: any;
  const Prism: any;
}

export {};
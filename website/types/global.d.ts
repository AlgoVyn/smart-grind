// Global type definitions for SmartGrind application

// Type definitions for external libraries
interface MarkedOptions {
    gfm?: boolean;
    breaks?: boolean;
    headerIds?: boolean;
    mangle?: boolean;
    sanitize?: boolean;
    smartLists?: boolean;
    smartypants?: boolean;
    xhtml?: boolean;
}

interface MarkedStatic {
    parse: (markdown: string, options?: MarkedOptions) => string;
    parseInline: (markdown: string, options?: MarkedOptions) => string;
    setOptions: (options: MarkedOptions) => void;
    use: (...extensions: unknown[]) => void;
    Renderer: new () => MarkedRenderer;
    Lexer: new () => MarkedLexer;
    Tokenizer: new () => MarkedTokenizer;
    Slugger: new () => MarkedSlugger;
}

interface MarkedRenderer {
    code: (code: string, language: string | undefined, escaped: boolean) => string;
    blockquote: (quote: string) => string;
    html: (html: string) => string;
    heading: (text: string, level: number, raw: string, slugger: MarkedSlugger) => string;
    hr: () => string;
    list: (body: string, ordered: boolean, start: number) => string;
    listitem: (text: string) => string;
    checkbox: (checked: boolean) => string;
    paragraph: (text: string) => string;
    table: (header: string, body: string) => string;
    tablerow: (content: string) => string;
    tablecell: (
        content: string,
        flags: { header: boolean; align: 'center' | 'left' | 'right' | null }
    ) => string;
    strong: (text: string) => string;
    em: (text: string) => string;
    codespan: (code: string) => string;
    br: () => string;
    del: (text: string) => string;
    link: (href: string, title: string | null, text: string) => string;
    image: (href: string, title: string | null, text: string) => string;
    text: (text: string) => string;
}

interface MarkedLexer {
    lex: (src: string) => MarkedToken[];
}

interface MarkedTokenizer {
    [key: string]: (src: string) => MarkedToken | undefined;
}

interface MarkedSlugger {
    slug: (value: string, options?: { dryrun?: boolean }) => string;
}

type MarkedToken = {
    type: string;
    raw: string;
    [key: string]: unknown;
};

interface PrismGrammar {
    [key: string]: unknown;
}

interface PrismStatic {
    highlight: (code: string, grammar: PrismGrammar, language: string) => string;
    highlightAllUnder: (element: Element) => void;
    languages: Record<string, PrismGrammar>;
}

// Import types from application modules
import type { state as StateType } from '../src/state';
import type { data as DataType } from '../src/data';
import type { api as ApiType } from '../src/api';
import type { renderers as RenderersType } from '../src/renderers';
import type { utils as UtilsType } from '../src/utils';
import type { app as AppType } from '../src/app';

declare global {
    interface Window {
        SmartGrind: SmartGrindGlobal;
        marked: MarkedStatic;
        Prism: PrismStatic;
        VITE_BASE_URL?: string;
        scrollToReview: () => void;
    }

    interface SmartGrindGlobal {
        app?: typeof AppType;
        state?: typeof StateType;
        data?: typeof DataType;
        renderers?: typeof RenderersType;
        api?: typeof ApiType;
        ui?: Record<string, unknown>;
        utils?: typeof UtilsType;
        GOOGLE_BUTTON_HTML?: string;
        [key: string]: unknown;
    }

    interface ImportMetaEnv {
        readonly VITE_API_BASE?: string;
        readonly VITE_GOOGLE_CLIENT_ID?: string;
        readonly MODE: 'development' | 'production';
        readonly DEV: boolean;
        readonly PROD: boolean;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }

    // Cloudflare Workers KV Namespace type
    interface KVNamespace {
        get(
            key: string,
            options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }
        ): Promise<string | null>;
        put(
            key: string,
            value: string | ArrayBuffer | ReadableStream,
            options?: { expiration?: number; expirationTtl?: number }
        ): Promise<void>;
        delete(key: string): Promise<void>;
        list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
            keys: { name: string; expiration?: number }[];
            list_complete: boolean;
            cursor?: string;
        }>;
    }

    const marked: MarkedStatic;
    const Prism: PrismStatic;
}

export {};

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
    parse: (_markdown: string, _options?: MarkedOptions) => string;
    parseInline: (_markdown: string, _options?: MarkedOptions) => string;
    setOptions: (_options: MarkedOptions) => void;
    use: (..._extensions: unknown[]) => void;
    Renderer: new () => MarkedRenderer;
    Lexer: new () => MarkedLexer;
    Tokenizer: new () => MarkedTokenizer;
    Slugger: new () => MarkedSlugger;
}

interface MarkedRenderer {
    code: (_code: string, _language: string | undefined, _escaped: boolean) => string;
    blockquote: (_quote: string) => string;
    html: (_html: string) => string;
    heading: (_text: string, _level: number, _raw: string, _slugger: MarkedSlugger) => string;
    hr: () => string;
    list: (_body: string, _ordered: boolean, _start: number) => string;
    listitem: (_text: string) => string;
    checkbox: (_checked: boolean) => string;
    paragraph: (_text: string) => string;
    table: (_header: string, _body: string) => string;
    tablerow: (_content: string) => string;
    tablecell: (
        _content: string,
        _flags: { header: boolean; align: 'center' | 'left' | 'right' | null }
    ) => string;
    strong: (_text: string) => string;
    em: (_text: string) => string;
    codespan: (_code: string) => string;
    br: () => string;
    del: (_text: string) => string;
    link: (_href: string, _title: string | null, _text: string) => string;
    image: (_href: string, _title: string | null, _text: string) => string;
    text: (_text: string) => string;
}

interface MarkedLexer {
    lex: (_src: string) => MarkedToken[];
}

interface MarkedTokenizer {
    [_key: string]: (_src: string) => MarkedToken | undefined;
}

interface MarkedSlugger {
    slug: (_value: string, _options?: { dryrun?: boolean }) => string;
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
    highlight: (_code: string, _grammar: PrismGrammar, _language: string) => string;
    highlightAllUnder: (_element: Element) => void;
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
            _key: string,
            _options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }
        ): Promise<string | null>;
        put(
            _key: string,
            _value: string | ArrayBuffer | ReadableStream,
            _options?: { expiration?: number; expirationTtl?: number }
        ): Promise<void>;
        delete(_key: string): Promise<void>;
        list(_options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
            keys: { name: string; expiration?: number }[];
            list_complete: boolean;
            cursor?: string;
        }>;
    }

    const marked: MarkedStatic;
    const Prism: PrismStatic;
}

export {};

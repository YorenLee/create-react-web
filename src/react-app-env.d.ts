// / <reference types="react-scripts" />
declare module '*.module.less' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

interface ViewTransition {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
}

interface Document {
    startViewTransition?(callback: () => void): ViewTransition;
}

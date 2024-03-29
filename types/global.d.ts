type GTagEvent = 'config' | 'event';

interface Window {
  gtag: (type: GTagEvent, action: string, params?: GAEventParams | { page_path: string }) => void;
}

type GAEventParams = {
    category?: string;
    label?: string;
    value?: number;
    // ... any other specific fields you expect ...
}

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}
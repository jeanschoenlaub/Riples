interface Window {
    gtag: any;  // You can make this more specific if needed
  }
  
  type GAEventParams = {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;  // This allows other properties too
  }
  
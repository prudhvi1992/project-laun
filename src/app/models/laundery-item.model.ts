export interface LaundryItem {
    _id?: string;
    name: string;
    category: string;
    basePrice: number;
    description?: string;
    estimatedTime?: string;
    active: boolean;
  }
export interface Order {
  _id: string;
  orderId: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: 'pending' | 'washing' | 'ready' | 'completed';
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  type: string;
  imageUrl: string;
  quantity: number;
  pricePerItem: number;
}
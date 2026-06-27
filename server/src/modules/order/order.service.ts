import { Injectable } from '@nestjs/common';

export interface OrderItem {
  dishId: number;
  dishName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  tableNo: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'served' | 'completed';
  remark: string;
  createdAt: string;
}

let idCounter = 1;
const orders: Order[] = [];

@Injectable()
export class OrderService {
  createOrder(data: { tableNo: string; items: OrderItem[]; remark?: string }): Order {
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order: Order = {
      id: idCounter++,
      tableNo: data.tableNo || 'A01',
      items: data.items,
      totalAmount,
      status: 'pending',
      remark: data.remark || '',
      createdAt: new Date().toISOString(),
    };

    orders.unshift(order);
    return order;
  }

  getOrders(): Order[] {
    return orders;
  }

  getOrderById(id: number): Order | undefined {
    return orders.find((o) => o.id === id);
  }

  updateOrderStatus(id: number, status: Order['status']): Order | null {
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  }
}
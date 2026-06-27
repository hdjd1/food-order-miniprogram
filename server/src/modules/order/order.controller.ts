import { Controller, Get, Post, Body, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { OrderService, Order } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() body: { tableNo: string; items: { dishId: number; dishName: string; price: number; quantity: number }[]; remark?: string }) {
    const order = this.orderService.createOrder(body);
    return {
      code: 200,
      message: '下单成功',
      data: order,
    };
  }

  @Get()
  findAll() {
    return {
      code: 200,
      message: 'success',
      data: this.orderService.getOrders(),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const order = this.orderService.getOrderById(id);
    return {
      code: 200,
      message: 'success',
      data: order || null,
    };
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: Order['status'] },
  ) {
    const order = this.orderService.updateOrderStatus(id, body.status);
    if (!order) {
      return { code: 404, message: '订单不存在', data: null };
    }
    return {
      code: 200,
      message: '状态更新成功',
      data: order,
    };
  }
}
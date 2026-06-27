import { Controller, Get, Param, Query } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('categories')
  getCategories() {
    return {
      code: 200,
      message: 'success',
      data: this.menuService.getCategories(),
    };
  }

  @Get('dishes')
  getDishes(@Query('categoryId') categoryId?: string) {
    const data = categoryId
      ? this.menuService.getDishes(Number(categoryId))
      : this.menuService.getDishes();
    return {
      code: 200,
      message: 'success',
      data,
    };
  }

  @Get('dishes/recommended')
  getRecommended() {
    return {
      code: 200,
      message: 'success',
      data: this.menuService.getRecommendedDishes(),
    };
  }

  @Get('dishes/:id')
  getDishById(@Param('id') id: string) {
    const dish = this.menuService.getDishById(Number(id));
    return {
      code: 200,
      message: 'success',
      data: dish || null,
    };
  }
}
import { Injectable } from '@nestjs/common';

export interface Category {
  id: number;
  name: string;
  icon: string;
  sort: number;
}

export interface Dish {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  image: string;
  description: string;
  isRecommended: boolean;
  salesCount: number;
}

// 模拟数据 - 饭店菜单
const categories: Category[] = [
  { id: 1, name: '招牌推荐', icon: '⭐', sort: 0 },
  { id: 2, name: '热菜', icon: '🔥', sort: 1 },
  { id: 3, name: '凉菜', icon: '🥗', sort: 2 },
  { id: 4, name: '主食', icon: '🍚', sort: 3 },
  { id: 5, name: '汤品', icon: '🍲', sort: 4 },
  { id: 6, name: '饮品', icon: '🥤', sort: 5 },
  { id: 7, name: '甜品', icon: '🍰', sort: 6 },
];

const dishes: Dish[] = [
  // 招牌推荐
  { id: 1, categoryId: 1, name: '秘制红烧肉', price: 68, image: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?w=400&h=300&fit=crop', description: '精选五花肉，文火慢炖4小时，入口即化', isRecommended: true, salesCount: 286 },
  { id: 2, categoryId: 1, name: '香辣水煮鱼', price: 88, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400&h=300&fit=crop', description: '鲜活草鱼，麻辣鲜香，嫩滑可口', isRecommended: true, salesCount: 219 },
  { id: 3, categoryId: 1, name: '金牌蒜香骨', price: 78, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', description: '精选肋排，蒜香浓郁，外酥里嫩', isRecommended: true, salesCount: 198 },
  // 热菜
  { id: 4, categoryId: 2, name: '宫保鸡丁', price: 48, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', description: '鸡胸肉配花生米，酸甜微辣', isRecommended: false, salesCount: 156 },
  { id: 5, categoryId: 2, name: '鱼香肉丝', price: 42, image: 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400&h=300&fit=crop', description: '经典川菜，酸甜适口', isRecommended: false, salesCount: 143 },
  { id: 6, categoryId: 2, name: '干锅手撕包菜', price: 36, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop', description: '包菜与五花肉同炒，锅气十足', isRecommended: false, salesCount: 132 },
  { id: 7, categoryId: 2, name: '辣子鸡', price: 52, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop', description: '干辣椒炒制，麻辣鲜香', isRecommended: false, salesCount: 118 },
  { id: 8, categoryId: 2, name: '回锅肉', price: 46, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', description: '五花肉配蒜苗，肥而不腻', isRecommended: false, salesCount: 105 },
  // 凉菜
  { id: 9, categoryId: 3, name: '凉拌黄瓜', price: 18, image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop', description: '爽脆可口，开胃解腻', isRecommended: false, salesCount: 210 },
  { id: 10, categoryId: 3, name: '口水鸡', price: 32, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop', description: '红油浇淋，麻辣鲜香', isRecommended: false, salesCount: 167 },
  { id: 11, categoryId: 3, name: '皮蛋豆腐', price: 22, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop', description: '冰镇嫩豆腐配松花蛋', isRecommended: false, salesCount: 145 },
  { id: 12, categoryId: 3, name: '夫妻肺片', price: 35, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', description: '牛杂卤制，麻辣红油', isRecommended: false, salesCount: 98 },
  // 主食
  { id: 13, categoryId: 4, name: '五常大米饭', price: 5, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop', description: '东北五常大米，粒粒饱满', isRecommended: false, salesCount: 532 },
  { id: 14, categoryId: 4, name: '蛋炒饭', price: 18, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', description: '粒粒分明，蛋香四溢', isRecommended: false, salesCount: 89 },
  { id: 15, categoryId: 4, name: '葱油拌面', price: 16, image: 'https://images.unsplash.com/photo-1552611052-33e04de1b100?w=400&h=300&fit=crop', description: '葱香浓郁，简单美味', isRecommended: false, salesCount: 76 },
  { id: 16, categoryId: 4, name: '手工水饺（12只）', price: 28, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop', description: '鲜肉馅，手工包制', isRecommended: false, salesCount: 123 },
  // 汤品
  { id: 17, categoryId: 5, name: '紫菜蛋花汤', price: 12, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', description: '清淡鲜美，家常味道', isRecommended: false, salesCount: 201 },
  { id: 18, categoryId: 5, name: '酸辣汤', price: 16, image: 'https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=400&h=300&fit=crop', description: '酸辣适口，开胃暖身', isRecommended: false, salesCount: 88 },
  { id: 19, categoryId: 5, name: '冬瓜排骨汤', price: 38, image: 'https://images.unsplash.com/photo-1602872030212-64d3f3d1e47c?w=400&h=300&fit=crop', description: '慢火熬制，汤色奶白', isRecommended: false, salesCount: 67 },
  // 饮品
  { id: 20, categoryId: 6, name: '冰镇酸梅汤', price: 8, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop', description: '自熬酸梅汤，冰爽解暑', isRecommended: false, salesCount: 312 },
  { id: 21, categoryId: 6, name: '鲜榨橙汁', price: 18, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop', description: '新鲜橙子现榨', isRecommended: false, salesCount: 156 },
  { id: 22, categoryId: 6, name: '王老吉', price: 6, image: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=400&h=300&fit=crop', description: '怕上火喝王老吉', isRecommended: false, salesCount: 245 },
  { id: 23, categoryId: 6, name: '可乐', price: 5, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop', description: '冰镇可乐', isRecommended: false, salesCount: 189 },
  // 甜品
  { id: 24, categoryId: 7, name: '红糖糍粑', price: 22, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop', description: '外酥里糯，红糖甜蜜', isRecommended: false, salesCount: 134 },
  { id: 25, categoryId: 7, name: '芒果布丁', price: 16, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop', description: '新鲜芒果制作，滑嫩爽口', isRecommended: false, salesCount: 98 },
];

@Injectable()
export class MenuService {
  getCategories(): Category[] {
    return categories.sort((a, b) => a.sort - b.sort);
  }

  getDishes(categoryId?: number): Dish[] {
    if (categoryId) {
      return dishes.filter((d) => d.categoryId === categoryId);
    }
    return dishes;
  }

  getDishById(id: number): Dish | undefined {
    return dishes.find((d) => d.id === id);
  }

  getRecommendedDishes(): Dish[] {
    return dishes.filter((d) => d.isRecommended);
  }
}
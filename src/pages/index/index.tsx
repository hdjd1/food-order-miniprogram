import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import { useCartStore, CartItem } from '@/stores/cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react-taro'
import './index.css'

interface Category {
  id: number
  name: string
  icon: string
}

interface Dish {
  id: number
  categoryId: number
  name: string
  price: number
  image: string
  description: string
  isRecommended: boolean
  salesCount: number
}

const IndexPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [activeCategory, setActiveCategory] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [showCart, setShowCart] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [remark, setRemark] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { items, tableNo, addItem, updateQuantity, clearCart, totalCount, totalAmount } = useCartStore()

  useLoad(async () => {
    try {
      setLoading(true)
      const [catRes, dishRes] = await Promise.all([
        Network.request({ url: '/api/menu/categories' }),
        Network.request({ url: '/api/menu/dishes' }),
      ])
      const catData = (catRes.data as any)?.data || []
      const dishData = (dishRes.data as any)?.data || []
      setCategories(catData)
      setDishes(dishData)
      if (catData.length > 0) {
        setActiveCategory(catData[0].id)
      }
    } catch (err) {
      console.error('加载菜单失败', err)
      Taro.showToast({ title: '加载菜单失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  })

  const filteredDishes = dishes.filter(
    (d) => d.categoryId === activeCategory,
  )

  const currentCategory = categories.find((c) => c.id === activeCategory)

  const handleAddItem = (dish: Dish) => {
    addItem({ id: dish.id, name: dish.name, price: dish.price, image: dish.image })
  }

  const handleSubmitOrder = async () => {
    if (items.length === 0) return
    setSubmitting(true)
    try {
      const orderItems = items.map((item) => ({
        dishId: item.dishId,
        dishName: item.dishName,
        price: item.price,
        quantity: item.quantity,
      }))
      const res = await Network.request({
        url: '/api/orders',
        method: 'POST',
        data: { tableNo, items: orderItems, remark },
      })
      console.log('下单响应', res.data)
      clearCart()
      setShowConfirm(false)
      setRemark('')
      Taro.showToast({ title: '下单成功！', icon: 'success' })
    } catch (err) {
      console.error('下单失败', err)
      Taro.showToast({ title: '下单失败，请重试', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  const goToOrders = () => {
    Taro.navigateTo({ url: '/pages/orders/index' })
  }

  // 购物车底部面板
  const renderCartPanel = () => {
    const count = totalCount()
    const amount = totalAmount()
    if (count === 0) return null

    return (
      <>
        {/* 遮罩层 */}
        {showCart && (
          <View
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setShowCart(false)}
          />
        )}

        {/* 购物车抽屉 */}
        {showCart && (
          <View
            className="fixed z-50 left-0 right-0 bg-white rounded-t-2xl shadow-lg"
            style={{ bottom: 50, maxHeight: '60vh' }}
          >
            <View className="flex items-center justify-between px-4 py-3">
              <View className="flex items-center gap-2">
                <Text className="block text-base font-bold text-gray-900">购物车</Text>
                <Text className="block text-xs text-gray-500">
                  桌号 {tableNo}
                </Text>
              </View>
              <View className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500"
                  onClick={() => {
                    clearCart()
                    setShowCart(false)
                  }}
                >
                  <Trash2 size={14} color="#8c8c8c" />
                  <Text className="block text-xs text-gray-500 ml-1">清空</Text>
                </Button>
                <X size={18} color="#8c8c8c" onClick={() => setShowCart(false)} />
              </View>
            </View>

            <Separator />

            <ScrollView className="max-h-64" scrollY>
              {items.map((item: CartItem) => (
                <View
                  key={item.dishId}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <View className="flex-1 mr-3">
                    <Text className="block text-sm font-medium text-gray-900">
                      {item.dishName}
                    </Text>
                    <Text className="block text-sm font-bold text-red-600 mt-1">
                      ¥{item.price}
                    </Text>
                  </View>
                  <View className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-7 h-7 rounded-full"
                      onClick={() => updateQuantity(item.dishId, -1)}
                    >
                      <Minus size={14} color="#e84c3d" />
                    </Button>
                    <Text className="block w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </Text>
                    <Button
                      variant="default"
                      size="icon"
                      className="w-7 h-7 rounded-full"
                      onClick={() =>
                        addItem({
                          id: item.dishId,
                          name: item.dishName,
                          price: item.price,
                          image: item.image,
                        })
                      }
                    >
                      <Plus size={14} color="white" />
                    </Button>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View className="px-4 py-3 border-t border-gray-100">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
                onClick={() => setShowConfirm(true)}
              >
                <Text className="block font-bold text-base">
                  去下单 ¥{amount.toFixed(2)}
                </Text>
              </Button>
            </View>
          </View>
        )}

        {/* 底部购物车栏 */}
        <View
          className="fixed left-0 right-0 z-30"
          style={{ bottom: 0 }}
          onClick={() => setShowCart(true)}
        >
          <View className="mx-3 mb-3 bg-red-600 rounded-full flex items-center justify-between px-2 py-1 shadow-lg">
            <View className="flex items-center gap-2">
              <View className="relative">
                <View className="bg-white rounded-full p-2">
                  <ShoppingCart size={22} color="#e84c3d" />
                </View>
                <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white border-0 min-w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {count > 99 ? '99+' : count}
                </Badge>
              </View>
              <Text className="block text-white font-bold text-lg ml-1">
                ¥{amount.toFixed(2)}
              </Text>
            </View>
            <Button
              className="bg-white text-red-600 font-bold rounded-full px-6"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowConfirm(true)
              }}
            >
              去下单
            </Button>
          </View>
        </View>
      </>
    )
  }

  // 下单确认弹窗
  const renderConfirmDialog = () => {
    if (!showConfirm) return null
    return (
      <>
        <View
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}
          onClick={() => setShowConfirm(false)}
        />
        <View className="fixed left-4 right-4 top-1/3 z-50 bg-white rounded-2xl p-5 shadow-xl">
          <Text className="block text-lg font-bold text-gray-900 mb-3 text-center">
            确认下单
          </Text>
          <Text className="block text-sm text-gray-500 mb-2">
            桌号：{tableNo}
          </Text>

          {/* 订单项预览 */}
          {items.map((item) => (
            <View
              key={item.dishId}
              className="flex justify-between py-1"
            >
              <Text className="block text-sm text-gray-700">
                {item.dishName} × {item.quantity}
              </Text>
              <Text className="block text-sm text-gray-700">
                ¥{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <Separator className="my-3" />

          <View className="flex justify-between mb-4">
            <Text className="block text-base font-bold text-gray-900">合计</Text>
            <Text className="block text-lg font-bold text-red-600">
              ¥{totalAmount().toFixed(2)}
            </Text>
          </View>

          {/* 备注输入 */}
          <View className="bg-gray-50 rounded-xl px-3 py-2 mb-4">
            <input
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
              placeholder="口味要求、备注..."
              value={remark}
              onChange={(e) => setRemark((e as any).detail?.value || (e as any).target?.value || '')}
            />
          </View>

          <View className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowConfirm(false)}
            >
              取消
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={submitting}
              onClick={handleSubmitOrder}
            >
              {submitting ? '提交中...' : `确认下单 ¥${totalAmount().toFixed(2)}`}
            </Button>
          </View>
        </View>
      </>
    )
  }

  return (
    <View className="h-full flex flex-col bg-amber-50">
      {/* 顶部标题栏 */}
      <View className="bg-white px-4 pt-3 pb-2">
        <View className="flex items-center justify-between">
          <View>
            <Text className="block text-xl font-bold text-gray-900">味鲜阁</Text>
            <Text className="block text-xs text-gray-500 mt-1">
              桌号 {tableNo} · 扫码点单
            </Text>
          </View>
          <View className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goToOrders}>
              <Text className="block text-sm text-red-600">我的订单</Text>
            </Button>
          </View>
        </View>
      </View>

      {/* 分类标签 */}
      <View className="bg-white px-4 pb-2">
        <ScrollView className="flex-nowrap" scrollX>
          <View className="flex gap-2 pb-1">
            {categories.map((cat) => (
              <View
                key={cat.id}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Text className="block text-sm font-medium">
                  {cat.icon} {cat.name}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 菜品列表 */}
      <ScrollView className="flex-1 px-4 pt-3 pb-4" scrollY>
        {/* 分类标题 */}
        <View className="mb-3">
          <Text className="block text-base font-bold text-gray-900">
            {currentCategory?.icon} {currentCategory?.name}
          </Text>
          <Text className="block text-xs text-gray-500 mt-1">
            共 {filteredDishes.length} 道菜品
          </Text>
        </View>

        {loading ? (
          <View className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <View key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <View className="flex gap-3">
                  <View className="w-24 h-24 bg-gray-200 rounded-xl" />
                  <View className="flex-1 gap-2">
                    <View className="h-4 bg-gray-200 rounded w-24" />
                    <View className="h-3 bg-gray-200 rounded w-full mt-2" />
                    <View className="h-3 bg-gray-200 rounded w-3/4 mt-1" />
                    <View className="h-5 bg-gray-200 rounded w-16 mt-2" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex flex-col gap-3">
            {filteredDishes.map((dish) => {
              const cartItem = items.find((i) => i.dishId === dish.id)
              const qty = cartItem?.quantity || 0
              return (
                <View
                  key={dish.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <View className="flex p-3 gap-3">
                    <Image
                      src={dish.image}
                      className="w-24 h-24 rounded-xl flex-shrink-0"
                      mode="aspectFill"
                      lazyLoad
                    />
                    <View className="flex-1 flex flex-col justify-between min-w-0">
                      <View>
                        <View className="flex items-center gap-1">
                          <Text className="block text-base font-semibold text-gray-900 truncate">
                            {dish.name}
                          </Text>
                          {dish.isRecommended && (
                            <Badge className="bg-red-100 text-red-600 border-0 text-xs px-2 py-1">
                              招牌
                            </Badge>
                          )}
                        </View>
                        <Text className="block text-xs text-gray-500 mt-1 line-clamp-2">
                          {dish.description}
                        </Text>
                        <Text className="block text-xs text-gray-400 mt-1">
                          已售 {dish.salesCount}
                        </Text>
                      </View>
                      <View className="flex items-center justify-between mt-2">
                        <Text className="block text-lg font-bold text-red-600">
                          ¥{dish.price}
                        </Text>
                        <View className="flex items-center gap-2">
                          {qty > 0 && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-7 h-7 rounded-full"
                                onClick={() => updateQuantity(dish.id, -1)}
                              >
                                <Minus size={14} color="#e84c3d" />
                              </Button>
                              <Text className="block w-5 text-center text-sm font-medium">
                                {qty}
                              </Text>
                            </>
                          )}
                          <Button
                            variant="default"
                            size="icon"
                            className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700"
                            onClick={() => handleAddItem(dish)}
                          >
                            <Plus size={16} color="white" />
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}

            {filteredDishes.length === 0 && (
              <View className="flex items-center justify-center py-16">
                <Text className="block text-gray-400 text-sm">
                  暂无菜品
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* 购物车面板 */}
      {renderCartPanel()}
      {renderConfirmDialog()}
    </View>
  )
}

export default IndexPage
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Clock, Check, ChefHat, Utensils } from 'lucide-react-taro'
import './index.css'

interface OrderItem {
  dishId: number
  dishName: string
  price: number
  quantity: number
}

interface Order {
  id: number
  tableNo: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'preparing' | 'served' | 'completed'
  remark: string
  createdAt: string
}

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: '待处理', color: 'text-orange-500', icon: Clock },
  preparing: { label: '备餐中', color: 'text-blue-500', icon: ChefHat },
  served: { label: '已上菜', color: 'text-green-500', icon: Utensils },
  completed: { label: '已完成', color: 'text-gray-400', icon: Check },
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useLoad(async () => {
    try {
      const res = await Network.request({ url: '/api/orders' })
      console.log('订单列表', res.data)
      setOrders((res.data as any)?.data || [])
    } catch (err) {
      console.error('加载订单失败', err)
      Taro.showToast({ title: '加载订单失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  })

  const goBack = () => {
    Taro.navigateBack()
  }

  const goToDetail = (id: number) => {
    Taro.navigateTo({ url: `/pages/order-detail/index?id=${id}` })
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <View className="h-full bg-amber-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-3 flex items-center gap-3">
        <ArrowLeft size={22} color="#333" onClick={goBack} />
        <Text className="block text-lg font-bold text-gray-900">我的订单</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-3" scrollY>
        {loading ? (
          <View className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <View key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <View className="h-4 bg-gray-200 rounded w-32 mb-3" />
                <View className="h-3 bg-gray-200 rounded w-full mb-2" />
                <View className="h-3 bg-gray-200 rounded w-24" />
              </View>
            ))}
          </View>
        ) : orders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="block text-4xl mb-4">📋</Text>
            <Text className="block text-gray-400 text-sm mb-1">暂无订单</Text>
            <Text className="block text-gray-400 text-xs">快去点单享受美食吧</Text>
            <Button className="mt-4 bg-red-600 text-white" size="sm" onClick={goBack}>
              返回点单
            </Button>
          </View>
        ) : (
          <View className="flex flex-col gap-3 pb-6">
            {orders.map((order) => {
              const status = statusMap[order.status] || statusMap.pending
              return (
                <Card
                  key={order.id}
                  className="rounded-2xl overflow-hidden"
                  onClick={() => goToDetail(order.id)}
                >
                  <CardContent className="p-4">
                    <View className="flex items-center justify-between mb-2">
                      <View className="flex items-center gap-2">
                        <Text className="block text-base font-bold text-gray-900">
                          订单 #{order.id}
                        </Text>
                        <Badge
                          className={`${status.color} border-0`}
                          style={{ backgroundColor: status.color.includes('text-orange') ? '#fff3e6' : status.color.includes('text-blue') ? '#eff6ff' : status.color.includes('text-green') ? '#f0fdf4' : '#f5f5f5' }}
                        >
                          {status.label}
                        </Badge>
                      </View>
                      <Text className="block text-xs text-gray-400">
                        {formatTime(order.createdAt)}
                      </Text>
                    </View>

                    <View className="flex items-center gap-1 mb-2">
                      <Text className="block text-xs text-gray-500">桌号 {order.tableNo}</Text>
                      {order.remark && (
                        <Text className="block text-xs text-gray-400 ml-2">
                          备注: {order.remark}
                        </Text>
                      )}
                    </View>

                    <Separator className="my-2" />

                    {/* 菜品摘要 */}
                    {order.items.slice(0, 3).map((item) => (
                      <View key={item.dishId} className="flex justify-between py-1">
                        <Text className="block text-sm text-gray-700">
                          {item.dishName} × {item.quantity}
                        </Text>
                        <Text className="block text-sm text-gray-700">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                    {order.items.length > 3 && (
                      <Text className="block text-xs text-gray-400 mt-1">
                        还有 {order.items.length - 3} 道菜品...
                      </Text>
                    )}

                    <Separator className="my-2" />

                    <View className="flex justify-between items-center">
                      <Text className="block text-sm text-gray-500">
                        共 {order.items.reduce((s, i) => s + i.quantity, 0)} 件
                      </Text>
                      <Text className="block text-base font-bold text-red-600">
                        ¥{order.totalAmount.toFixed(2)}
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default OrdersPage
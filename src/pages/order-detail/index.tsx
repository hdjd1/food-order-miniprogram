import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Clock, Check, ChefHat, Utensils, MapPin } from 'lucide-react-taro'
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

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: '等待处理', color: 'text-orange-500', bg: 'bg-orange-50', icon: Clock },
  preparing: { label: '正在备餐', color: 'text-blue-500', bg: 'bg-blue-50', icon: ChefHat },
  served: { label: '已上菜', color: 'text-green-500', bg: 'bg-green-50', icon: Utensils },
  completed: { label: '已完成', color: 'text-gray-400', bg: 'bg-gray-50', icon: Check },
}

const OrderDetailPage = () => {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = router.params?.id

  useLoad(async () => {
    if (!orderId) {
      Taro.showToast({ title: '订单不存在', icon: 'none' })
      return
    }
    try {
      const res = await Network.request({ url: `/api/orders/${orderId}` })
      console.log('订单详情', res.data)
      setOrder((res.data as any)?.data || null)
    } catch (err) {
      console.error('加载订单详情失败', err)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  })

  const goBack = () => Taro.navigateBack()

  const goToHome = () => Taro.reLaunch({ url: '/pages/index/index' })

  if (loading) {
    return (
      <View className="h-full bg-amber-50 flex items-center justify-center">
        <View className="animate-pulse flex flex-col items-center gap-3">
          <View className="w-16 h-16 bg-gray-200 rounded-full" />
          <View className="h-4 bg-gray-200 rounded w-32" />
        </View>
      </View>
    )
  }

  if (!order) {
    return (
      <View className="h-full bg-amber-50 flex flex-col items-center justify-center">
        <Text className="block text-4xl mb-4">🔍</Text>
        <Text className="block text-gray-400 text-sm mb-4">订单不存在</Text>
        <Button className="bg-red-600 text-white" onClick={goToHome}>
          返回首页
        </Button>
      </View>
    )
  }

  const status = statusConfig[order.status] || statusConfig.pending
  const StatusIcon = status.icon
  const totalCount = order.items.reduce((s, i) => s + i.quantity, 0)
  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <View className="h-full bg-amber-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-3 flex items-center gap-3">
        <ArrowLeft size={22} color="#333" onClick={goBack} />
        <Text className="block text-lg font-bold text-gray-900">订单详情</Text>
      </View>

      <ScrollView className="flex-1" scrollY>
        {/* 状态卡片 */}
        <View className={`mx-4 mt-4 ${status.bg} rounded-2xl p-5 flex items-center gap-3`}>
          <StatusIcon size={32} color={status.color.includes('text-orange') ? '#ff8c42' : status.color.includes('text-blue') ? '#3b82f6' : status.color.includes('text-green') ? '#52c41a' : '#999'} />
          <View>
            <Text className={`block text-lg font-bold ${status.color}`}>
              {status.label}
            </Text>
            <Text className="block text-xs text-gray-500 mt-1">
              订单号 #{order.id} · {formatTime(order.createdAt)}
            </Text>
          </View>
        </View>

        {/* 桌号信息 */}
        <Card className="mx-4 mt-3 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <MapPin size={20} color="#e84c3d" />
            <View>
              <Text className="block text-sm text-gray-500">用餐桌号</Text>
              <Text className="block text-base font-bold text-gray-900">
                {order.tableNo} 号桌
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* 菜品列表 */}
        <Card className="mx-4 mt-3 rounded-2xl">
          <CardContent className="p-4">
            <Text className="block text-base font-bold text-gray-900 mb-3">
              已点菜品 ({totalCount} 件)
            </Text>

            {order.items.map((item, idx) => (
              <View key={idx}>
                {idx > 0 && <Separator className="my-2" />}
                <View className="flex justify-between items-center py-1">
                  <View className="flex-1">
                    <Text className="block text-sm font-medium text-gray-900">
                      {item.dishName}
                    </Text>
                    <Text className="block text-xs text-gray-400 mt-1">
                      ¥{item.price} × {item.quantity}
                    </Text>
                  </View>
                  <Text className="block text-sm font-medium text-gray-900">
                    ¥{(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            <Separator className="my-3" />

            {order.remark && (
              <View className="mb-3">
                <Text className="block text-xs text-gray-500 mb-1">备注</Text>
                <Text className="block text-sm text-gray-700">{order.remark}</Text>
              </View>
            )}

            <View className="flex justify-between items-center">
              <Text className="block text-sm text-gray-500">合计</Text>
              <Text className="block text-xl font-bold text-red-600">
                ¥{order.totalAmount.toFixed(2)}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* 底部按钮 */}
        <View className="px-4 py-6">
          <Button
            className="w-full bg-red-600 text-white"
            size="lg"
            onClick={goToHome}
          >
            继续点单
          </Button>
        </View>
      </ScrollView>
    </View>
  )
}

export default OrderDetailPage
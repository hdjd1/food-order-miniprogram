export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '我的订单',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black',
    })
  : {
      navigationBarTitleText: '我的订单',
    }
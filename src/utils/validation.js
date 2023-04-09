// // form表单验证规则配置
// import { extend, localize } from 'vee-validate'
// // 导入vee所有默认规则
// import * as rules from 'vee-validate/dist/rules'
// // 导入中文语言包
// import zh from 'vee-validate/dist/locale/zh_CN'

// // 设置语言包为中文
// localize('zh', zh)
// // 设置字段映射表
// localize({
//   zh: {
//     names: {
//       phone: '手机号',
//       code: '验证码',
//       password: '密码',
//       rp_password: '确认密码',
//       agree: '协议',
//       name: '昵称'
//     },
//     messages: {
//       is: '{_field_}不一致'
//     }
//   }
// })

// // 循环rules对象 将规则添加到vee中
// Object.keys(rules).forEach(key => extend(key, rules[key]))

// // 验证手机号
// extend('phone', {
//   validate: value => /^1[356789]\d{9}$/.test(value),
//   message: '手机号格式不正确'
// })

// // 验证协议
// extend('agree', {
//   validate: value => value,
//   message: '请先勾选协议'
// })

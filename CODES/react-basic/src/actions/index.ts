

export type State = {
  /** 错误消息 */
  errorTips?: string;
  /** 用户名，用于提交之后回显（因为提交之后会重置表单） */
  username?: string;
  /** 用户名，错误消息 */
  usernameTips?: string;
  /** 手机号，用于提交之后回显（因为提交之后会重置表单） */
  phone?: string;
  /** 手机号，错误消息 */
  phoneTips?: string;
}

/**
 * 创建用户
 * @param previousState 
 * @param formData 
 * @returns 
 */
export async function createUser(previousState: State, formData: FormData) {

  console.log(`previousState: ${JSON.stringify(previousState)}`);

  // -- 获取表单数据
  const username = formData.get('username') as string;
  const phone = formData.get('phone') as string;

  
  // -- 表单校验
  if (!/^\w+$/.test(username)) {
    return { usernameTips: '用户名必须为字母、数字、下划线', username, phone } as State
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { phoneTips: '手机号格式错误', username, phone } as State
  }

  // -- 模拟请求耗时
  await new Promise(resolve => setTimeout(resolve, 1000));
  const resp = {
    code: 200,
    data: null,
    message: 'success',
  }
  if (resp.code === 200) {
    console.log('注册成功')
  }

  return { errorTips: '请求失败', username, phone } as State

}
import { useState } from 'react'


export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  // 返回两个对象：一个用于 input 属性，一个包含 reset 方法
  return {
    input: {
      type,
      value,
      onChange
    },
    reset
  }
}

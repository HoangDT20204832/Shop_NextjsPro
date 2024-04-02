import { useEffect, useRef, useState } from 'react'

// sử dụng useDounce để tạo độ trễ cập nhật giá trị value khi thay đổi giá trị value(dùng khi muốn nhập ở thanh search)
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState('')

  useEffect(() => {
    const timerRef = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(timerRef)
    }
  }, [value])

  return debouncedValue
}

export { useDebounce }

import wa from '@/libs/wa'
import { useAppStore } from '@/stores/app'

const useWa = () => {
  const { isReady, activeChat } = useAppStore()

  return {
    isReady,
    activeChat,
    ...wa,
  }
}

export default useWa

// src/hooks/useAi.ts
import { AI } from '@/constants/action'
import type { Response } from '@/types'
import { sendToBackgroundViaRelay } from '@plasmohq/messaging'

const useAi = () => {
  const rewriteMessage = async (
    prompt: string,
    message: string,
    system:
      | string
      | null = 'You are an expert copywriter. Your task is to rewrite the user message based on their instruction.',
  ): Promise<Response<string>> => {
    // Send the request to the background relay defined in `ai.relay.ts`
    return await sendToBackgroundViaRelay({
      //@ts-ignore
      name: 'ai',
      body: { prompt, message, system },
    })
  }

  return {
    rewriteMessage,
  }
}

export default useAi

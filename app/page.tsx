'use client'

import { useEffect } from 'react'
import { subscribeUserToPush } from '@/lib/pushClient'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Home() {

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      subscribeUserToPush()
    }
  }, [])

  const sendPush = async () => {
    try {
      const res = await fetch('/api/send-push', { method: 'POST' })
      if (res.ok) {
        toast.success("Event has been created")
      } else {
        toast.success("Event error")
      }
    } catch (error) {
      toast.success("Event error")
    }
  }

  return (
    <main className='p-[1rem] flex flex-col items-center justify-center min-h-[100vh] h-full gap-[2rem]'>
      <h1 className='text-[1rem] font-[600]'>Web push notification</h1>
      <Button
        className='cursor-pointer'
        variant="outline"
        onClick={sendPush}
      >
        Notification
      </Button>
    </main>
  )
}
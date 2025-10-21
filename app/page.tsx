'use client'

import { useEffect } from 'react'
import { subscribeUserToPush } from '@/lib/pushClient'

export default function Home() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      subscribeUserToPush()
    }
  }, [])

  const sendPush = async () => {
    await fetch('/api/send-push', { method: 'POST' })
  }

  // setTimeout(() => {
  //   sendPush()
  // }, 3000);

  return (
    <main style={{ padding: 40 }}>
      <h1>Web Push Notification Demo</h1>
      <button onClick={sendPush}>Send Push</button>
    </main>
  )
}

export function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export async function subscribeUserToPush() {
    if (!('serviceWorker' in navigator)) {
        console.warn('Service worker not supported')
        return
    }

    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    console.log('Service Worker registered')

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
        console.warn('Notification permission not granted')
        return
    }

    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
            console.error('Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY')
            return
        }

        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        })
        console.log('New subscription created!')
    } else {
        console.log('Already subscribed!')
    }

    try {
        const res = await fetch('/api/save-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
        })
        console.log('Subscription sent to server:', await res.json())
    } catch (err) {
        console.error('Failed to send subscription:', err)
    }
}

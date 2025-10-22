import { NextResponse } from 'next/server'
import { getSubscriptions } from '../save-subscription/route'

export const dynamic = 'force-dynamic'

export async function POST() {
    const webpush = (await import('web-push')).default

    webpush.setVapidDetails(
        process.env.VAPID_EMAIL!,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
    )

    const subs = await getSubscriptions()
    const payload = JSON.stringify({
        title: 'Notification from web push!',
        body: 'This is a test notification!'
    })

    for (const sub of subs) {
        try {
            await webpush.sendNotification(sub, payload)
        } catch (err) {
            console.error('Push failed:', err)
        }
    }

    return NextResponse.json({ sent: subs.length })
}

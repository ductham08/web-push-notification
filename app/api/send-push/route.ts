import { NextResponse } from 'next/server'
import webpush from 'web-push'
import connectDB from '@/lib/db'
import Subscription from '@/models/Subscription'

export const dynamic = 'force-dynamic'

webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

export async function POST() {
    try {
        await connectDB()

        const subs = await Subscription.find().lean()
        if (!subs.length) {
            return NextResponse.json({ success: false, message: 'No subscriptions found' }, { status: 404 })
        }

        const payload = JSON.stringify({
            title: 'Notification from web push!',
            body: 'This is a test notification!',
        })

        let sentCount = 0

        await Promise.all(
            subs.map(async (index, sub:any) => {
                try {
                    await webpush.sendNotification(sub, payload)
                    sentCount++
                } catch (err: any) {
                    console.error('Push failed:', err.message)

                    if (err.statusCode === 410 || err.statusCode === 404) {
                        await Subscription.deleteOne({ endpoint: sub.endpoint })
                        console.log(`Deleted expired subscription: ${sub.endpoint}`)
                    }
                }
            })
        )

        return NextResponse.json({ success: true, sent: sentCount })
    } catch (error: any) {
        console.error('Push error:', error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

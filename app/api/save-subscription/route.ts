import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Subscription from '@/models/Subscription'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    console.log('📩 Incoming subscription:', body?.endpoint)

    if (!body?.endpoint || !body?.keys) {
      return NextResponse.json({ success: false, message: 'Invalid subscription data' }, { status: 400 })
    }

    const exists = await Subscription.findOne({ endpoint: body.endpoint })
    if (!exists) {
      await Subscription.create(body)
      console.log('✅ Saved subscription:', body.endpoint)
    } else {
      console.log('⚠️ Subscription already exists:', body.endpoint)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('❌ Save subscription error:', err)
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function getSubscriptions() {
  await connectDB()
  return await Subscription.find().lean()
}

import { NextResponse } from 'next/server'

let subscriptions: any[] = []

export async function POST(req: Request) {
    const body = await req.json()
    subscriptions.push(body)
    return NextResponse.json({ success: true })
}

export function getSubscriptions() {
    return subscriptions
}

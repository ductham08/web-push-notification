import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const filePath = path.join(process.cwd(), 'subscriptions.json')

export async function POST(req: Request) {
  const body = await req.json()

  let subs: any[] = []
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    subs = JSON.parse(data)
  } catch {
    subs = []
  }

  // tránh trùng subscription
  if (!subs.find(s => s.endpoint === body.endpoint)) {
    subs.push(body)
    await fs.writeFile(filePath, JSON.stringify(subs, null, 2))
  }

  return NextResponse.json({ success: true })
}

export async function getSubscriptions() {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

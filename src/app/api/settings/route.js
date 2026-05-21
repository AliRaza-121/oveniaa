import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Setting from '@/models/Setting'

export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    if (key) {
      const setting = await Setting.findOne({ key })
      return NextResponse.json({ success: true, value: setting ? setting.value : null })
    }

    const settings = await Setting.find()
    const config = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {})
    
    // Default config if not present
    if (!('storeOpen' in config)) config.storeOpen = true

    return NextResponse.json({ success: true, config })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    
    // body should be an object of key-value pairs
    for (const [key, value] of Object.entries(body)) {
      await Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      )
    }

    return NextResponse.json({ success: true, message: 'Settings updated' })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

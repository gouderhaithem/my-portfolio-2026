import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, type, budget, message } = body

    if (!name || !email || !type || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const budgetLine = budget ? `\nBudget: ${budget}` : ''

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'gouderhaithem@gmail.com',
      replyTo: email,
      subject: `New project inquiry — ${type} from ${name}`,
      text: `Name: ${name}
Email: ${email}
Project type: ${type}${budgetLine}

Message:
${message}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

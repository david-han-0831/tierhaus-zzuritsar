import { NextRequest, NextResponse } from 'next/server'

// 슬랙 알림 함수
async function sendSlackNotification(orderData: any) {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
  
  if (!SLACK_WEBHOOK_URL) {
    console.log('❌ Slack 웹훅 URL이 설정되지 않았습니다.')
    return
  }

  const { customerInfo, products, totalProductPrice, shippingFee, totalPrice } = orderData
  const { name, depositor, phone, address, message } = customerInfo

  // 상품 목록 텍스트 생성
  const productList = products.map((product: any) => 
    `• ${product.name} - ${product.quantity}개 × ${product.groupPrice.toLocaleString()}원 = ${(product.groupPrice * product.quantity).toLocaleString()}원`
  ).join('\n')

  const slackMessage = {
    text: "🛒 *새로운 공동구매 주문이 접수되었습니다!*",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🛒 새로운 공동구매 주문",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*주문자:*\n${name}`
          },
          {
            type: "mrkdwn",
            text: `*입금자명:*\n${depositor}`
          },
          {
            type: "mrkdwn",
            text: `*연락처:*\n${phone}`
          },
          {
            type: "mrkdwn",
            text: `*주소:*\n${address}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*주문 상품:*\n${productList}`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*상품 총액:*\n${totalProductPrice.toLocaleString()}원`
          },
          {
            type: "mrkdwn",
            text: `*배송비:*\n${shippingFee === 0 ? '무료' : shippingFee.toLocaleString() + '원'}`
          },
          {
            type: "mrkdwn",
            text: `*총 결제금액:*\n${totalPrice.toLocaleString()}원`
          }
        ]
      }
    ]
  }

  // 배송 메시지가 있는 경우 추가
  if (message && message.trim()) {
    slackMessage.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*배송 메시지:*\n${message}`
      }
    })
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    })

    if (!response.ok) {
      console.error('❌ Slack 알림 전송 실패:', response.statusText)
    } else {
      console.log('✅ Slack 알림 전송 성공')
    }
  } catch (error) {
    console.error('❌ Slack 알림 전송 중 오류:', error)
  }
}

export async function POST(req: NextRequest) {
  const NOTION_SECRET = process.env.NOTION_SECRET
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

  console.log('로그 찍는다 ')
  console.log('🧪 NOTION_DATABASE_ID:', NOTION_DATABASE_ID)
  console.log('🧪 typeof ID:', typeof NOTION_DATABASE_ID)
  console.log('--------------------------------')
  if (!NOTION_SECRET || !NOTION_DATABASE_ID) {
    return NextResponse.json({ ok: false, message: '❌ Notion 환경변수 누락' }, { status: 500 })
  }

  let data
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ ok: false, message: '❌ 잘못된 JSON' }, { status: 400 })
  }

  const { customerInfo, products, totalProductPrice, shippingFee, totalPrice, timestamp } = data
  const { name, depositor, phone, address, message } = customerInfo || {}

  if (!name || !depositor || !phone || !address) {
    return NextResponse.json({ ok: false, message: '❌ 필수 정보 누락' }, { status: 400 })
  }

  try {
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const isFirst = i === 0

      const properties: any = {
        '신청일시': {
          date: { start: timestamp || new Date().toISOString() },
        },
        '성함': {
            title: [{ text: { content: name } }],
        },
        '입금자명': {
            rich_text: [{ text: { content: depositor } }],
        },
        '연락처': {
            phone_number: phone,
        },
        '주소': {
            rich_text: [{ text: { content: address } }],
        },
        '배송메시지': {
            rich_text: [{ text: { content: message || '' } }],
        },
        '상품명': {
          rich_text: [{ text: { content: product.name } }],
        },
        '수량': { number: product.quantity },
        '단가': { number: product.groupPrice },
        '소계': { number: product.groupPrice * product.quantity },
      }

      // 첫 번째 상품에만 결제 요약 포함
      if (isFirst) {
        properties['상품총액'] = { number: totalProductPrice }
        properties['배송비'] = { number: shippingFee }
        properties['총결제금액'] = { number: totalPrice }
      }

      const notionRes = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_SECRET}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: {
            database_id: NOTION_DATABASE_ID,
          },
          properties,
        }),
      })

      if (!notionRes.ok) {
        const errorText = await notionRes.text()
        return NextResponse.json({ ok: false, message: errorText }, { status: 500 })
      }
    }

    // Notion 저장 성공 후 슬랙 알림 전송
    await sendSlackNotification(data)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: `❌ 서버 오류: ${err.message}` }, { status: 500 })
  }
}

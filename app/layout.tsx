import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '쭈리차르네 X 티어하우스 수제간식 공동구매',
  description: '쭈리차르네 공구방에서 진행하는 반려동물 수제간식 전문점, 티어하우스 전 제품 공구 주문서입니다.',
  generator: 'v0.dev',
  openGraph: {
    title: '쭈리차르네 X 티어하우스 수제간식 공동구매',
    description: '쭈리차르네 공구방에서 진행하는 반려동물 수제간식 전문점, 티어하우스 전 제품 공구 주문서입니다.',
    type: 'website',
    siteName: '쭈리차르네 X 티어하우스',
    locale: 'ko_KR',
    url: 'https://tierhaus-zzuritsar.vercel.app/', // 실제 배포 URL로 교체 필요
    images: [
      {
        url: '/logo/공동구매 로고.png', // 
        width: 1200,
        height: 630,
        alt: '쭈리차르네 X 티어하우스 수제간식 공동구매',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

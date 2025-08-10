"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, Loader } from "lucide-react"

interface Product {
  id: number
  name: string
  originalPrice: number
  groupPrice: number
  quantity: number
  imageUrl?: string // 이미지 URL 추가
}

// 연락처 유효성 검사 및 포맷팅 함수
const formatPhoneNumber = (value: string) => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, "")

  // 한국 휴대폰 번호 형식 검사 (010, 011, 016, 017, 018, 019로 시작)
  if (numbers.length === 11 && /^01[0-9]/.test(numbers)) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
  } else if (numbers.length === 10 && /^01[0-9]/.test(numbers)) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
  }
  return value
}

const validatePhoneNumber = (phone: string) => {
  const numbers = phone.replace(/[^\d]/g, "")
  return /^01[0-9]\d{7,8}$/.test(numbers)
}

export default function GroupPurchasePage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "닭 안심 육포 80g",
      originalPrice: 10000,
      groupPrice: 9000,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250623/727f203522794.jpeg",
    },
    {
      id: 2,
      name: "조각 닭 안심 육포 90g",
      originalPrice: 15000,
      groupPrice: 13500,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250623/5ce8d350c4c0d.jpeg",
    },
    {
      id: 3,
      name: "오리 안심 육포 50g",
      originalPrice: 10000,
      groupPrice: 9000,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250624/dca71888cbb67.jpeg",
    },
    {
      id: 4,
      name: "조각 오리 안심 육포 65g",
      originalPrice: 15000,
      groupPrice: 13500,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250624/e53d59e27b636.jpeg",
    },
    {
      id: 5,
      name: "오리 도가니 안심 말이 (작은 사이즈) 80g",
      originalPrice: 13000,
      groupPrice: 11700,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250624/fee14ffff1a59.jpeg",
    },
    {
      id: 6,
      name: "오리 도가니 안심 말이 (큰 사이즈) 120g",
      originalPrice: 13000,
      groupPrice: 11700,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/6c6ba6db9736f.jpeg",
    },
    {
      id: 7,
      name: "오리 통 다리 (2PCS.)",
      originalPrice: 15000,
      groupPrice: 13500,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/eb98edfbde208.jpeg",
    },
    // {
    //   id: 8,
    //   name: "통 오리 몸통 (목 뼈, 울대, 염통 포함)",
    //   originalPrice: 5000,
    //   groupPrice: 4500,
    //   quantity: 0,
    //   imageUrl: "",
    // },
    // {
    //   id: 9,
    //   name: "반 컷팅 오리 몸통 (목 뼈, 울대, 염통 포함)",
    //   originalPrice: 5000,
    //   groupPrice: 4500,
    //   quantity: 0,
    //   imageUrl: "",
    // },
    // {
    //   id: 10,
    //   name: "오리 말이 우피 껌",
    //   originalPrice: 8000,
    //   groupPrice: 7400,
    //   quantity: 0,
    //   imageUrl: "",
    // },
    {
      id: 11,
      name: "알 메추리 (2PCS.)",
      originalPrice: 13000,
      groupPrice: 11700,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250624/3c47dbc50e430.jpeg",
    },
    // {
    //   id: 12,
    //   name: "조각 알 메추리 (2PCS.)",
    //   originalPrice: 15000,
    //   groupPrice: 13500,
    //   quantity: 0,
    //   imageUrl: "https://cdn.imweb.me/thumbnail/20250624/135f3d7747f60.jpeg",
    // },
    {
      id: 13,
      name: "칠면조 통 목 뼈 (1PC.)",
      originalPrice: 17000,
      groupPrice: 15300,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/80ab7a557a009.jpeg",
    },
    {
      id: 14,
      name: "칠면조 목 뼈 (사등분, 1PC.)",
      originalPrice: 17000,
      groupPrice: 15300,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/20bee497eb4ae.jpeg",
    },
    {
      id: 15,
      name: "칠면조 목 뼈 슬라이스 80g",
      originalPrice: 15000,
      groupPrice: 13500,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/e9250c36a75b1.jpeg",
    },
    {
      id: 16,
      name: "칠면조 통 다리 (1PC.)",
      originalPrice: 21000,
      groupPrice: 18900,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/6076bd6c34414.jpeg",
    },
    {
      id: 17,
      name: "칠면조 다리 슬라이스 180g",
      originalPrice: 16000,
      groupPrice: 14400,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/d38ee88738950.jpeg",
    },
    // {
    //   id: 18,
    //   name: "조각 칠면조 다리살 육포 75g",
    //   originalPrice: 15000,
    //   groupPrice: 13000,
    //   quantity: 0,
    //   imageUrl: "https://cdn.imweb.me/thumbnail/20250617/42d721e2a575e.jpeg",
    // },
    // {
    //   id: 19,
    //   name: "칠면조 안심 육포 50g",
    //   originalPrice: 10000,
    //   groupPrice: 8500,
    //   quantity: 0,
    //   imageUrl: "https://cdn.imweb.me/thumbnail/20250624/9dc0dbc712b23.jpeg",
    // },
    // {
    //   id: 20,
    //   name: "조각 칠면조 안심 육포 70g",
    //   originalPrice: 15000,
    //   groupPrice: 13000,
    //   quantity: 0,
    //   imageUrl: "/product/조각칠면조안심육포_이미지.png",
    // },
    {
      id: 21,
      name: "연어 스틱 100g",
      originalPrice: 15000,
      groupPrice: 13500,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/fed58800660f2.jpeg",
    },
    {
      id: 22,
      name: "조각 연어 80g",
      originalPrice: 15000,
      groupPrice: 13500,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/64fecf27f7e41.jpeg",
    },
    {
      id: 23,
      name: "연어 스튜 100ml",
      originalPrice: 7000,
      groupPrice: 6300,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/20d766921467d.jpeg",
    },
    {
      id: 24,
      name: "한우 간 육포 100g",
      originalPrice: 13000,
      groupPrice: 11700,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/d85f1348ebdba.jpeg",
    },
    {
      id: 25,
      name: "조각 한우 간 육포 90g",
      originalPrice: 15000,
      groupPrice: 13500,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/2bc60cedfde64.jpeg",
    },
    {
      id: 26,
      name: "소고기 육포 60g",
      originalPrice: 13000,
      groupPrice: 11700,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250520/2306b5414ee3e.jpeg",
    },
    // {
    //   id: 26,
    //   name: "한우 간 파우더 90g",
    //   originalPrice: 15000,
    //   groupPrice: 13000,
    //   quantity: 0,
    //   imageUrl: "https://cdn.imweb.me/thumbnail/20220130/7a0eb0dea1bf5.jpeg",
    // },
    {
      id: 27,
      name: "말 갈비 (L 사이즈, 150g)",
      originalPrice: 16000,
      groupPrice: 14400,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250624/8f550fbb96048.jpeg",
    },
    {
      id: 28,
      name: "말 갈비 (S 사이즈, 80g)",
      originalPrice: 10000,
      groupPrice: 9000,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250624/e4e1bb981d6e2.jpeg",
    },
    {
      id: 29,
      name: "얇은 말 꼬리 슬라이스 80g",
      originalPrice: 15000,
      groupPrice: 13500,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/a281c9785c2b0.jpeg",
    },
    {
      id: 30,
      name: "두꺼운 말 꼬리 슬라이스 (1PC.)",
      originalPrice: 40000,
      groupPrice: 36000,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250621/08cd65291491d.jpeg",
    },
    {
      id: 31,
      name: "통 말 꼬리 (1PC.)",
      originalPrice: 40000,
      groupPrice: 36000,
      quantity: 0,
      imageUrl: "https://cdn.imweb.me/thumbnail/20250109/bd362f90dc067.jpeg",
    },
    {
      id: 32,
      name: "말고기 육포 60g",
      originalPrice: 10000,
      groupPrice: 9000,
      quantity: 0,
      imageUrl: "/product/말고기 육포.jpg",
    },
    {
      id: 33,
      name: "조각 말고기 육포 80g",
      originalPrice: 15000,
      groupPrice: 13500,
      quantity: 0,
      imageUrl: "/product/조각 말고기 육포.jpg",
    },
  ])

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    depositor: "",
    phone: "",
    address: "",
    message: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedOrder, setSubmittedOrder] = useState<{
    products: Product[]
    totalProductPrice: number
    shippingFee: number
    totalPrice: number
  } | null>(null)

  const updateQuantity = (id: number, change: number) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, quantity: Math.max(0, product.quantity + change) } : product,
      ),
    )
  }

  const totalProductPrice = products.reduce((sum, product) => sum + product.groupPrice * product.quantity, 0)
  const shippingFee = totalProductPrice >= 60000 ? 0 : 4000
  const totalPrice = totalProductPrice + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 입력 검증
    if (!customerInfo.name || !customerInfo.depositor || !customerInfo.phone || !customerInfo.address) {
      alert("필수 정보를 모두 입력해주세요.")
      return
    }

    if (!validatePhoneNumber(customerInfo.phone)) {
      alert("올바른 휴대폰 번호를 입력해주세요.")
      return
    }

    const selectedProducts = products.filter((product) => product.quantity > 0)
    if (selectedProducts.length === 0) {
      alert("상품을 선택해주세요.")
      return
    }

    setIsSubmitting(true)

    const orderData = {
      customerInfo: {
        ...customerInfo,
        phone: "'" + customerInfo.phone,
      },
      products: selectedProducts,
      totalProductPrice,
      shippingFee,
      totalPrice,
      timestamp: new Date().toISOString(),
    }

    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      // 주문 완료 시점의 정보를 저장
      setSubmittedOrder({
        products: selectedProducts,
        totalProductPrice,
        shippingFee,
        totalPrice
      })
      setIsSubmitted(true)
      setProducts(products.map((p) => ({ ...p, quantity: 0 })))
      setCustomerInfo({ name: '', depositor: '', phone: '', address: '', message: '' })
    } catch (error) {
      alert('주문 전송에 실패했습니다. 잠시 후 다시 시도해주세요.\n' + error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-[#8f001e] py-4 px-4 flex items-center min-h-[100px]">
        <div className="max-w-4xl mx-auto flex justify-center items-center w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-[white] text-center leading-tight">
            쭈리차르네  X 티어하우스<br className="block" />
            수제간식 공동 구매 오픈!
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 인트로 영역 */}
        <div className="text-center mb-8">
          
          <p className="text-lg text-[#8f001e]">
            쭈리차르네 공구방에서 진행하는 반려동물 수제간식 전문점, 티어하우스 전 제품 공구 주문서입니다.
          </p>
        </div>

        {/* 상품 리스트 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6 text-[#8f001e]">상품 선택</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row items-start md:items-center p-4 border rounded-lg gap-4"
                >
                  {/* 상품 이미지 */}
                  <div className="w-full md:w-24 aspect-[4/3] flex-shrink-0 overflow-hidden flex items-center justify-center bg-white">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg border bg-white"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg border flex items-center justify-center">
                        <span className="text-gray-400 text-xs text-center">
                          이미지<br />준비중
                        </span>
                      </div>
                    )}
                  </div>
                  {/* 상품 정보 + 가격 + 수량을 세로로, 모두 가운데 정렬 */}
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 w-full">
                    <h3 className="font-semibold text-lg text-[#333333] text-center whitespace-nowrap">{product.name}</h3>
                    <div className="flex flex-row items-center justify-center gap-2">
                      <span className="text-red-500 line-through text-sm">{product.originalPrice.toLocaleString()}원</span>
                      <span className="text-[#8f001e] font-bold text-xl">{product.groupPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(product.id, -1)}
                        disabled={product.quantity === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{product.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(product.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 주문자 정보 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6 text-[#8f001e]">주문자 정보</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#333333]">받으시는 분 성함 *</label>
                <Input
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="성함을 입력해주세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#333333]">입금자명 *</label>
                <Input
                  value={customerInfo.depositor}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, depositor: e.target.value })}
                  placeholder="입금자명을 입력해주세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#333333]">연락처 *</label>
                <Input
                  value={customerInfo.phone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    setCustomerInfo({ ...customerInfo, phone: formatted })
                  }}
                  placeholder="010-1234-5678"
                  required
                />
                {customerInfo.phone && !validatePhoneNumber(customerInfo.phone) && (
                  <p className="text-red-500 text-sm mt-1">올바른 휴대폰 번호를 입력해주세요 (예: 010-1234-5678)</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#333333]">주소 *</label>
                <Input
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  placeholder="배송받을 주소를 입력해주세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#333333]">배송 메시지</label>
                <Textarea
                  value={customerInfo.message}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, message: e.target.value })}
                  placeholder="배송 시 요청사항이 있으시면 입력해주세요"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 결제 요약 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6 text-[#8f001e]">결제 정보</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#333333]">상품 총 금액</span>
                <span>{totalProductPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#333333]">배송비</span>
                <span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>
                  {shippingFee === 0 ? "무료배송" : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold text-[#8f001e]">
                <span>총 결제 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-center text-[#8f001e]">
                입금 계좌: 카카오뱅크 3333-32-616-5855 한태은(티어하우스)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 하단 안내 문구 */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-[#333333] space-y-1">
            <p>• 택배비 4,000원 별도 (아이스팩+아이스박스)</p>
            <p>• 공구가 합 6만원 이상 무료배송입니다.</p>
            <p>• 아이스팩+아이스박스 완전 무장해서 보내드립니다.</p>
            <p>• 공구 주문 마감 후 일주일 내로 발송 예정입니다.</p>
            <p>• 지연될 경우 미리 안내 문자 보내드립니다.</p>
            <p>• 10만원 이상 구매 시 서비스 간식 함께 보내드립니다.</p>
          </div>
        </div>

        {/* 신청 버튼 */}
        <form onSubmit={handleSubmit}>
          <Button
            type="submit"
            className="w-full bg-[#8f001e] hover:bg-[#7a0019] text-white py-4 text-lg font-semibold"
            disabled={totalProductPrice === 0 || isSubmitting}
          >
            공구 신청하기
          </Button>
        </form>

        {/* 신청 완료 메시지 */}
        {isSubmitted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md mx-4 text-center">
              <h3 className="text-xl font-bold text-[#8f001e] mb-4">신청 완료!</h3>
              
                             {/* 주문 상품 정보 */}
               <div className="mb-4 text-left">
                 <h4 className="font-semibold text-[#8f001e] mb-2">주문 상품</h4>
                 <div className="space-y-2 max-h-32 overflow-y-auto">
                   {submittedOrder?.products.map((product) => (
                     <div key={product.id} className="text-sm text-gray-700 border-b border-gray-100 pb-1">
                       <div className="flex justify-between">
                         <span className="font-medium">{product.name}</span>
                         <span className="text-[#8f001e]">{product.quantity}개</span>
                       </div>
                       <div className="text-xs text-gray-500">
                         {product.groupPrice.toLocaleString()}원 × {product.quantity}개 = {(product.groupPrice * product.quantity).toLocaleString()}원
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* 결제 금액 정보 */}
               <div className="mb-4 text-left border-t pt-3">
                 <div className="space-y-1 text-sm">
                   <div className="flex justify-between">
                     <span>상품 금액:</span>
                     <span>{submittedOrder?.totalProductPrice.toLocaleString()}원</span>
                   </div>
                   <div className="flex justify-between">
                     <span>배송비:</span>
                     <span>{submittedOrder?.shippingFee === 0 ? '무료' : submittedOrder?.shippingFee.toLocaleString() + '원'}</span>
                   </div>
                   <div className="flex justify-between font-bold text-[#8f001e] border-t pt-1">
                     <span>총 결제 금액:</span>
                     <span>{submittedOrder?.totalPrice.toLocaleString()}원</span>
                   </div>
                 </div>
               </div>

              <p className="text-gray-600 mb-4 text-sm">
                정상적으로 접수되었습니다!
                <br />
                입금 확인 후 배송 준비 시작되며,
                <br />
                공구 마감 후 일주일 내로 발송 예정입니다.
              </p>
                             <Button onClick={() => {
                 window.scrollTo({ top: 0, behavior: 'smooth' })
                 setIsSubmitted(false)
                 setSubmittedOrder(null)
               }} className="bg-[#8f001e] hover:bg-[#7a0019]">
                 확인
               </Button>
            </div>
          </div>
        )}
        {/* 로딩 화면 */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-[100]">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
              <Loader className="animate-spin w-10 h-10 text-[#8f001e] mb-4" />
              <div className="text-[#8f001e] font-semibold text-lg">신청을 처리 중입니다...<br/>잠시만 기다려주세요.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

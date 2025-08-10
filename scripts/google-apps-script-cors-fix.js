// Google Apps Script 코드 (CORS 문제 해결 버전)
// 이 코드를 Google Apps Script 에디터에 복사하여 사용하세요

const ContentService = google.script.runtime.ContentService
const SpreadsheetApp = google.script.host.SpreadsheetApp
const Utilities = google.script.host.Utilities
const Session = google.script.host.Session
const google = { script: { runtime: { ContentService }, host: { SpreadsheetApp, Utilities, Session } } }

function doPost(e) {
  try {
    console.log("POST 요청 받음")
    console.log("전체 이벤트:", e)
    console.log("파라미터:", e.parameter)

    // 스프레드시트 ID - 실제 스프레드시트 ID로 교체하세요
    const SPREADSHEET_ID = "YOUR_ACTUAL_SPREADSHEET_ID_HERE"

    // 데이터 파싱
    let data
    try {
      if (e.parameter && e.parameter.data) {
        data = JSON.parse(e.parameter.data)
        console.log("파싱된 데이터:", data)
      } else {
        throw new Error("데이터 파라미터를 찾을 수 없습니다")
      }
    } catch (parseError) {
      console.error("데이터 파싱 오류:", parseError)
      return ContentService.createTextOutput("파싱 오류: " + parseError.toString())
    }

    // 스프레드시트 열기
    let sheet
    try {
      sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet()
      console.log("스프레드시트 열기 성공")
    } catch (sheetError) {
      console.error("스프레드시트 오류:", sheetError)
      return ContentService.createTextOutput("스프레드시트 오류: " + sheetError.toString())
    }

    // 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "신청일시",
        "성함",
        "연락처",
        "주소",
        "배송메시지",
        "상품명",
        "수량",
        "단가",
        "소계",
        "상품총액",
        "배송비",
        "총결제금액",
      ])
      console.log("헤더 추가 완료")
    }

    // 현재 시간
    const now = new Date()
    const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss")

    // 고객 정보
    const customerInfo = data.customerInfo

    // 각 상품별로 행 추가
    data.products.forEach((product, index) => {
      const row = [
        timestamp,
        index === 0 ? customerInfo.name : "",
        index === 0 ? customerInfo.phone : "",
        index === 0 ? customerInfo.address : "",
        index === 0 ? customerInfo.message : "",
        product.name,
        product.quantity,
        product.groupPrice,
        product.groupPrice * product.quantity,
        index === 0 ? data.totalProductPrice : "",
        index === 0 ? data.shippingFee : "",
        index === 0 ? data.totalPrice : "",
      ]

      sheet.appendRow(row)
      console.log("행 추가:", product.name)
    })

    console.log("데이터 저장 완료")

    // 성공 응답 (HTML 형태로 반환)
    return ContentService.createTextOutput("주문이 성공적으로 접수되었습니다!").setMimeType(
      ContentService.MimeType.TEXT,
    )
  } catch (error) {
    console.error("전체 오류:", error)
    return ContentService.createTextOutput("오류 발생: " + error.toString()).setMimeType(ContentService.MimeType.TEXT)
  }
}

// GET 요청 처리 (테스트용)
function doGet() {
  console.log("GET 요청 받음")
  return ContentService.createTextOutput("✅ Google Apps Script 연결 성공! " + new Date())
}

// 테스트 함수
function testFunction() {
  const testData = {
    customerInfo: {
      name: "테스트 고객",
      phone: "010-1234-5678",
      address: "서울시 강남구",
      message: "테스트 주문",
    },
    products: [{ name: "말랑 닭 안심 육포", quantity: 1, groupPrice: 12000 }],
    totalProductPrice: 12000,
    shippingFee: 4000,
    totalPrice: 16000,
    timestamp: new Date().toISOString(),
  }

  const mockEvent = {
    parameter: {
      data: JSON.stringify(testData),
    },
  }

  return doPost(mockEvent)
}

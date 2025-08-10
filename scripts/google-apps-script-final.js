// Google Apps Script 코드 (최종 수정 버전)
// 이 코드를 Google Apps Script 에디터에 복사하여 사용하세요

var ContentService = google.script.runtime.ContentService
var SpreadsheetApp = google.script.runtime.SpreadsheetApp
var Utilities = google.script.runtime.Utilities
var Session = google.script.runtime.Session
var google = google // Declare the google variable

function doPost(e) {
  try {
    console.log("POST 요청 받음:", e)

    // 스프레드시트 ID - 실제 스프레드시트 ID로 교체하세요
    const SPREADSHEET_ID = "YOUR_ACTUAL_SPREADSHEET_ID_HERE"

    // 데이터 파싱 (FormData 또는 JSON 모두 처리)
    let data
    try {
      if (e.parameter && e.parameter.data) {
        // FormData로 전송된 경우
        data = JSON.parse(e.parameter.data)
        console.log("FormData에서 파싱된 데이터:", data)
      } else if (e.postData && e.postData.contents) {
        // JSON으로 직접 전송된 경우
        data = JSON.parse(e.postData.contents)
        console.log("JSON에서 파싱된 데이터:", data)
      } else {
        throw new Error("데이터를 찾을 수 없습니다")
      }
    } catch (parseError) {
      console.error("데이터 파싱 오류:", parseError)
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Invalid data format" }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    // 스프레드시트 열기
    let sheet
    try {
      sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet()
      console.log("스프레드시트 열기 성공")
    } catch (sheetError) {
      console.error("스프레드시트 열기 오류:", sheetError)
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Spreadsheet access failed: " + sheetError.toString() }),
      ).setMimeType(ContentService.MimeType.JSON)
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

    // 주문 데이터 추가
    const timestamp = new Date(data.timestamp)
    const customerInfo = data.customerInfo

    // 각 상품별로 행 추가
    data.products.forEach((product, index) => {
      const row = [
        Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
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
      console.log("행 추가 완료:", product.name)
    })

    console.log("모든 데이터 저장 완료")

    // 성공 응답
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "주문이 성공적으로 접수되었습니다!",
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("전체 처리 오류:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

// GET 요청 처리 (연결 테스트용)
function doGet() {
  console.log("GET 요청 받음 - " + new Date())
  return ContentService.createTextOutput("✅ Google Apps Script 연결 성공! " + new Date()).setMimeType(
    ContentService.MimeType.TEXT,
  )
}

// 테스트 함수 (수동 실행용)
function testFunction() {
  console.log("테스트 함수 실행 시작")

  const testData = {
    customerInfo: {
      name: "홍길동",
      phone: "010-1234-5678",
      address: "서울시 강남구 테스트동 123-45",
      message: "문 앞에 놓아주세요",
    },
    products: [
      { name: "말랑 닭 안심 육포", quantity: 2, groupPrice: 12000 },
      { name: "수제 연어 큐브", quantity: 1, groupPrice: 14000 },
    ],
    totalProductPrice: 38000,
    shippingFee: 4000,
    totalPrice: 42000,
    timestamp: new Date().toISOString(),
  }

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  }

  const result = doPost(mockEvent)
  console.log("테스트 결과:", result.getContent())
  return result
}

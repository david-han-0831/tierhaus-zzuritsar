// Google Apps Script 코드 (수정된 버전)
// 이 코드를 Google Apps Script 에디터에 복사하여 사용하세요

function doPost(e) {
  try {
    // 로그 추가
    console.log("POST 요청 받음:", e)

    // 스프레드시트 ID - 실제 스프레드시트 ID로 교체하세요
    const SPREADSHEET_ID = "YOUR_ACTUAL_SPREADSHEET_ID_HERE"

    // JSON 데이터 파싱
    let data
    try {
      data = JSON.parse(e.postData.contents)
      console.log("파싱된 데이터:", data)
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError)
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid JSON" })).setMimeType(
        ContentService.MimeType.JSON,
      )
    }

    // 스프레드시트 열기
    let sheet
    try {
      sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet()
      console.log("스프레드시트 열기 성공")
    } catch (sheetError) {
      console.error("스프레드시트 열기 오류:", sheetError)
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Spreadsheet access failed" }),
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
        timestamp,
        index === 0 ? customerInfo.name : "", // 첫 번째 상품에만 고객정보 표시
        index === 0 ? customerInfo.phone : "",
        index === 0 ? customerInfo.address : "",
        index === 0 ? customerInfo.message : "",
        product.name,
        product.quantity,
        product.groupPrice,
        product.groupPrice * product.quantity,
        index === 0 ? data.totalProductPrice : "", // 첫 번째 상품에만 합계 표시
        index === 0 ? data.shippingFee : "",
        index === 0 ? data.totalPrice : "",
      ]
      sheet.appendRow(row)
      console.log("행 추가:", row)
    })

    console.log("데이터 저장 완료")

    // 성공 응답
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Data saved successfully" }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("전체 오류:", error)
    // 에러 응답
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}

// GET 요청 처리 (테스트용)
function doGet() {
  console.log("GET 요청 받음")
  return ContentService.createTextOutput("Google Apps Script is working! " + new Date()).setMimeType(
    ContentService.MimeType.TEXT,
  )
}

// 테스트 함수 (수동 실행용)
function testFunction() {
  const testData = {
    customerInfo: {
      name: "테스트 고객",
      phone: "010-1234-5678",
      address: "서울시 강남구",
      message: "테스트 메시지",
    },
    products: [{ name: "테스트 상품", quantity: 1, groupPrice: 10000 }],
    totalProductPrice: 10000,
    shippingFee: 4000,
    totalPrice: 14000,
    timestamp: new Date().toISOString(),
  }

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  }

  return doPost(mockEvent)
}

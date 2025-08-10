// Google Apps Script 코드 (Google Apps Script 에디터에서 사용)
// 이 코드를 Google Apps Script에 복사하여 사용하세요

function doPost(e) {
  try {
    // 스프레드시트 ID (Google Sheets URL에서 확인 가능)
    const SPREADSHEET_ID = "1QquChLq4L-0JUe9S_DGNu2DdNjgUE-1kvYak4JKtk_c"

    // JSON 데이터 파싱
    const data = JSON.parse(e.postData.contents)

    // 스프레드시트 열기
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet()

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
    })

    // 성공 응답
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    // 에러 응답
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}

// GET 요청 처리 (테스트용)
function doGet() {
  return ContentService.createTextOutput("Google Apps Script is working!").setMimeType(ContentService.MimeType.TEXT)
}

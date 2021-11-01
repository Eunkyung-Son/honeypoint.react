type RestaurantData = {
  rNo: number,
  mNo: number,
  rTel: string,         // 전화번호
  rType: string,        // 식당종류
  rName: string,        // 이름
  rAddress: string,     // 주소
  rOAddress: string,    // 상세주소
  rTag: string,         // 태그
  rPrice: number,       // 가격
  rParking: string,     // 주차가능여부
  rStartTime: string,   // 오픈시간
  rEndTime: string,     // 마감시간
  rRating: number,
  rIntro: string,       // 소개
  resveYn: string,      // 예약가능여부
  rRestDay: string,     // 휴일
  rStatus: string,
  rCount: number,
  fileIds: string[],
}

export default RestaurantData;
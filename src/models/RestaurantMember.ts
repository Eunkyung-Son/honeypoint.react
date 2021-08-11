type RestaurantMember = {
  mId: string,          // 아이디
  rName: string,        // 이름
  mEmail: string,       // 이메일
  rTel: string,         // 전화번호
  rType: string,        // 식당종류
  rAddress: string,     // 주소
  rOAddress: string,    // 상세주소
  rTag: string,         // 태그
  rPrice: number,       // 가격
  rParking: string,     // 주차가능여부
  rStartTime: string,   // 오픈시간
  rEndTime: string,     // 마감시간
  rIntro: string,       // 소개
  resveYn: string,      // 예약가능여부
  rRestDay: string,     // 휴일
  mPwd: string          // 비밀번호
}

export default RestaurantMember;
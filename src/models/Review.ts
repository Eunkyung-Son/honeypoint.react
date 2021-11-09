type Review = {
  gnrlMember:{
    mNo: number,
    mNickname: string,
    mBirthday: number,
    mPhone: number,
    mAddress: string,
    mGrad: number,
    mPoint: number
  },
  mNo: number,
  member: null,
  rNo: number,
  revCn: string,
  revDate: string,
  revNo: number,
  revStatus: string,
  score: number
}

export default Review;
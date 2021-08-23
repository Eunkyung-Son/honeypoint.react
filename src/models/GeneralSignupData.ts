import { Moment } from "moment";

type GeneralSignupData = {
  mId: string,
  mPwd: string,
  confirm: string,
  mName: string,
  mNickname: string,
  mBirthday: Moment,
  mEmail: string,
  mPhone: string,
  mPostNumber: string,
  mRoadAddress: string,
  mDetailAddress: string
}

export default GeneralSignupData;
import { Moment } from "moment";

type RestaurantSignupData = {
  mId: string,
  mPwd: string,
  confirm: string,
  mEmail: string,
  rName: string,
  rPostNumber: string,
  rAddress: string,
  rOAddress: string,
  rTel: string,
  rType: string,
  rTag: string[],
  rPrice: string,
  rParking: string,
  rStartTime: Moment,
  rEndTime: Moment,
  rRestDay: string[],
  rIntro: string,
  resveYn: string,
}

export default RestaurantSignupData;
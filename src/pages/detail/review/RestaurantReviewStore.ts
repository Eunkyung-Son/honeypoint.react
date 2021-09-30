import axios, { AxiosResponse } from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { SERVER_URL } from "../../../config/config";
import Review from "../../../models/Review";

export default class RestaurantReviewStore {
  @observable private _reviewList: Array<Review> = [];
  @observable private _reviewAllCount = 0;
  @observable private _reviewGoodCount = 0;
  @observable private _reviewSosoCount = 0;
  @observable private _reviewBadCount = 0;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  fetchReviews = async (rNo: string, score?: number) => {
    const URL = `${SERVER_URL}/api/reviews/${rNo}`;
    const params = {
      ...(score && { filterType: score }),
    }
    try {
      await axios
        .get(URL, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            ...params
          }
        }).then((response: AxiosResponse) => {
          const { setReviewAllCount, setReviewList, setReviewGoodCount, setReviewSosoCount, setReviewBadCount } = this; 
          const { data } = response;
          if (!data || !data.reviews) return;
          setReviewList(data.reviews);
          if (score) return;
          let all = data.total;
          let good = 0;
          let soso = 0;
          let bad = 0;
          (data.reviews as Review[]).forEach((review) => {
            switch (review.score){
              case 1:
                good = good + 1;
                break;
              case 2:
                soso = soso + 1;
                break;
              case 3:
                bad = bad + 1;
                break;
              default:
                return;
            }
          });
          setReviewAllCount(all);
          setReviewGoodCount(good);
          setReviewSosoCount(soso);
          setReviewBadCount(bad);
        })
    } finally {
      // 로딩
    }
  }

  @action.bound
  deleteReview = async (reviewId: number) => {
    const URL =`${SERVER_URL}/api/review/${reviewId}`;
    await axios
      .delete(URL)
        .then((response: AxiosResponse) => {
          console.log(response);
        }
      )
  }

  @action.bound
  setReviewList = (reviewList: Array<Review>) => {
    this._reviewList = reviewList;
  }

  @action.bound
  setReviewAllCount = (reviewAllCount: number) => {
    this._reviewAllCount = reviewAllCount;
  }

  @action.bound
  setReviewGoodCount = (reviewGoodCount: number) => {
    this._reviewGoodCount = reviewGoodCount;
  }

  @action.bound
  setReviewSosoCount = (reviewSosoCount: number) => {
    this._reviewSosoCount = reviewSosoCount;
  }

  @action.bound
  setReviewBadCount = (reviewBadCount: number) => {
    this._reviewBadCount = reviewBadCount;
  }

  @computed
  get reviewGoodCount() {
    return this._reviewGoodCount;
  }

  @computed
  get reviewSosoCount() {
    return this._reviewSosoCount;
  }

  @computed
  get reviewBadCount() {
    return this._reviewBadCount;
  }

  @computed
  get reviewList() {
    return this._reviewList;
  }

  @computed
  get reviewAllCount() {
    return this._reviewAllCount;
  }
}
import * as Yup from "yup";

export const PRODUCT = {
  id: "상품 ID",
  name: "상품 이름",
  price: "상품 가격",
  createdAt: "상품 등록일",
};

/** 테이블 데이터 유효성 스키마 */
export const TABLE_VALIDATION_SCEMA = Yup.object().shape({
  name: Yup.string()
    .min(2, "이름은 최소 2글자 이상입니다!")
    .max(10, "이름은 최대 10글자입니다!")
    .required("이름을 입력해주세요"),
});

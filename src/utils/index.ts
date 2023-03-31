export const formatNumber = (num: number | string | undefined): any => {
  if (typeof num === "undefined") {
    num = 0;
  }
  if (typeof num === "string") {
    num = parseFloat(num);
  }
  return new Intl.NumberFormat().format(num);
};

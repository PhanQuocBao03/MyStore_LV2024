const FormatPrice = (amount) => {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export default FormatPrice;

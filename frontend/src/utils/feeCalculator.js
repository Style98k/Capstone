export const calculateFee = (amount) => {
    const price = parseFloat(amount || 0);
    if (price < 1000) return 10;
    if (price < 5000) return 30;
    return Math.floor(price * 0.01);
};

export const calculateFee = (amount) => {
    const price = parseFloat(amount || 0);
    if (price < 1000) return 15;
    if (price < 5000) return 50;
    return Math.floor(price * 0.02);
};

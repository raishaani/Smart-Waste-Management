export const getOrders = async () => {
  const res = await fetch("/api/orders");
  return res.json();
};
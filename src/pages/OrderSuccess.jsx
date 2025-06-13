export default function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md">
        <h2 className="text-3xl font-bold text-green-700 mb-4">🎉 Order Placed!</h2>
        <p className="text-gray-600 mb-6">Your order has been placed with Cash on Delivery. We will reach out soon to confirm your delivery.</p>
        <a href="/shop" className="inline-block px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition font-medium">Continue Shopping</a>
      </div>
    </div>
  );
}
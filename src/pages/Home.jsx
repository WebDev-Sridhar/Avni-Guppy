import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-200 to-white py-20 text-center">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-4">Welcome to GuppyStore</h1>
        <p className="text-lg text-gray-600 mb-8">Your one-stop shop for guppy fish and aquarium accessories</p>
        <a href="/shop" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">Shop Now</a>
      </section>

      {/* Featured Categories */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Link to={"/shop"}><img src="/images/guppies.jpg" alt="Guppy Fish" className="mx-auto w-full h-40 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Guppy Fish</h3></Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <img src="/images/tanks.jpg" alt="Tanks" className="mx-auto w-full h-40 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Tanks & Aquascaping</h3>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <img src="/images/accessories.jpg" alt="Accessories" className="mx-auto w-full h-40 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Accessories & Tools</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

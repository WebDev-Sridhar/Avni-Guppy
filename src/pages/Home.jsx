import { Link } from "react-router-dom";
import TrendingProducts from "../components/TrendingProducts";
import FishFoodAccessoriesSlider from "../components/FishFoodAccessoriesSlider";
import OnSaleProducts from "../components/OnsaleProducts";
export default function Home() {
  return (

    <div className="bg-white-50 min-h-screen  p-6">
      
      {/* Hero Section */}
      <section className=" bg-linear-to-t from-[#d5f0e6] to-#d5f0e6] py-10 text-center  p-2  overflow-hidden rounded-2xl mb-8">
        <h1 className="text-7xl font-extrabold  text-green-900 mb-4 ">
          Welcome to Avni Guppy Home
        </h1>
        <p className="text-lg  mb-8 text-green-900 ">
          Your one-stop shop for guppy fish and aquarium accessories
        </p>
        <a
          href="/shop"
          className="inline-block bg-[#2d6049] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2c3f32] transition"
        >
          Shop Now
        </a>
      </section>
      

      {/* Featured Categories */}
      <section className="max-w-6xl mx-auto py-12 ">
 
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md  text-center hover:scale-102 transition-transform duration-300">
            <Link to={"/guppy"}>
              <img
                src="/images/card1.png"
                alt="Guppy Fish"
                className="mx-auto w-full h-full object-cover rounded-xl  "
              />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md  text-center hover:scale-102 transition-transform duration-300">
            <Link to={"/tanks"}>
              <img
                src="/images/card2.png"
                alt="Tanks"
                className="mx-auto w-full h-full object-cover rounded-xl  "
              />
           
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md text-center hover:scale-102 transition-transform duration-300">
            <Link to={"/accessories"}>
              <img
                src="/images/card3.png"
                alt="Accessories"
                className="mx-auto w-full h-full object-cover rounded-xl "
              />
           
            </Link>
          </div>
        </div>
      </section>
      
      <TrendingProducts/>
      <FishFoodAccessoriesSlider/>
      <OnSaleProducts/>
    </div>
  );
}

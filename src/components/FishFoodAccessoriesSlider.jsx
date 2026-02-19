import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function FishFoodAccessoriesSlider() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSliderProducts = async () => {
      const q = query(
        collection(db, 'products'),
        where('category', 'in', ['fish food', 'accessories'])
      );
      const querySnapshot = await getDocs(q);
      let productList = [];
      querySnapshot.forEach((doc) => {
        productList.push({ id: doc.id, ...doc.data() });
      });

      // Shuffle and pick 10–15
      productList = productList.sort(() => 0.5 - Math.random()).slice(0, 15);
      setProducts(productList);
    };

    fetchSliderProducts();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-center mb-4">Fish Food & Accessories</h2>
      <Slider {...settings}>
        {products.map((product) => {
          const discount = Math.round(
            ((product.originalprice - product.price) / product.originalprice) * 100
          );

          return (
            <div key={product.id} className="p-2 hover:scale-90 transition-transform duration-300">
              <Link to={`/shop/${product.id}`} className="block text-center shadow-sm rounded-lg hover:shadow-lg">
                <div className="relative ">
                  {discount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl">
                      {discount}% OFF
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-800">{product.title}</h3>
                <p className="text-sm mt-1">
                  <span className="text-gray-500 line-through mr-2">₹{product.originalprice}</span>
                  <span className="text-black font-semibold">₹{product.price}</span>
                </p>
              </Link>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

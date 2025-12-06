import CategoryCard from "../components/CategoryCard";
import { Link } from "react-router-dom";
const categories = [
  {id: 1, path:"live fish", title: "Live fish", image: "./images/fish.svg" },
  {id:2, path:"tanks", title: "Tanks", image: "./images/tank.jpeg" },
  {id: 3, path:"live plants", title: "Live plants", image: "./images/plants.jpeg" },
  {id: 4, path:"aquascaping", title: "Aquascaping", image: "./images/aquascaping.png" },
  {id: 5, path:"fish food", title: "Fish food", image: "./images/food.jpg" },
];

export default function ProductDetails() {
  // const categoryName = useParams().categoryName;
  return (
    <div className="bg-white-50 p-6 ">
      {/* Hero Section */}
     <section className=" bg-linear-to-t from-[#d5f0e6] to-#d5f0e6] py-20 text-center  rounded-2xl bg-cover bg-bottom mb-8">
      <h1 className="text-6xl font-bold text-center text-green-900 mb-6">
        Category
      </h1>
      <p className="text-gray-700 mb-6 text-bold text-lg">
        “Splash into Color! Bright Guppies & Cool Gear for Your Tank.”
      </p>
      </section>

      {/* Categories */}
      <section className="py-10 px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map(( cat) => (
            <Link to={`/category/${cat.path}`}  key={cat.id} className="hover:scale-105 transition-transform duration-300">
              <CategoryCard key={cat.id} title={cat.title} image={cat.image} />
              </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

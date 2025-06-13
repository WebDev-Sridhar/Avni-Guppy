import CategoryCard from "../components/CategoryCard";
import { Link } from "react-router-dom";
const categories = [
  { title: "Guppy Fish", image: "https://i.imgur.com/5Z6WzLz.jpg" },
  { title: "Aquariums", image: "https://i.imgur.com/igUfpKz.jpg" },
  { title: "Live Plants", image: "https://i.imgur.com/Acjz7fi.jpg" },
  { title: "Fish Food", image: "https://i.imgur.com/4mrxS7I.jpg" },
  { title: "Accessories", image: "https://i.imgur.com/ZC1S7fQ.jpg" },
];

export default function ProductDetails() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-green-100 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">Welcome to GuppyFarm</h1>
        <p className="text-gray-700 mb-6 text-lg">
          Your one-stop shop for guppies, tanks, plants, and all aquarium needs!
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full shadow">
           <Link to="/shop" className="text-white-700">Shop</Link>
        </button>
      </section>

      {/* Categories */}
      <section className="py-10 px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} title={cat.title} image={cat.image} />
          ))}
        </div>
      </section>
    </div>
  );
}

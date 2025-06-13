import { useState } from "react";
import { useCart } from "../contexts/CartContext";

const dummyProducts = [
  {
    id: 1,
    title: "Fancy Guppy - Red Tail",
    price: 120,
    image: "https://i.imgur.com/5Z6WzLz.jpg",
  },
  {
    id: 2,
    title: "Aquarium Glass Tank - 15L",
    price: 700,
    image: "https://i.imgur.com/igUfpKz.jpg",
  },
  {
    id: 3,
    title: "Java Moss Plant",
    price: 150,
    image: "https://i.imgur.com/Acjz7fi.jpg",
  },
  {
    id: 4,
    title: "Tetra Fish Food (50g)",
    price: 90,
    image: "https://i.imgur.com/4mrxS7I.jpg",
  },
  {
    id: 5,
    title: "Aquarium Filter (Submersible)",
    price: 450,
    image: "https://i.imgur.com/ZC1S7fQ.jpg",
  },
  {
    id: 6,
    title: "Guppy Breeding Box",
    price: 300,
    image: "https://i.imgur.com/5Z6WzLz.jpg",
  },
  {
    id: 7,
    title: "LED Aquarium Light",
    price: 600,
    image: "https://i.imgur.com/igUfpKz.jpg",
  },
  {
    id: 8,
    title: "Aquarium Gravel (5kg)",
    price: 200,
    image: "https://i.imgur.com/Acjz7fi.jpg",
  },
];

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const { addToCart } = useCart();

  const filtered = dummyProducts.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">
        Shop
      </h1>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden justify-self-stretch"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-black-600 font-bold mb-3">
                  ₹{product.price}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 button1"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}

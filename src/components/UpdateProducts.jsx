import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function UpdateProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const items = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    };
    fetchProducts();
  }, []);

const handleChange = (docId, field, value) => {
  setProducts(prev =>
    prev.map(item =>
      item.docId === docId ? { ...item, [field]: value } : item
    )
  );
};

 const handleSliderImageChange = (productId, imageIndex, value) => {
  setProducts(prev => {
    const updated = [...prev];

    // Find real product index
    const realIndex = updated.findIndex(p => p.id === productId);
    if (realIndex === -1) return prev;

    // Ensure sliderimages array exists
    const sliderImages = Array.isArray(updated[realIndex].sliderimages)
      ? [...updated[realIndex].sliderimages]
      : [];

    sliderImages[imageIndex] = value;

    updated[realIndex] = {
      ...updated[realIndex],
      sliderimages: sliderImages,
    };

    return updated;
  });
};


const handleUpdate = async (docId) => {
  const updatedProduct = products.find(p => p.docId === docId);
  const { docId: _, ...dataToUpdate } = updatedProduct;

  try {
    await updateDoc(doc(db, 'products', docId), dataToUpdate);
    toast.success(`${updatedProduct.title} updated`);
  } catch (error) {
    console.error(error);
    toast.error('Update failed');
  }
};

  const handleDelete = async docId => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteDoc(doc(db, 'products', docId));
      setProducts(prev => prev.filter(item => item.docId !== docId));
      toast.success('Product deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
  };

  // Filtered product list
  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">Update Products</h2>

      {/* 🔍 Search bar */}
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search by product title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border px-4 py-2 rounded-md shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <div key={product.docId} className=" rounded-md p-4 shadow-xl bg-white space-y-3">
            <label>Product ID</label>
            <input
              value={product.id}
              onChange={e => handleChange(product.docId, 'id', e.target.value)}
              className="w-full border px-2 py-1 rounded"
              placeholder="Product ID"
            />
            <label>Title</label>
            <input
              value={product.title}
              onChange={e => handleChange(product.docId, 'title', e.target.value)}
              className="w-full border px-2 py-1 rounded"
              placeholder="Title"
            />
            <label>Price</label>
            <input
              type="number"
              value={product.price}
              onChange={e => handleChange(product.docId, 'price', +e.target.value)}
              className="w-full border px-2 py-1 rounded"
              placeholder="Price"
            />
            <label>Original Price</label>
            <input
              type="number"
              value={product.originalprice}
              onChange={e => handleChange(product.docId, 'originalprice', +e.target.value)}
              className="w-full border px-2 py-1 rounded"
              placeholder="Original Price"
            />
            <label>Main Image</label>
            <input
              value={product.image}
              onChange={e => handleChange(product.docId, 'image', e.target.value)}
              className="w-full border px-2 py-1 rounded"
              placeholder="Main Image URL"
            />
                  <label>Slider Images</label>
         {(product.sliderimages || []).map((img, i) => (
          
  <input
    key={i}
    value={img || ""}
      className="w-full border px-2 py-1 rounded"
    onChange={(e) => handleSliderImageChange(product.id, i, e.target.value)}
  />
))}
            <label>Category</label>
            <input
              value={product.category}
              onChange={e => handleChange(product.docId, 'category', e.target.value)}
              className="w-full border px-2 py-1 rounded"
              placeholder="Category"
            />
            <label>Description</label>
            <textarea
              value={product.description}
              onChange={e => handleChange(product.docId, 'description', e.target.value)}
              className="w-full border px-2 py-1 rounded"
              placeholder="Description"
            />
            <label>Quantity</label>
            <input
              type="number"
              value={product.inStock}
              onChange={e => handleChange(product.docId, 'inStock', +e.target.value)}
              className="w-full border px-2 py-1 rounded"
              placeholder="Available Quantity"
            />

            <div className="flex justify-between gap-2">
              <button
                onClick={() => handleUpdate(product.docId)}
                className="text-blue-600 border px-4 py-1 rounded hover:text-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(product.docId)}
                className="text-red-600 border px-4 py-1 rounded hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
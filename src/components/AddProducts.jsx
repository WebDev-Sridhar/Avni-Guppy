import { useState } from 'react';
import { db } from '../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
// import ProductAddingScript from './ProductAddingScript';

export default function AddProduct() {


const [formData, setFormData] = useState({
  id: '',
  title: '',
  price: '',
  originalprice: '',
  image: '',
  sliderimages: [],
  description: '',
  category: '',
  inStock: '',
});

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Filter empty inputs
  const sliderImages = [formData.slider1, formData.slider2, formData.slider3].filter(Boolean);

  const productData = {
    id: formData.id,
    title: formData.title,
    price: Number(formData.price),
    originalprice: Number(formData.originalprice),
    image: formData.image,
    sliderimages: sliderImages, // <-- Correct final format
    description: formData.description,
    category: formData.category,
    inStock: Number(formData.inStock),
  };

  const productRef = doc(db, 'products', formData.id);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    setStatus('❌ A product with this ID already exists!');
    return;
  }

  try {
    await setDoc(productRef, productData);
    setStatus('✅ Product added successfully!');
    setFormData({
      id: '',
      title: '',
      price: '',
      originalprice: '',
      image: '',
      slider1: '',
      slider2: '',
      slider3: '',
      sliderimages: [],
      description: '',
      category: '',
      inStock: '',
    });
  } catch (error) {
    console.error(error);
    setStatus('❌ Failed to upload product.');
  }
};

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="id" value={formData.id} onChange={handleChange} placeholder="Product ID (required)" className="w-full border p-2 rounded" required />
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />
        <input name="price" value={formData.price} onChange={handleChange} type="number" placeholder="Price" className="w-full border p-2 rounded" />
        <input name="originalprice" value={formData.originalprice} onChange={handleChange} type="number" placeholder="Original Price" className="w-full border p-2 rounded" />
        <input name="image" value={formData.image} onChange={handleChange} placeholder="Main Image URL" className="w-full border p-2 rounded" />
        <input name="slider1" value={formData.slider1} onChange={handleChange} placeholder="sliderimages URL" className="w-full border p-2 rounded" />
        <input name="slider2" value={formData.slider2} onChange={handleChange} placeholder="sliderimages URL" className="w-full border p-2 rounded" />
        <input name="slider3" value={formData.slider3} onChange={handleChange} placeholder="sliderimages URL" className="w-full border p-2 rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full border p-2 rounded" required />
        <input name="inStock" value={formData.inStock} onChange={handleChange} type="number" placeholder="Quantity" className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Add Product</button>
      </form>
      {status && <p className="text-center mt-4">{status}</p>}

      {/* <div className="mt-6 text-center">
        <ProductAddingScript/>
        </div> */}
    </div>
  );
}

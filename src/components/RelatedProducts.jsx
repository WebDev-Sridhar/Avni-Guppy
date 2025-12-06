import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ProductCard from './ProductCard'; // create one if not exists

export default function RelatedProducts({ category, currentProductId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      const q = query(
        collection(db, 'products'),
        where('category', '==', category)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => product.id !== currentProductId)
        .slice(0, 8); // Limit to 8 products
      setRelated(items);
    };

    if (category) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  if (related.length === 0) return null;

  return (
    <div className="mt-10 ">
      <h2 className="text-xl font-semibold mb-4 text-center">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

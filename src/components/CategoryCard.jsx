export default function CategoryCard({ title, image }) {
  return (
    <div className="flex flex-col items-center bg-white shadow rounded-2xl p-4 hover:scale-105 transition-transform cursor-pointer">
      <img src={image} alt={title} className="w-44 h-44 object-cover rounded-2xl mb-2" />
      <p className="font-semibold text-sm">{title}</p>
    </div>
  );
}

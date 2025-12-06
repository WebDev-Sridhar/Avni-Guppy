import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const generateLabel = (segment) => {
    return segment
      .replace(/-/g, ' ')         // replace hyphens with space
      .replace(/\b\w/g, c => c.toUpperCase()); // capitalize
  };

  return (
    <nav className="text-sm text-gray-600  px-4 ml-6 mt-24">
      <ol className="list-reset flex flex-wrap items-center space-x-1">
        <li>
          <Link to="/" className="text-teal-600 hover:underline">Home</Link>
        </li>
{pathnames.map((segment, index) => {
  const pathTo = `/${pathnames.slice(0, index + 1).join('/')}`;
  const isLast = index === pathnames.length - 1;
  const label = generateLabel(decodeURIComponent(segment));

  return (
    <li key={pathTo} className="flex items-center">
      <span className="mx-1">/</span>
      {isLast ? (
        <span className="text-gray-800 font-semibold">{label}</span>
      ) : (
        <Link to={pathTo} className="text-teal-600 hover:underline">
          {label}
        </Link>
      )}
    </li>
  );
})}
      </ol>
    </nav>
  );
}

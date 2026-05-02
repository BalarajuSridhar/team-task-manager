import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="text-center mt-20">
    <h1 className="text-4xl font-bold">404</h1>
    <p className="text-gray-600">Page not found</p>
    <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">
      Go Home
    </Link>
  </div>
);

export default NotFound;
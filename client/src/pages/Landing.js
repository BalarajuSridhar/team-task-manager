import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineClipboardList } from 'react-icons/hi';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar – brand lives only here */}
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <HiOutlineClipboardList className="text-3xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition" />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero – no brand name here */}
      <div className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-16 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left max-w-lg"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Manage teams,<br />
            <span className="text-indigo-600 dark:text-indigo-400">ship projects</span>
          </h2>
          <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto lg:mx-0">
            Assign tasks, track progress, and collaborate with role‑based access. Everything a modern team needs — beautifully simple.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              Start for free <HiArrowRight />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              I have an account
            </Link>
          </div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-50" />
            <svg viewBox="0 0 200 200" className="relative w-full h-full drop-shadow-xl">
              <rect x="40" y="35" width="120" height="130" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="2" />
              <rect x="60" y="50" width="80" height="8" rx="4" fill="#6366f1" />
              <circle cx="160" cy="135" r="16" fill="#34d399" opacity="0.9" />
              <path d="M154 135 L158 139 L166 131" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <rect x="60" y="70" width="90" height="6" rx="3" fill="#e0e7ff" />
              <rect x="60" y="85" width="75" height="6" rx="3" fill="#e0e7ff" />
              <rect x="60" y="100" width="85" height="6" rx="3" fill="#e0e7ff" />
              <circle cx="170" cy="45" r="10" fill="#f59e0b" />
              <path d="M166 49 L170 43 L174 49" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </motion.div>
      </div>

      <div className="py-6 text-center text-sm text-gray-400 dark:text-gray-600">
        Built with ❤️ · Secure · No credit card required
      </div>
    </div>
  );
};

export default Landing;
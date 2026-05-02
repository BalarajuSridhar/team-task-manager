import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiShieldCheck, HiUsers, HiChartBar } from 'react-icons/hi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Now with Kanban boards</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Manage teams,{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ship projects
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
              Assign tasks, track progress with drag‑and‑drop Kanban boards, and collaborate with role‑based access. Everything a modern team needs — beautifully simple.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Start for free <HiArrowRight className="text-lg" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                I have an account
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1"><HiShieldCheck className="text-green-500" /> Secure</span>
              <span className="flex items-center gap-1"><HiUsers className="text-blue-500" /> Team ready</span>
              <span className="flex items-center gap-1"><HiChartBar className="text-purple-500" /> Analytics</span>
            </div>
          </motion.div>

          {/* Right - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8">
                {/* Mini Kanban */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="w-20 h-2 bg-indigo-600 rounded-full mb-2"></div>
                    <div className="w-14 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-400 mb-2">To Do</div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                      <div className="w-full h-2 bg-indigo-200 dark:bg-indigo-800 rounded-full mb-2"></div>
                      <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                      <div className="w-full h-2 bg-orange-200 dark:bg-orange-800 rounded-full mb-2"></div>
                      <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-400 mb-2">Doing</div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800">
                      <div className="w-full h-2 bg-blue-300 dark:bg-blue-600 rounded-full mb-2"></div>
                      <div className="w-2/3 h-2 bg-blue-100 dark:bg-blue-800 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-400 mb-2">Done</div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800">
                      <div className="w-full h-2 bg-green-300 dark:bg-green-600 rounded-full mb-2"></div>
                      <div className="w-1/2 h-2 bg-green-100 dark:bg-green-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
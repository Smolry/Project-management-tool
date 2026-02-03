import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  FiFolder, FiCheckSquare, FiUsers, FiTrendingUp, FiZap, FiShield,
  FiArrowRight, FiCheck
} from 'react-icons/fi';

export default function Home() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <FiFolder size={28} />,
      title: 'Project Management',
      description: 'Create and organize unlimited projects with ease'
    },
    {
      icon: <FiCheckSquare size={28} />,
      title: 'Task Tracking',
      description: 'Assign tasks and track progress in real-time'
    },
    {
      icon: <FiUsers size={28} />,
      title: 'Team Collaboration',
      description: 'Invite team members and work together seamlessly'
    },
    {
      icon: <FiTrendingUp size={28} />,
      title: 'Progress Analytics',
      description: 'Visualize project completion and performance metrics'
    },
    {
      icon: <FiZap size={28} />,
      title: 'Fast & Responsive',
      description: 'Lightning-fast interface that works on all devices'
    },
    {
      icon: <FiShield size={28} />,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with Auth0 authentication'
    }
  ];

  const benefits = [
    'Unlimited projects and tasks',
    'Team collaboration tools',
    'Real-time progress tracking',
    'Beautiful, modern interface',
    'Mobile responsive design',
    'Secure authentication'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/50 to-purple-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8 fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <FiFolder className="text-white" size={32} />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ProjectFlow
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 fade-in-delay-1">
              Manage Projects with
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Elegance & Ease
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto fade-in-delay-2">
              The beautiful project management tool that helps teams collaborate,
              track progress, and deliver exceptional results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 fade-in-delay-3">
              <button
                onClick={() => loginWithRedirect()}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 shadow-xl"
              >
                <span>Get Started Free</span>
                <FiArrowRight size={20} />
              </button>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 border-2 border-gray-200"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make project management effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why teams choose ProjectFlow
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Join thousands of teams who trust ProjectFlow to manage their projects efficiently.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-white"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiCheck size={16} />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <FiFolder className="text-indigo-600" size={48} />
                    </div>
                    <p className="text-2xl font-bold text-white mb-2">Start Building Today</p>
                    <p className="text-indigo-100">No credit card required</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join ProjectFlow today and experience a better way to manage projects.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-semibold rounded-2xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 mx-auto shadow-xl"
          >
            <span>Get Started Free</span>
            <FiArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FiFolder className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold">ProjectFlow</span>
            </div>
            <p className="text-gray-400">© 2026 ProjectFlow. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

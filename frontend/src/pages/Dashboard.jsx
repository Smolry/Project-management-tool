import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFolder, FiCheckSquare, FiPlus, FiExternalLink, FiTrendingUp,
  FiClock, FiUsers, FiActivity, FiArrowRight
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const { user } = useAuth0();
  const [dbUser, setDbUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  function sessionSet(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  function sessionGet(key) {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const cached = sessionGet('dbUser');
      if (cached) {
        setDbUser(cached);
        return;
      }
      
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sub: user.sub,
            name: user.name,
            email: user.email,
            picture: user.picture,
            email_verified: user.email_verified
          })
        });

        const data = await res.json();
        setDbUser(data);
        sessionSet('dbUser', data);
      } catch (err) {
        console.error('Error fetching user:', err);
        toast.error('Failed to load user data');
      }
    };

    if (user?.sub) {
      fetchUserFromDB();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const projectsCached = sessionGet('projects');
        if (projectsCached) {
          setProjects(projectsCached);
        } else {
          const projectsRes = await fetch(`${API_URL}/api/projects/me`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sub: user.sub })
          });
          
          if (projectsRes.ok) {
            const projectsData = await projectsRes.json();
            setProjects(projectsData);
            sessionSet('projects', projectsData);
          }
        }

        const tasksCached = sessionGet('tasks');
        if (tasksCached) {
          setTasks(tasksCached);
        } else {
          const tasksRes = await fetch(`${API_URL}/api/tasks/assigned/${user.sub}`);
          
          if (tasksRes.ok) {
            const tasksData = await tasksRes.json();
            setTasks(tasksData);
            sessionSet('tasks', tasksData);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.sub) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner message="Loading your dashboard..." />
      </>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl fade-in">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-5 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full opacity-5 -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FiActivity className="text-white" size={24} />
                </div>
                <span className="text-white/80 font-medium">Dashboard Overview</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg text-white/90 max-w-2xl">
                You have {tasks.length} active tasks across {projects.length} projects. 
                {completionRate > 0 && ` You're making great progress at ${completionRate}% completion rate!`}
              </p>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<FiFolder className="text-indigo-600" size={28} />}
              title="Total Projects"
              value={projects.length}
              subtitle="Active workspaces"
              color="from-indigo-500 to-indigo-600"
              bgColor="bg-indigo-50"
              trend="+2 this week"
              delay="fade-in-delay-1"
            />
            <StatCard
              icon={<FiCheckSquare className="text-emerald-600" size={28} />}
              title="Active Tasks"
              value={tasks.length}
              subtitle="Tasks assigned to you"
              color="from-emerald-500 to-emerald-600"
              bgColor="bg-emerald-50"
              trend={`${inProgressTasks} in progress`}
              delay="fade-in-delay-2"
            />
            <StatCard
              icon={<FiTrendingUp className="text-purple-600" size={28} />}
              title="Completed"
              value={completedTasks}
              subtitle="Tasks finished"
              color="from-purple-500 to-purple-600"
              bgColor="bg-purple-50"
              trend={`${completionRate}% completion`}
              delay="fade-in-delay-3"
            />
            <StatCard
              icon={<FiClock className="text-amber-600" size={28} />}
              title="Pending"
              value={tasks.filter(t => t.status === 'pending').length}
              subtitle="Awaiting action"
              color="from-amber-500 to-amber-600"
              bgColor="bg-amber-50"
              trend="Need attention"
              delay="fade-in-delay-1"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Projects - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden fade-in-delay-2">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                      <FiFolder className="text-indigo-600" />
                      <span>Recent Projects</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Your active workspaces</p>
                  </div>
                  <Link
                    to="/projects"
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    <span>View All</span>
                    <FiArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {projects.length > 0 ? (
                  <div className="space-y-3">
                    {projects.slice(0, 5).map((project, index) => (
                      <Link
                        key={project._id}
                        to={`/projects/${project._id}`}
                        className="block group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="p-5 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 card-hover">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                  <FiFolder className="text-white" size={18} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {project.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 capitalize">{project.status}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
                                {project.type}
                              </span>
                              <FiExternalLink className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FiFolder className="text-indigo-600" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 mb-6">Start by creating your first project</p>
                    <Link
                      to="/projects"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      <FiPlus size={20} />
                      <span>Create Project</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Your Tasks - Takes 1 column */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden fade-in-delay-3">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                      <FiCheckSquare className="text-emerald-600" />
                      <span>Your Tasks</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{tasks.length} total tasks</p>
                  </div>
                  <Link
                    to="/tasks"
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center space-x-1"
                  >
                    <span>View all</span>
                    <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {tasks.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {tasks.slice(0, 6).map((task, index) => (
                      <div
                        key={task._id}
                        className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm flex-1">
                            {task.title}
                          </h3>
                          <StatusBadge status={task.status} />
                        </div>
                        <p className="text-xs text-gray-500 flex items-center space-x-1">
                          <FiFolder size={12} />
                          <span>{task.project?.name || 'Unknown Project'}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                      <FiCheckSquare className="text-emerald-600" size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">No tasks assigned yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 fade-in-delay-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FiPlus className="text-white" size={18} />
              </div>
              <span>Quick Actions</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickActionCard
                to="/projects"
                icon={<FiPlus size={28} />}
                title="New Project"
                description="Start a new workspace"
                color="from-indigo-500 to-indigo-600"
                bgColor="bg-indigo-50"
              />
              <QuickActionCard
                to="/joinproject"
                icon={<FiUsers size={28} />}
                title="Join Project"
                description="Use an invite code"
                color="from-emerald-500 to-emerald-600"
                bgColor="bg-emerald-50"
              />
              <QuickActionCard
                to="/profile"
                icon={<FiUser size={28} />}
                title="Update Profile"
                description="Edit your information"
                color="from-purple-500 to-purple-600"
                bgColor="bg-purple-50"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, title, value, subtitle, color, bgColor, trend, delay = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 card-hover ${delay}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center shadow-md`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' }
  };

  const style = styles[status] || styles.pending;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      <span>{status || 'pending'}</span>
    </span>
  );
}

function QuickActionCard({ to, icon, title, description, color, bgColor }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-indigo-300 p-6 transition-all duration-300 hover:shadow-xl card-hover"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <div className={`bg-gradient-to-br ${color} bg-clip-text text-transparent`}>
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500">
          {description}
        </p>
        <div className="mt-4 flex items-center text-indigo-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Get started</span>
          <FiArrowRight className="ml-2" size={16} />
        </div>
      </div>
    </Link>
  );
}

import { FiUser } from 'react-icons/fi';

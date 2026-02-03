import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiFolder, FiPlus, FiX, FiGithub, FiLink, FiFileText, 
  FiUsers, FiTrendingUp, FiArrowRight, FiTrash2, FiExternalLink
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

function sessionGet(key) {
  const raw = sessionStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function sessionSet(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export default function Projects() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [projectInit, setProjectInit] = useState({ name: '', type: 'personal' });
  const [popupVisibility, setPopupVisibility] = useState(false);
  const [formDetails, setFormDetails] = useState({
    description: '', githubLink: '', deploymentUrl: '', environmentNotes: '', members: []
  });
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const cached = sessionGet('projects');
      if (cached) {
        setProjects(cached);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/projects/me`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sub: user.sub })
        });

        if (res.ok) {
          const data = await res.json();
          setProjects(data);
          sessionSet('projects', data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        toast.error('Failed to fetch projects');
      }
    };

    if (user?.sub) fetchProjects();
  }, [user]);

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch(`${API_URL}/api/projects/progress-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds: projects.map(p => p._id) })
      });
      const progressArray = await res.json();
      const map = {};
      for (const item of progressArray) {
        map[item.projectId] = item;
      }
      setProgressMap(map);
    };

    if (projects.length > 0) fetchProgress();
  }, [projects]);

  const handleConfirm = async () => {
    if (!projectInit.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectInit,
          ...formDetails,
          sub: user.sub
        })
      });

      if (res.ok) {
        const newProject = await res.json();
        toast.success('Project created successfully!');
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        sessionSet('projects', updatedProjects);
        navigate(`/projects/${newProject._id}`);
        resetForm();
      } else {
        toast.error('Failed to create project');
      }
    } catch (err) {
      console.error('Project creation error:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
   
  const resetForm = () => {
    setProjectInit({ name: '', type: 'personal' });
    setFormDetails({
      description: '', githubLink: '', deploymentUrl: '', environmentNotes: '', members: []
    });
    setMemberEmail('');
    setPopupVisibility(false);
  };

  const addMember = () => {
    if (memberEmail && !formDetails.members.includes(memberEmail)) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
      setFormDetails(prev => ({
        ...prev,
        members: [...prev.members, memberEmail]
      }));
      setMemberEmail('');
      toast.success('Member added');
    } else if (formDetails.members.includes(memberEmail)) {
      toast.error('Member already added');
    }
  };

  const removeMember = (email) => {
    setFormDetails(prev => ({
      ...prev,
      members: prev.members.filter(m => m !== email)
    }));
    toast.success('Member removed');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FiFolder className="text-white" size={24} />
                  </div>
                  <span>Projects</span>
                </h1>
                <p className="text-gray-500">Manage and track your projects</p>
              </div>
              <button
                onClick={() => setPopupVisibility(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 shadow-md"
              >
                <FiPlus size={20} />
                <span>Create Project</span>
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in-delay-1">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  progress={progressMap[project._id]}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 fade-in-delay-1">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <FiFolder className="text-indigo-600" size={64} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No projects yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Get started by creating your first project and begin organizing your work
              </p>
              <button
                onClick={() => setPopupVisibility(true)}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 shadow-lg"
              >
                <FiPlus size={24} />
                <span>Create Your First Project</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {popupVisibility && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FiPlus className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Create New Project</h2>
                    <p className="text-indigo-100 text-sm">Set up your project workspace</p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Project Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Project Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['personal', 'team'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setProjectInit({ ...projectInit, type })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        projectInit.type === type
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {type === 'personal' ? (
                          <FiUser className={projectInit.type === type ? 'text-indigo-600' : 'text-gray-400'} size={24} />
                        ) : (
                          <FiUsers className={projectInit.type === type ? 'text-indigo-600' : 'text-gray-400'} size={24} />
                        )}
                        <span className={`font-semibold capitalize ${
                          projectInit.type === type ? 'text-indigo-600' : 'text-gray-600'
                        }`}>
                          {type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectInit.name}
                  onChange={e => setProjectInit({ ...projectInit, name: e.target.value })}
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <FiFileText size={16} />
                  <span>Description</span>
                </label>
                <textarea
                  placeholder="Describe your project..."
                  value={formDetails.description}
                  onChange={e => setFormDetails({ ...formDetails, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                  rows="4"
                />
              </div>

              {/* Links Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <FiGithub size={16} />
                    <span>GitHub Link</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formDetails.githubLink}
                    onChange={e => setFormDetails({ ...formDetails, githubLink: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <FiLink size={16} />
                    <span>Deployment URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formDetails.deploymentUrl}
                    onChange={e => setFormDetails({ ...formDetails, deploymentUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Environment Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Environment Notes
                </label>
                <textarea
                  placeholder="Add environment setup notes..."
                  value={formDetails.environmentNotes}
                  onChange={e => setFormDetails({ ...formDetails, environmentNotes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                  rows="3"
                />
              </div>

              {/* Team Members (only for team projects) */}
              {projectInit.type === 'team' && (
                <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <FiUsers size={18} />
                    <span>Team Members</span>
                  </label>
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="email"
                      placeholder="Enter member email"
                      value={memberEmail}
                      onChange={e => setMemberEmail(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addMember()}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                    <button
                      onClick={addMember}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <FiPlus size={18} />
                      <span>Add</span>
                    </button>
                  </div>

                  {formDetails.members.length > 0 && (
                    <div className="space-y-2">
                      {formDetails.members.map((email, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <FiUsers className="text-indigo-600" size={14} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{email}</span>
                          </div>
                          <button
                            onClick={() => removeMember(email)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-3xl border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FiPlus size={20} />
                    <span>Create Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectCard({ project, progress, index }) {
  const percentage = progress?.percentage || 0;
  const completed = progress?.completed || 0;
  const total = progress?.total || 0;

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 card-hover"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <FiFolder className="text-white" size={24} />
          </div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white capitalize">
            {project.type}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">
          {project.name}
        </h3>
        <p className="text-indigo-100 text-sm capitalize">{project.status}</p>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
              <FiTrendingUp size={14} />
              <span>Progress</span>
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {percentage}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {completed} of {total} tasks completed
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-600">View Details</span>
          <FiArrowRight className="text-indigo-600 group-hover:translate-x-2 transition-transform" size={20} />
        </div>
      </div>
    </Link>
  );
}

import { FiUser } from 'react-icons/fi';

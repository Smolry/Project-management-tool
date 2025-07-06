import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // Fetch projects for the logged-in user
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
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    if (user?.sub) fetchProjects();
  }, [user]);

  //fetch task completion for projects
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


  // Handle form confirmation
  const handleConfirm = async () => {
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
        alert('Project created successfully!');
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        sessionSet('projects', updatedProjects);
        navigate(`/projects/${newProject._id}`);
        resetForm();
      } else {
        alert('Failed to create project.');
      }
    } catch (err) {
      console.error('Project creation error:', err);
      alert('Something went wrong.');
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

  return (
    <div>
      <h1>Projects</h1>

      <h2>Create New Project</h2>
      <label>Project Type:</label>
      <select
        value={projectInit.type}
        onChange={e => setProjectInit({ ...projectInit, type: e.target.value })}
      >
        <option value="personal">Personal</option>
        <option value="team">Team</option>
      </select><br />

      <label>Project Name:</label>
      <input
        type="text"
        value={projectInit.name}
        onChange={e => setProjectInit({ ...projectInit, name: e.target.value })}
        placeholder="Enter project name"
        required
      /><br />

      <button onClick={() => setPopupVisibility(true)}>Create</button>

      {popupVisibility && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', width: '400px' }}>
            <h3>Confirm Project Details</h3>
            <p><strong>Name:</strong> {projectInit.name}</p>
            <p><strong>Type:</strong> {projectInit.type}</p>

            <textarea
              placeholder="Description"
              value={formDetails.description}
              onChange={e => setFormDetails({ ...formDetails, description: e.target.value })}
            /><br />

            <input
              type="url"
              placeholder="GitHub Link"
              value={formDetails.githubLink}
              onChange={e => setFormDetails({ ...formDetails, githubLink: e.target.value })}
            /><br />

            <input
              type="url"
              placeholder="Deployment URL"
              value={formDetails.deploymentUrl}
              onChange={e => setFormDetails({ ...formDetails, deploymentUrl: e.target.value })}
            /><br />

            <textarea
              placeholder="Environment Notes"
              value={formDetails.environmentNotes}
              onChange={e => setFormDetails({ ...formDetails, environmentNotes: e.target.value })}
            /><br />

            {projectInit.type === 'team' && (
              <>
                <h4>Team Members</h4>
                <input
                  type="email"
                  placeholder="Enter member email"
                  value={memberEmail}
                  onChange={e => setMemberEmail(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (memberEmail && !formDetails.members.includes(memberEmail)) {
                      setFormDetails(prev => ({
                        ...prev,
                        members: [...prev.members, memberEmail]
                      }));
                      setMemberEmail('');
                    }
                  }}
                >
                  Add
                </button>

                <ul>
                  {formDetails.members.map((email, i) => (
                    <li key={i}>
                      {email}
                      <button
                        onClick={() =>
                          setFormDetails(prev => ({
                            ...prev,
                            members: prev.members.filter(m => m !== email)
                          }))
                        }
                        style={{ marginLeft: '10px' }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={() => setPopupVisibility(false)} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </div>
      )}

      <h2>Created Projects</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((p, i) => (
            <li key={i}>
              <strong>{p.name}</strong> —<p>
                {progressMap[p._id]? `Progress: ${progressMap[p._id].percentage}% (${progressMap[p._id].completed}/${progressMap[p._id].total})`: 'Loading progress...'}
                </p> — <a href={`/projects/${p._id}`}>View</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects yet.</p>
      )}

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

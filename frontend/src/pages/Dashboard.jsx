import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL;


export default function Dashboard() {
  const { user, logout } = useAuth0();
  const [dbUser, setDbUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [form, setForm] = useState({
    sub: '',
    name: '',
    email: '',
    email_verified: '',
    picture: ''
  });

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
        sessionStorage.setItem("user", JSON.stringify(data));

        const dismissed = sessionGet("profilePopupDismissed");
        if ((!data.name || !data.email) && !dismissed) {
          setForm({
            sub: data.sub || user.sub || '',
            name: data.name || user.name || '',
            email: data.email || user.email || '',
            email_verified: data.email_verified?.toString() || 'false',
            picture: data.picture || user.picture || ''
          });
          setShowProfilePopup(true);
        }

      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    if (user?.sub) {
      fetchUserFromDB();
    }
  }, [user]);

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

    const fetchTasks = async () => {
      const cached = sessionGet('tasks');
      if (cached) {
        setTasks(cached);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/tasks/assigned/${user.sub}`);
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
          sessionSet('tasks', data);
        } else {
          console.error('Failed to load tasks');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    if (user?.sub) {
      fetchProjects();
      fetchTasks();
    }
  }, [user]);

 const handlePopupSave = async (e) => {
  e.preventDefault();

  try {
    const currentSub = user.sub;

    const updatedForm = {
      ...form,
      sub: currentSub // ✅ Always a string!
    };

    console.log("Submitting form data:", updatedForm);

    const res = await fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedForm)
    });

    if (res.ok) {
      const updated = await res.json();
      setDbUser(updated);
      sessionSet('dbUser', updated);
      setShowProfilePopup(false);
      sessionSet('profilePopupDismissed', true);
      alert('Profile updated successfully');
    } else {
      alert('Failed to update profile');
    }
  } catch (err) {
    console.error('Error updating profile:', err);
    alert('Server error while updating profile');
  }
};



  const { sub: _, ...dbCompare } = dbUser || {};
  const { sub: __, ...formCompare } = form;
  const isModified = JSON.stringify(dbCompare) !== JSON.stringify(formCompare);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.name}</p>

      <h2>User Data from Mongodb User database</h2>
      {dbUser && (
        <>
          <pre style={{ textAlign: 'left' }}>
            {JSON.stringify(dbUser, null, 2)}
          </pre>
          <Link to="/profile"><button>Profile</button></Link>
        </>
      )}

      <div id='projects section'>
        <h2>Ongoing Projects</h2>
        {projects.length > 0 ? (
          <ul>
            {projects.map((p, i) => (
              <li key={i}>
                <strong>{p.name}</strong> — {p.status} —
                <a href={`/projects/${p._id}`}>View</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects yet.</p>
        )}
        <Link to="/projects">
          <button>Go to Projects</button>
        </Link>
      </div>

      <div>
        <h2>Ongoing Tasks</h2>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((t, i) => (
              <li key={i}>
                <strong>{t.title}</strong> — {t.status} —
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects yet.</p>
        )}
        <Link to="/tasks">
          <button>Go to Tasks</button>
        </Link>
      </div>

      <button onClick={() => {
        sessionStorage.clear();
        logout({ logoutParams: { returnTo: window.location.origin } });
      }}>Log out</button>

      {showProfilePopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '20px', borderRadius: '10px',
            width: '300px', textAlign: 'center'
          }}>
            <h3>Complete Your Profile</h3>
            <form onSubmit={handlePopupSave}>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              /><br />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              /><br />
              <input
                type="text"
                placeholder="Email Verified"
                value={form.email_verified}
                onChange={(e) => setForm({ ...form, email_verified: e.target.value })}
              /><br />
              <input
                type="text"
                placeholder="Picture URL"
                value={form.picture}
                onChange={(e) => setForm({ ...form, picture: e.target.value })}
              /><br />
              <button type="submit" disabled={!isModified}>Save</button>
            </form>
          </div>
        </div>
      )}

      <Link to="/joinProject"><button>Join project</button></Link>
    </div>
  )
}

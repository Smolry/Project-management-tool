import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

export default function Tasks() {
  const { user } = useAuth0();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const sessionKey = user?.sub ? `tasks-${user.sub}` : null;

  const sessionSetTasks = (data) => {
    if (sessionKey) {
      sessionStorage.setItem(sessionKey, JSON.stringify(data));
      setTasks(data);
    }
  };

  useEffect(() => {
    if (!user?.sub) return;

    const cached = sessionStorage.getItem(sessionKey);
    if (cached) {
      setTasks(JSON.parse(cached));
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tasks/assigned/${user.sub}`);
        if (res.ok) {
          const data = await res.json();
          sessionSetTasks(data);
        } else {
          console.error('Failed to load tasks');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchTasks();
  }, [user]);

  return (
    <div>
      <h2>My Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        <ul>
          {tasks.map((task, i) => (
            <li key={i} style={{ marginBottom: '10px' }}>
              <strong>{task.title}</strong><br />
              <span>Project: {task.project?.name}</span><br />
              <span>Assigned By: {task.project?.owner?.name || 'Unknown'}</span>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate(-1)}>  back  </button>
    </div>
  );
}

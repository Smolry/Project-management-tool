import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Projectdetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [originalMembers, setOriginalMembers] = useState([]);

  const sessionSetProject = (data, taskList = tasks) => {
    const combined = { ...data, tasks: taskList };
    sessionStorage.setItem(`project-${id}`, JSON.stringify(combined));
    setProject(data);
    setTasks(taskList);
  };

  useEffect(() => {
    const cached = sessionStorage.getItem(`project-${id}`);
    if (cached) {
      const data = JSON.parse(cached);
      setProject(data);
      setTasks(data.tasks || []);
      setMembers(data.members || []);
      setOriginalMembers(data.members.map(m => m._id));
    }

    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          const taskRes = await fetch(`${API_URL}/api/projects/${id}/tasks`);
          const taskData = taskRes.ok ? await taskRes.json() : [];
          sessionSetProject(data, taskData);
          setMembers(data.members || []);
          setOriginalMembers(data.members.map(m => m._id));
        } else {
          console.error('project not found');
        }
      } catch (err) {
        console.error('Fetch error: ', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects/${id}/tasks/users`);
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchProject();
    fetchUsers();
  }, [id]);
  const dbUser = JSON.parse(sessionStorage.getItem('dbUser'));


  if (!project) return <p>Loading...</p>;

  const handleSaveChanges = async () => {
    const currentIds = members.map(m => m._id);
    const added = currentIds.filter(id => !originalMembers.includes(id));
    const removed = originalMembers.filter(id => !currentIds.includes(id));

    try {
      for (let id of added) {
        const member = members.find(m => m._id === id);
        if (!member || !member.email) continue;
        await fetch(`${API_URL}/api/projects/${project._id}/add-member`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: member.email })
        });
      }

      for (let id of removed) {
        const member = members.find(m => m._id === id);
        const email = member?.email || '';
        if (!email) continue;
        await fetch(`${API_URL}/api/projects/${project._id}/remove-member`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, removeTasks: true })
        });
      }

      alert("Changes saved.");
      setOriginalMembers(currentIds);
      const updated = { ...project, members };
      sessionSetProject(updated);
    } catch (err) {
      console.error('Error saving changes', err);
      alert('Could not save changes');
    }
  };

  const handleAddMember = () => {
    if (!memberEmail || members.find(m => m.email === memberEmail)) return;
    const updatedMembers = [...members, { email: memberEmail }];
    setMembers(updatedMembers);
    setMemberEmail("");
    const updated = { ...project, members: updatedMembers };
    sessionSetProject(updated);
  };

  const handleRemoveUser = async (email) => {
    try {
      await fetch(`${API_URL}/api/projects/${project._id}/remove-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, removeTasks: true })
      });
      const updatedMembers = members.filter(m => m.email !== email);
      const updatedTasks = tasks.filter(t => t.assignedTo?.email !== email);
      setUsers(prev => prev.filter(u => u.email !== email));
      setTasks(updatedTasks);
      setMembers(updatedMembers);
      const updated = { ...project, members: updatedMembers };
      sessionSetProject(updated, updatedTasks);
      alert('Member removed with tasks');
    } catch (err) {
      console.error('Error removing user:', err);
      alert('Could not remove member');
    }
  };

  const handleRemoveTask = async (taskId) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to remove task');
      }

      const updatedTasks = tasks.filter(t => t._id !== taskId);
      setTasks(updatedTasks);
      sessionSetProject(project, updatedTasks);

      alert('Task removed successfully');
    } catch (err) {
      console.error('Error removing Task:', err);
      alert('Could not remove Task');
    }
  };

  const handleReassignTask = async (taskId, newAssigneeEmail) => {
    try {
      console.log("Reassigning task:", taskId, "to", newAssigneeEmail);
      const res = await fetch(`${API_URL}/api/tasks/${taskId}/reassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAssigneeEmail })
      });

      if (!res.ok) {
        throw new Error('Failed to reassign task');
      }

      const updatedTask = await res.json();
      const updatedTasks = tasks.map(t => (t._id === updatedTask._id ? updatedTask : t));
      setTasks(updatedTasks);
      sessionSetProject(project, updatedTasks);

      alert('Task reassigned');
    } catch (err) {
      console.error("Error reassigning task: ", err);
      alert('Could not reassign task');
    }
  };

  return (
    <div>
      {project.owner._id === dbUser._id && <span><h2>(You are the Owner)</h2></span>}

      <h2>{project.name}</h2>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>GitHub:</strong> <a href={project.githubLink} target="_blank">{project.githubLink}</a></p>
      <p><strong>Deployment:</strong> <a href={project.deploymentUrl} target="_blank">{project.deploymentUrl}</a></p>
      <p><strong>Environment Notes:</strong></p>
      <p><strong>Project type: </strong> {project.type}</p>
      <pre>{project.environmentNotes}</pre>

      {project.type === 'team' && (
        <div>
          <h3>Team Members</h3>
          <input
            type="email"
            value={memberEmail}
            onChange={e => setMemberEmail(e.target.value)}
            placeholder="Enter member email"
          />
          <button onClick={handleAddMember}>Add</button>

          <ul>
            {members.map((m, i) => (
              <li key={i}>
                {m.name || m.email}
                <button onClick={() => handleRemoveUser(m.email)} style={{ marginLeft: '10px' }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={() => setMembers(originalMembers.map(id => members.find(m => m._id === id)))} style={{ marginLeft: '10px' }}>
            Discard Changes
          </button>
        </div>
      )}

      {users.length > 0 && (
        <div>
          <h3>All Visible Users on Project</h3>
          <ul>
            {users.map((u, i) => (
              <li key={i}>
                {u.name || u.email}
                <button onClick={() => handleRemoveUser(u.email)} style={{ marginLeft: '10px' }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>Tasks</h3>
      <ul>
        {tasks.filter(task => task && task.title).map((t, i) => (
          <li key={i}>
            {t.title} - {t.status}
            {t.assignedTo
              ? <> (Assigned To: {t.assignedTo.name || t.assignedTo.email})</>
              : <> (Unassigned)</>}
            <button onClick={() => handleRemoveTask(t._id)}>
              Remove task
            </button>
            <div>
              <select
                value={t.assignedTo?.email || ""}
                onChange={(e) => handleReassignTask(t._id, e.target.value)}>
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.email} value={member.email}>
                    {member.email}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={async e => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/api/projects/${id}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: taskTitle, assignedTo })
        });
        if (res.ok) {
          const newTask = await res.json();
          const updatedTasks = [...tasks, newTask];
          setTasks(updatedTasks);
          sessionSetProject(project, updatedTasks);
          setTaskTitle('');
          setAssignedTo('');
        }
      }}>
        <input
          type="text"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
          placeholder="New task"
          required
        />
        <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
          <option value="">Assign To</option>
          {members.map(member => (
            <option key={member.email || member.name} value={member.email || member.name}>
              {member.email || member.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Task</button>
      </form>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Invite = require('./models/Invite');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

function generateUniqueCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function generateUniqueInviteCode() {
  let code, exists;
  do {
    code = generateUniqueCode(10);
    exists = await Invite.findOne({ code });
  } while (exists);
  return code;
}

// POST /api/users/me - Find or create user
app.post('/api/users/me', async (req, res) => {
  const { sub, name, email, picture, email_verified } = req.body;
  if (!sub || !email) return res.status(400).json({ error: 'Missing sub or email' });

  try {
    let user = await User.findOne({ sub: { $in: [sub] } });

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        if (!user.sub.includes(sub)) user.sub.push(sub);
        await user.save();
      } else {
        user = new User({ sub: [sub], name, email, picture, email_verified });
        await user.save();
      }
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error in /api/users/me:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/me - Update user by sub

app.put('/api/users/me', async (req, res) => {
  console.log('UPDATE RECEIVED:', req.body);
  const { sub, name, email, picture, email_verified } = req.body;
  if (!sub) return res.status(400).json({ error: 'Missing sub' });

  try {
    // Try to find user by sub
    let user = await User.findOne({ sub: { $in: Array.isArray(sub) ? sub : [sub] } });

    // If not found, try to find by email
    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        // If sub is not already in the array, add it
        if (!user.sub.includes(sub)) {
          user.sub.push(sub);
        }
      }
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update user fields
    user.name = name;
    user.email = email;
    user.picture = picture;
    user.email_verified = email_verified === 'true' || email_verified === true;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Updated endpoints where sub was used:
app.post('/api/projects', async (req, res) => {
  const { sub, name, description, type, status, githubLink, deploymentUrl, environmentNotes, members } = req.body;
  try {
    const user = await User.findOne({ sub: { $in: [sub] } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newProject = new Project({
      name, description, type, status, githubLink, deploymentUrl, environmentNotes,
      owner: user._id,
      members: members ? await User.find({ email: { $in: members } }).then(res => res.map(u => u._id)) : []
    });

    const savedProject = await newProject.save();
    user.projects.push(savedProject._id);
    await user.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'server error' });
  }
});

app.post('/api/projects/me', async (req, res) => {
  const { sub } = req.body;
  if (!sub) return res.status(400).json({ error: 'sub missing' });

  try {
    const user = await User.findOne({ sub: { $in: [sub] } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const projects = await Project.find({ owner: user._id });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/tasks/assigned/:sub', async (req, res) => {
  try {
    const user = await User.findOne({ sub: { $in: [req.params.sub] } });
    if (!user) return res.status(404).json({ error: 'user not found' });

    const tasks = await Task.find({ assignedTo: user._id })
      .populate('project', 'name owner')
      .populate({ path: 'project', populate: { path: 'owner', select: 'name email' } });

    res.json(tasks);
  } catch (err) {
    console.error('error fetching assigned tasks', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /api/projects/:id - Get a project with owner and members populated
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) return res.status(404).json({ error: 'Project not found' });

    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/projects/join', async (req, res) => {
  const { code, sub } = req.body;

  try {
    const invite = await Invite.findOne({ code }).populate('project');
    if (!invite) return res.status(404).json({ error: 'invalid invite code' });
    if (invite.expiresAt < Date.now()) {
      await Invite.deleteOne({ _id: invite._id });
      return res.status(400).json({ error: 'Invite code expired' });
    }

    const user = await User.findOne({ sub: { $in: [sub] } });
    if (!user) return res.status(404).json({ error: 'user not found' });

    const project = invite.project;
    if (!project.members.includes(user._id)) {
      project.members.push(user._id);
      await project.save();
    }

    await Invite.deleteOne({ _id: invite._id });
    res.json({ message: 'Joined project', projectId: project._id });
  } catch (err) {
    console.error('Join error : ', err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST /api/projects/progress-batch - Get progress for multiple projects
app.post('/api/projects/progress-batch', async (req, res) => {
  try {
    const { projectIds } = req.body;
    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ error: 'projectIds must be an array' });
    }

    // For each project, count completed and total tasks
    const results = await Promise.all(projectIds.map(async (projectId) => {
      const tasks = await Task.find({ project: projectId });
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'completed').length;
      const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { projectId, percentage, completed, total };
    }));

    res.json(results);
  } catch (err) {
    console.error('Error in progress-batch:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/projects/:id/tasks - Create a new task for a project
app.post('/api/projects/:id/tasks', async (req, res) => {
  try {
    const { title, assignedTo } = req.body;
    const projectId = req.params.id;

    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Find assignee if provided
    let assigneeId = null;
    if (assignedTo) {
      const assignee = await User.findOne({ email: assignedTo });
      if (assignee) {
        assigneeId = assignee._id;
      }
    }

    // Create new task
    const task = new Task({
      title,
      project: projectId,
      assignedTo: assigneeId,
      status: 'todo'
    });

    const savedTask = await task.save();
    
    // Populate task with assignee details
    const populatedTask = await Task.findById(savedTask._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    res.status(201).json(populatedTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

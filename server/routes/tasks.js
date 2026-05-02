const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// Get tasks (optionally filter by projectId)
router.get('/', auth(), async (req, res) => {
  const { projectId } = req.query;
  const where = {};
  if (projectId) where.projectId = projectId;

  try {
    let tasks;
    if (req.user.role === 'ADMIN') {
      tasks = await prisma.task.findMany({
        where,
        include: { assignee: { select: { id: true, name: true } } },
      });
    } else {
      const memberProjects = await prisma.projectMember.findMany({
        where: { userId: req.user.id },
        select: { projectId: true },
      });
      const projectIds = memberProjects.map((m) => m.projectId);
      tasks = await prisma.task.findMany({
        where: {
          ...where,
          OR: [
            { projectId: { in: projectIds } },
            { assignedTo: req.user.id },
          ],
        },
        include: { assignee: { select: { id: true, name: true } } },
      });
    }
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create task (admin only)
router.post(
  '/',
  auth(['ADMIN']),
  [
    body('title').notEmpty(),
    body('projectId').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, priority, status, dueDate, projectId, assignedTo } = req.body;
    try {
      const task = await prisma.task.create({
        data: {
          title,
          description: description || null,
          priority: priority || 'MEDIUM',
          status: status || 'TODO',
          dueDate: dueDate ? new Date(dueDate) : null,
          projectId,
          assignedTo: assignedTo || null,   // safely convert falsy to null
        },
        include: { assignee: { select: { id: true, name: true } } },
      });
      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// Update task
router.put('/:id', auth(), async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'ADMIN') {
      const { title, description, status, priority, dueDate, assignedTo } = req.body;
      const updated = await prisma.task.update({
        where: { id },
        data: {
          title: title !== undefined ? title : task.title,
          description: description !== undefined ? description : task.description,
          priority: priority !== undefined ? priority : task.priority,
          status: status !== undefined ? status : task.status,
          dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : task.dueDate,
          assignedTo: assignedTo !== undefined ? (assignedTo || null) : task.assignedTo,
        },
        include: { assignee: { select: { id: true, name: true } } },
      });
      return res.json(updated);
    } else {
      if (task.assignedTo !== req.user.id) {
        return res.status(403).json({ message: 'Not assigned to this task' });
      }
      const { status } = req.body;
      if (!status) return res.status(400).json({ message: 'Status is required' });
      const updated = await prisma.task.update({
        where: { id },
        data: { status },
        include: { assignee: { select: { id: true, name: true } } },
      });
      return res.json(updated);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
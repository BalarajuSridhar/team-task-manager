const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// Get all projects (admin sees all; member sees only projects they are member of)
router.get('/', auth(), async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'ADMIN') {
      projects = await prisma.project.findMany({
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          members: { some: { userId: req.user.id } },
        },
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
      });
    }
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create project (admin only)
router.post('/', auth(['ADMIN']), body('name').notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        createdBy: req.user.id,
        members: {
          create: { userId: req.user.id, role: 'ADMIN' },
        },
      },
      include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get single project
router.get('/:id', auth(), async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: { include: { assignee: { select: { id: true, name: true } } } },
      },
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    // Check access: admin or member
    const isMember = project.members.some((m) => m.userId === req.user.id);
    if (req.user.role !== 'ADMIN' && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add member to project (admin only)
router.post('/:id/members', auth(['ADMIN']), body('userId').notEmpty(), async (req, res) => {
  const { id: projectId } = req.params;
  const { userId } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (existing) return res.status(400).json({ message: 'User already a member' });
    const member = await prisma.projectMember.create({
      data: { projectId, userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Remove member from project (admin only)
router.delete('/:id/members/:userId', auth(['ADMIN']), async (req, res) => {
  const { id: projectId, userId } = req.params;
  try {
    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });
    res.json({ message: 'Member removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete project (admin only)
router.delete('/:id', auth(['ADMIN']), async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
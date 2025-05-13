// Jobs routes
const express = require('express');
const router = express.Router();
const { Job, User, Application } = require('../models');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { Op } = require('sequelize');

// Search jobs (public route)
router.get('/search', async (req, res) => {
  try {
    const { title, category, location } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {
      status: 'approved' // Only return approved jobs to the public
    };

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` };
    }

    if (category) {
      whereClause.category = category;
    }

    if (location) {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }

    // Find jobs with pagination
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'postedBy',
          attributes: ['name']
        }
      ]
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);

    res.json({
      jobs,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get job details
router.get('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    
    const job = await Job.findOne({
      where: { 
        id: jobId,
        status: 'approved' // Only return approved jobs to the public
      },
      include: [
        {
          model: User,
          as: 'postedBy',
          attributes: ['name']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error getting job details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a job (protected - recruiters and admins only)
router.post('/', authenticateUser, authorizeRoles(['recruiter', 'admin']), async (req, res) => {
  try {
    const { title, category, description, requirements, salary, location } = req.body;
    
    // Validate required fields
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required' });
    }

    // Create job
    const job = await Job.create({
      title,
      category,
      description,
      requirements,
      salary,
      location,
      posted_by: req.user.id,
      status: req.user.role === 'admin' ? 'approved' : 'pending' // Auto-approve if admin
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply to a job
router.post('/apply', authenticateUser, authorizeRoles(['job_seeker']), async (req, res) => {
  try {
    const { job_id, cv_url, cover_note } = req.body;
    
    // Validate required fields
    if (!job_id || !cv_url) {
      return res.status(400).json({ error: 'Job ID and CV URL are required' });
    }

    // Check if job exists and is approved
    const job = await Job.findOne({
      where: {
        id: job_id,
        status: 'approved'
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found or not approved' });
    }

    // Create application
    const application = await Application.create({
      user_id: req.user.id,
      job_id,
      cv_url,
      cover_note,
      status: 'submitted'
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 
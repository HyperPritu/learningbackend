const express = require('express');
const auth = require('../middleware/user_jwt');
const Todo = require('../models/Todo');

const router = express.Router();

// Create new TODO task
router.post('/', auth, async (req, res, next) => {
	try {
		const toDo = await Todo.create({ title: req.body.title, description: req.body.description, user: req.user.id });

		if (!toDo) return res.status(400).json({ success: false, msg: 'Something went wrong' });

		res.status(200).json({ success: true, toDo: toDo, msg: 'Successfully Created' });
	} catch (e) {
		next(e);
	}
});

// Fetch all TODO's
router.get('/', auth, async (req, res, next) => {
	try {
		const todo = await Todo.find({ user: req.user.id, finished: false });

		if (!todo) return res.status(400).json({ success: false, msg: "NO ToDo's found" });

		res.status(200).json({ success: true, count: todo.length, todos: todo, msg: 'Successfully fetched' });
	} catch (e) {
		next(e);
	}
});

// Edit a TODO
router.put('/:id', async (req, res, next) => {
	try {
		let todo = await Todo.findById(req.params.id);

		if (!todo) return res.status(400).json({ success: false, msg: 'ToDo not exist' });

		todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

		if (!todo) return res.status(400).json({ success: false, msg: 'Something went wrong' });

		res.status(200).json({ success: true, todo: todo, msg: 'Successfully Updated' });
	} catch (e) {
		next(e);
	}
});

// Delete a ToDo
router.delete('/:id', async (req, res, next) => {
	try {
		let todo = await Todo.findById(req.params.id);

		if (!todo) return res.status(400).json({ success: false, msg: 'ToDo not exist' });

		todo = await Todo.findByIdAndDelete(req.params.id);

		res.status(200).json({ success: true, todo: todo, msg: 'Successfully Deleted' });
	} catch (e) {
		next(e);
	}
});

// Fetch all finished TODO's
router.get('/finished', auth, async (req, res, next) => {
	try {
		const todo = await Todo.find({ user: req.user.id, finished: true });

		if (!todo) return res.status(400).json({ success: false, msg: "NO ToDo's found" });

		res.status(200).json({ success: true, count: todo.length, todos: todo, msg: 'Successfully fetched' });
	} catch (e) {
		next(e);
	}
});

module.exports = router;

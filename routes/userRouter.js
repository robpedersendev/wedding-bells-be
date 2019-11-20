require("dotenv").config();

const User = require("../models/users");

const express = require("express");

const router = express();
router.use(express.json());

// GET User table
router.get("/", async (req, res) => {
	const { subject, role } = req.decodedJwt;
	if (role === "admin") {
		try {
			const users = await User.find();
			res.json(users);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	} else {
		User.findById(subject)
			.then(user => {
				res.json(user);
			})
			.catch(err => {
				res.status(500).send(err);
			});
	}
});

// GET USER table with ID
router.get("/:id", async (req, res) => {
	const { subject, role } = req.decodedJwt;
	const { id } = req.params;
	if (role === "admin") {
		try {
			const user = await User.findById(id);

			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ message: "could not find user " });
			}
		} catch (err) {
			res.status(500).json({ message: "failed to get user" });
		}
	} else {
		User.findById(subject)
			.then(user => {
				res.json(user);
			})
			.catch(err => {
				res.status(500).send(err);
			});
	}
});

// EDIT USER with ID
router.put("/:id", async (req, res) => {
	const { subject, role } = req.decodedJwt;
	const { id } = req.params;
	const changes = req.body;

	if (role === "admin") {
		try {
			const user = await User.findById(id);

			if (user) {
				const updatedUser = await User.update(changes, id);

				res.status(200).json(updatedUser);
			} else {
				res.status(404).json({ message: "could not find user with given id" });
			}
		} catch (err) {
			res.status(500).json({ message: "Failed to update user" });
		}
	} else {
		try {
			const user = await User.findById(subject);

			if (user) {
				const updatedUser = await User.update(changes, subject);

				res.status(200).json(updatedUser);
			} else {
				res.status(404).json({ message: "could not find user with given id" });
			}
		} catch (err) {
			res.status(500).json({ message: "Failed to update user" });
		}
	}
});

// DEL request to with ID
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const deleted = await User.remove(id);

		if (deleted) {
			res.status(200).json({ removed: deleted });
		} else {
			res.status(404).json({ message: "could not find user with given id" });
		}
	} catch (err) {
		res.status(500).json({ message: "failed to delete user" });
	}
});

module.exports = router;

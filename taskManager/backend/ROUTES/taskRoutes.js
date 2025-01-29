const express = require('express');
const user = require('../MODELS/user');
const router = express.Router();
const task = require('../MODELS/task');
const auth = require('../MIDDLEWARES/auth');

router.get('/test', auth, (req, res) => {
  res.json({
    message: "Task routes are working",
    user: req.user
  });
});

router.post('/createtask', auth, async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const newTask = new task({
      description: description,
      owner: req.user._id
    });

    await newTask.save();
    res.status(201).json({ task: newTask, message: "Task created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/getalltasks', auth, async (req, res) => {
  try {
    const tasks = await task.find({ owner: req.user._id });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/gettask/:id', auth, async (req, res) => {

  try {
    const taskId = req.params.id;
    const owner = req.user._id;

    const reqTask = await task.findOne({
      _id: taskId,
      owner: owner
    })
    res.status(200).json(reqTask);
  }
  catch (error) {
    res.status(500).json({ message: error });
  }

})

router.patch('/update/:id', auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const owner = req.user._id;

    const description = req.body.description;
    const status = req.body.status;

    const updatedTask = await task.findOneAndUpdate({
      _id: taskId,
      owner: owner
    },
      {
        $set: {
          description: description,
          status: status
        }
      },
      { new: true }
    );
    res.send("updated succesfully")
  }
  catch (error) {
    res.json({ messege: error })
  }
})

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const owner = req.user._id;
    const deletedTask = await task.findOneAndDelete({
      _id: taskId,
      owner: owner
    });

    res.send("deleted successfully")
  }
  catch (error) {
    res.json({ message: error })
  }
}
)
module.exports = router;

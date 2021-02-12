const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/', (req, res) => {
  User.find().then(
    users => res.json({ users })
  ).catch(err => {
    throw err.message
  })
})

router.get('/:userId', (req, res) => {
  User.findById(
    req.params.userId
  ).then(
    result => res.json(result)
  ).catch(err => {
    throw err.message
  })
})

router.post('/', (req, res) => {
  const user = new User(req.body)
  user.save().then(
    userResult => res.json({ user: userResult })
  ).catch(err => {
    throw err.message
  })
})

router.put('/:userId', (req, res) => {
  User.findByIdAndUpdate(
    req.params.userId, req.body
  ).then(
    () => User.findById(req.params.userId)
  ).then(
    user => res.json({ user })
  ).catch(err => {
    throw err.message
  })
})

router.delete('/:userId', (req, res) => {
  User.findByIdAndDelete(req.params.userId).then(result => {
    if (result === null) {
      return res.json({ message: 'User does not exist.' })
    }
    return res.json({
      message: 'Successfully deleted.',
      _id: req.params.userId
    })
  }).catch(err => {
    throw err.message
  })
})

module.exports = router

const express = require('express')
const router = express.Router()

const User = require('../models/user')
const Message = require('../models/message')

router.get('/', (req, res) => {
  Message.find().then(
    messages => res.json({ messages })
  ).catch(err => {
    throw err.message
  })
})

router.get('/:messageId', (req, res) => {
  Message.findById(
    req.params.messageId
  ).then(
    message => res.json({ message })
  ).catch(err => {
    throw err.message
  })
})

router.post('/', (req, res) => {
  const message = new Message(req.body)
  message.save().then(
    message => User.findById(message.author)
  ).then(user => {
    user.messages.unshift(message)
    return user.save()
  }).then(
    () => res.json({ message })
  ).catch(err => {
    throw err.message
  })
})

router.put('/:messageId', (req, res) => {
  Message.findByIdAndUpdate(
    req.params.messageId, req.body
  ).then(
    () => Message.findById(req.params.messageId)
  ).then(
    message => res.json({ message })
  ).catch(err => {
    throw err.message
  })
})

router.delete('/:messageId', (req, res) => {
  Message.findByIdAndDelete(req.params.messageId).then(result => {
    if (result === null) {
      return res.json({ message: 'Message does not exist.' })
    }
    return res.json({
      message: 'Successfully deleted.',
      _id: req.params.messageId
    })
  }).catch(err => {
    throw err.message
  })
})

module.exports = router

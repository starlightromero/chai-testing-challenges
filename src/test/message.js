require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

after(done => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa'

describe('Message API endpoints', () => {
  beforeEach(done => {
    const sampleMessage = new Message({
      title: 'Sample',
      body: 'This is for testing purposes.',
      author: 'aaaaaaaaaaaa',
      _id: SAMPLE_OBJECT_ID
    })
    sampleMessage.save()
    const sampleUser = new User({
      username: 'myuser',
      password: 'mypassword',
      _id: SAMPLE_OBJECT_ID
    })
    sampleUser.save().then(() => {
      done()
    })
  })

  afterEach(done => {
    Message.deleteMany(
      { title: ['Sample', 'Another One', 'Do not disturb'] }
    )
    User.deleteMany(
      { username: 'myuser' }
    ).then(() => {
      done()
    })
  })

  it('should load all messages', done => {
    chai.request(
      app
    ).get(
      '/messages'
    ).end((err, res) => {
      if (err) { done(err) }
      expect(res).to.have.status(200)
      expect(res.body.messages).to.be.an('array')
    })
    done()
  })

  it('should get one specific message', done => {
    chai.request(
      app
    ).get(
      `/messages/${SAMPLE_OBJECT_ID}`
    ).end((err, res) => {
      if (err) { done(err) }
      expect(res).to.have.status(200)
      expect(res.body).to.be.an('object')
      expect(res.body.message.title).to.equal('Sample')
      expect(res.body.message.body).to.equal('This is for testing purposes.')
      done()
    })
  })

  it('should post a new message', done => {
    chai.request(
      app
    ).post(
      '/messages'
    ).send(
      { title: 'Another One', body: 'DJ Khaaaaaled', author: 'aaaaaaaaaaaa' }
    ).end((err, res) => {
      if (err) { done(err) }
      expect(res.body.message).to.be.an('object')
      expect(res.body.message).to.have.property('title', 'Another One')

      Message.findOne({ title: 'Another One' }).then(message => {
        expect(message).to.be.an('object')
        done()
      })
    })
  })

  it('should update a message', done => {
    chai.request(
      app
    ).put(
      `/messages/${SAMPLE_OBJECT_ID}`
    ).send(
      { title: 'Do not disturb' }
    ).end((err, res) => {
      if (err) { done(err) }
      expect(res.body.message).to.be.an('object')
      expect(res.body.message).to.have.property('title', 'Do not disturb')

      Message.findOne({ title: 'Do not disturb' }).then(message => {
        expect(message).to.be.an('object')
        done()
      })
    })
  })

  it('should delete a message', done => {
    chai.request(
      app
    ).delete(
      `/messages/${SAMPLE_OBJECT_ID}`
    ).end((err, res) => {
      if (err) { done(err) }
      expect(res.body.message).to.equal('Successfully deleted.')
      expect(res.body._id).to.equal(SAMPLE_OBJECT_ID)

      Message.findOne({ title: 'Sample' }).then(message => {
        expect(message).to.equal(null)
        done()
      })
    })
  })
})

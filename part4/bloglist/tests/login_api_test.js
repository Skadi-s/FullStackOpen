const { test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const setupDatabase = require('./setup')

const api = supertest(app)

describe('Login API Tests', () => {
    beforeEach(async () => {
        await setupDatabase.setupDatabase()
    })

    describe('POST /api/login', () => {
        test('logs in with valid credentials', async () => {
            const loginData = {
                username: 'testuser1',
                password: 'password1'
            }

            const response = await api.post('/api/login')
                .send(loginData)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.username, loginData.username)
        })

        test('fails with status code 401 if credentials are invalid', async () => {
            const loginData = {
                username: 'testuser1',
                password: 'wrongpassword'
            }

            const response = await api.post('/api/login')
                .send(loginData)
                .expect(401)

            assert.strictEqual(response.body.error, 'invalid username or password')
        })
    })
})

after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})
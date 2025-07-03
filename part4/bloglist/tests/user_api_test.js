const { test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('User API Tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const initialUsers = [
            { username: 'testuser1', name: 'Test User 1', passwordHash: await bcrypt.hash('password1', 10) },
            { username: 'testuser2', name: 'Test User 2', passwordHash: await bcrypt.hash('password2', 10) }
        ]
        await User.insertMany(initialUsers)
    })

    describe('POST /api/users', () => {
        test('creates a new user with valid data', async () => {
            const newUser = {
                username: 'newuser',
                name: 'New User',
                password: 'newpassword'
            }

            const response = await api.post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.username, newUser.username)
            assert.strictEqual(response.body.name, newUser.name)

            const usersAtEnd = await User.find({})
            assert.strictEqual(usersAtEnd.length, 3) // 2 initial + 1 new user
        })

        test('fails with status code 400 if username is too short', async () => {
            const newUser = {
                username: 'nu',
                name: 'New User',
                password: 'newpassword'
            }

            const response = await api.post('/api/users')
                .send(newUser)
                .expect(400)

            assert.strictEqual(response.body.error, 'username must be at least 3 characters long')
        })

        test('fails with status code 400 if password is too short', async () => {
            const newUser = {
                username: 'newuser',
                name: 'New User',
                password: 'np'
            }

            const response = await api.post('/api/users')
                .send(newUser)
                .expect(400)

            assert.strictEqual(response.body.error, 'password must be at least 3 characters long')
        })
    })

    describe('GET /api/users', () => {
        test('returns all users with correct fields', async () => {
            const response = await api.get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.length, 2)
            assert.strictEqual(response.body[0].username, 'testuser1')
            assert.strictEqual(response.body[1].username, 'testuser2')
        })
    })

})

after(async () => {
    await mongoose.connection.close()
})
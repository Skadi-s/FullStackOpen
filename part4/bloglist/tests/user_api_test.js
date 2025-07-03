const { test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('User API Tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    describe('GET /api/users', () => {
        test('returns all users as JSON', async () => {
            const response = await api.get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(Array.isArray(response.body), true)
            assert.strictEqual(response.body.length, 1)
        })

        test('returns the correct user data', async () => {
            const response = await api.get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body[0].username, 'root')
            assert.strictEqual(response.body[0].name, undefined) // Name is not set in the initial user
        })

        test('should not return password hashes', async () => {
            const response = await api.get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body[0].passwordHash, undefined)
        })
    })

    describe('POST /api/users', () => {
        test('creates a new user with valid data', async () => {
            const newUser = {
                username: 'testuser',
                name: 'Test User',
                password: 'password123'
            }

            const response = await api.post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.username, newUser.username)
            assert.strictEqual(response.body.name, newUser.name)

            const usersAtEnd = await User.find({})
            assert.strictEqual(usersAtEnd.length, 2)
        })

        test('returns 400 if username or password is missing', async () => {
            const newUser = {
                name: 'Test User'
            }

            await api.post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await User.find({})
            assert.strictEqual(usersAtEnd.length, 1) // No new user should be created
        })

        test('returns 400 if username is too short', async () => {
            const newUser = {
                username: 'ab',
                name: 'Test User',
                password: 'password123'
            }

            await api.post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await User.find({})
            assert.strictEqual(usersAtEnd.length, 1) // No new user should be created
        })

        test('returns 400 if password is too short', async () => {
            const newUser = {
                username: 'testuser',
                name: 'Test User',
                password: 'ab'
            }

            await api.post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await User.find({})
            assert.strictEqual(usersAtEnd.length, 1) // No new user should be created
        })
    })
})

after(async () => {
    await User.deleteMany({})
})
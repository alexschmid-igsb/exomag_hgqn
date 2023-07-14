const knex = require('../database/access').connection
var _ = require('lodash')

const RedisConnection = require('../redis/RedisConnection')

const RedisMap = require('../redis/RedisMap')
const RedisObject = require('../redis/RedisObject')

class Users {

    async init() {

        await RedisConnection.initPromise
        this.redis = RedisConnection.getClient()

        await this.updateUsers()
        console.log("User cache initialized")
    }

    constructor() {
        this.initPromise = this.init()
    }

    async updateUsers() {

        let users = await knex('users')

        this.users = new RedisObject(this.redis, 'users')
        this.users.set(users)

        this.userById = new RedisMap(this.redis, 'userById')
        this.userByEmail = new RedisMap(this.redis, 'userByEmail')
        this.userByUsername = new RedisMap(this.redis, 'userByUsername')
        this.userByActivationToken = new RedisMap(this.redis, 'userByActivationToken')
        this.userByPasswordToken = new RedisMap(this.redis, 'userByPasswordToken')

        for(let user of users) {
            this.userById.set(user.id, user)
            this.userByEmail.set(user.email.toLowerCase(), user)
            this.userByUsername.set(user.username, user)
            if(user.actions.activation.token != null) {
                this.userByActivationToken.set(user.actions.activation.token, user)
            }
            if(user.actions.resetPassword.token != null) {
                this.userByPasswordToken.set(user.actions.resetPassword.token, user)
            }
        }
    }

    async getAllUsers() {
        return await this.users.get()
    }

    async getUserById(id) {
        if(this.userById != undefined) {
            return await this.userById.get(id)
        } else {
            return undefined
        }
    }

    async getUserByEmail(email) {
        if(this.userByEmail != undefined) {
            return await this.userByEmail.get(email.toLowerCase())
        } else {
            return undefined
        }
    }

    async getUserByUsername(username) {
        if(this.userByUsername != undefined) {
            return await this.userByUsername.get(username)
        } else {
            return undefined
        }
    }

    async getUserByActivationToken(token) {
        if(this.userByActivationToken != undefined) {
            return await this.userByActivationToken.get(token)
        } else {
            return undefined
        }
    }

    async getUserByPasswordToken(token) {
        if(this.userByPasswordToken != undefined) {
            return await this.userByPasswordToken.get(token)
        } else {
            return undefined
        }
    }

    async insertUser(user) {
        await knex('users').insert([user])
        await this.updateUsers()
    }

    async resetActions(id, username, actions) {
        await knex('users').where({id: id, username: username}).update({ actions: actions })
        await this.updateUsers()
    }

    async deleteUser(id, username) {
        await knex('users').where({id: id, username: username}).del()
        await this.updateUsers()
    }

    async updateUserById(id, user) {
        // console.log("update user")
        // console.log(user)
        await knex('users').where({id: id}).update(user)
        await this.updateUsers()
    }

    async relaodAll() {
        await this.updateUsers()
    }
}

module.exports = new Users()


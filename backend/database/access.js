const knex = require('knex')
const config = require('../../config/config')

const environmentMode = config['environmentMode']

const connection = knex(config['knex'][environmentMode])

module.exports = {    
    init: function() {
        module.exports.connection = connection
        return module.exports
    }
}
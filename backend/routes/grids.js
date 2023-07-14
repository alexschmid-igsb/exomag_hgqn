var express = require('express')
var router = express.Router()

const auth = require('../auth/auth')
const knex = require('../database/access').connection

router.get('/get', /*[ auth ],*/ async function (req, res, next) {

    // TODO: über den query für den current user zusätzlich die sichtbarkeit der jeweiligen grids ermitteln und grids nicht anzeigen, auf die der user keinen zugriff hat

    let groups = await knex('grid_groups').orderBy('ordering', 'desc')
    let groupsById = new Map()
    for(let group of groups) {
        group.grids = []
        groupsById.set(group.id,group)
    }

    let grids = await knex('grids').orderBy('ordering', 'desc')
    for(let grid of grids) {
        let group = groupsById.get(grid.group)
        group.grids.push(grid)
    }

    console.log(JSON.stringify(groups))

    return res.send(groups)
})

module.exports = router;
















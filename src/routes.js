const express = require('express')
const nunjucks = require('nunjucks')
const teachers = require('./app/controllers/teachers')
const students = require('./app/controllers/students')
const validator = require('./app/Validators/base')
const server = express()
const routes = express.Router()

routes.get('/', function(req,res){
    return res.redirect('/teachers')
})

routes.get('/teachers', teachers.index)
routes.get('/teachers/create', teachers.create)
routes.get('/teachers/:id', teachers.show)
routes.get('/teachers/:id/edit', teachers.edit)
routes.post('/teachers', validator.post, teachers.post )
routes.put('/teachers',validator.post, teachers.update)
routes.delete('/teachers', teachers.delete)




routes.get('/students', students.index)
routes.get('/students/create', students.create)
routes.get('/students/:id', students.show)
routes.get('/students/:id/edit', students.edit)
routes.post('/students', validator.post, students.post )
routes.put('/students',validator.post, students.update)
routes.delete('/students', students.delete)




module.exports = routes













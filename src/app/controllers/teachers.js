const { age, date, grade } = require('../../lib/utils')
const Intl = require('intl')
const db = require('../../config/db')
const Teacher = require('../models/teacher')


module.exports = {
    async index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)


        await Teacher.paginate({filter, limit, offset}).then((teachers) =>{
            
            const pagination = {
                
                total: Math.ceil(teachers.total / limit),
                page
            }

            return res.render('teachers/index', { teachers, pagination, filter })
        })



                
        
    },
    create(req, res) {
        return res.render('teachers/create')
    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        let { name, avatar_url, birth, school, classtype, services} = req.body
        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Please fill all fields')
            }
        }
        birth = date(birth).iso
        let created_at = date(Date.now()).iso
       const teacherId = await Teacher.create({
            name,
            avatar_url,
            birth,
            school,
            classtype,
            services,
            created_at 
       }) 






            return res.redirect(`/teachers/${teacherId}`)
        
    },
    async show(req, res) {


        let teacher = await Teacher.find(req.params.id)
        if(!teacher) return res.send('Teacher not found!')

            teacher.age = age(teacher.birth)
            teacher.services = teacher.services.split(',')
            teacher.created_at = date(teacher.created_at).format

            return res.render('teachers/show', {teacher})
        
    },
    async edit(req, res) {
        
        let teacher = await Teacher.find(req.params.id)
        if(!teacher) return res.send('Teacher not found!')

            teacher.age = age(teacher.birth)
            teacher.services = teacher.services.split(',')
            teacher.created_at = date(teacher.created_at).format

            return res.render('teachers/edit', {teacher})
        
    },
    async update(req, res) {
        const keys = Object.keys(req.body)
        const { name, avatar_url, birth, school, classtype, services} = req.body

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Please fill all fields')
            }
        }

        const teacherId = await Teacher.update(req.body.id, {
            name,
            avatar_url,
            birth: date(birth).iso,
            school,
            classtype,
            services,
            created_at: date(Date.now()).iso
       }) 


        return res.redirect(`/teachers/${req.body.id}`)
        
    },
    async delete(req, res) {
        
        
        
        await Teacher.delete(req.body.id)
        return res.redirect(`/teachers/`)
    },
}


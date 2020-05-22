const { age, date, grade } = require('../../lib/utils')
const Intl = require('intl')
const db = require('../../config/db')
const Teacher = require('../models/teacher')


module.exports = {
    async index(req, res) {
        let { filter, page, limit } = req.query



        if(!filter) filter = null
        
        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)
        

        await Teacher.paginateTeach({filter,page,limit,offset}).then((teachers) =>{
            
            const pagination = {
                filter,
                total: Math.ceil(teachers[0].total / limit),
                page
                
            }
            
            return res.render('teachers/index', { teachers, pagination, filter })
        })



                
        
    },
    create(req, res) {
        return res.render('teachers/create')
    },
    async post(req, res) {
        
        let { name, avatar_url, birth, school, classtype, services} = req.body
        birth = date(birth).iso
        let created_at = date(Date.now()).iso

        let teachers = await Teacher.create({
            name,
            birth,
            school, 
            classtype,
            services,
            created_at,
            avatar_url
       }) 

      
       

       
        return res.render(`parts/success.njk`)
        
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
       
        const { name, avatar_url, birth, school, classtype, services} = req.body

        
        let teacherId = await Teacher.update(req.body.id, {
            name,
            avatar_url,
            birth: date(birth).iso,
            school,
            classtype,
            services,
            created_at: date(Date.now()).iso
       }) 


       return res.render(`parts/success.njk`)
        
    },
    async delete(req, res) {
        
        
        
        await Teacher.delete(req.body.id)
        return res.render(`parts/success.njk`)
    },
}


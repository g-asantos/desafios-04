const { age, date, grade } = require('../../lib/utils')
const Intl = require('intl')
const Student = require('../models/student')
const db = require('../../config/db')



module.exports = {
    async index(req, res) {


        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        await Student.paginate({filter, limit, offset}).then((students) =>{
            const pagination = {
                total: Math.ceil(students[0].total / limit),
                page
            }

            return res.render('students/index', { students, pagination, filter })
        })



        



    },
    async create(req, res) {

        let options = await Student.teachersSelectOptions()

        return res.render('students/create', { teacherOptions: options })
    },
    async post(req, res) {
        
        let { name,avatar_url, birth, schoolyear,email,workload,teacher } = req.body



        
        birth = date(birth).iso
        let created_at = date(Date.now()).iso
        let teacher_id = teacher
        const studentId = await Student.create({
            name,
            avatar_url, 
            birth,
            schoolyear,
            email,
            workload,
            teacher_id, 
            created_at}) 
            
            
            
            
            
            return res.render(`parts/success.njk`)
        
    },
    async show(req, res) {
        Student.findStudent(req.params.id, function (student) {
            if (!student) return res.send('Student not found!')

            student.birth = date(student.birth).birthDay


            return res.render('students/show', { student })
        })
    },
    async edit(req, res) {
        Student.findStudent(req.params.id, async function (student) {
            if (!student) return res.send('Student not found!')

            student.birth = date(student.birth).iso


            const teacherOptions = await Student.teachersSelectOptions()
            
            return res.render('students/edit', { student, teacherOptions })
            


        })
    },
    async update(req, res) {
        
        let { name,avatar_url, birth, schoolyear,email,workload,teacher } = req.body
        
        birth = date(birth).iso
        let teacher_id = teacher
        
        const studentId = await Student.update(req.body.id, {
            name,
            avatar_url, 
            birth, 
            schoolyear,
            email,
            workload,
            teacher_id 
           
        })






        return res.render(`parts/success.njk`)
        
    },
    async delete(req, res) {


      await Student.delete(req.body.id)
        
        
        
      return res.render(`parts/success.njk`)
        
    },
}


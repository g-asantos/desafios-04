const db = require('../../config/db')
const { age, date, grade } = require('../../lib/utils')
const Base = require('../models/Base')

Base.init({table: 'teachers'})


module.exports = {
    ...Base,
    all(callback){
        db.query(`SELECT teachers.*, count(students) AS total_students
        FROM teachers
        LEFT JOIN students ON (teachers.id = students.teacher_id)
        GROUP BY teachers.id
        ORDER BY total_students DESC`, function(err, results){

            if(err) throw `Database Error! ${err}`

            
            callback(results.rows)
        })

    },
    findBy(filter, callback){
        db.query(`SELECT teachers.*, count(students) AS total_students
        FROM teachers
        LEFT JOIN students ON (teachers.id = students.teacher_id)
        WHERE teachers.name ILIKE '%${filter}%'
        OR teachers.services ILIKE '%${filter}%'
        GROUP BY teachers.id
        ORDER BY total_students DESC`, function(err, results){

            if(err) throw `Database Error! ${err}`

            
            callback(results.rows)
        }) 
    },
    async paginateTeach(params){
        const { filter, limit, offset } = params

        let query = '',
            filterQuery = '',
            totalQuery = `(
                SELECT count(*) FROM teachers
            )AS total`

        if(filter != null){
            filterQuery = `
            WHERE teachers.name ILIKE '%${filter}%'
            OR teachers.services ILIKE '%${filter}%'`

            totalQuery = `(
                SELECT count(*) FROM teachers
                ${filterQuery}
            )AS total`
        }
        

        
        query = `
        SELECT teachers.*, ${totalQuery} ,  count(students) as total_students 
        FROM teachers
        LEFT JOIN students ON (teachers.id = students.teacher_id)
        ${filterQuery}
        GROUP BY teachers.id LIMIT ${limit} OFFSET ${offset}`


        
        
        let results = await db.query(query)
        
        return results.rows
        
    }
}
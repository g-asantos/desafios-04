const db = require('../../config/db')


const Base = {
    init({table}){
        if(!table) throw new Error('Invalid Params')


        this.table = table

        return this
    },
    async all() {
        
        try {
            const query = `SELECT * FROM ${this.table} ORDER BY name ASC`

            await db.query(query)
            return results.rows
            

        }catch(err){

            console.error(err)
        }

            
        
        
        
    },
    async find(id){

        try{

            const query = `SELECT * FROM ${this.table} WHERE id = ${id}`

            let results = await db.query(query)

            return results.rows[0]



        } catch(err){
            console.error(err)
        }

       
    },
    async create(fields){

        try{

        let keys = [],
            values = []    


        Object.keys(fields).map( key => {
            keys.push(key)
            values.push(`'${fields[key]}'`)
        })    

        const query = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${values.join(',')})
        RETURNING id`
        

        const results = await db.query(query)
        
        return results.rows[0].id
        }catch(err){

            console.error(err)
        }


    },
    async update(id, fields){


        try{

            let update = []

            Object.keys(fields).map(key => {

                const line = `${key} = '${fields[key]}'`

                update.push(line)


            })





            let query = `UPDATE ${this.table} SET
            ${update.join(',')} WHERE id = ${id}`

            await db.query(query)
            return


        } catch(err){
            console.error(err)
        }

        

    },
    async delete(id){

        try{
        const query = `DELETE FROM ${this.table} WHERE id = ${id}`

        await db.query(query)
        return


        }catch(err){

            console.error(err)
        }

       
    },
    async teachersSelectOptions(){

        try{

            const query = `SELECT name,id FROM teachers`

            let results = await db.query(query)
            
            return results.rows

        }catch(err){
            console.error(err)
        }

    },
    async paginate(params){
        const { filter, limit, offset } = params



        let query = '',
            filterQuery = '',
            totalQuery = `(
                SELECT count(*) FROM ${this.table}   
            )AS total`

        if(filter){
            filterQuery = `
            WHERE ${this.table}.name ILIKE '%${filter}%'
            OR ${this.table}.email ILIKE '%${filter}%'`

            totalQuery = `(
                SELECT count(*) FROM ${this.table}
                ${filterQuery}
            )AS total`
        }


        
        query = `
        SELECT ${this.table}.* , ${totalQuery} 
        FROM ${this.table}
        ${filterQuery}
        LIMIT ${limit} OFFSET ${offset}`


        
        let results = await db.query(query)

        return results.rows

        
    }
}






module.exports = Base
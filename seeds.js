const {date} = require('./src/lib/utils')
const faker = require('faker')

const Student = require('./src/app/models/student')
const Teacher = require('./src/app/models/teacher')
let studentsIds = []
let teachersId = []
async function createStudents(){
    const students = []
    


    while(students.length < 5){
      let birth = faker.date.past(25)
      
        students.push({
            name: faker.name.firstName(),
            avatar_url: faker.image.imageUrl(),
            birth: new Date(faker.date.past(25)).toUTCString(),
            email: faker.internet.email(),
            schoolyear: faker.random.alphaNumeric(9999),
            workload: faker.random.number(9999),
            teacher_id: faker.random.number(9999),
            created_at: date(Date.now()).iso
        })
    }


    const studentsPromise = students.map(student => Student.create(student))
    studentsIds = await Promise.all(studentsPromise)
}

async function createTeachers(){
    const teachers = []
    


    while(teachers.length < 10){
      let birth = faker.date.past(25)
      
        teachers.push({
            name: faker.name.firstName(),
            avatar_url: faker.image.imageUrl(),
            birth: new Date(faker.date.past(25)).toUTCString(),
            school: faker.name.title(),
            classtype: faker.name.jobTitle(),
            services: faker.name.jobType(),
            created_at: date(Date.now()).iso
        })
    }


    const teachersPromise = teachers.map(teacher => Teacher.create(teacher))
    teachersIds = await Promise.all(teachersPromise)
}


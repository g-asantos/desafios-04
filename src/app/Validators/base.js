

async function post(req,res, next){

    const keys = Object.keys(req.body)
        
        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por Favor, volte a preencha todos os campos')
            }
        }

        next()
}



module.exports = {
    post
}
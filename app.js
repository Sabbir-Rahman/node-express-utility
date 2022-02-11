const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jwt = require('jsonwebtoken')

require('dotenv').config()

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.json())
app.use(bodyParser.json())

const port = 3000
const posts = [
    {
        username: 'Sabbir',
        title: 'Post 1'
    },
    {
        username: 'Sadik',
        title: 'Post 2'
    }
]

app.get('/posts',authenticateToken ,(req,res) => {
    console.log(req.user)
    res.json(posts)
})

app.post('/login', (req,res) => {
    // Authenticate user
    const username = req.body.username
    const user = { name:username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken})
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) res.status(403).json({'message':'Token not given'})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({'message':'Token not valid'})
        req.user = user 
        next()
    })

}

app.listen(port,()=>{
    console.log(`Server running on ${port}`)
})
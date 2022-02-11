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

//store locally now can be store in redis, mongo or etc
let refreshTokens = [] 

// refresh token route
app.post('/token',(req,res)=> {
    const refreshToken = req.body.token

    if (refreshToken == null) res.status(403).json({'message':'Token not given'})
    if(!refreshTokens.includes(refreshToken)) return res.status(403).json({'message':'Token not valid'})

    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,user) => {
        if (err) return res.status(403).json({'message':'Token not valid'})
        
        //remove prev refresh token if you want 


        const accessToken = generateAccessToken(user)

        res.json({ accessToken: accessToken })
    })

})

app.delete('/logout', (req,res)=> {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})


app.get('/posts',authenticateToken ,(req,res) => {
    console.log(req.user)
    res.json(posts)
})

app.post('/login', (req,res) => {
    // Authenticate user
    const username = req.body.username
    const user = { name:username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

    refreshTokens.push(refreshToken)

    res.json({ accessToken: accessToken, refreshToken: refreshToken })
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

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '35s'})
}

app.listen(port,()=>{
    console.log(`Server running on ${port}`)
})
const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send('app working')
})

app.listen(6969)
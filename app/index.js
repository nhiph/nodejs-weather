const asyncRequest = require('async-request')
const express = require('express')
const app = express() // init application
const path = require('path') // build in nodejs


const ACCESS_KEY = 'f96c043608ecad05fce89b5a117707b5'
const port = 7000 
const pathPublic = path.join(__dirname, "../public") // __dirname la dg dan tuyet doi toi file dang run (app/index.js), ket hop param 2 de di den thu muc public de set staticfile pathPublic
app.use(express.static(pathPublic)) // application will use pathPublic to link to public
//  => http://localhost:7000/image/husky.jpg  server file will link to public folder

const getWeater = async (region) => {
    const url = `http://api.weatherstack.com/current?access_key=${ACCESS_KEY}&query=${region}`
    try {
        const res = await asyncRequest(url)
        let data = {}
        if(res) data = JSON.parse(res.body)
        const weather = { 
            region: data.location.region,
            country: data.location.country,
            temperature: data.current.temperature,
            windSpeed: data.current.wind_speed,
            precip: data.current.precip,
            cloudcover: data.current.cloudcover,
            humidity: data.current.humidity
        }
        console.log('weather', weather);
        return weather
    } catch(e) {
        console.log('Not found', e);
    }
}
// set hbs view
app.set("view engine", "hbs") 

app.get('/', async (req, res) => {
    const location = req.query.address
    const weather = await getWeater(location)
    console.log('weather', weather);

    // res.send("Hello world") return string

    // return webpage with param 2 use for html hbs
    res.render("weather", location ? {
        status: true,
        region: weather.region,
        country: weather.country,
        temperature: weather.temperature,
        windSpeed: weather.windSpeed,
        precip: weather.precip,
        cloudcover: weather.cloudcover,
        humidity: weather.humidity
    } : { status: false }
    ) 
})

app.listen(port , () => {
    console.log(`port ${port} running`);
})
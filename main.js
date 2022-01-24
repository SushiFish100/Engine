/**
 * Coder: SushiFish
 * Date: 2020,05,25
 */

const http = require('http')
const fs = require('fs')

const PORT = 1337 //Any port that is open on your router

http
    .createServer((request, response) => {
        fs.readFile(`.${request.url}`, (err, data) => {
            if (err) {
                response.writeHeader(404, {
                    'Content-Type': 'text/plain'
                })
                response.write('404 Not Found')
                response.end()
                return
            }

            
            if (request.url.endsWith('.json')) {
                response.writeHeader(200, {
                    'Content-Type': 'application/json'
                })
            }

            if (request.url.endsWith('.html')) {
                response.writeHeader(200, {
                    'Content-Type': 'text/html'
                })
            }

            if (request.url.endsWith('.js')) {
                response.writeHeader(200, {
                    'Content-Type': 'application/javascript'
                })
            }

            if (request.url.endsWith('.ogg')) {
                response.writeHeader(200, {
                    'Content-Type': 'audio/ogg'
                })
            }

            if (request.url.endsWith('.wav')) {
                response.writeHeader(200, {
                    'Content-Type': 'audio/x-wav'
                })
            }


            response.write(data)
            response.end()
        })
    })
    .listen(PORT)





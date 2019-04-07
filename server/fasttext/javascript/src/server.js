require('./enrollAdmin').run(() => {
    require('./registerUser').run(() => {
        console.log('=== DONE ===')
    })
})

var invoke = require('./invoke')
var query = require('./query')

const IPFS = require('ipfs')
const node = new IPFS({ start: false, EXPERIMENTAL: { pubsub: true } })

const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

node.on('ready', () => {
    console.log('Node is ready to use!')
     node.start()
})

node.on('error', error => {
     console.error('Something went terribly wrong!', error)
})

node.on('start', () => {
    console.log('Node started!')
})

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())

var isBroadcasting = false
var timeInterval = 5000

/* serves main page */
app.get('/metric', function(req, res) {
    query.run((err, resp) => {
        res.send(JSON.parse(resp))
    })
})

app.post('/metric', function(req, res) { 
    /* some server side logic */
    fs.readFile(path.join(process.cwd(), '..', '..', 'model', req.body.model), function(err, data) {
        console.log('load model')
        if(!err) {
            console.log('compress model')
            zlib.deflate(data, (err, compressed_data) => {
                if(!err) {
                    console.log('add model to IPFS network')
                    node.add({
                        path: req.body.model,
                        content: compressed_data//Buffer.from('compressed_data')
                    }).then((file_added) => {
                        console.log('added model to ipfs network' + file_added[0].hash)
                        hash_data = file_added[0].hash
                        console.log('update blockchain')
                        invoke.run(req.body.precision, req.body.recall, ''+hash_data, (err, resp) => {
                            console.log('blockchain updated')
                            res.send('OK')
                        })
                    })
                }
                else {
                    console.log('error compressing model', err)
                }
            })
        }
        else {
            console.log('error loading model', err)
        }
    })
})

app.post('/init', function(req, res) { 
    /* some server side logic */
    if (!isBroadcasting) {
        isBroadcasting = true
        broadcast()
    }
    res.send('OK')
})

function broadcast() {
    setInterval(function(){ 
        query.run((err, resp) => {
            var resp_ = JSON.parse(JSON.parse(resp))
            const data = Buffer.from(resp_.ipfs_id)
            node.pubsub.publish('update', data, (err) => {
                if (err) {
                    console.error('error publishing: ', err)
                } else {
                    console.log('successfully published message')
                }
            })
        })
    }, timeInterval)
}

var port = process.env.PORT || 4000
app.listen(port, function() {
    console.log('Listening on ' + port)
})
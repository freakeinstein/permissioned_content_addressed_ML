const fs = require('fs')
const zlib = require('zlib')

const IPFS = require('ipfs')
const node = new IPFS({ start: false, EXPERIMENTAL: { pubsub: true } })

var old_ipfs_id = null

node.on('ready', () => {
     console.log('Node is ready to use!')
      node.start()
})

node.on('error', error => {
      console.error('Something went terribly wrong!', error)
})

node.on('start', () => {
    console.log('Node started!')

    node.pubsub.subscribe('update', (message) => {
        // console.log('got message from ' + message.from)

        const data = message.data.toString()
        if (old_ipfs_id !== data) {
            console.log('new model available')
            old_ipfs_id = data
            saveModel(old_ipfs_id)
        }
    })
})

function saveModel (ipfs_id) {
    console.log('fetching new model')
    node.cat(ipfs_id).then((result) => {
        console.log('inflating data')
        zlib.inflate(result, (err, inflated_data) => {
            console.log('saving new model')
            fs.writeFile("./model/"+Date.now(), inflated_data, function(err) {
                if(err) {
                    console.log(err)
                }
                else {
                    console.log("The file was saved!")
                }
            })
        })
    }).catch((err) => {
      console.log(err)
    })
}
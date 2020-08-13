const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URI)

const addFieldToHashTable = (collection, field, id) => {
    console.log('Collection:')
    console.log(collection)
    console.log('Field:')
    console.log(field)
    console.log('id:')
    console.log(id)
    return new Promise((resolve, reject) => {
        redisClient.hdel(collection, field, (error, response) => {
            redisClient.hset(collection, field, id, (err, res) => {
                if (err || !res) {
                    return reject({
                        error: "unauthorized",
                    })
                }
                return resolve({
                    success: true,
                })
            })
        })
       
    })
}

const getFieldFromHashTable = (collection, field) => {

    return new Promise((resolve, reject) => {
        redisClient.hget(collection, field, (err, res) => {
            if (err || !res) {
                reject({
                    error: "Couldn't get requested field"
                })
            }

            resolve({
                data: res
            })
        })
    })

}

const removeFieldFromHashTable = (collection, field) => {
    redisClient.hdel(collection, field, (err, res) => {
        if (err || !res) {
            console.log("Error!")
            return {
                error: "unexpected error",
            }
        }
        return {
            success: true
        }
    })
}


module.exports = {
    addFieldToHashTable,
    removeFieldFromHashTable,
    getFieldFromHashTable
};
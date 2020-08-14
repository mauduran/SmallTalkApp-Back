const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URI)

const addFieldToHashTable = (collection, field, id) => {

    return new Promise((resolve, reject) => {
        redisClient.hset(collection, field, ''+id, (err, res) => {
            console.log(err);
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
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URI)

const addTokenID = (token, id ) =>{
    redisClient.hset("jwt",token, id, (err, res) => {
        if(err || !res ){
            return{
                error: "unauthorized",
            }
        }
        console.log(res);
        return {
            id: id,
        }
    })
}

const removeTokenId = () => {
    redisClient.hdel("jwt",token, (err, res) => {
        if(err || !res ){
            return{
                error: "unexpected error",
            }
        }
        console.log(res);
        return {
            success: true
        }
    })
}

module.exports = {addTokenID, removeTokenId};
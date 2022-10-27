const mongoose = require('mongoose')


const ConnectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI,{
   
    
  })


  console.log(`Mongo Connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = ConnectDB
const mongoose = require('mongoose');
const uri = process.env.MONGO_URL;

const initDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log('successfully connected to DB!')
    } catch(e) {
        console.log(e)
    }
}

initDB();
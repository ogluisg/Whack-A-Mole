import mongoose from 'mongoose'

const local = 'mongodb://mongo:27017/whack';

const live = `mongodb+srv://whack-admin:whack@cluster0.xmn4p.mongodb.net/Whack?retryWrites=true&w=majority`

const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}

// Function to connect to mongodb
export const connectToDB = async () => {  
        try {
            await mongoose.connect(live, options);
            console.log(`[info]: Successful connection to database`)
        } catch (error) {
            console.log(`[info]: Error connecting to database ${error}`)
        }
};

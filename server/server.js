import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/connectdb.js'
import billRoutes from './routes/billRoutes.js'
const DATABASE_URL = process.env.MONGODB_URI;
const port = process.env.PORT || 8000;

const app = express()

app.use(cors({
  origin: "https://electricity-bill-4ov1-git-master-yash-maskes-projects-93f4ac16.vercel.app",
  credentials: true
}));


app.use(express.json());


app.use("/api/save",billRoutes);

app.get('/',(req,res)=>{
    res.send({
        activeStatus : true,
        error : false,
        hii : true
    });
})


connectDB(DATABASE_URL).then(()=>{
    console.log('MongoDB Connected Successfully...');
    app.listen(port,()=>{
        console.log(`Server listening at https://localhost:${port}`);
    });
}).catch(err=>{
    console.error(`Failed to start server due to DB Connectioon error ${err}`)
});


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

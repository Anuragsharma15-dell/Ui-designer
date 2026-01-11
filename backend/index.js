import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { Conncttodb } from '../backend/db/db.js';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'

const app  = express();
Conncttodb();
app.use(cors());
app.use(express.json());


app.get('/', (req,res)=>{
    res.send('started the project')
})

const PORT  = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server is listening on port ${process.env.PORT}`);

})
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export const app: Application = express();

app.use(cors());
app.use(express.json());

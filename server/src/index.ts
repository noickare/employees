import * as dotenv from 'dotenv';

import { createEmployee, getAllEmployees, searchEmployees, terminateEmployee, updateEmployee } from './controllers/employees';

import bodyParser from 'body-parser';
import { connectDB } from './config/db';
import cors from "cors";
import express from "express";

dotenv.config()

const { PORT, DB_CONNECTION } = process.env;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }))

const jsonParser = bodyParser.json()

app.get("/check", async (req, res) => {
    res.send({ "success": true })
})

app.post("/employee", jsonParser, createEmployee);
app.get("/employees", getAllEmployees);
app.get("/employees/search", searchEmployees);
app.patch("/employee/:id", jsonParser, updateEmployee)
app.patch("/employee/terminate/:id", jsonParser, terminateEmployee);


const start = async () => {
    try {
        await connectDB(DB_CONNECTION || 'mongodb://localhost:27017/kinterview');
        app.listen(PORT || 8080, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (error) {
        console.log(error);
        console.log("Failed to connect to the database, server is not running.");
    }
};
  
start();

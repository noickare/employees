import { Employee } from '../schema/employee';
import Express from 'express';
import { IEmployee } from '../models/employee';

export const createEmployee = async (req: Express.Request, res: Express.Response) => {
    const data = req.body as IEmployee;
    const employee = new Employee(data);
    try {
        await employee.save();
        res.send(employee);
    } catch (error: any) {
        if (error.message.includes("Employee validation failed")) {
            console.log(error.message)
            res.status(400).send(error.message);
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}

export const getAllEmployees = async (req: Express.Request, res: Express.Response) => {
    try {
        const employee = await Employee.find({});
        res.send(employee);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}


export const searchEmployees = async (req: Express.Request, res: Express.Response) => {
    try {
        const regex = new RegExp(req.query.searchTerm as string || '', 'i') 
    const results = await Employee.find({ name: {$regex: regex} }); 
        res.send(results);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const updateEmployee = async (req: Express.Request, res: Express.Response) => {
    try {
        const data = req.body as IEmployee;
        const filter = { _id: data.id };
        let doc = await Employee.findOneAndUpdate(filter, {...data, dateTerminated: data.dateTerminated ? data.dateTerminated : null}, {
            new: true
        });
        res.send(doc);
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

export const terminateEmployee = async (req: Express.Request, res: Express.Response) => {
    try {
        if (!req.body.date) {
            res.status(400).json({ error: "Bad Request" });
        }
        const updated = await Employee.updateOne(
            { "_id": req.params.id },
            {
                $set: {
                    "isActive": false,
                    "dateTerminated": req.body.date
                }
            }
        );
        if (updated.modifiedCount <= 0) {
            res.status(404).json({ error: "No employee found" });
        } else {
            res.send(true);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
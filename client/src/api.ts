import { API_URL } from "./constants";
import { IEmployee } from "./App";
import axios from "axios";
import { getDateWithoutTime } from "./utils";

export const terminateEmployee = async (id: string) => {
    try {
        await axios.patch(`${API_URL}/employee/terminate/${id}`, { date: (new Date()).toString() });
    } catch (error: any) {
        throw new Error(error.message);
    }
}


export const searchName = async (name: string) => {
    try {
        const response = await axios.get(
            `${API_URL}/employees/search?searchTerm=${name}`
        )
        const searchResults = response.data.map((emp: IEmployee) => {
            return {
                key: emp.id,
                id: emp.id,
                name: emp.name,
                dateHired: getDateWithoutTime(emp.dateHired),
                isActive: emp.isActive,
                dateTerminated: emp.dateTerminated ? getDateWithoutTime(emp.dateTerminated) : 'N/A',
                numOfWeekWorkHours: emp.numOfWeekWorkHours,
                hourlyPayRate: emp.hourlyPayRate,
                weeklyNet: emp.hourlyPayRate * emp.numOfWeekWorkHours,
                taxes: '16%',
                payout: (emp.hourlyPayRate * emp.numOfWeekWorkHours) * 0.84
            }
        });
        return searchResults;
    } catch (error) {
        alert("An error occured during search! Please try again");
    }
}
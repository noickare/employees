export interface IEmployee {
    id: string;
    name: string;
    dateHired: string;
    isActive: boolean;
    dateTerminated?: string;
    numOfWeekWorkHours: number;
    hourlyPayRate: number;
}
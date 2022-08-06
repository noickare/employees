import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dateHired: {
        type: Date,
        required: true,
        validate: function (input: string) {
            return new Date(input) <= new Date();
        },
        message: (input: any) => `Date hired can't be in the future`
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    dateTerminated: {
        type: Date,
        validate: function (input: string) {
            return new Date(input) <= new Date();
        },
        message: (input: any) => `Date terminated can't be in the future`
    },
    numOfWeekWorkHours: {
        type: Number,
        required: true,
    },
    hourlyPayRate: {
        type: Number,
        required: true,
    }
});

EmployeeSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

EmployeeSchema.set('toJSON', {
    virtuals: true
});

EmployeeSchema.index({ name: 1, type: -1 });
export const Employee = mongoose.model("Employee", EmployeeSchema);
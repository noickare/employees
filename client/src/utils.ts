export const getDateWithoutTime = (date: string) => {
    const convertedDate = new Date(date);
    const result = convertedDate.toLocaleDateString();
    return result;
}
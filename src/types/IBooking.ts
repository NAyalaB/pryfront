export interface IBooking{
    id: number,
    TransactionNumber:string,
    Quantity:number,
    Paid:number,
    Date:string,
    userId?:number,
    eventsId?:number,    
};
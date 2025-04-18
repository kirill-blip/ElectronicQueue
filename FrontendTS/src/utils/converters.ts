export function convertTicketNumber(ticketNumber: number): string {
    const ticketString = ticketNumber.toString().padStart(3, "0");
    console.log(ticketNumber);
    return ticketString;
}
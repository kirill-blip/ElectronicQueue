import User from "./User";

export interface Entry {
    EntryId: number;
    TicketNumber: number;
    UserId: number;
    AdminId: number;
    EntryStatus: EntryStatus;
}

export interface EntryInfo {
    EntryId: number;
    UserId: number;
    User: User;
}

export enum EntryStatus {
    None = "None",
    WaitForProcessing = "WaitForProcessing",
    Processing = "Processing",
    CanceledByUser = "CanceledByUser",
    Canceled = "Canceled",
    Accepted = "Accepted"
}

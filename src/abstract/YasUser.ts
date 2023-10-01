export interface IYasUser {
    userId: number,
    publicId: string,
    telegramId: number,
    userName: string,
    registerTime: Date
}

export const DefaultYasUser = {
    userId: 0,
    publicId: "",
    telegramId: 0,
    userName: ""
} as IYasUser
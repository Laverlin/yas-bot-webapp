export interface IYasUser {
    userId: number,
    publicId: string,
    telegramId: number,
    userName: string,
    registerTime: string
}

export const DefaultYasUser = {
    userId: 0,
    publicId: "",
    telegramId: 0,
    userName: ""
} as IYasUser
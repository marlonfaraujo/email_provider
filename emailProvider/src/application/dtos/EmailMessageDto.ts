export type EmailMessageDto = {
    body: string,
    subject: string,
    from: string
    to?: string[],
    cc?: string[],
    cco?: string[]
}
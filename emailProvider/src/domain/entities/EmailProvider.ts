export class EmailProvider{
    readonly id: string;
    server: string;
    port: string;
    private level: string;
    credentials: string;

    constructor(id: string, server: string, port: string, credentials: string, level: string = EmailProviderLevel.Primary){
        this.id = id;
        this.server = server;
        this.port = port;
        this.level = level;
        this.credentials = credentials;
    }

    getLevel(): string{
        return this.level;
    }

    setPrimary(): void{
        this.level = EmailProviderLevel.Primary;
    }

    setSecondary(): void{
        this.level = EmailProviderLevel.Secondary;
    }
}

export enum EmailProviderLevel{
    Primary = "Primary",
    Secondary = "Secondary"
}
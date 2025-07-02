export default class Email {
    private value: string;

    constructor (email: string) {
        if (!email || !email.match(/^(.+)\@(.+)$/)) throw new Error("Invalid email");
        this.value = email;
    }

    getValue () : string {
        return this.value;
    }

    static splitWithSeparator(emails: Email[], separator: string = ",") : string{
        return emails.map(x => x.getValue()).join(separator);
    }
    
}
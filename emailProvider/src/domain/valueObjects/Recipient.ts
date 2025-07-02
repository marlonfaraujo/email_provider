import Email from "./Email";

export default class Recipient{
    
    to: Email[];
    cc: Email[];
    cco: Email[];

    constructor(to: string[] = [], cc: string[] = [], cco: string[] = []){
        this.to = to.map(x => new Email(x));
        this.cc = cc.map(x => new Email(x));
        this.cco = cco.map(x => new Email(x));
    }

}
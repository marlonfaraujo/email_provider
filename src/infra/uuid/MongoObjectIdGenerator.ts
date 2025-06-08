import { ObjectId } from "mongodb";
import IdGeneratorAbstraction from "../../application/abstractions/IdGeneratorAbstraction";

export default class MongoObjectIdGenerator implements IdGeneratorAbstraction {

    generate(): string {
        return new ObjectId().toString();
    }

}
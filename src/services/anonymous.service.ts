import { SignupReqDTO } from "@controllers/anonymous/dto/anonymous.dto";
import AnonymousRepo from "@repo/anonymous.repo";

export default class AnonymousService {
    private anonymousRepo: AnonymousRepo;

    constructor() {
        this.anonymousRepo = new AnonymousRepo();
    }

    async signup(user: SignupReqDTO) {
        // unique한지 확인 과정

        
    }
}

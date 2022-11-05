import { User } from "../user/user";

export class GameRoom {
    public users: Map<string, User> = new Map<string, User>()
    public ready: string[] = []
    public chatMessages: Map<string, string> = new Map<string, string>()
    constructor(public readonly ownerUniqueId: string, public readonly gameCode: string) {
    }

    roomReady() {
        return this.ready.length >= Math.floor(this.users.size / 2)
    }
}
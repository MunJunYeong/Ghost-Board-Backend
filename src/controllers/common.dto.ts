import { IsString } from "@utils/validation";

export class DecodedUser {
    userId!: number;
    id!: string;
    username!: string;
    email!: string;
}

export class PaginationReqDTO {
    pageIndex!: number;
    pageSize!: number;
    search!: string;
}

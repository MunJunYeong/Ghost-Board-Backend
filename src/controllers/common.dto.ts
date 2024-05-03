export class DecodedUser {
    userId!: number;
    id!: string;
    username!: string;
    email!: string;
    role!: string;
    activate!: boolean;
}

export class PaginationReqDTO {
    pageIndex!: number;
    pageSize!: number;
    search!: string;
}

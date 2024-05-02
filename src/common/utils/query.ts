export const createOffsetQueyr = (query: any) => {
    let pagination: any;
    {
        let pageIndex = parseInt(query.pageIndex as string);
        pageIndex = isNaN(pageIndex) ? 0 : pageIndex; // default : 0
        let pageSize = parseInt(query.pageSize as string);
        pageSize = isNaN(pageSize) ? 10 : pageSize; // default : 10
        const search = (query.search as string) || "";
        pagination = {
            pageIndex,
            pageSize,
            search,
        };
    }
    return pagination;
};

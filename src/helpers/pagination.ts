type PaginationResult<T> = {
    data: T[];
    nextCursor?: string | undefined;
    prevCursor?: string | undefined;
    hasNextPage: boolean | undefined;
    hasPrevPage: boolean | undefined;
};


export const PaginationCursor = <T extends { createdAt?: string | undefined }>(response: Array<T>, limit: number, after: string | undefined, before: string | undefined): PaginationResult<T> => {
    let nextCursor: string | undefined = undefined;
    let prevCursor: string | undefined = undefined;
    let hasNextPage: boolean | undefined = undefined;
    let hasPrevPage: boolean | undefined = undefined;
    if (!after && !before) {
        if (response.length === Number(limit) + 1) {
            hasNextPage = true;
            hasPrevPage = false;
            response.pop();
            nextCursor = response[response.length - 1].createdAt;
        } else {
            hasNextPage = false;
            hasPrevPage = false;
        }
    } else if (after) {
        if (response.length === Number(limit) + 1) {
            hasNextPage = true;
            hasPrevPage = true;
            response.pop();
            prevCursor = response[0].createdAt;
            nextCursor = response[response.length - 1].createdAt;
        } else {
            hasNextPage = false;
            hasPrevPage = true;
            prevCursor = response[0].createdAt;
        }
    } else if (before) {
        if (response.length === Number(limit) + 1) {
            hasNextPage = true;
            hasPrevPage = true;
            response.pop();
            response.reverse();
            prevCursor = response[0].createdAt;
            nextCursor = response[response.length - 1].createdAt;
        } else {
            hasNextPage = true;
            hasPrevPage = false;
            response.reverse();
            nextCursor = response[response.length - 1].createdAt;
        }
    }
    return { data: response, nextCursor, prevCursor, hasNextPage, hasPrevPage };
};
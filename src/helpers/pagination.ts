type PaginationResult<T> = {
    data: T[];
    nextCursor?: string | undefined;
    prevCursor?: string | undefined;
    hasNextPage: boolean | undefined;
    hasPrevPage: boolean | undefined;
};

// Handle pagination, type must have createdAt field
// Note: order=ASC <-> > (gt)  |||||  order=DESC <-> < (lt)
// This is also why when we meet before we have to reverse the array
// Because the array returned when beforeCursor exist will be have the oldest first and newest at the bottom.
export const PaginationCursor = <T extends { createdAt?: string | undefined }>(response: Array<T>, limit: number, after: string | undefined, before: string | undefined): PaginationResult<T> => {
    // Initialize the cursor value and boolean value.
    let nextCursor: string | undefined = undefined;
    let prevCursor: string | undefined = undefined;
    let hasNextPage: boolean | undefined = undefined;
    let hasPrevPage: boolean | undefined = undefined;
    if (!after && !before) {
        // If there are no after and before cursor
        // Check if the length of the array is equal to limit + 1
        // If yes -> have next page, pop the response by 1 to the last one
        // Set the nextCursor to be the last element of the current array
        if (response.length === Number(limit) + 1) {
            hasNextPage = true;
            hasPrevPage = false;
            response.pop();
            nextCursor = response[response.length - 1].createdAt;
        } else {
            // Else -> No next page and no previous page
            hasNextPage = false;
            hasPrevPage = false;
        }
    } else if (after) {
        // If there exists after cursor -> there will be always exists previous page
        // Check if the length of the array is equal to limit + 1
        // If yes -> have next page, pop the response by 1 to the last one
        // Set the nextCursor to be the last element of the current array
        // Set the prevCursor to be the first element of the current array
        if (response.length === Number(limit) + 1) {
            hasNextPage = true;
            hasPrevPage = true;
            response.pop();
            prevCursor = response[0].createdAt;
            nextCursor = response[response.length - 1].createdAt;
        } else {
            // If the length is not equal the limit + 1
            // -> only have the prev page, set the prevCursor to be the first element of the array.
            hasNextPage = false;
            hasPrevPage = true;
            prevCursor = response[0].createdAt;
        }
    } else if (before) {
        // If there exists before cursor -> there will be always exists next page
        // First we check if the length of the array == limit + 1
        // If yes -> we still have previous page
        // We pop to remove the newest one at the last position
        // Why we need to reverse array? Read note at head of the file
        // Set the next cursor to be the last element of the array
        // Set the prev cursor to be the first element of the array
        if (response.length === Number(limit) + 1) {
            hasNextPage = true;
            hasPrevPage = true;
            response.pop();
            response.reverse();
            prevCursor = response[0].createdAt;
            nextCursor = response[response.length - 1].createdAt;
        } else {
            // If there are less element than limit + 1
            // We only have nextpage, no prevpage
            // Update the nextCursor to be the last element of the array
            hasNextPage = true;
            hasPrevPage = false;
            response.reverse();
            nextCursor = response[response.length - 1].createdAt;
        }
    }
    return { data: response, nextCursor, prevCursor, hasNextPage, hasPrevPage };
};
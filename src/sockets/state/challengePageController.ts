import { ChallengeAttributes } from "../../types/types";

// To control the challenge page and users who enter it
class ChallengePageController {
    private challengePageTracker = new Map<string, Set<string>>();
    handleUserEnterChallengePage(userId: string, challenge: ChallengeAttributes) {
        if (!this.challengePageTracker.has(challenge.id!)) {
            // If not exists this page before -> create new one
            this.challengePageTracker.set(challenge.id!, new Set());
        }
        // Add the new user to the challenge page
        this.challengePageTracker.get(challenge.id!)?.add(userId);
    }

    // To check if the number of users in the page is == 2
    checkNumberOfUsers(challengeId: string) {
        return this.challengePageTracker.get(challengeId)?.size == 2;
    }

    // To delete the page.
    deletePage(challengeId: string) {
        this.challengePageTracker.delete(challengeId);
    }

    // To delete user from the page
    deleteUserFromPage(challengeId: string, userId: string) {
        this.challengePageTracker.get(challengeId)?.delete(userId);
    }
}

export const challengePageController = new ChallengePageController();
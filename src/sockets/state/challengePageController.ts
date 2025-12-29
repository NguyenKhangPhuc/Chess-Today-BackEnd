import { ChallengeAttributes } from "../../types/types";

class ChallengePageController {
    private challengePageTracker = new Map<string, Set<string>>();
    handleUserEnterChallengePage(userId: string, challenge: ChallengeAttributes) {
        if (!this.challengePageTracker.has(challenge.id!)) {
            this.challengePageTracker.set(challenge.id!, new Set());
        }
        this.challengePageTracker.get(challenge.id!)?.add(userId);
    }

    checkNumberOfUsers(challengeId: string) {
        return this.challengePageTracker.get(challengeId)?.size == 2;
    }

    deletePage(challengeId: string) {
        this.challengePageTracker.delete(challengeId);
    }
}

export const challengePageController = new ChallengePageController();
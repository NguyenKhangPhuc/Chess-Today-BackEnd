"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengePageController = void 0;
// To control the challenge page and users who enter it
class ChallengePageController {
    constructor() {
        this.challengePageTracker = new Map();
    }
    handleUserEnterChallengePage(userId, challenge) {
        var _a;
        if (!this.challengePageTracker.has(challenge.id)) {
            // If not exists this page before -> create new one
            this.challengePageTracker.set(challenge.id, new Set());
        }
        // Add the new user to the challenge page
        (_a = this.challengePageTracker.get(challenge.id)) === null || _a === void 0 ? void 0 : _a.add(userId);
    }
    // To check if the number of users in the page is == 2
    checkNumberOfUsers(challengeId) {
        var _a;
        return ((_a = this.challengePageTracker.get(challengeId)) === null || _a === void 0 ? void 0 : _a.size) == 2;
    }
    // To delete the page.
    deletePage(challengeId) {
        this.challengePageTracker.delete(challengeId);
    }
    // To delete user from the page
    deleteUserFromPage(challengeId, userId) {
        var _a;
        (_a = this.challengePageTracker.get(challengeId)) === null || _a === void 0 ? void 0 : _a.delete(userId);
    }
}
exports.challengePageController = new ChallengePageController();

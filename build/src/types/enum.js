"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATION_TYPE = exports.PUZZLE_STATUS = exports.PUZZLE_LEVEL = exports.GAME_STATUS = exports.GAME_TYPE = exports.INVITATION_STATUS = void 0;
var INVITATION_STATUS;
(function (INVITATION_STATUS) {
    INVITATION_STATUS[INVITATION_STATUS["pending"] = 0] = "pending";
    INVITATION_STATUS[INVITATION_STATUS["accepted"] = 1] = "accepted";
    INVITATION_STATUS[INVITATION_STATUS["rejected"] = 2] = "rejected";
})(INVITATION_STATUS || (exports.INVITATION_STATUS = INVITATION_STATUS = {}));
var GAME_TYPE;
(function (GAME_TYPE) {
    GAME_TYPE["ROCKET"] = "Rocket";
    GAME_TYPE["BLITZ"] = "Blitz";
    GAME_TYPE["RAPID"] = "Rapid";
})(GAME_TYPE || (exports.GAME_TYPE = GAME_TYPE = {}));
var GAME_STATUS;
(function (GAME_STATUS) {
    GAME_STATUS["FINISHED"] = "finished";
    GAME_STATUS["PLAYING"] = "playing";
})(GAME_STATUS || (exports.GAME_STATUS = GAME_STATUS = {}));
var PUZZLE_LEVEL;
(function (PUZZLE_LEVEL) {
    PUZZLE_LEVEL[PUZZLE_LEVEL["EASY"] = 1] = "EASY";
    PUZZLE_LEVEL[PUZZLE_LEVEL["MEDIUM"] = 2] = "MEDIUM";
    PUZZLE_LEVEL[PUZZLE_LEVEL["HARD"] = 3] = "HARD";
})(PUZZLE_LEVEL || (exports.PUZZLE_LEVEL = PUZZLE_LEVEL = {}));
var PUZZLE_STATUS;
(function (PUZZLE_STATUS) {
    PUZZLE_STATUS["SOLVED"] = "solved";
    PUZZLE_STATUS["UNSOLVED"] = "unsolved";
})(PUZZLE_STATUS || (exports.PUZZLE_STATUS = PUZZLE_STATUS = {}));
var VERIFICATION_TYPE;
(function (VERIFICATION_TYPE) {
    VERIFICATION_TYPE["PASSWORD_RESET"] = "PASSWORD_RESET";
    VERIFICATION_TYPE["AUTHENTICATION"] = "AUTHENTICATION";
})(VERIFICATION_TYPE || (exports.VERIFICATION_TYPE = VERIFICATION_TYPE = {}));

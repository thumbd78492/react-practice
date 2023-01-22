"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eApS = exports.eApV = exports.errorMessageAddFront = exports.semiErrorMessage = exports.errorMessageFrom = exports.errorMessageOf = void 0;
const N = require("newtype-ts");
const Apply = require("fp-ts/Apply");
const S = require("fp-ts/string");
const E = require("fp-ts/Either");
const function_1 = require("fp-ts/lib/function");
exports.errorMessageOf = N.iso().wrap;
exports.errorMessageFrom = N.iso().unwrap;
exports.semiErrorMessage = {
    concat: (msg1, msg2) => (0, exports.errorMessageOf)((0, exports.errorMessageFrom)(msg1) + '\n' + (0, exports.errorMessageFrom)(msg2)),
};
const errorMessageAddFront = (msg) => (em) => (0, function_1.pipe)(em, exports.errorMessageFrom, (oldMsg) => msg + oldMsg + '\n', S.split('\n'), (x) => x.join('\n\t'), exports.errorMessageOf);
exports.errorMessageAddFront = errorMessageAddFront;
exports.eApV = E.getApplicativeValidation(exports.semiErrorMessage);
exports.eApS = Apply.apS(exports.eApV);

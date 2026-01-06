"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (requestFunction) => {
    return (req, res, next) => {
        Promise.resolve(requestFunction(req, res, next)).catch((err) => next(err));
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map
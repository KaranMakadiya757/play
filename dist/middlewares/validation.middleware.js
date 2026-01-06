"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = require("../utils/apiError");
const validate = (schema) => {
    return (req, _res, next) => {
        const isBodyEmpty = !req.body || Object.keys(req.body).length === 0;
        const hasNoFile = !req.file && (!req.files || Object.keys(req.files).length === 0);
        if (isBodyEmpty && hasNoFile) {
            throw new apiError_1.ApiError(400, "Bad Request !! No Payload Provided");
        }
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const validationErrors = error.details.map((detail) => detail.message);
            throw new apiError_1.ApiError(400, "Bad Request", validationErrors);
        }
        next();
    };
};
exports.default = validate;
//# sourceMappingURL=validation.middleware.js.map
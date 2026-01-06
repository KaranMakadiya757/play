"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthcheck_controller_1 = require("../controllers/healthcheck.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /healthcheck:
 *   get:
 *     summary: Health Check Route
 *     tags:
 *      - Health Check
 *     security: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/HealthcheckResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.route("/").get(healthcheck_controller_1.healthcheck);
exports.default = router;
//# sourceMappingURL=healthcheck.routes.js.map
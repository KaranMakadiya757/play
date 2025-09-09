import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller";

const router = Router();

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
router.route("/").get(healthcheck);

export default router;

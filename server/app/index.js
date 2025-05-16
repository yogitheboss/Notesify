import authRoutes from "./auth/index.js";
import filesRoutes from "./files/index.js";
import { authMiddleware } from "../middleware/auth.js";
/**
 * Register all application routes
 * @param {express.Router} apiRouter - The main API router
 */
export const registerApps = (apiRouter) => {
  apiRouter.use("/auth", authRoutes);
  apiRouter.use("/files", authMiddleware, filesRoutes);
};

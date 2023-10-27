import express, { Router } from 'express';
import Owner from "../controllers/OwnerController"
import OwnerMiddleware from "../middleware/OwnerMiddleware"

const router: Router = express.Router();

router.post("/login", Owner.login);

router.post("/register", Owner.register);

// load middleware for all routes to test owner login
router.use(OwnerMiddleware.ownerLoginMiddleware);

router.get("/", Owner.defaultFunction);


export default router;
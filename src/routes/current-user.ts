import express from 'express';
import { currentUser } from '../middlewares/current-user';

import {me} from '../http/controllers/current-user/current-user-controller';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, me);

export { router as currentUserRouter };

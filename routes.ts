import { Router } from 'express';
import { SendMailController } from './src/controllers/SendMailController';
import { SurveysController } from './src/controllers/SurveyController';
import { UserController } from './src/controllers/UserController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveysController();
const sendMail = new SendMailController();

router.post('/users', userController.create)

router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)

router.post('/send', sendMail.execute)

export {router}

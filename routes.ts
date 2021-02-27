import { Router } from 'express';
import { AnswerController } from './src/controllers/AnswerController';
import { NpsController } from './src/controllers/NpsController';
import { SendMailController } from './src/controllers/SendMailController';
import { SurveysController } from './src/controllers/SurveyController';
import { UserController } from './src/controllers/UserController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveysController();
const sendMail = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post('/users', userController.create)

router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)

router.post('/send', sendMail.execute)

router.get('/answers/:value', answerController.execute)

router.get('/nps', npsController.execute)


export {router}

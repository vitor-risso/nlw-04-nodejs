import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepositorys";


class NpsController{
  async execute(req: Request, res: Response){

    const { survey_id } = req.params 

    const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUsers = await surveyUserRepository.find({
      survey_id
    });

    const detractor = surveyUsers.filter(
      survey => survey.value >= 0 && survey.value <= 6
    ).length;

    const promoters  = surveyUsers.filter(survey => survey.value >= 9 && survey.value <= 10).length;

    const passive = surveyUsers.filter(survey => survey.value >= 7 && survey.value <= 8).length;

    const totalAnswers = surveyUsers.length;

    const calculate = (promoters - detractor) / totalAnswers;

    return res.json({
      detractor,
      promoters,
      passive,
      totalAnswers,
      nps: calculate
    })

  }
}

export { NpsController }

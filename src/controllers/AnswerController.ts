import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepositorys";


class AnswerController {

  // http://localhost:8080/answers/1?u=17fb2260-7cf4-46bd-bf6c-fa88d3d92cb1
  async execute(req: Request, res: Response){
    const { value } = req.params;
    const { u } = req.query;

    const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveyUserRepository.findOne({
      id: String(u)
    })

    if(!surveyUser){
      throw new AppError("SurveyUser does not exists!")
    };

    surveyUser.value = Number(value);

    await surveyUserRepository.save(surveyUser)

    return res.status(200).send({ message: "Answer has been added" ,data: surveyUser});

  }
}

export { AnswerController }

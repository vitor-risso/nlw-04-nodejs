import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';
import { SurveysRepository } from "../repositories/SurveysRespository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepositorys";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";


class SendMailController{

  async execute(req: Request, res: Response){
    const { email, survey_id } = req.body;

    const userRepository =  getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userExists = await userRepository.findOne({email});
    const surveyExists = await surveyRepository.findOne({id: survey_id});

    if(!userExists){
      res.status(400).send({error: "User doesn't exist"})
    }

    if(!surveyExists){
      res.status(400).send({error: "Survey does not exist"})
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const variables = {
      name: userExists.name,
      title: surveyExists.title,
      description: surveyExists.description,
      user_id: userExists.id,
      link: process.env.URL_MAIL
    };

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{user_id: userExists.id}, {value: null}],
      relations: ["user", "survey"]
    });

    if(surveyUserAlreadyExists){
      await SendMailService.execute(email, surveyExists.title, variables, npsPath);
      return res.json(surveyUserAlreadyExists)
    }

    // Save the information at the table
    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser)

    // Send an email to user    
    await SendMailService.execute(email, surveyExists.title, variables, npsPath )

    return res.json({message: "Survey user created", data: surveyUser})
  }

}

export { SendMailController }

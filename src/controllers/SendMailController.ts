import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';
import { SurveysRepository } from "../repositories/SurveysRespository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepositorys";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";


class SendMailController{

  async execute(req: Request, res: Response){
    const { email, survey_id } = req.body;

    const userRepository =  getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userExists = await userRepository.findOne({email});
    const surveyExists = await surveyRepository.findOne({id: survey_id});

    if(!userExists){
      throw new AppError("User doesn't exist");
    };

    if(!surveyExists){
      throw new AppError("Survey does not exist");
    };

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");



    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: {user_id: userExists.id,value: null},
      relations: ["user", "survey"]
    });

    const variables = {
      name: userExists.name,
      title: surveyExists.title,
      description: surveyExists.description,
      id: '',
      link: process.env.URL_MAIL
    };

    if(surveyUserAlreadyExists){
      variables.id =  surveyUserAlreadyExists.id; 
      await SendMailService.execute(email, surveyExists.title, variables, npsPath);
      return res.json(surveyUserAlreadyExists)
    };

    // Save the information at the table
    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser)

    // Send an email to user    
    variables.id = surveyUser.id
    await SendMailService.execute(email, surveyExists.title, variables, npsPath )

    return res.json({message: "Survey user created", data: surveyUser})
  }

}

export { SendMailController }

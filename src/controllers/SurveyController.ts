import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysRepository } from '../repositories/SurveysRespository';

class SurveysController {
  
  async create (req: Request, res: Response){
    const { title, description } = req.body;

    const surveyRepository = getCustomRepository(SurveysRepository);

    const surveyAlreadyExistisByTitle = await surveyRepository.findOne({title})
    const surveyAlreadyExistisByDescription = await surveyRepository.findOne({description})

    if(surveyAlreadyExistisByTitle || surveyAlreadyExistisByDescription ){
      throw new AppError("Survey already exist, change your title and/or description");
    };

    const survey = surveyRepository.create({
      title, description
    })

    await surveyRepository.save(survey)

    return res.status(201).send({message: "Pesquisa cadastrada.", data: survey})
  } 

  async show (req: Request, res:Response){

    const surveyRepository = getCustomRepository(SurveysRepository);

    const all = await surveyRepository.find();

    return res.send(all)
  }
}

export { SurveysController }

import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRespository';

class SurveysController {
  
  async create (req: Request, res: Response){
    const { title, description } = req.body;

    const surveyRepository = getCustomRepository(SurveysRepository);

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

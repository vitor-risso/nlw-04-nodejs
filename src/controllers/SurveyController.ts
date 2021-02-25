import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRespository';

class SurveysController {
  
  async create (req: Request, res: Response){
    const { title, description } = req.body;

    const surveyRepository = getCustomRepository(SurveysRepository);

    const surveyAlreadyExistisByTitle = await surveyRepository.findOne({title})
    const surveyAlreadyExistisByDescription = await surveyRepository.findOne({description})

    if(surveyAlreadyExistisByTitle){
      return res.status(400).send({message: "survey already exist, change your title and/or description"})
    }

    if(surveyAlreadyExistisByDescription){
      return res.status(400).send({message: "survey already exist, change your description and/or title"})
    }

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

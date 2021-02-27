import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import * as yup from 'yup';

class UserController{

  async create(req: Request, res: Response){
    const { name, email} = req.body;

    const  schema = yup.object().shape({
      name:yup.string().required(),
      email:yup.string().email().required()
    }); 
    
    if( !(await schema.isValid(req.body))){
      return res.status(400).send({messgae: "Insert all data (name and email)"});
    };

    const userRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await userRepository.findOne({email})

    if(userAlreadyExists){
      return res.status(400).send({message: "User already exist"})
    }

    const user = userRepository.create({
      name, email
    })


    await userRepository.save(user)

    return res.status(201).send(user)
  }
}

export { UserController };


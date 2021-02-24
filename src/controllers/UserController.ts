import { Response, Request } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../models/User';

class UserController{

  async create(req: Request, res: Response){
    const { name, email} = req.body;

    const userRepository = getRepository(User);

    const userAlreadyExists = await userRepository.findOne({email})

    if(userAlreadyExists){
      return res.status(400).send({message: "User already exist"})
    }

    const user = userRepository.create({
      name, email
    })


    await userRepository.save(user)

    return res.send(user)
  }
}

export { UserController }

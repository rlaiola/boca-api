import { inject, injectable } from "tsyringe";

import { UsersRepository } from "../../repositories/implementations/UsersRepository";

interface IRequest {
  contestnumber: number;
  usersitenumber: number;
  usernumber: number;
  username: string;
  userfullname: string;
  userdesc?: string;
  usertype: string;
  userenabled: boolean;
  usermultilogin: boolean;
  userpassword: string;
  userip?: string;
  userlastlogin?: number;
  usersession: string;
  usersessionextra: string;
  userlastlogout?: number;
  userpermitip?: number;
  userinfo: string;
  usercpcid: string;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepository
  ) {}

  async execute({
    contestnumber,
    usersitenumber,
    username,
    userfullname,
    userdesc,
    usertype,
    userenabled,
    usermultilogin,
    userpassword,
    userip,
    userlastlogin,
    usersession,
    usersessionextra,
    userlastlogout,
    userpermitip,
    userinfo,
    usercpcid,
  }: IRequest): Promise<void> {
    try {
      const count = (await this.usersRepository.count()) + 1;
      await this.usersRepository.create({
        contestnumber,
        usersitenumber,
        usernumber: count,
        username,
        userfullname,
        userdesc,
        usertype,
        userenabled,
        usermultilogin,
        userpassword,
        userip,
        userlastlogin,
        usersession,
        usersessionextra,
        userlastlogout,
        userpermitip,
        userinfo,
        usercpcid,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export { CreateUserUseCase };

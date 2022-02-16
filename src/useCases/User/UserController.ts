import { Request, Response } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { GetContestsUseCase } from "../Contest/GetContestUseCase";

import { GetProblemUseCase } from "../Problem/GetProblemUseCase";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { GetUserUseCase } from "./GetUserUseCase";
import { ListUsersUseCase } from "./ListUserUseCase";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UserController {
  async listAll(request: Request, response: Response): Promise<Response> {
    const listUsersUseCase = container.resolve(ListUsersUseCase);

    const { id_p } = request.params;

    try {
      const all = await listUsersUseCase.execute(parseInt(id_p, 10));
      return response.json(all);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async getOne(request: Request, response: Response): Promise<Response> {
    const getUserUseCase = container.resolve(GetUserUseCase);
    const { id_user } = request.params;

    try {
      const user = await getUserUseCase.execute({
        id: parseInt(id_user, 10),
      });
      return response.json(user);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }

  async create(request: Request, response: Response): Promise<Response> {
    const createUserUseCase = container.resolve(CreateUserUseCase);
    const getContestUseCase = container.resolve(GetContestsUseCase);

    const { id_c } = request.params;

    const {
      contestnumber,
      usersitenumber,
      usernumber,
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
      updatetime,
      usercpcid,
    } = request.body();

    const user = await getContestUseCase.execute({ id: parseInt(id_c, 10) });

    if (!user) {
      throw new Error("Contest not found");
    }

    try {
      await createUserUseCase.execute({
        contestnumber: parseInt(id_c, 10),
        usersitenumber,
        usernumber,
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
        updatetime,
        usercpcid,
      });

      return response.status(201).send();
    } catch (error) {
      return response.status(400).json({ error: "Error creating User" });
    }
  }

  async update(request: Request, response: Response): Promise<Response> {
    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    const { id_user } = request.params;

    const {
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
      updatetime,
      usercpcid,
    } = request.body;

    try {
      await updateUserUseCase.execute({
        contestnumber,
        usersitenumber,
        usernumber: parseInt(id_user, 10),
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
        updatetime,
        usercpcid,
      });

      return response.status(201).send();
    } catch (error) {
      return response.status(400).json({ error: "Error creating User" });
    }
  }

  async delete(request: Request, response: Response) {
    const { id_user } = request.params;
    const idNumber = parseInt(id_user, 10);
    const deleteUserUseCase = container.resolve(DeleteUserUseCase);

    try {
      await deleteUserUseCase.execute({ id: idNumber });
      return response.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export { UserController };

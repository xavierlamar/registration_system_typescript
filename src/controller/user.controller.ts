import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../service/user.service";
import log from "../utils/logger";
import sendEmail from "../utils/mailer";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  const user = await createUser(body);

  try {

    await sendEmail({
      to: user.email,
      from: "test@example.com",
      subject: "Verify your email",
      text: `verification code: ${user.verificationCode} and Id: ${user._id}`,
    });

    return res.json("User successfully created");
  } catch (e: any) {
 
    return res.status(500).send("account exists");
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // find the user by id
  const user = await findUserById(id);

  if (!user) {
    return res.send("Could not verify user");
  }

  // check to see if they are already verified
  if (user.verified) {
    return res.send("User is already verified");
  }

  // check to see if the verificationCode matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return res.send("User successfully verified");
  }

  return res.send("Could not verify user");
}

export async function forgotPasswordHandler(req:Request<{},{}, ForgotPasswordInput>, res:Response){

  const message = "If a user with that email is registered you will receive a password reset email";

  const {email} = req.body

  const user = await findUserByEmail(email)

  if(!user){
    log.debug(`User with email ${email} does not exists`);
    return res.send(message);
  }
  if (!user.verified) {
    return res.send("User is not verified");
  }


  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode

  await user.save()

  await sendEmail({
    to: user.email,
    from:"test@example.com",
    subject: "Reset your password",
    text:`Password reset code : ${passwordResetCode} and ID ${user._id}`
  });

  log.debug(`Password reset email to: ${email}`)

  return res.send(message)
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
){

  const {id,passwordResetCode}=req.params
  const {password} = req.body

  const user = await findUserById(id)

  if(
    !user || 
    !user.passwordResetCode || 
    user.passwordResetCode !== passwordResetCode
    ){
    return res.status(400).send("Could not reset user password")
  }

  user.passwordResetCode = null

  user.password = password;

  await user.save();

  return res.send("Successfully updated password")

  return 

}


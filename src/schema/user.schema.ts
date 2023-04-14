import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    // Personal Informations start
    fullName: string({
      required_error: "Full name is required",
    }),
    userName: string({
      required_error: "Username is required",
    }),
    phoneNumber: string({
      required_error: "Phone number is required",
    }),
    address: string({
      required_error: "Address is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    // Personal Informations end

    // Organization Informations start
    organizationName: string({
      required_error: "Organization name is required",
    }),
    sector: string({
      required_error: "sector is required",
    }),
    country: string({
      required_error: "Your country is required",
    }),
    city: string({
      required_error: "Your city is required",
    }),
    numberOfEmployees: string({
      required_error: "Number of Employees is required",
    }),
    // Organization Informations end

    //Bundle start
    subscriptionBundle: string({
      required_error: "A bundle needs to be selected",
    }),
    //Bundle start

    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short - should be min 6 chars"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short - should be min 6 chars"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

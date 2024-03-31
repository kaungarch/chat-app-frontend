import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { signup_controller } from "../controllers/signup_controller";
import { AxiosError } from "axios";

const Signup_Page = () => {
  const errorMessageSchema = z.object({ message: z.string() });
  const [errorMessage, seterrorMessage] = useState<string | null>(null);

  const FormSchema = z.object({
    name: z
      .string()
      .max(15, "Name should not exceed more than 15 characters.")
      .min(3, "Name should be at least 3 characters."),
    email: z.string().email(),
    password: z
      .string()
      .max(15, "Password should not exceed more than 15 characters.")
      .min(8, "Password should be at least 8 characters.")
      .superRefine((val, ctx) => {
        if (/\s/g.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password don't allow space character.",
          });
        }
      }),
  });

  type FormType = z.infer<typeof FormSchema>;

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<FormType>({ resolver: zodResolver(FormSchema) });

  const handleSignup: SubmitHandler<FormType> = async (data) => {
    console.log(data);
    signup_controller(data)
      .then((response) => {
        console.log(response.data);
        seterrorMessage(null);
      })
      .catch((err) => {
        const error = err as AxiosError;
        if (error.response?.status === 401 || 403) {
          const Zcheck = errorMessageSchema.safeParse(error.response?.data);
          if (Zcheck.success) seterrorMessage(Zcheck.data.message);
        }
      });
    reset();
  };

  return (
    <div className="flex w-full h-screen bg-zinc-100 justify-center items-center">
      <div className="flex flex-col min-w-[500px] bg-white gap-y-5 shadow-lg p-10">
        <div>
          <h1 className="text-5xl mb-4 font-[poppins] font-semibold capitalize text-zinc-600 text-center">
            login form
          </h1>
        </div>
        <form
          onSubmit={handleSubmit(handleSignup)}
          className="flex flex-col gap-y-5"
        >
          {/* name 🧑🏻 */}
          <div className="flex flex-col gap-y-3">
            <label htmlFor="name" className="capitalize font-[poppins] text-lg">
              name
            </label>
            <input
              id="name"
              type="name"
              {...register("name")}
              className="text-lg py-2 pl-3 text-gray-600 rounded-lg border border-zinc-400 outline-none focus:ring-purple-400 focus:ring-1"
            />
            {errors.name && (
              <p className="text-red-400">{errors.name.message}</p>
            )}
          </div>
          {/* email 📜 */}
          <div className="flex flex-col gap-y-3">
            <label
              htmlFor="email"
              className="capitalize font-[poppins] text-lg"
            >
              email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="text-lg py-2 pl-3 text-gray-600 rounded-lg border border-zinc-400 outline-none focus:ring-purple-400 focus:ring-1"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </div>
          {/* password ☢️ */}
          <div className="flex flex-col gap-y-3">
            <label
              htmlFor="password"
              className="capitalize font-[poppins] text-lg"
            >
              password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="text-lg py-2 pl-3 text-gray-600 rounded-lg border border-zinc-400 outline-none focus:ring-purple-400 focus:ring-1"
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
          {/* error message from server 🚨 */}
          <p className="text-red-400">{errorMessage && errorMessage}</p>
          {/* signup buttons🕹️ */}
          <div className="flex w-full">
            <button
              onClick={() => trigger()}
              className="w-full bg-zinc-300 text-gray-600 text-lg py-2 rounded-lg font-[poppins] outline-none focus:ring-1 focus:ring-purple-400 capitalize"
            >
              signup
            </button>
          </div>
          {/* home button */}
          <div className="flex">
            <Link
              to={"/"}
              className="w-full text-center text-purple-400 bg-white text-lg py-2 rounded-lg border-2 border-zinc-300 font-[poppins] outline-none focus:ring-1 focus:ring-purple-400"
            >
              Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup_Page;

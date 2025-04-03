"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormData = {
  username: string;
  password: string;
};

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    console.log(res);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/admin");
      router.refresh();
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">{error}</p>
        )}

        <h1 className="text-black font-bold text-4xl mb-4 text-center">Login</h1>

        <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
          Username:
        </label>
        <input
          type="text"
          {...register("username", {
            required: "Username is required",
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="yourUser123"
        />

        {errors.username && (
          <span className="text-red-500 text-xs">{errors.username.message}</span>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Password:
        </label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="******"
        />

        {errors.password && (
          <span className="text-red-500 text-xs">{errors.password.message}</span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
          Login
        </button>
      </form>
    </div>
  );
}

export default function Page() {
    return <LoginPage />;
  }

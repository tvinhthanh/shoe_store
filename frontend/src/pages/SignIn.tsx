import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast, setUserData } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>();

  const mutation = useMutation((data: SignInFormData) => authService.signIn(data), {
    onSuccess: async (data) => {
      setUserData(data.id_user, data.role);

      showToast("Đăng nhập thành công!", "SUCCESS");
      await queryClient.invalidateQueries("validateToken");

      // Redirect by role
      if (data.role === "1") navigate("/admin");
      else navigate("/");
    },
    onError: (err: Error) => {
      showToast(err.message, "ERROR");
    }
  });

  const onSubmit = handleSubmit((data) => mutation.mutate(data));

  return (
    <form
      className="flex flex-col gap-4 p-4 max-w-sm mx-auto"
      onSubmit={onSubmit}
    >
      <h2 className="text-xl font-bold text-center">Đăng nhập</h2>

      <label className="text-xs font-semibold">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 mt-1 text-sm"
          {...register("email", { required: "Email is required" })}
        />
      </label>

      {errors.email && (
        <p className="text-red-500 text-xs -mt-2">{errors.email.message}</p>
      )}

      <label className="text-xs font-semibold">
        Mật khẩu
        <input
          type="password"
          className="border rounded w-full py-1 px-2 mt-1 text-sm"
          {...register("password", { required: "Password is required" })}
        />
      </label>

      {errors.password && (
        <p className="text-red-500 text-xs -mt-2">
          {errors.password.message}
        </p>
      )}

      <button
        type="submit"
        className="bg-black text-white p-2 rounded mt-2 hover:bg-gray-900"
      >
        Đăng nhập
      </button>

      <p className="text-sm text-center">
        Chưa có tài khoản?{" "}
        <Link className="underline" to="/register">
          Đăng ký
        </Link>
      </p>
    </form>
  );
};

export default SignIn;

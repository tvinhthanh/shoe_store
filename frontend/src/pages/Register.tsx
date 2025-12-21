import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { authService } from "../services/auth.service";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  role?: "1" | "2";
};

const Register = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm<RegisterFormData>();

  // Mutation KHÔNG có onSuccess/onError tại đây nữa
  const mutation = useMutation((data: RegisterFormData) =>
    authService.register(data)
  );

  const onSubmit = (data: RegisterFormData) => {
    if (mutation.isLoading) return; // Chống double submit

    mutation.mutate(
      { ...data, role: "2" },
      {
        onSuccess: () => {
          showToast("Đăng ký thành công!", "SUCCESS");
          navigate("/login");
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Đã xảy ra lỗi, vui lòng thử lại!";
          showToast(message, "ERROR");
        },
      }
    );
  };

  return (
    <form
      className="max-w-md mx-auto flex flex-col gap-4 p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-bold text-center">Tạo tài khoản</h2>

      <div className="flex gap-4">
        <label className="text-xs font-semibold flex-1">
          Họ
          <input
            className="border rounded w-full py-1 px-2"
            {...register("firstName", { required: "Required" })}
          />
        </label>

        <label className="text-xs font-semibold flex-1">
          Tên
          <input
            className="border rounded w-full py-1 px-2"
            {...register("lastName", { required: "Required" })}
          />
        </label>
      </div>

      <label className="text-xs font-semibold">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2"
          {...register("email", { required: "Required" })}
        />
      </label>

      <label className="text-xs font-semibold">
        Số điện thoại
        <input
          type="tel"
          className="border rounded w-full py-1 px-2"
          {...register("phone", {
            required: "Required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Sai số điện thoại",
            },
          })}
        />
      </label>

      <label className="text-xs font-semibold">
        Mật khẩu
        <input
          type="password"
          className="border rounded w-full py-1 px-2"
          {...register("password", {
            required: "Required",
            minLength: { value: 6, message: "Ít nhất 6 ký tự" },
          })}
        />
      </label>

      <label className="text-xs font-semibold">
        Nhập lại mật khẩu
        <input
          type="password"
          className="border rounded w-full py-1 px-2"
          {...register("confirmPassword", {
            validate: (val) =>
              val === watch("password") || "Mật khẩu không khớp",
          })}
        />
      </label>

      <label className="text-xs font-semibold">
        Địa chỉ
        <input
          className="border rounded w-full py-1 px-2"
          {...register("address", { required: "Required" })}
        />
      </label>

      <button
        type="submit"
        disabled={mutation.isLoading}
        className={`bg-black text-white py-2 font-semibold rounded ${mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        {mutation.isLoading ? "Đang xử lý..." : "Đăng ký"}
      </button>
    </form>
  );
};

export default Register;

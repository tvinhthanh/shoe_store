/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "react-query";
import { authService } from "../services/auth.service";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast, setUserData } = useAppContext();

  const mutation = useMutation(() => authService.signOut(), {
    onSuccess: async () => {
      // Xoá user trong FE context
      setUserData(null as any, null as any);

      // Cập nhật ngay lập tức cache để UI chuyển về trạng thái chưa đăng nhập
      queryClient.setQueryData("validateToken", { valid: false });

      // Làm mới trạng thái validateToken
      await queryClient.invalidateQueries("validateToken");

      showToast("Đăng xuất thành công!", "SUCCESS");
    },
    onError: (error: Error) => {
      showToast(error.message, "ERROR");
    }
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="hover:text-red-400 transition duration-200"
    >
      Đăng xuất
    </button>
  );
};

export default SignOutButton;

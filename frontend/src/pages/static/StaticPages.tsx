import React, { ReactNode } from "react";

interface InfoPageProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const InfoPage: React.FC<InfoPageProps> = ({ title, description, children }: InfoPageProps) => (
  <div className="max-w-screen-md mx-auto px-6 py-12 space-y-4">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-gray-700 leading-relaxed">{description}</p>
    {children && <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>}
  </div>
);

export const TermsOfSale: React.FC = () => (
  <InfoPage
    title="Điều khoản bán hàng"
    description="Các điều khoản áp dụng khi bạn mua sản phẩm tại cửa hàng trực tuyến của chúng tôi."
  >
    <p>- Giá, phí vận chuyển và thời gian giao hàng sẽ được hiển thị trước khi bạn thanh toán.</p>
    <p>- Đơn hàng chỉ được xác nhận sau khi bạn nhận được email thông báo thành công.</p>
    <p>- Vui lòng kiểm tra sản phẩm khi nhận; nếu có vấn đề hãy liên hệ hỗ trợ trong 48 giờ.</p>
  </InfoPage>
);

export const TermsOfUse: React.FC = () => (
  <InfoPage
    title="Điều khoản sử dụng"
    description="Quy định khi bạn truy cập và sử dụng website."
  >
    <p>- Không sử dụng website cho mục đích gian lận, spam hay gây hại cho người khác.</p>
    <p>- Tôn trọng bản quyền nội dung, không sao chép trái phép.</p>
    <p>- Chúng tôi có quyền hạn chế truy cập nếu phát hiện vi phạm.</p>
  </InfoPage>
);

export const PrivacyPolicy: React.FC = () => (
  <InfoPage
    title="Chính sách bảo mật"
    description="Cách chúng tôi thu thập và sử dụng thông tin cá nhân của bạn."
  >
    <p>- Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ và hỗ trợ khách hàng.</p>
    <p>- Thông tin thanh toán được xử lý an toàn; chúng tôi không lưu trữ dữ liệu thẻ trên hệ thống.</p>
    <p>- Bạn có thể yêu cầu cập nhật hoặc xóa thông tin cá nhân bằng cách liên hệ bộ phận hỗ trợ.</p>
  </InfoPage>
);

export const PrivacySettings: React.FC = () => (
  <InfoPage
    title="Tùy chọn quyền riêng tư"
    description="Quản lý các tùy chọn thông báo và bảo mật tài khoản."
  >
    <p>- Bạn có thể bật/tắt email khuyến mãi trong phần cài đặt tài khoản.</p>
    <p>- Hãy sử dụng mật khẩu mạnh và bật xác thực 2 bước (nếu có) để bảo vệ tài khoản.</p>
    <p>- Liên hệ hỗ trợ nếu phát hiện hoạt động bất thường trong tài khoản của bạn.</p>
  </InfoPage>
);



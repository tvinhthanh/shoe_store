/* eslint-disable @typescript-eslint/no-explicit-any */
import { QRCodeSVG } from "qrcode.react";
import { useCurrency } from "../../../hooks/useCurrency";

interface PaymentQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentMethod: string;
    orderCode: string;
    amount: number;
    onConfirm: () => void;
}

export default function PaymentQRModal({
    isOpen,
    onClose,
    paymentMethod,
    orderCode,
    amount,
    onConfirm,
}: PaymentQRModalProps) {
    const { formatVND } = useCurrency();
    
    if (!isOpen) return null;

    // Tạo nội dung QR code dựa trên phương thức thanh toán
    const getQRContent = () => {
        const formattedAmount = Math.round(amount).toLocaleString("vi-VN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        const baseInfo = `Mã đơn: ${orderCode}\nSố tiền: ${formattedAmount} VNĐ`;
        
        switch (paymentMethod) {
            case "bank_transfer":
                return `STK: 1234567890\nNgân hàng: Vietcombank\nChủ TK: SHOE SHOP\n${baseInfo}`;
            case "momo":
                return `momo://transfer?phone=0901234567&amount=${amount}&note=${orderCode}`;
            case "zalopay":
                return `zalopay://transfer?phone=0901234567&amount=${amount}&note=${orderCode}`;
            default:
                return baseInfo;
        }
    };

    const getPaymentName = () => {
        switch (paymentMethod) {
            case "bank_transfer":
                return "Chuyển khoản ngân hàng";
            case "momo":
                return "Ví MoMo";
            case "zalopay":
                return "ZaloPay";
            default:
                return "Thanh toán";
        }
    };

    const getPaymentInstructions = () => {
        switch (paymentMethod) {
            case "bank_transfer":
                return (
                    <div className="text-sm space-y-2 mt-4">
                        <div className="font-semibold">Thông tin chuyển khoản:</div>
                        <div>Số tài khoản: <span className="font-mono">1234567890</span></div>
                        <div>Ngân hàng: <span className="font-semibold">Vietcombank</span></div>
                        <div>Chủ tài khoản: <span className="font-semibold">SHOE SHOP</span></div>
                        <div className="mt-2 text-gray-600">
                            Nội dung chuyển khoản: <span className="font-mono">{orderCode}</span>
                        </div>
                    </div>
                );
            case "momo":
                return (
                    <div className="text-sm space-y-2 mt-4">
                        <div className="font-semibold">Hướng dẫn:</div>
                        <div>1. Mở ứng dụng MoMo</div>
                        <div>2. Quét mã QR bên trên</div>
                        <div>3. Xác nhận thanh toán</div>
                        <div className="mt-2 text-gray-600">
                            Hoặc chuyển khoản đến số: <span className="font-mono font-semibold">0901234567</span>
                        </div>
                    </div>
                );
            case "zalopay":
                return (
                    <div className="text-sm space-y-2 mt-4">
                        <div className="font-semibold">Hướng dẫn:</div>
                        <div>1. Mở ứng dụng ZaloPay</div>
                        <div>2. Quét mã QR bên trên</div>
                        <div>3. Xác nhận thanh toán</div>
                        <div className="mt-2 text-gray-600">
                            Hoặc chuyển khoản đến số: <span className="font-mono font-semibold">0901234567</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                <h2 className="text-xl font-bold mb-4 text-center">
                    Thanh toán qua {getPaymentName()}
                </h2>

                {/* QR Code */}
                <div className="flex justify-center my-6">
                    <div className="border-4 border-gray-200 p-4 rounded-lg bg-white">
                        <QRCodeSVG
                            value={getQRContent()}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                </div>

                {/* Payment Info */}
                <div className="text-center space-y-2 mb-4">
                    <div className="text-lg font-semibold">
                        Mã đơn hàng: <span className="text-blue-600">{orderCode}</span>
                    </div>
                    <div className="text-xl font-bold text-red-600">
                        {formatVND(amount)}
                    </div>
                </div>

                {/* Instructions */}
                {getPaymentInstructions()}

                {/* Action buttons */}
                <div className="mt-6 space-y-2">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700"
                    >
                        Đã thanh toán xong
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}


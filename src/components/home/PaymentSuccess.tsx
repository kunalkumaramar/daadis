import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Home, CheckCircle2, Download, ClipboardCheck, Mail, Calendar, CreditCard, Hash } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface PaymentSuccessState {
  paymentId: string;
  orderId: string;
  amount: number;
  timestamp: string;
}

export const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(true);

  const paymentData = location.state as PaymentSuccessState;

  useEffect(() => {
    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(confettiTimer);
  }, []);

  useEffect(() => {
    // Redirect countdown
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [countdown, navigate]);

  // Redirect if no payment data
  useEffect(() => {
    if (!paymentData) {
      navigate("/");
    }
  }, [paymentData, navigate]);

  if (!paymentData) {
    return null;
  }

  const formattedDate = new Date(paymentData.timestamp).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 font-Quicksand">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12 relative overflow-hidden">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4 animate-bounce">
            <CheckCircle2 className="w-20 h-20 text-green-600" strokeWidth={2} />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border border-yellow-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ClipboardCheck className="w-6 h-6 mr-2" />
            Payment Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Hash className="w-4 h-4 mr-2" />
                Payment ID:
              </span>
              <span className="font-mono text-sm bg-white px-3 py-1 rounded border">
                {paymentData.paymentId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Hash className="w-4 h-4 mr-2" />
                Order ID:
              </span>
              <span className="font-mono text-sm bg-white px-3 py-1 rounded border">
                {paymentData.orderId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Amount Paid:
              </span>
              <span className="text-2xl font-bold text-green-600">
                ₹{paymentData.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date & Time:
              </span>
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800 text-center flex items-center justify-center flex-wrap gap-1">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span>A confirmation email has been sent to your registered email address.</span>
          </p>
          <p className="text-sm text-blue-800 text-center mt-2">
            You can track your order from your profile page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/profile/orders" className="flex-1">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-6 text-base">
              <Download className="w-5 h-5 mr-2" />
              View Order Details
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-2 border-gray-300 hover:bg-gray-100 py-6 text-base font-semibold"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>

        {/* Auto Redirect Countdown */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Automatically redirecting to home in{" "}
            <span className="font-bold text-yellow-600">{countdown}</span> seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

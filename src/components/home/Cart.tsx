import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { ToastFaliure, ToastSuccess } from "../dashboard/productMain/AllProductsTable";
import type { RootState, AppDispatch } from "../../redux1/store";
import {
  fetchCartDetails,
  selectCartItems,
  selectCartTotals,
  selectCartLoading,
  updateCartItem,
  removeCartItem,
  clearCart,
  selectUpdateCartLoading,
  selectRemoveCartLoading,
  applyDiscount,
  removeDiscount,
  selectRemoveDiscountLoading,
  clearAppliedDiscount,
} from "../../redux1/cartSlice";
import { Product } from "../../redux1/productSlice";
import { selectUser, updateProfile, Address } from "../../redux1/authSlice";
import { createOrder } from "../../redux1/orderSlice";
import {
  initiatePayment,
  handlePaymentSuccess,
  RazorpayPaymentData,
} from "../../redux1/paymentSlice";
import {
  getDiscountByCode,
  selectCurrentDiscount,
  selectDiscountLoading,
  selectDiscountError,
} from "../../redux1/discountSlice";

// Checkout Modal Component
interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { phoneNumber: string; address: Address }) => void;
  user: any;
  loading: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  loading,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState<Address>({
    name: "",
    addressLine1: "",
    city: "",
    state: "",
    pinCode: "",
    isDefault: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phoneNumber || "");
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr =
          user.addresses.find((a: Address) => a.isDefault) ||
          user.addresses[0];
        setAddress(defaultAddr);
      }
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!phoneNumber || !phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (!address.name.trim()) newErrors.name = "Name is required";
    if (!address.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.pinCode.trim()) newErrors.pinCode = "Pin code is required";
    else if (!/^\d{6}$/.test(address.pinCode.trim()))
      newErrors.pinCode = "Please enter a valid 6-digit pin code";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ phoneNumber, address });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Complete Your Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Personal Information (Read-only) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  value={user?.firstName || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  value={user?.lastName || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input value={user?.email || ""} disabled className="bg-gray-50" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (errors.phoneNumber)
                  setErrors((prev) => ({ ...prev, phoneNumber: "" }));
              }}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Shipping Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Label <span className="text-red-500">*</span>
                </label>
                <Input
                  value={address.name}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, name: e.target.value }));
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="e.g., Home, Office"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pin Code <span className="text-red-500">*</span>
                </label>
                <Input
                  value={address.pinCode}
                  onChange={(e) => {
                    setAddress((prev) => ({
                      ...prev,
                      pinCode: e.target.value,
                    }));
                    if (errors.pinCode)
                      setErrors((prev) => ({ ...prev, pinCode: "" }));
                  }}
                  placeholder="6-digit pin code"
                  maxLength={6}
                  className={errors.pinCode ? "border-red-500" : ""}
                />
                {errors.pinCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={address.addressLine1}
                onChange={(e) => {
                  setAddress((prev) => ({
                    ...prev,
                    addressLine1: e.target.value,
                  }));
                  if (errors.addressLine1)
                    setErrors((prev) => ({ ...prev, addressLine1: "" }));
                }}
                placeholder="House number, street name, area"
                rows={3}
                className={`resize-none ${errors.addressLine1 ? "border-red-500" : ""
                  }`}
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.addressLine1}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  value={address.city}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, city: e.target.value }));
                    if (errors.city)
                      setErrors((prev) => ({ ...prev, city: "" }));
                  }}
                  placeholder="City"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <Input
                  value={address.state}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, state: e.target.value }));
                    if (errors.state)
                      setErrors((prev) => ({ ...prev, state: "" }));
                  }}
                  placeholder="State"
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>
            </div>
            <div>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={address.isDefault}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                Save as default address
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 order-1 sm:order-2 bg-yellow-500 hover:bg-yellow-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Continue to Payment"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ⭐ UPDATED: Cart Item Component with fixed layout
interface CartItemProps {
  item: any;
  dispatch: AppDispatch;
  userPresent: boolean;
  quantity: number;
  itemId: string;
  product: Product;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, dispatch }) => {
  const product: Product | undefined = useSelector((state: RootState) => {
    if (typeof item.product === "string") {
      return state.product.products.find((p) => p._id === item.product);
    }
    return item.product as Product;
  });

  const updateLoading = useSelector(selectUpdateCartLoading);
  const removeLoading = useSelector(selectRemoveCartLoading);
  const isCartUpdating = updateLoading || removeLoading;

  const [count, setCount] = useState(item.quantity);
  const [loadingMinus, setLoadingMinus] = useState(false);
  const [loadingPlus, setLoadingPlus] = useState(false);

  useEffect(() => {
    setCount(item.quantity);
  }, [item.quantity]);

  if (!product) return <div>Loading product...</div>;

  const handleRemove = async () => {
    if (isCartUpdating) return;
    try {
      await dispatch(removeCartItem(item._id)).unwrap();
      toast.success("Product removed from cart!", {
        className: "font-[Quicksand]",
        icon: <ToastSuccess />,
      });
      dispatch(fetchCartDetails());
    } catch {
      toast.error("Failed to remove product.", {
        className: "font-[Quicksand]",
        icon: <ToastFaliure />,
      });
    }
  };

  const handleQuantityChange = async (newQty: number) => {
    if (isCartUpdating || newQty < 1) return;
    setCount(newQty);
    try {
      await dispatch(
        updateCartItem({ itemId: item._id, data: { quantity: newQty } })
      ).unwrap();
      toast.success("Quantity updated!", {
        className: "font-[Quicksand]",
        icon: <ToastSuccess />,
      });
      dispatch(fetchCartDetails());
    } catch {
      toast.error("Failed to update quantity.", {
        className: "font-[Quicksand]",
        icon: <ToastFaliure />,
      });
      setCount(item.quantity);
    }
  };

  const onMinusClick = async () => {
    if (count <= 1) {
      await handleRemove();
    } else {
      setLoadingMinus(true);
      await handleQuantityChange(count - 1);
      setLoadingMinus(false);
    }
  };

  const onPlusClick = async () => {
    setLoadingPlus(true);
    await handleQuantityChange(count + 1);
    setLoadingPlus(false);
  };

  return (
    <>
      {/* Mobile VIEW - Card Style */}
      <div className="sm:hidden bg-white rounded-lg border p-4 mb-3">
        <div className="flex gap-3">
          {/* Product Image */}
          <div className="relative flex-shrink-0">
            <img
              src={product.images?.[0] ?? "/default-image.png"}
              width={80}
              height={80}
              className="object-cover rounded-md w-20 h-20"
              alt={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h4 className="text-gray-800 font-semibold text-sm line-clamp-2 flex-1">
                {product.name}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                disabled={isCartUpdating}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                onClick={handleRemove}
                aria-label="Remove item"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {product?.weight && (
              <p className="text-gray-600 text-xs mb-2">
                {product.weight.number}
                {product.weight.unit}
              </p>
            )}

            {/* Price and Quantity Row */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-700 font-medium text-sm">
                ₹{product.price}
              </span>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  disabled={count <= 1 || isCartUpdating || loadingMinus}
                  size="sm"
                  className="h-7 w-7 p-0 border border-gray-300"
                  onClick={onMinusClick}
                >
                  {loadingMinus ? (
                    <Loader2 className="animate-spin w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                </Button>
                <span className="w-8 text-center font-medium text-sm">
                  {isCartUpdating && !loadingMinus && !loadingPlus ? (
                    <Loader2 className="animate-spin w-3 h-3 mx-auto" />
                  ) : (
                    count
                  )}
                </span>
                <Button
                  variant="ghost"
                  disabled={isCartUpdating || loadingPlus}
                  size="sm"
                  className="h-7 w-7 p-0 border border-gray-300"
                  onClick={onPlusClick}
                >
                  {loadingPlus ? (
                    <Loader2 className="animate-spin w-3 h-3" />
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                </Button>
              </div>

              {/* Total */}
              <span className="text-gray-700 font-semibold text-sm">
                ₹{(product.price * count).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop VIEW - Table Row Style */}
      <div className="hidden sm:grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 last:border-b-0">
        {/* Product column */}
        <div className="col-span-5 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={product.images?.[0] ?? "/default-image.png"}
              width={64}
              height={64}
              className="object-cover rounded-md w-16 h-16"
              alt={product.name}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-gray-800 font-semibold text-base mb-1 line-clamp-2">
              {product.name}
            </h4>
            {product?.weight && (
              <p className="text-gray-600 text-sm">
                {product.weight.number}
                {product.weight.unit}
              </p>
            )}
          </div>
        </div>

        {/* Price column */}
        <div className="col-span-2 text-center text-gray-700 font-medium">
          ₹{product.price}
        </div>

        {/* Quantity column */}
        <div className="col-span-2 flex items-center gap-2 justify-center">
          <Button
            variant="ghost"
            disabled={count <= 1 || isCartUpdating || loadingMinus}
            size="sm"
            className="h-8 w-8 p-0 border border-gray-300"
            onClick={onMinusClick}
          >
            {loadingMinus ? (
              <Loader2 className="animate-spin w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
          </Button>
          <span className="w-10 text-center font-medium text-sm">
            {isCartUpdating && !loadingMinus && !loadingPlus ? (
              <Loader2 className="animate-spin w-4 h-4 mx-auto" />
            ) : (
              count
            )}
          </span>
          <Button
            variant="ghost"
            disabled={isCartUpdating || loadingPlus}
            size="sm"
            className="h-8 w-8 p-0 border border-gray-300"
            onClick={onPlusClick}
          >
            {loadingPlus ? (
              <Loader2 className="animate-spin w-3 h-3" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
          </Button>
        </div>

        {/* Total column */}
        <div className="col-span-2 text-center text-gray-700 font-semibold">
          {isCartUpdating && !loadingMinus && !loadingPlus ? (
            <Loader2 className="animate-spin inline-block w-4 h-4" />
          ) : (
            `₹${(product.price * count).toFixed(2)}`
          )}
        </div>

        {/* Remove button column */}
        <div className="col-span-1 text-right">
          <Button
            variant="ghost"
            size="sm"
            disabled={isCartUpdating}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-3"
            onClick={handleRemove}
            aria-label="Remove item"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};


// Main Cart Component
export const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);
  const cartTotals = useSelector(selectCartTotals);
  const loading = useSelector(selectCartLoading);

  const [orderNote, setOrderNote] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const currentDiscount = useSelector(selectCurrentDiscount);
  const discountLoading = useSelector(selectDiscountLoading);
  const discountFetchError = useSelector(selectDiscountError);
  const removeDiscountLoading = useSelector(selectRemoveDiscountLoading);

  // Get values from backend response
  const originalSubtotal = cartTotals?.subtotal || 0;
  const discountAmount = cartTotals?.discountAmount || 0;
  const finalTotal = cartTotals?.total || 0;

  // Calculate shipping
  const calculateShippingCharge = (amount: number): number => {
    if (amount >= 1000) return 0;
    else if (amount >= 500) return 50;
    else return 100;
  };

  const shippingCharge = calculateShippingCharge(originalSubtotal);
  const grandTotal = finalTotal + shippingCharge;

  useEffect(() => {
    dispatch(fetchCartDetails());
  }, [dispatch]);

  useEffect(() => {
    if (!document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const removeDiscountHandler = async () => {
    try {
      await dispatch(removeDiscount()).unwrap();
      dispatch(clearAppliedDiscount());
      await dispatch(fetchCartDetails());
      setCouponCode("");
      setCouponApplied(false);
      toast.success("Discount removed successfully.");
    } catch {
      toast.error("Failed to remove discount.");
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    dispatch(getDiscountByCode(couponCode.trim()))
      .unwrap()
      .then(() => {
        dispatch(applyDiscount({ code: couponCode.trim(), type: "coupon" }))
          .unwrap()
          .then(() => {
            setCouponApplied(true);
            toast.success("Coupon applied!");
            dispatch(fetchCartDetails());
          })
          .catch((err) => {
            setCouponApplied(false);
            toast.error(err || (err as any).message || "Invalid coupon code");
          });
      })
      .catch((err) => {
        setCouponApplied(false);
        toast.error(err || (err as any).message || "Invalid coupon code");
      });
  };

  // Check if user needs to complete profile
  const needsProfileCompletion = () => {
    if (!user) return true;
    if (!user.phoneNumber || !user.phoneNumber.trim()) return true;
    if (!user.addresses || user.addresses.length === 0) return true;

    const defaultAddress =
      user.addresses.find((a: Address) => a.isDefault) || user.addresses[0];
    if (!defaultAddress || !defaultAddress.city) return true;

    return false;
  };

  // Handle modal submit
  const handleModalSubmit = async (data: {
    phoneNumber: string;
    address: Address;
  }) => {
    setModalLoading(true);
    try {
      // Update user profile with phone number and address
      const existingAddresses = user?.addresses || [];
      const updatedAddresses = [...existingAddresses, data.address];

      await dispatch(
        updateProfile({
          phoneNumber: data.phoneNumber,
          addresses: updatedAddresses,
        })
      ).unwrap();

      toast.success("Details saved successfully!");
      setShowCheckoutModal(false);

      // Proceed to checkout automatically
      setTimeout(() => {
        proceedToPayment(data.phoneNumber, data.address);
      }, 500);
    } catch (error) {
      toast.error("Failed to save details. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setModalLoading(false);
    }
  };

  // Proceed to payment with saved details
  const proceedToPayment = async (phoneNumber: string, address: Address) => {
    setCheckoutLoading(true);
    try {
      const orderPayload = {
        shippingAddress: { ...address, country: "India", phone: phoneNumber },
        billingAddress: { ...address, country: "India", phone: phoneNumber },
        paymentMethod: "razorpay",
        notes: orderNote,
        totalAmount: grandTotal,
        discountAmount: discountAmount,
        couponCode: couponCode,
      };

      console.log("Order payload:", orderPayload);

      // Create order
      const orderRes = await dispatch(createOrder(orderPayload)).unwrap();
      console.log("Order creation response:", orderRes);

      // Fix: Extract orderId from the response data object
      const orderId = orderRes.data?.orderId || orderRes.data?._id;

      if (!orderId) {
        console.error("Order response structure:", orderRes);
        throw new Error("Failed to get order ID from response");
      }

      const paymentRes = await dispatch(
        initiatePayment({ orderId, method: "razorpay" })
      ).unwrap();
      console.log("Payment initiation response:", paymentRes);

      const paymentData = paymentRes.data || paymentRes;
      const order = paymentData.payment;

      if (!paymentData.key || !order) {
        throw new Error("Invalid payment data");
      }

      const options = {
        key: paymentData.key,
        amount: Math.round(order.amount * 100),
        currency: order.currency || "INR",
        name: "Daadis.in",
        description: `Order ${order.receipt}`,
        image: "/logo.svg",
        order_id: paymentData.payment.notes?.razorpayOrder?.id,
        handler: async (response: RazorpayPaymentData) => {
          if (
            !response.razorpay_order_id ||
            !response.razorpay_payment_id ||
            !response.razorpay_signature
          ) {
            console.error("Missing Razorpay fields:", response);
            toast.error("Payment verification failed - incomplete data");
            return;
          }

          try {
            await dispatch(
              handlePaymentSuccess({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();

            toast.success("Payment successful!");
            await dispatch(clearCart()).unwrap();
            navigate("/payment-success", {
              state: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: grandTotal,
                timestamp: new Date().toISOString(),
              },
            });
          } catch (error) {
            const err = error as Error;
            console.error("Payment verification error:", err);
            toast.error(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
          contact: phoneNumber,
        },
        theme: {
          color: "#BFA6A1",
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            console.log("Payment popup dismissed.");
          },
        },
      };

      console.log("Razorpay options object:", options);

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        toast.error(
          `Payment failed: ${response.error.description || "Unknown error"}`
        );
      });
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error during checkout");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Handle checkout button click
  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Checkout initiated");

    if (!user) {
      toast.error("Please login to proceed", { icon: <ToastFaliure /> });
      console.log("User not logged in.");
      return;
    }

    // Check if profile needs completion
    if (needsProfileCompletion()) {
      setShowCheckoutModal(true);
      return;
    }

    // If all details exist, proceed directly
    const defaultAddress =
      user.addresses.find((a: Address) => a.isDefault) || user.addresses[0];
    proceedToPayment(user.phoneNumber, defaultAddress);
  };

  if (loading) {
    return (
      <div className="flex font-[Quicksand] text-sm items-center min-h-[calc(100vh-56px)] justify-center flex-col w-full mt-14">
        <Loader2 className="animate-spin w-8 h-8" />
        <p className="mt-2">Loading cart...</p>
      </div>
    );
  }

  return (
    <div
      id="cart-page"
      className="flex font-[Quicksand] text-sm items-center min-h-[calc(100vh-56px)] justify-center py-5 flex-col w-full mt-14"
    >
      <h1 className="font-[Quicksand] mb-4 text-xl">Shopping cart</h1>

      <div className="w-full max-w-6xl px-4">
        {/* ⭐ Cart Items Section */}
        <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-6 mb-6">
          {/* ⭐ Desktop Header Row - Hidden on mobile */}
          <div className="hidden sm:grid grid-cols-12 gap-4 border-b pb-4 mb-4 font-medium text-gray-700">
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
            <div className="col-span-1"></div>
          </div>

          {/* Empty Cart Message */}
          {!cartItems || cartItems?.length === 0 ? (
            <div className="text-xl font-[Quicksand] w-full text-center py-20 font-bold text-gray-500">
              Cart empty!!
            </div>
          ) : (
            /* Cart Items */
            cartItems?.map((cartItem: any) => (
              <CartItemComponent
                key={cartItem._id}
                item={cartItem}
                userPresent={!!user}
                dispatch={dispatch}
                quantity={cartItem.quantity}
                itemId={cartItem._id}
                product={
                  typeof cartItem.product === "object"
                    ? (cartItem.product as Product)
                    : ({} as Product)
                }
              />
            ))
          )}
        </div>

        {/* Bottom Section - Coupon and Summary */}
        {cartItems && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Coupon Code */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <label
                htmlFor="coupon"
                className="block mb-3 font-medium text-gray-700"
              >
                Coupon Code
              </label>
              <div className="flex gap-3">
                <input
                  id="coupon"
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={discountLoading}
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={discountLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6"
                >
                  {discountLoading ? "Applying..." : "Apply"}
                </Button>
              </div>
              {discountFetchError && (
                <p className="text-red-600 mt-2 text-sm">
                  {String(discountFetchError)}
                </p>
              )}
              {couponApplied && currentDiscount && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700 text-sm font-medium">
                    {currentDiscount.code} coupon applied{" "}
                    {currentDiscount.discountType === "percentage"
                      ? `${currentDiscount.value}%`
                      : `₹${currentDiscount.value}`}{" "}
                    off
                  </p>
                  <button
                    type="button"
                    onClick={removeDiscountHandler}
                    disabled={removeDiscountLoading}
                    className="text-red-500 hover:underline text-sm disabled:opacity-50"
                    aria-label="Remove coupon"
                  >
                    {removeDiscountLoading ? "Removing..." : "Remove"}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{originalSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{shippingCharge.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Note and Checkout Section */}
        {cartItems && cartItems.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="max-w-md mx-auto">
              <label
                htmlFor="order-note"
                className="block mb-3 font-medium text-gray-700"
              >
                Add a note to your order
              </label>
              <Textarea
                id="order-note"
                placeholder="Special instructions for your order..."
                className="resize-none w-full mb-4 focus-visible:ring-yellow-500"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                rows={3}
              />
              <p className="text-center text-sm text-gray-500 mb-6">
                Tax included and shipping calculated at checkout
              </p>
              <Button
                disabled={checkoutLoading || cartItems.length === 0}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 text-base"
                onClick={handleCheckout}
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmit={handleModalSubmit}
        user={user}
        loading={modalLoading}
      />
    </div>
  );
};

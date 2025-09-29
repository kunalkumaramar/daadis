//Cart.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { ToastFaliure, ToastSuccess } from "../dashboard/productMain/AllProductsTable";

import { RootState, AppDispatch } from "../../redux1/store";

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
import { selectUser } from "../../redux1/authSlice";

import {
  createOrder,
} from "../../redux1/orderSlice";

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

interface CartItemProps {
  item: any;
  dispatch: AppDispatch;
  userPresent: boolean;
  quantity: number;
  itemId: string;
  product: Product;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  dispatch,
}) => {
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
      toast.success("Product removed from cart!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
      dispatch(fetchCartDetails());
    } catch {
      toast.error("Failed to remove product.", { className: "font-[quicksand]", icon: <ToastFaliure /> });
    }
  };

  const handleQuantityChange = async (newQty: number) => {
    if (isCartUpdating || newQty < 1) return;
    setCount(newQty);
    try {
      await dispatch(
        updateCartItem({ itemId: item._id, data: { quantity: newQty } })
      ).unwrap();
      toast.success("Quantity updated!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
      dispatch(fetchCartDetails());
    } catch {
      toast.error("Failed to update quantity.", { className: "font-[quicksand]", icon: <ToastFaliure /> });
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
    <div className="grid grid-cols-12 gap-4 items-center py-4">
      {/* Product column - takes more space */}
      <div className="col-span-6 flex items-center gap-4">
        <div className="relative">
          <img 
            src={product.images?.[0] ?? "/default-image.png"} 
            width={56} height={56}
            className="object-cover rounded-md w-14 h-14"
            alt={product.name}
          />
          <Button 
            disabled={isCartUpdating}
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 hover:scale-110 transition-all"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-gray-800 font-semibold truncate">{product.name}</h4>
          {product?.weight && (
            <p className="text-gray-600 text-xs">{product.weight.number}{product.weight.unit}</p>
          )}
        </div>
      </div>
      
      {/* Price column */}
      <div className="col-span-2 text-gray-700 text-center">
        ₹{product.price}
      </div>
      
      {/* Quantity column */}
      <div className="col-span-2 flex items-center gap-2 justify-center">
        <Button 
          variant="ghost"
          disabled={count <= 1 || isCartUpdating || loadingMinus}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onMinusClick}
        >
          {loadingMinus ? <Loader2 className="animate-spin w-3 h-3" /> : <Minus className="w-3 h-3" />}
        </Button>
        <span className="w-8 text-center font-medium">
          {isCartUpdating && !loadingMinus && !loadingPlus ? <Loader2 className="animate-spin w-3 h-3 mx-auto" /> : count}
        </span>
        <Button 
          variant="ghost"
          disabled={isCartUpdating || loadingPlus}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onPlusClick}
        >
          {loadingPlus ? <Loader2 className="animate-spin w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </Button>
      </div>
      
      {/* Total column */}
      <div className="col-span-2 text-gray-700 text-right font-medium">
        {isCartUpdating && !loadingMinus && !loadingPlus ? 
          <Loader2 className="animate-spin inline-block w-4 h-4" /> : 
          `₹${product.price * count}`
        }
      </div>
    </div>
  );
};

export const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);
  const cartTotals = useSelector(selectCartTotals);
  const loading = useSelector(selectCartLoading);

  
  const [orderNote, setOrderNote] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  //const [localDiscountValue] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const currentDiscount = useSelector(selectCurrentDiscount);
  const discountLoading = useSelector(selectDiscountLoading);
  const discountFetchError = useSelector(selectDiscountError);
  const removeDiscountLoading = useSelector(selectRemoveDiscountLoading);
  
  //const shippingCharge = 50; // Rs 10 fixed
  
  const subtotal = cartTotals?.total || 0;
 // Work out how much the applied coupon really removes
  const discountAmount =
  couponApplied && currentDiscount
    ? currentDiscount.discountType === "percentage"
        ? (subtotal * currentDiscount.value) / 100
        : currentDiscount.value
    : 0;   
  const calcTotalBeforeTax = subtotal - discountAmount;
  // Dynamic shipping logic
  const shippingCharge =
  calcTotalBeforeTax >= 1000 ? 0         // ≥ ₹1000 ⇒ free shipping
  : calcTotalBeforeTax >= 500 ? 50       // ₹500–₹999 ⇒ ₹50
  : 100;                                 // < ₹500    ⇒ ₹100
  const grandTotal = calcTotalBeforeTax + shippingCharge;

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
    setCouponCode('');
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
  // 1. Fetch discount info and store it in Redux
  dispatch(getDiscountByCode(couponCode.trim()))
    .unwrap()
    .then(() => {
      // 2. ON SUCCESS, apply discount to cart
      dispatch(applyDiscount({ code: couponCode.trim(), type: "coupon" }))
        .unwrap()
        .then(() => {
          setCouponApplied(true);
          toast.success("Coupon applied!");
          dispatch(fetchCartDetails());
        })
        .catch((err) => {
          setCouponApplied(false);
          toast.error((err && err.message) || "Invalid coupon code");
        });
    })
    .catch((err) => {
      setCouponApplied(false);
      toast.error((err && err.message) || "Invalid coupon code");
    });
};

  const defaultAddress = user?.addresses.find((a) => a.isDefault) ?? null;

  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //console.log("Checkout initiated");

    if (!user) {
      toast.error("Please login to proceed", { icon: <ToastFaliure /> });
      //console.log("User not logged in.");
      return;
    }
    if (!user.phoneNumber) {
      toast.error("Please add your phone number");
      //console.log("User phone number missing, redirecting to shipping.");
      navigate("/profile");
      return;
    }
    if (!defaultAddress || !defaultAddress.city) {
      toast.error("Please add your shipping address");
      //console.log("User shipping address missing, redirecting to shipping.");
      navigate("/profile");
      return;
    }

    setCheckoutLoading(true);

    try {
      const orderPayload = {
        shippingAddress: {
          ...defaultAddress,
          country: "India",
          phone: user.phoneNumber,
        },
        billingAddress: {
          ...defaultAddress,
          country: "India", 
          phone: user.phoneNumber,
        },
        paymentMethod: "razorpay",
        notes: orderNote,
        totalAmount: grandTotal,        // Add discounted total here
        discountAmount: discountAmount, // Optional but recommended
        couponCode: couponCode,         // Optional, to identify applied discount
      };
      //console.log("Order payload:", orderPayload);
      // Create order
      const orderRes = await dispatch(createOrder(orderPayload)).unwrap();
      //console.log("Order creation response:", orderRes);
      const { orderId } = orderRes.data;
      if (!orderId) throw new Error("Failed to get order ID");
      const paymentRes = await dispatch(
        initiatePayment({ orderId, method: "razorpay" })
      ).unwrap();
      //console.log("Payment initiation response:", paymentRes);
      const paymentData = paymentRes.data || paymentRes;

      //console.log("=== PAYMENT DATA DEBUG ===");
      //console.log("Full paymentData:", paymentData);
      //console.log("paymentData.order:", paymentData.order);
      //console.log("paymentData.order.id:", paymentData.order.id);
      //console.log("paymentData.payment.notes:", paymentData.payment.notes);
      //console.log("========================");

      const order = paymentData.payment;

      if (!paymentData.key || !order) {
        throw new Error("Invalid payment data");
      }

      let razorpayOrderId = paymentData.order.id;
    
    // If that doesn't work, try these alternatives:
    if (!razorpayOrderId) {
      razorpayOrderId = paymentData.payment.notes?.razorpayOrder?.id;
    }
    
    if (!razorpayOrderId) {
      razorpayOrderId = paymentData.payment.razorpayOrderId;
    }

    //console.log("Final order ID for Razorpay:", razorpayOrderId);

      const options = {
        key: paymentData.key,
        amount: Math.round(order.amount * 100), // in paise
        currency: order.currency || "INR",
        name: "Daadis.in",
        description: `Order #${order.receipt}`,
        image: "/logo.svg",
        order_id:  paymentData.payment.notes?.razorpayOrder?.id,
        handler: async (response: RazorpayPaymentData) => {
          //console.log("razorpay_order_id:", response.razorpay_order_id);
          //console.log("razorpay_payment_id:", response.razorpay_payment_id);
          //console.log("razorpay_signature:", response.razorpay_signature);

          if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
            //console.error("Missing Razorpay fields:", response);
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
          //dispatch(fetchProfile());
          navigate("/profile");
        } catch (error) {
          const err = error as Error;
          //console.error("Payment verification error:", err);
          toast.error(err.message || "Payment verification failed");
        }
      },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phoneNumber,
        },
        theme: { color: "#BFA6A1" },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            //console.log("Payment popup dismissed.");
          }
        }
      };

      //console.log("Razorpay options object:", options);

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        //console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description || "Unknown error"}`);
      });
  
      rzp.open();
    } catch (error) {
    //console.error("Checkout error:", error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Unknown error during checkout");
    }
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex font-[quicksand] text-sm items-center min-h-[calc(100vh-56px)] justify-center flex-col w-full mt-14">
        <Loader2 className="animate-spin w-8 h-8" />
        <p className="mt-2">Loading cart...</p>
      </div>
    );
  }

  return (
    <div id="cart-page" className="flex font-[quicksand] text-sm items-center min-h-[calc(100vh-56px)] justify-center py-[5%] flex-col w-full mt-14">
      <h1 className="font-[quicksand] mb-[4%] text-xl">Shopping cart</h1>
      <div className="w-full max-w-6xl px-4">
        {/* Cart Items Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 border-b pb-4 mb-4 font-medium text-gray-700">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          {/* Empty Cart Message */}
          {cartItems && cartItems?.length === 0 && (
            <div className="text-xl font-[quicksand] w-full text-center py-20 font-bold text-gray-500">
              Cart empty!!
            </div>
          )}
          
          {/* Cart Items */}
          {cartItems?.map((cartItem: any, index: number) => (
            <div key={cartItem._id}>
              <CartItemComponent
                item={cartItem}
                userPresent={!!user}
                dispatch={dispatch}
                quantity={cartItem.quantity}
                itemId={cartItem._id}
                product={typeof cartItem.product === "object" ? (cartItem.product as Product) : {} as Product}
              />
              {index < cartItems.length - 1 && (
                <hr className="my-4 border-gray-200" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section - Coupon and Summary */}
        {cartItems && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Coupon Code */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <label htmlFor="coupon" className="block mb-3 font-medium text-gray-700">Coupon Code</label>
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
                <p className="text-red-600 mt-2 text-sm">{String(discountFetchError)}</p>
              )}
              {couponApplied && currentDiscount && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700 text-sm font-medium">
                    {currentDiscount.code} coupon applied: {currentDiscount.discountType === "percentage"
                      ? `${currentDiscount.value}%`
                      : `₹${currentDiscount.value}`} off
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
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>₹{shippingCharge.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total:</span>
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
              <label htmlFor="order-note" className="block mb-3 font-medium text-gray-700">
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
                disabled={checkoutLoading || cartItems.length <= 0} 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 text-base" 
                onClick={handleCheckout}
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


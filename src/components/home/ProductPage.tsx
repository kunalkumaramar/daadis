// ProductPage.tsx
import { ChevronLeft, LucideHeart, LucideImageOff, ShoppingCart, Trash2, Loader2, AlertTriangle, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ToastSuccess } from "../dashboard/productMain/AllProductsTable";
import { CarouselApi } from "../ui/carousel";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux1/store";
import { getProductById, selectCurrentProduct, selectProductLoading } from "../../redux1/productSlice";
import { addToCart, removeCartItem } from "../../redux1/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux1/wishlistSlice";

export const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const loading = useSelector(selectProductLoading);
  const productData = useSelector(selectCurrentProduct);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;
  
  const images = productData?.images ?? [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [api] = useState<CarouselApi | undefined>(undefined);
  const [, setCurrent] = useState(0);
  const [, setCount] = useState(0);

  const isOutOfStock = productData?.stock === 0 || productData?.stock === undefined || productData?.stock < 1;

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (productData) {
      setIsInCart(cartItems.some(item => (typeof item.product === 'string' ? item.product === productData._id : item.product?._id === productData._id)));
      setIsInWishlist(wishlistItems.some(item => item.product === productData._id));
    }
  }, [cartItems, wishlistItems, productData]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [productData]);

  // Reset quantity when product changes or is out of stock
  useEffect(() => {
    setQuantity(1);
  }, [productData?._id, isOutOfStock]);

  const handleQuantityIncrease = () => {
    if (productData?.stock && quantity < productData.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Only ${productData?.stock} items available in stock`);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] w-full mt-14 sm:mt-0 sm:p-10 flex flex-col sm:grid sm:grid-cols-2 sm:gap-[4rem]">
      <div className="flex flex-col items-center sm:items-start sm:justify-center sm:h-full sm:pl-6">
        <div className="w-full sm:pb-6">
          <Button variant={"ghost"} onClick={() => navigate(-1)}><ChevronLeft /></Button>
        </div>
        <div className="flex flex-col items-center w-full sm:px-8">
          <div className="w-full flex justify-center mb-4 relative">
            {images.length > 0 ? (
              <>
                <img
                  src={images[selectedIndex]}
                  alt={`Product Image ${selectedIndex + 1}`}
                  className={cn(
                    "rounded-md object-contain shadow-lg transition-all duration-200",
                    isOutOfStock && "grayscale opacity-70"
                  )}
                  style={{
                    width: "530px",
                    height: "420px",
                    borderRadius: "1rem"
                  }}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                      OUT OF STOCK
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-300 rounded-md w-[350px] h-[350px] flex justify-center items-center">
                <LucideImageOff className="" />No product images present
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-4 justify-center mt-2">
              {images.map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    "h-16 w-16 object-cover cursor-pointer rounded border transition-all duration-200",
                    idx === selectedIndex
                      ? "border-yellow-400 shadow-md"
                      : "border-gray-200",
                    isOutOfStock && "grayscale opacity-70"
                  )}
                  style={{
                    boxShadow: idx === selectedIndex ? "0 0 0 2px #facc15" : undefined
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-10 flex-col sm:mt-32 mt-4 items-center font-[quicksand] flex-1 mx-3">
        <div id="head" className="flex flex-col h-full gap-2">
          <h1 className="font-bold text-3xl">{productData?.name ? productData?.name : <Skeleton className="h-8 w-56" />}</h1>
          <div className="flex flex-row gap-5 text-gray-500 font-bold">
            <span className="text-lg text-gray-500 font-sans">{productData?.weight ? productData?.weight?.number + productData?.weight?.unit : <Skeleton className="h-5 w-20" />}</span>
            <span className="text-lg ">{productData?.price ? "₹" + productData?.price : <Skeleton className="h-5 w-14" />}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            {productData?.stock !== undefined ? (
              isOutOfStock || productData.stock < 10 ? (
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                  isOutOfStock 
                    ? "bg-red-100 text-red-700 border border-red-200" 
                    : "bg-orange-100 text-orange-700 border border-orange-200"
                )}>
                  {isOutOfStock ? (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Out of Stock</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Only {productData.stock} left</span>
                    </>
                  )}
                </div>
              ) : null
            ) : (
              <Skeleton className="h-6 w-24" />
            )}
          </div>

          {productData?.description !== "" && (
            <h3 className="font-sans text-gray-500 ">
              {productData?.description ? productData?.description : <Skeleton className="h-4 w-full" />}
            </h3>
          )}
        </div>

        {/* Quantity Selector - Only show when not in cart and not out of stock */}
        {!isInCart && !isOutOfStock && productData?._id && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuantityDecrease}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-4 py-1 text-base font-medium min-w-[3ch] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuantityIncrease}
                disabled={productData?.stock ? quantity >= productData.stock : true}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="sm:grid sm:w-[500px] flex sm:grid-cols-6 justify-center items-center flex-row sm:grid-rows-2 gap-10 sm:gap-2">
          {productData?._id ? (
            <Button
              disabled={cartLoading || isOutOfStock}
              onClick={async (e) => {
                e.preventDefault();
                
                if (!isAuthenticated) {
                  toast.error("Please login to add items to cart");
                  navigate('/auth');
                  return;
                }

                if (isOutOfStock) {
                  toast.error("This product is currently out of stock");
                  return;
                }
                
                setCartLoading(true);
                if (isInCart) {
                  const cartEntry = cartItems.find(item =>
                    typeof item.product === 'string'
                      ? item.product === productData._id
                      : item.product?._id === productData._id
                  );
                
                  if (!cartEntry) {
                    toast.error("Cart item not found");
                  } else {
                    await dispatch(removeCartItem(cartEntry._id)).unwrap();
                    setIsInCart(false);
                    toast.success("Product removed from cart successfully!", {
                      className: "font-[quicksand]",
                      icon: <Trash2 className="w-4 h-4 stroke-red-500" />
                    });
                  }
                  setCartLoading(false);
                  return;
                }
                await dispatch(addToCart({ product: productData._id, quantity: quantity })).unwrap();
                setCartLoading(false);
                setIsInCart(true);
                setQuantity(1); // Reset quantity after adding to cart
                return toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart successfully!`, { 
                  className: "font-[quicksand]", 
                  icon: <ToastSuccess /> 
                });
              }}
              variant={"ghost"}
              className={cn(
                "flex col-span-5 row-span-1 justify-center items-center gap-2 text-lg transition-all duration-200",
                cartLoading && `bg-gray-100`,
                isOutOfStock && `bg-gray-100 text-gray-400 cursor-not-allowed opacity-60`
              )}
            >
              {isOutOfStock 
                ? "Out of Stock" 
                : isInCart 
                  ? "- Remove from cart " 
                  : "+ Add to cart "
              }
              <ShoppingCart className={cn("stroke-1", isOutOfStock && "stroke-gray-400")} />
            </Button>
          ) : (
            <Skeleton className="row-span-1 col-span-5" />
          )}
          {productData?._id ? (
            <Button
              onClick={async (e) => {
                e.preventDefault();
                
                if (!isAuthenticated) {
                  toast.error("Please login to add items to wishlist");
                  navigate('/auth');
                  return;
                }
                
                if (isOutOfStock && !isInWishlist) {
                  toast.error("Cannot add out of stock product to wishlist");
                  return;
                }

                setWishLoading(true);
                if (isInWishlist) {
                  await dispatch(removeFromWishlist(productData._id)).unwrap();
                  setWishLoading(false);
                  setIsInWishlist(false);
                  return toast.success("Product deleted from wishlist successfully!", { 
                    className: "font-[quicksand]", 
                    icon: <Trash2 className="w-4 h-4 stroke-red-500" /> 
                  });
                }
                await dispatch(addToWishlist({ productId: productData._id, priceWhenAdded: productData.price })).unwrap();
                setWishLoading(false);
                setIsInWishlist(true);
                return toast.success("Product added to wishlist successfully!", { 
                  className: "font-[quicksand]", 
                  icon: <ToastSuccess /> 
                });
              }}
              variant={"ghost"}
              className="col-span-1 row-span-1 p-0 m-0 hover:scale-125 transition-all duration-150 w-10 h-10 rounded-full"
            >
              <LucideHeart className={cn("hover:stroke-red-500 stroke-1", isInWishlist && `fill-red-500 stroke-red-500`, wishLoading && `animate-ping`)} />
            </Button>
          ) : (
            <Skeleton className="w-10 h-10 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};
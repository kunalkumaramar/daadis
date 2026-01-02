// WishListPage.tsx
import { ChevronLeft, Loader2, X, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux1/store";
import { User } from "../../redux1/authSlice";
import {
  WishlistItem,
  fetchWishlist,
  removeFromWishlist,
  selectWishlistItems,
  selectWishlistLoading,
} from "../../redux1/wishlistSlice";
import { CartItem, addToCart, selectCartItems } from "../../redux1/cartSlice";
import { Product, getProductById } from "../../redux1/productSlice";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

interface WishListCardProps {
  user: User | null;
  wishListItem: WishlistItem;
  cart: CartItem[];
  productDetails: Product | null;
}

const WishListCard = ({
  user,
  wishListItem,
  cart,
  productDetails,
}: WishListCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get user authentication status
  const isAuthenticated = !!user;

  // WishlistItem has `product` as string representing product ID
  const prodId = wishListItem.product;
  // Check if product is in cart
  const inCart = cart.some((ci) => ci.product === prodId);

  const onRemove = async () => {
    // Check if user is authenticated before removing
    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      if (user?._id) {
        await dispatch(removeFromWishlist(prodId)).unwrap();
        toast.success("Removed from Wishlist");
      } else {
        // Guest user fallback - update localStorage
        const stored = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        ) as WishlistItem[];
        const updated = stored.filter((w) => w.product !== prodId);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        toast.success("Removed from Wishlist");
        // Force page refresh for guest users
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    } finally {
      setLoading(false);
    }
  };

  const onMoveToCart = async () => {
    // Check if user is authenticated before adding to cart
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      await dispatch(addToCart({ product: prodId, quantity: 1 })).unwrap();
      toast.success("Added to Cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  // Show loading if product details are not available
  if (!productDetails) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="aspect-square bg-gray-200 flex items-center justify-center">
          <LoaderCircle className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ⭐ MOBILE VIEW - Compact Card */}
      <div className="sm:hidden bg-white rounded-lg shadow-sm border overflow-hidden relative">
        {/* Remove Button - Top Right */}
        <Button
          onClick={onRemove}
          disabled={loading}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 h-7 w-7 p-0 bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-full shadow-md"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <X className="w-3 h-3" />
          )}
        </Button>

        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative">
          <img
            src={productDetails.images?.[0] || "/default-image.jpg"}
            alt={productDetails.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/default-image.jpg";
            }}
          />
        </div>

        {/* Product Info */}
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
            {productDetails.name}
          </h3>

          {productDetails?.weight && (
            <p className="text-xs text-gray-600">
              {productDetails.weight.number}
              {productDetails.weight.unit}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">
              ₹{wishListItem.priceWhenAdded || productDetails.price}
            </span>
            {productDetails.stock <= 0 && (
              <span className="text-xs text-red-500 font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <Button
            onClick={onMoveToCart}
            disabled={loading || inCart || productDetails.stock <= 0}
            className="w-full text-xs h-8"
            variant={inCart ? "secondary" : "default"}
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : inCart ? (
              <>
                <ShoppingCart className="w-3 h-3 mr-1" />
                In Cart
              </>
            ) : productDetails.stock <= 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ⭐ DESKTOP VIEW - Larger Card */}
      <div className="hidden sm:block bg-white rounded-lg shadow-sm border overflow-hidden relative hover:shadow-lg transition-shadow duration-300">
        {/* Remove Button - Top Right */}
        <Button
          onClick={onRemove}
          disabled={loading}
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-full shadow-md"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>

        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative">
          <img
            src={productDetails.images?.[0] || "/default-image.jpg"}
            alt={productDetails.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/default-image.jpg";
            }}
          />
          {productDetails.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-red-500 px-3 py-1 rounded">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem]">
            {productDetails.name}
          </h3>

          {productDetails?.weight && (
            <p className="text-sm text-gray-600">
              {productDetails.weight.number}
              {productDetails.weight.unit}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-lg font-bold text-gray-900">
              ₹{wishListItem.priceWhenAdded || productDetails.price}
            </span>
          </div>

          <Button
            onClick={onMoveToCart}
            disabled={loading || inCart || productDetails.stock <= 0}
            className="w-full"
            variant={inCart ? "secondary" : "default"}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : inCart ? (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                In Cart
              </>
            ) : productDetails.stock <= 0 ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Move to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export const WishListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const wishlist = useSelector(selectWishlistItems);
  const wishlistLoading = useSelector(selectWishlistLoading);
  const cart = useSelector(selectCartItems);

  // Check authentication on component mount
  useEffect(() => {
    if (!user) {
      toast.error("Please login to view your wishlist");
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  // State to store product details for each wishlist item
  const [productDetails, setProductDetails] = useState<{
    [key: string]: Product;
  }>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load wishlist on user login
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist());
    } else {
      // For guest users, get wishlist from localStorage
      const guestWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      // You might need to dispatch a local action to set guest wishlist
    }
  }, [dispatch, user?._id]);

  // Fetch product details for each wishlist item
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (wishlist.length === 0) {
        setLoadingProducts(false);
        return;
      }

      const details: { [key: string]: Product } = {};

      try {
        await Promise.all(
          wishlist.map(async (item) => {
            try {
              const result = await dispatch(
                getProductById(item.product)
              ).unwrap();
              // result is ProductResponse { data: Product, ... }
              const prod = (result as any).data ? (result as any).data : result;
              // images: string[]
              const images: string[] = Array.isArray(prod.images)
                ? prod.images
                : [];
              // weight: { number, unit }
              const weight =
                prod.weight && typeof prod.weight === "object"
                  ? prod.weight
                  : { number: 0, unit: "" };
              // dimensions: { l, b, h }
              const dimensions =
                prod.dimensions && typeof prod.dimensions === "object"
                  ? prod.dimensions
                  : { l: 0, b: 0, h: 0 };
              const product: Product = {
                _id: prod._id,
                product: prod.product ?? "",
                name: prod.name,
                code: prod.code,
                category: prod.category,
                price: prod.price,
                description: prod.description,
                images,
                isActive: prod.isActive ?? true,
                tags: prod.tags ?? [],
                dimensions,
                stock: prod.stock,
                vegetarian: prod.vegetarian ?? false,
                quantitySold: prod.quantitySold ?? 0,
                weight,
                ratings: prod.ratings ?? [],
                createdAt: prod.createdAt,
                updatedAt: prod.updatedAt,
                __v: prod.__v ?? 0,
              };
              details[item.product] = product;
            } catch (error) {
              console.error(
                `Failed to fetch product ${item.product}:`,
                error
              );
            }
          })
        );
        setProductDetails(details);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductDetails();
  }, [wishlist, dispatch]);

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  if (wishlistLoading || loadingProducts) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-56px)] mt-14">
        <LoaderCircle className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-14 w-full min-h-[calc(100vh-56px)] font-[quicksand] bg-gray-50">
      {/* ⭐ Header Section - Responsive */}
      <div className="bg-white border-b sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-2 sm:p-2 h-auto"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">My Wishlist</h1>
                {wishlist.length > 0 && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Content Section - Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Your wishlist is empty
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-md">
                Save your favorite items here and shop them anytime!
              </p>
              <Button
                onClick={() => navigate("/category/all")}
                className="mt-4"
                size="lg"
              >
                Start Shopping
              </Button>
            </div>
          </div>
        ) : (
          /* ⭐ Grid Layout - Fully Responsive */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {wishlist.map((item: WishlistItem) => (
              <WishListCard
                key={item._id}
                user={user ?? null}
                wishListItem={item}
                cart={cart}
                productDetails={productDetails[item.product] || null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
// End of file

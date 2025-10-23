// Home-OurProducts.tsx
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Skeleton } from "@mui/material";
import { optimizeCloudinaryUrl, optimizeImage } from "../../utils/utility-functions"; // Updated import
import TiltedCard from "./Home-OurProductsAnimation";

// Import from Redux slices
import { 
  Category, 
  getAllCategories, 
  selectCategories, 
  selectCategoryLoading 
} from "../../redux1/categorySlice";
import { 
  Product, 
  getAllProducts, 
  selectProducts, 
  selectProductLoading 
} from "../../redux1/productSlice";
import type { RootState, AppDispatch } from "../../redux1/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const HomeOurProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Get data from Redux store
  const categories = useSelector((state: RootState) => selectCategories(state));
  const products = useSelector((state: RootState) => selectProducts(state));
  const categoriesLoading = useSelector((state: RootState) => selectCategoryLoading(state));
  const productsLoading = useSelector((state: RootState) => selectProductLoading(state));
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllProducts({ limit: 10, sortBy: 'quantitySold', sortOrder: 'desc' })); // Get top products by sales
  }, [dispatch]);

  // Filter active categories and get top selling products
  const activeCategories = categories.filter(category => category.isActive);
  const topProducts = products.filter(product => product.isActive && product.stock > 0).slice(0, 3);
  return (
    <div className="p-10 our-products-section">
      {/* ---------- Our Products (Categories) ---------- */}
      <h1 className="font-bold relative text-center text-xl py-4 ">
        Our products
        <Link className="absolute right-0 " to={"/category/all"}>
          <Button variant="ghost" className="underline">
            View all
          </Button>
        </Link>
      </h1>

      <div className="mt-8 grid w-full sm:grid-cols-3 grid-cols-1 justify-items-center gap-8 h-full">
        {categoriesLoading || activeCategories.length === 0
          ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <div key={number} className="w-[100%] col-span-1 max-w-sm">
                <Skeleton className="rounded-md w-[100%] aspect-square" />
                <Skeleton className="w-1/2 mt-2" />
              </div>
            ))
          : activeCategories.slice(0, 9).map((category: Category) => (
              <div key={category._id} className="w-[100%] col-span-1 max-w-sm">
                <Link to={`/category/${category._id}`} className="hover:cursor-pointer block">
                  <TiltedCard
                    imageSrc={optimizeCloudinaryUrl(category.image)} // Kept optimizeCloudinaryUrl for categories
                    altText={`${category.name} category`}
                    captionText={category.name}
                    containerHeight="320px"
                    containerWidth="100%"
                    imageHeight="320px"
                    imageWidth="100%"
                    rotateAmplitude={8}
                    scaleOnHover={1.03}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="absolute inset-0 flex items-end p-4">
                        <div className="w-full bg-black bg-opacity-70 text-white px-4 py-3 rounded-lg backdrop-blur-sm">
                          <h3 className="font-bold text-base text-center text-white">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    }
                  />
                </Link>
              </div>
            ))}
      </div>

      {/* ---------- Best Sellers (Top Products) ---------- */}
      <div id="best-sellers-section" className="mt-16 best-sellers-section">
        <h1 className="font-bold text-xl mb-8 text-center">Best Sellers</h1>
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-6 justify-items-center">
          {productsLoading || topProducts.length === 0
            ? [0, 1, 2].map((num) => (
                <div key={num} className="w-[100%] col-span-1 max-w-xs">
                  <Skeleton className="rounded-md w-[100%] aspect-square" />
                  <Skeleton className="w-3/4 mt-2" />
                  <Skeleton className="w-1/2 mt-1" />
                </div>
              ))
            : topProducts.map((product: Product) => (
                <div
                  key={product._id}
                  className="rounded-lg flex flex-col h-full relative hover:shadow-lg transition w-full max-w-xs"
                >
                  {/* Product Image Container - Takes up remaining space */}
                  <div className="flex-grow flex items-center justify-center p-2">
                    <Link to={`/product/${product._id}`} className="block">
                      <img
                        className="max-w-full max-h-full object-contain rounded-md"
                        src={optimizeImage(product.images?.[0])} // Use optimizeImage for products
                        alt={product.name}
                      />
                    </Link>
                  </div>
                  
                  {/* Product Info - Always at bottom */}
                  <div className="px-2 text-center mt-3 flex-shrink-0">
                    <span className="font-semibold">{product.name}</span>
                    <span className="block text-slate-500 text-sm">
                      {product.weight?.number}
                      {product.weight?.unit}
                    </span>
                    <span className="block font-bold">₹ {product.price}</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default HomeOurProducts;
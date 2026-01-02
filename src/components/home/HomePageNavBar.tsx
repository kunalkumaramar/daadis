import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { CircleHelp, Headset, HeartCrack, HomeIcon, LoaderCircle, LogIn, LucideHeart, ShoppingCart, Store, UserCircle2, Rss, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState} from "react";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Squash as Hamburger } from 'hamburger-react';
import { slide as Menu } from 'react-burger-menu';
import { getProfile } from "../../redux1/authSlice";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { AppDispatch, RootState } from "../../redux1/store";
import { Category } from "../../redux1/categorySlice";
import { Product, getAllProducts } from "../../redux1/productSlice";
import { CartItem } from "../../redux1/cartSlice";
import { WishlistItem } from "../../redux1/wishlistSlice";
import { AuthComponent } from "./AuthComponent";



export const HomePageNavBar = () => {
    const categories = useSelector<RootState, Category[]>(
      (state) => state.category.categories
    );
    const productDataFromStore = useSelector<RootState, Product[]>(
      (state) => state.product.products
    );
    const cartItems = useSelector<RootState, CartItem[]>(
      (state) => state.cart.items
    );
    const wishlistItems = useSelector<RootState, WishlistItem[]>(
      (state) => state.wishlist.items
    );



    const [, setCurrentWishList] = useState<Product[]>(
      wishlistItems?.map((item) => {
        if (typeof item.product === "object") return item.product as Product;
        return null;
      }).filter(Boolean) as Product[]
    );
    const [currentCart, setCurrentCart] = useState<CartItem[]>(cartItems || []);
    const productDropMenuRef = useRef<HTMLDivElement | null>(null);
    const productsLinkRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();



    useEffect(() => {
        setCurrentWishList(
          wishlistItems?.map((item) =>
            typeof item.product === "object" ? (item.product as Product) : null
          ).filter(Boolean) as Product[]
        );
        setCurrentCart(cartItems || []);
    }, [wishlistItems, cartItems]);



    const [isProductPageVisible, setIsProductPageVisible] = useState(false);
    const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'left' | 'center' | 'right'>('left');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);



    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const loading = useSelector((state: RootState) => state.auth.profileLoading);



    useEffect(() => {
        if (!user) dispatch(getProfile());
    }, [dispatch, user]);



    // Calculate dropdown position based on viewport
    const calculateDropdownPosition = () => {
        if (productsLinkRef.current) {
            const rect = productsLinkRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const dropdownWidth = Math.min(viewportWidth * 0.9, 800);
            
            if (rect.left + dropdownWidth > viewportWidth - 20) {
                setDropdownPosition('right');
            } 
            else if (rect.left < 20) {
                setDropdownPosition('left');
            }
            else {
                setDropdownPosition('center');
            }
        }
    };



    const handleMouseEnter = () => {
        calculateDropdownPosition();
        setIsProductPageVisible(true);
        // ADDITIONAL FIX: Try to load products when dropdown is opened if not already loaded
        if (!productDataFromStore || productDataFromStore.length === 0) {
            //console.log("Loading products on dropdown hover...");
            dispatch(getAllProducts());
        }
    };



    const getDropdownClasses = () => {
        const baseClasses = "absolute p-4 rounded-lg top-full bg-white shadow-xl border border-gray-200 z-50 min-w-[300px] max-w-[800px] w-auto";
        
        switch (dropdownPosition) {
            case 'right':
                return `${baseClasses} right-0`;
            case 'center':
                return `${baseClasses} left-1/2 transform -translate-x-1/2`;
            default:
                return `${baseClasses} left-0`;
        }
    };



    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };



    // Ensure dropdown fits in viewport
    useEffect(() => {
        const handleResize = () => {
            if (isProductPageVisible) {
                calculateDropdownPosition();
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isProductPageVisible]);



    // CRITICAL FIX: Load products when component mounts
    useEffect(() => {
        // Always ensure products are loaded, regardless of which page we're on
        if (!productDataFromStore || productDataFromStore.length === 0) {
            //console.log("Loading products for navbar dropdown...");
            dispatch(getAllProducts());
        }
    }, [dispatch, productDataFromStore]);



    useEffect(() => {
        //console.log("=== NAVBAR PRODUCT DEBUG ===");
        //console.log("Current page path:", window.location.pathname);
        //console.log("Available categories:", categories?.length || 0);
        //console.log("Available products:", productDataFromStore?.length || 0);
        // ... more debug info
    }, [categories, productDataFromStore]);



    return (
        <div className="z-[100] font-[quicksand] bg-white scroll-smooth w-full top-0 fixed justify-center items-center flex h-14">
            {/* Add custom CSS for hidden scrollbar */}
            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;  /* Chrome, Safari, Opera */
                }
            `}</style>
            
            <section id="auth-component" className="opacity-0 z-[100] hidden absolute top-0 left-0 right-0 h-screen justify-center items-center bottom-0">
                <AuthComponent />
            </section>
            
            <div className="sm:flex hidden justify-evenly font-[quicksand] gap-4 items-center flex-1">
                <Link to={"/"} className="text-sm capitalize font-[quicksand] transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm">
                    HOME
                </Link>



                <Link to={"/about-us"} className="text-sm capitalize font-[quicksand] transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm">
                    ABOUT
                </Link>
                
                {/* Products dropdown with improved positioning */}
                <div 
                    ref={productsLinkRef}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => {
                        setIsProductPageVisible(false);
                        setExpandedCategory(null);
                    }}
                >
                    <Link 
                        to="/category/all" 
                        className="text-sm capitalize transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm"
                    >
                        PRODUCTS
                    </Link>
                    
                    {isProductPageVisible && (
                        <div 
                            ref={productDropMenuRef} 
                            className={getDropdownClasses()}
                            onMouseEnter={() => setIsProductPageVisible(true)}
                            onMouseLeave={() => {
                                setIsProductPageVisible(false);
                                setExpandedCategory(null);
                            }}
                            style={{
                                maxWidth: 'calc(100vw - 2rem)',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                            }}
                        >
                            <div className="space-y-2 scrollbar-hide" style={{ maxHeight: '360px', overflowY: 'auto' }}>
                                {/* View All Categories Link */}
                                <Link 
                                    to="/category/all" 
                                    className="block text-sm font-bold text-blue-600 hover:text-blue-800 border-b border-gray-200 pb-2 mb-3"
                                    onClick={() => setIsProductPageVisible(false)}
                                >
                                    VIEW ALL PRODUCTS
                                </Link>



                                {/* ADD THE LOADING STATE HERE */}
                                {(!productDataFromStore || productDataFromStore.length === 0) && (
                                    <div className="flex items-center justify-center py-4">
                                        <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                                        <span className="text-sm text-gray-500">Loading products...</span>
                                    </div>
                                )}
                                
                                {categories && categories.length > 0 ? (
                                    categories.map((category, categoryIndex) => {
                                        // Get products for this category
                                        const categoryProducts = productDataFromStore?.filter(
                                            (product) => product.category === category._id
                                        ) || [];
                                        
                                        // Show ALL categories, even if they have no products
                                        // This ensures all categories from your store are displayed
                                        const isExpanded = expandedCategory === category._id;
                                        
                                        return (
                                            <div key={categoryIndex} className="border-b border-gray-100 last:border-b-0">
                                                <button
                                                    className="w-full flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-sm transition-colors duration-150"
                                                    onClick={() => toggleCategory(category._id)}
                                                >
                                                    <span className="capitalize font-semibold text-gray-800 text-sm">
                                                        {category.name} ({categoryProducts.length})
                                                    </span>
                                                    <ChevronDown 
                                                        className={`w-4 h-4 transition-transform duration-200 ${
                                                            isExpanded ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>
                                                
                                                {isExpanded && (
                                                    <div className="pl-4 pb-2">
                                                        {categoryProducts.length > 0 ? (
                                                            <div className="space-y-1 max-h-[150px] overflow-y-auto scrollbar-hide">
                                                                {categoryProducts.map((product, productIndex) => (
                                                                    <Link 
                                                                        key={productIndex}
                                                                        to={`/product/${product._id}`} 
                                                                        className="block text-gray-600 hover:text-gray-800 text-xs transition-colors duration-150 hover:bg-gray-50 py-1 px-2 rounded truncate"
                                                                        onClick={() => {
                                                                            setIsProductPageVisible(false);
                                                                            setExpandedCategory(null);
                                                                        }}
                                                                        title={product.name}
                                                                    >
                                                                        {product.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-400 text-xs pl-2 py-1">
                                                                No products available in this category
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-gray-500 text-sm p-4">
                                        <div>No categories available</div>
                                        <div className="text-xs mt-1">Categories count: {categories?.length || 0}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>



                <Link to={"/blog"} className="text-sm capitalize transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm">
                    BLOG
                </Link>
                
                <Link className="text-sm capitalize transition-all duration-150 hover:bg-slate-500/10 flex justify-center items-center px-2 py-1 rounded-sm" to={"/contact"}>
                    CONTACT
                </Link>
            </div>



            {/* Mobile menu */}
            <div className="sm:hidden block">
                <Hamburger toggled={isHamburgerMenuOpen} size={24} onToggle={() => {
                    setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
                }}/>
                <Menu className="bg-cyan-300" onClose={() => {
                    setIsHamburgerMenuOpen(false);
                }} width={"100vw"} customBurgerIcon={false} customCrossIcon={false} isOpen={isHamburgerMenuOpen}>
                    <div className="w-full h-[75%] gap-4" style={{
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"center",
                        alignItems:"flex-start"
                    }}>
                        <Link onClick={() => {
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <HomeIcon />
                                HOME
                            </div>
                        </Link>
                        <Link onClick={() => {
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/category/all"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <Store />
                                PRODUCTS
                            </div>
                        </Link>
                        <Link onClick={()=>{
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/about-us"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <CircleHelp />
                                ABOUT
                            </div>
                        </Link>
                        <Link onClick={() => {
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/contact"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <Headset />
                                CONTACT
                            </div>
                        </Link>
                        <Link onClick={() => {
                            setIsHamburgerMenuOpen(false);
                        }} className="text-sm capitalize transition-all duration-150 px-2 py-1 rounded-sm" to={"/blog"}>
                            <div className="items-center gap-4 font-bold text-[35px] my-[10px] flex">
                                <Rss />
                                BLOGS
                            </div>
                        </Link>
                    </div>
                    <div className="items-center gap-4 font-bold text-[20px] p-5 my-[10px] flex">
                        <p className="text-[15px]">Socials</p>
                        <a href="https://www.instagram.com/daadis.in?igsh=MTg2aWx1M2o1d2c2bQ==">Instagram</a>
                    </div>
                </Menu>
            </div>



            {/* Logo */}
            <Link className="ml-[100px]" to={"/"}>
                <img className="h-20" src="/logo.png" />
            </Link>



            <div className="justify-between gap-4 items-center flex flex-1">
                <div className="flex-1 flex justify-end mr-4 gap-3 sm:gap-4 items-center">
                    {/* ⭐ Desktop Wishlist - Only visible on desktop */}
                    <Link 
                        to={"/wishlist"} 
                        onClick={() => {}} 
                        className="hidden sm:block transition-all z-[0] hover:scale-125 duration-250 hover:fill-red-500 relative"
                    >
                        {wishlistItems?.length === 0 ? (
                            <HeartCrack className="transition-all"/>
                        ) : (
                            <LucideHeart className="fill-red-500 stroke-red-500 transition-all"/>
                        )}
                        <Badge className="absolute z-0 right-[-25%] top-[-25%] text-[10px] rounded-full px-1 py-0" variant={"secondary"}>
                            {wishlistItems?.length}
                        </Badge>
                    </Link>
                    
                    {/* ⭐ User profile section - Different for logged in/out */}
                    {!user ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost">
                            <UserCircle2 className="w-8 h-8" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" sideOffset={8} className="p-3 w-56">
                          <div className="flex flex-col gap-2">
                            {/* ⭐ Wishlist for non-logged-in users (Mobile only) */}
                            <Button
                              variant="ghost"
                              className="sm:hidden w-full justify-start px-2 py-2 h-auto"
                              onClick={() => navigate("/wishlist")}
                            >
                              <LucideHeart className="w-4 h-4 mr-2" />
                              <span className="flex-1 text-left text-sm">My Wishlist</span>
                              {wishlistItems?.length > 0 && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  {wishlistItems?.length}
                                </Badge>
                              )}
                            </Button>

                            {/* Divider for mobile */}
                            <div className="sm:hidden border-t my-1"></div>

                            {/* Google Login Button */}
                            <Button onClick={() => navigate('/auth')} className="w-full">
                              <LogIn className="mr-2 w-4 h-4" /> 
                              <span className="text-sm">Google Login</span>
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : loading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="p-2">
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {user.firstName.charAt(0)}
                            </Avatar>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" sideOffset={8} className="p-3 w-56">
                          <div className="flex flex-col gap-2">
                            {/* User Info - Desktop only */}
                            <div className="hidden sm:block border-b pb-2 mb-1">
                              <p className="font-semibold text-sm truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-600 truncate">{user.email}</p>
                            </div>

                            {/* ⭐ My Wishlist Button (Mobile only) */}
                            <Button
                              variant="ghost"
                              className="sm:hidden w-full justify-start px-2 py-2 h-auto"
                              onClick={() => navigate("/wishlist")}
                            >
                              <LucideHeart className="w-4 h-4 mr-2" />
                              <span className="flex-1 text-left text-sm">My Wishlist</span>
                              {wishlistItems?.length > 0 && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  {wishlistItems?.length}
                                </Badge>
                              )}
                            </Button>

                            {/* ⭐ My Profile Button */}
                            <Button
                              variant="ghost"
                              className="w-full justify-start px-2 py-2 h-auto"
                              onClick={() => navigate("/profile")}
                            >
                              <UserCircle2 className="w-4 h-4 mr-2" />
                              <span className="text-sm">My Profile</span>
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}



                    <Link to={"/cart"} className="flex gap-4 items-center justify-center relative">
                        <Button className="flex gap-4 items-center justify-center relative">
                            <ShoppingCart />
                            <span className="sm:block hidden">Cart</span>
                            <Badge className="absolute right-[-8%] top-[-18%] rounded-full px-1 py-0" variant={"secondary"}>
                                {currentCart?.length}
                            </Badge>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

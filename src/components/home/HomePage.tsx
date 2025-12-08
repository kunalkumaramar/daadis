//HomePage.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { HomePageHeroCarousel } from "./HomePageHeroCarousel";
import HomeOurProducts from "./Home-OurProducts";
import AnimatedTestimonials from "./Home-Testimonials";
import DaadisFAQ from "./faq";
import { useNavigate } from "react-router-dom";
import { Calendar } from "react-feather";
import { ArrowRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "../../utils/utility-functions";
import {
  Product,
  selectProducts,
  getAllProducts,
} from "../../redux1/productSlice";
import {
  Category,
  selectCategories,
  getAllCategories,
} from "../../redux1/categorySlice";
import {
  Blog,
  selectBlogs,
  getAllBlogs,
  selectBlogsLoading,
} from "../../redux1/blogSlice";
import type { AppDispatch } from "../../redux1/store";
import OurPartners from "./Home-OurPartners";


// Blog Card component adapted to Blog type
const HomeBlogCard = ({ blog }: { blog: Blog }) => {
  const navigate = useNavigate();

  return (
    <article className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <img
          src={optimizeCloudinaryUrl(blog?.blogImgUrl?.url ?? "")}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100" />
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-1">
        {/* Date */}
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <time dateTime={blog.createdAt ?? "2024-01-01"}>
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "January 1, 2024"}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 flex-1">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {/* Replace with summary or first 100 chars if available */}
          {blog.content
            ? blog.content.slice(0, 100) + "..."
            : "Discover insights and stories from our blog."}
        </p>

        <Button
          variant="ghost"
          onClick={() => navigate(`/blog/${blog._id}`)}
          className="self-start p-0"
        >
          Read More <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </article>
  );
};

// Simple auto-sliding image component for the responsive section
const AutoImageSlider = ({ images, imgClassName }: { images: string[]; imgClassName: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000); // Auto-change every 10 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return <img src={images[currentIndex]} alt="Featured content" className={imgClassName} />;
};

export const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const blogs = useSelector(selectBlogs);
  const blogsLoading = useSelector(selectBlogsLoading);


  const [, setBannerHeros] = useState<Category[]>([]);
  const [, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllProducts());
    dispatch(getAllBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (categories) setBannerHeros(categories);
  }, [categories]);

  useEffect(() => {
    if (products) setTopProducts(products);
  }, [products]);

  // Define your two Cloudinary image URLs for desktop and mobile here
  // Replace with actual URLs as needed
  const desktopImages = [
    "https://res.cloudinary.com/dwocbguvr/image/upload/v1765187637/1_t8cmyw_qv6h6f.webp",
    "https://res.cloudinary.com/dwocbguvr/image/upload/v1765187644/2_klbjcr_iereyc.webp", // Add your second desktop image URL
  ];

  const mobileImages = [
    "https://res.cloudinary.com/dwocbguvr/image/upload/v1765187636/1_qkw3ll_qxp9pd.webp",
    "https://res.cloudinary.com/dwocbguvr/image/upload/v1765187641/2_1_w6evhh_e6wwxh.webp", // Add your second mobile image URL
  ];

  return (
    <div className="mt-14 font-[quicksand]">
      {/* Floating WhatsApp Button */}
      <Button
        variant="ghost"
        className="fixed bg-white hover:bg-green-500 hover:fill-white p-2 h-auto m-0 rounded-full z-[200] transition-all bottom-[5%] right-[5%]"
        onClick={() => window.open('https://wa.me/919886402902', '_blank')}
      >
        {/* WhatsApp SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32">
          <path
            fillRule="evenodd"
            d="M 24.503906 7.503906 C 22.246094 5.246094 19.246094 4 16.050781 4 C 9.464844 4 4.101563 9.359375 4.101563 15.945313 C 4.097656 18.050781 4.648438 20.105469 5.695313 21.917969 L 4 28.109375 L 10.335938 26.445313 C 12.078125 27.398438 14.046875 27.898438 16.046875 27.902344 L 16.050781 27.902344 C 22.636719 27.902344 27.898438 22.542969 27.902344 15.953125 C 27.902344 12.761719 26.761719 9.761719 24.503906 7.503906 Z M 16.050781 25.882813 L 16.046875 25.882813 C 14.265625 25.882813 12.515625 25.402344 10.992188 24.5 L 10.628906 24.285156 L 6.867188 25.269531 L 7.871094 21.605469 L 7.636719 21.230469 C 6.640625 19.648438 6.117188 17.820313 6.121094 15.945313 C 6.125 10.472656 10.574219 6.019531 16.054688 6.019531 C 18.707031 6.019531 21.199219 7.050781 23.074219 8.929688 C 24.949219 10.808594 25.878906 13.300781 25.878906 15.953125 C 25.878906 21.429688 21.527344 25.882813 16.050781 25.882813 Z M 21.496094 18.445313 C 21.199219 18.296875 19.730469 17.574219 19.457031 17.476563 C 19.183594 17.375 18.984375 17.328125 18.785156 17.621094 C 18.585938 17.917969 18.015625 18.593750 17.839844 18.792969 C 17.667969 18.992188 17.492188 19.019531 17.195313 18.871094 C 16.894531 18.722656 15.933594 18.402344 14.792969 17.386719 C 13.90625 16.597656 13.304688 15.617188 13.132813 15.320313 C 12.957031 15.023438 13.113281 14.859375 13.261719 14.710938 C 13.398438 14.574219 13.558594 14.363281 13.707031 14.1875 C 13.855469 14.015625 13.902344 13.890625 14.003906 13.691406 C 14.105469 13.492188 14.054688 13.316406 13.980469 13.167969 C 13.902344 13.019531 13.304688 11.546875 13.058594 10.957031 C 12.820313 10.382813 12.578125 10.460938 12.394531 10.449219 C 12.21875 10.4375 12.019531 10.4375 11.820313 10.4375 C 11.621094 10.4375 11.296875 10.511719 11.023438 10.808594 C 10.75 11.105469 9.980469 11.828125 9.980469 13.300781 C 9.980469 14.773438 11.050781 16.199219 11.199219 16.398438 C 11.347656 16.597656 13.300781 19.617188 16.238281 20.914063 C 16.992188 21.253906 17.582031 21.460938 18.042969 21.613281 C 18.796875 21.859375 19.492188 21.824219 20.042969 21.746094 C 20.652344 21.660156 21.855469 21.011719 22.101563 20.296875 C 22.347656 19.582031 22.347656 18.96875 22.273438 18.84375 C 22.199219 18.71875 22 18.644531 21.703125 18.496094 Z"
          />
        </svg>
      </Button>

      {/* Hero carousel */}
      <HomePageHeroCarousel />

      {/* Responsive Image Section with Auto-Slider */}
      <div className="w-full flex justify-center py-4 px-4">
        <AutoImageSlider
          images={desktopImages}
          imgClassName="hidden sm:block rounded-[1.5rem] max-w-[88rem] w-full h-auto object-cover"
        />
        <AutoImageSlider
          images={mobileImages}
          imgClassName="block sm:hidden rounded-[1.5rem] max-w-sm w-full h-auto object-cover"
        />
      </div>

      {/* Products */}
      <HomeOurProducts />

      {/* Partners 
      <OurPartners />*/}
      
      {/* Responsive Videos */}
      {/* ... your video section unchanged ... */}
      <div className="w-full p-4 md:p-10 home-page-carousel-container">
       <h1 className="font-bold text-xl mb-6 md:mb-8 flex justify-center items-center relative">
         From the gram
       </h1>
       
       <div className="flex flex-col md:flex-row gap-4 w-full md:w-[60%] m-auto">
  {/* First Video */}
  <div className="w-full max-w-[320px] md:w-[277px] mx-auto relative aspect-[9/16] rounded-md bg-white border border-gray-600/50">
    <video
      src="https://res.cloudinary.com/dwocbguvr/video/upload/v1765187647/He_saves_he_blesses_he_protects_This_Chaturthi_let_s_offer_Bappa_what_he_loves_most_swe_iesfxn_uhfej2.mp4"
      controls
      autoPlay
      loop
      muted
      className="bg-white-100 w-full h-[calc(100%-60px)] object-cover rounded-t-[inherit]"
    />
    <span className="font-bold flex justify-center items-center absolute bottom-0 left-0 right-0 h-[60px] bg-white rounded-b-[inherit] text-sm md:text-base px-2 text-center">
      Bappa Ka Chamatkar
    </span>
  </div>

  {/* Second Video */}
  <div className="w-full max-w-[320px] md:w-[277px] mx-auto relative aspect-[9/16] rounded-md bg-white border border-gray-600/50">
    <video
      src="https://res.cloudinary.com/dwocbguvr/video/upload/v1765187651/reel2_tgvnr6_dtpy6j.mp4"
      controls
      autoPlay
      loop
      muted
      className="bg-white-100 w-full h-[calc(100%-60px)] object-cover rounded-t-[inherit]"
    />
    <span className="font-bold flex justify-center items-center absolute bottom-0 left-0 right-0 h-[60px] bg-white rounded-b-[inherit] text-sm md:text-base px-2 text-center">
      Focus on Daadi's
    </span>
  </div>

  {/* Third Video */}
  <div className="w-full max-w-[320px] md:w-[277px] mx-auto relative aspect-[9/16] rounded-md bg-white border border-gray-600/50">
    <video
      src="https://res.cloudinary.com/dwocbguvr/video/upload/v1765187651/reel3_gicop6_uzhfxa.mp4"
      controls
      autoPlay
      loop
      muted
      className="bg-white-100 w-full h-[calc(100%-60px)] object-cover rounded-t-[inherit]"
    />
    <span className="font-bold flex justify-center items-center absolute bottom-0 left-0 right-0 h-[60px] bg-white rounded-b-[inherit] text-sm md:text-base px-2 text-center">
      Mandatory Work Break
    </span>
  </div>
</div>

      </div>

      {/* Blog Section */}
      <div className="bg-white py-16 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Latest from our Blog</h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Stay updated with the latest insights and stories.
              </p>
            </div>
            {blogs.length > 0 && (
              <Button
                onClick={() => navigate("/blog")}
                className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded hover:bg-yellow-600"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {blogsLoading && <p>Loading blog posts...</p>}
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <HomeBlogCard blog={blogs[0]} />
              </div>
              <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.slice(1, 3).map((blog) => (
                  <HomeBlogCard key={blog._id} blog={blog} />
                ))}
                {blogs.length === 1 && (
                  <div className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded h-48">
                    <p className="text-gray-500 text-center">
                      More posts coming soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : !blogsLoading ? (
            <div className="text-center py-12">
              <p>No blog posts available yet. Please check back later.</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Testimonials and FAQ */}
      <AnimatedTestimonials />
      <DaadisFAQ />
    </div>
  );
};
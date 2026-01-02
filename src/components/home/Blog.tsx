//Blog.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux1/store";
import { getAllBlogs, selectBlogs, selectBlogsLoading, selectBlogsError } from "../../redux1/blogSlice";
import { Button } from "../ui/button";
import { Plus, X, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { optimizeCloudinaryUrl } from "../../utils/utility-functions";

// Blog Card component matching HomePage HomeBlogCard
const Blog = ({ blog }: { blog: any }) => {
  const navigate = useNavigate();

  return (
    <article className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Image Container with fixed height */}
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

export const BlogPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const blogs = useSelector((state: RootState) => selectBlogs(state));
    const loading = useSelector((state: RootState) => selectBlogsLoading(state));
    const error = useSelector((state: RootState) => selectBlogsError(state));

    const [visibleItemCount, setVisibleItemCount] = useState(6);
    const displayedData = blogs.slice(0, visibleItemCount);

    useEffect(() => {
      dispatch(getAllBlogs());
    }, [dispatch]);

    useEffect(() => {
      if (error) {
        toast.error("No Blogs Found!");
      }
    }, [error]);

    const isLoadmoreButtonDisabled = displayedData.length >= blogs.length;
    return (
        <div className="min-h-screen font-[Quicksand]" style={{backgroundColor: '#ffff'}}>
            {/* Hero Section */}
            <div className="relative">
                <div className="relative h-80 overflow-hidden">
                    <img 
                        src="/assets/allproducts.webp" 
                        className="w-full h-full object-cover opacity-50" 
                        alt="Blog header"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h1 className="text-5xl font-bold mb-4 text-gray-800">
                                Daadi's Blog
                            </h1>
                            <p className="text-xl opacity-90 max-w-2xl mx-auto text-gray-700">
                                Stories, insights, and inspiration from our journey
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Description */}
                <div className="max-w-4xl mx-auto mb-16">
                    <p className="text-gray-600 text-lg leading-relaxed text-center">
                        Welcome to our blog where we share insights, stories, and knowledge. 
                        We believe in the power of sharing experiences and learning from one another. 
                        Join us on this journey as we explore topics that matter to our community.
                    </p>
                </div>

                {/* Blog Grid */}
                {loading ? (
                  <p className="text-center">Loading blogs...</p>
                ) : blogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
                    {displayedData.map((blog) => (
                      <Blog key={blog._id} blog={blog} />
                    ))}
                  </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-600 mb-4">
                            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center border border-yellow-200">
                                <Calendar className="w-12 h-12 text-yellow-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs yet</h3>
                        <p className="text-gray-600">Check back soon for new content!</p>
                    </div>
                )}

                {/* Load More Section */}
                {blogs.length > 0 && (
                    <div className="text-center">
                        {displayedData?.length === blogs?.length ? (
                            <div className="inline-flex flex-col items-center gap-4">
                                <p className="text-gray-500 italic">That's all for now!</p>
                                <div className="w-16 h-px bg-gray-300"></div>
                            </div>
                        ) : (
                            <Button 
                                disabled={isLoadmoreButtonDisabled} 
                                onClick={() => {
                                    setVisibleItemCount(prevCount => prevCount + 6);
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 px-8 py-3 text-base font-medium transition-colors border border-yellow-400"
                            >
                                {displayedData.length === blogs.length ? (
                                    <>
                                        All loaded 
                                        <X className="w-5 h-5 ml-2" />
                                    </>
                                ) : (
                                    <>
                                        Load More Posts 
                                        <Plus className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
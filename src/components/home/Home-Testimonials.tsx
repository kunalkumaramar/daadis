import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Button } from "../ui/button";
import {
  MoveRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import ReactPlayer from "react-player";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  videoUrl?: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Inc",
    content:
      "This product has revolutionized our workflow. The seamless integration and intuitive design have boosted our team's productivity by 40%. Absolutely game-changing!",
    avatar: "",
    videoUrl:
      "https://res.cloudinary.com/dwqyjytaw/video/upload/v1756799325/Daadi_s_v3_aptdxm.mp4",
  },
  {
    id: 2,
    name: "Kaivanya Bhandari",
    role: "",
    company: "",
    content:
      "Daadis sweets remind me of authentic homemade mithai. The gulab jamuns were perfectly soft and not overly sweet. Truly feels like festive vibes in every bite!",
    avatar:
      "https://res.cloudinary.com/dmrgscauc/image/upload/v1758786177/kv_p7tz3a.jpg",
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Creative Director",
    company: "Design Studio Pro",
    content:
      "From concept to execution, this solution exceeded all expectations. The creative possibilities it unlocks are endless, and our clients love the results.",
    avatar: "",
    videoUrl:
      "https://res.cloudinary.com/dwqyjytaw/video/upload/v1756799324/Daadi_s_v1_t5a3p7.mp4",
  },
  {
    id: 4,
    name: "Neer Shah",
    role: "",
    company: "",
    content:
      "The khakhras are super crispy and fresh! I tried the masala flavor, and it’s the perfect evening snack with tea. Light, crunchy, and guilt-free.",
    avatar:
      "https://res.cloudinary.com/dmrgscauc/image/upload/v1758786178/neer_bsbaae.png",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Operations Manager",
    company: "Global Solutions",
    content:
      "The automation features have streamlined our operations completely. What used to take hours now happens in minutes with incredible accuracy.",
    avatar: "",
    videoUrl:
      "https://res.cloudinary.com/dwqyjytaw/video/upload/v1756799323/Daadi_s_v4_vvur9d.mp4",
  },
  {
    id: 6,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Inc",
    content:
      "This product has revolutionized our workflow. The seamless integration and intuitive design have boosted our team's productivity by 40%. Absolutely game-changing!",
    avatar: "",
    videoUrl:
      "https://res.cloudinary.com/dwqyjytaw/video/upload/v1756799323/Daadi_s_v2_qqbj3l.mp4",
  },
  {
    id: 7,
    name: "Kunal Kumar Amar",
    role: "",
    company: "",
    content:
      "I loved the namkeens! They are not oily and taste just like my grandmother recipes. The packaging could be better, but the taste makes up for it.",
    avatar:
      "https://res.cloudinary.com/dmrgscauc/image/upload/v1758786177/kunal_c4z6oo.jpg",
  },
  {
    id: 8,
    name: "Mohit Singh",
    role: "",
    company: "",
    content:
      "Daadi’s products are pure nostalgia. The ladoos tasted exactly like homemade ones, full of ghee and love. Definitely ordering again for Diwali.",
    avatar:
      "https://res.cloudinary.com/dmrgscauc/image/upload/v1758786177/mohit_aqqupg.jpg",
  },
  {
    id: 9,
    name: "Rohan Sunwar",
    role: "",
    company: "",
    content:
      "The khakhras are wholesome and filling. I carry them to work, and they make a great healthy munch. A little more flavor variety would make it perfect.",
    avatar:
      "https://res.cloudinary.com/dmrgscauc/image/upload/v1758786178/Rohan_kvuele.png",
  },
  {
    id: 10,
    name: "Shaik Nazidulla",
    role: "",
    company: "",
    content:
      "The taste is really authentic and homemade, not like commercial brands. The kaju katli was melt-in-mouth good. Slightly pricey, but worth it.",
    avatar:
      "https://res.cloudinary.com/dmrgscauc/image/upload/v1758786184/nazid_zhunc6.png",
  },
];

interface CircularTestimonialCardProps {
  testimonial: TestimonialItem;
  index: number;
  currentIndex: number;
  totalItems: number;
  onVideoPlay: (testimonial: TestimonialItem) => void;
  isMobile: boolean;
  onCardClick: () => void;
}

const CircularTestimonialCard: React.FC<CircularTestimonialCardProps> =
  React.memo(
    ({
      testimonial,
      index,
      currentIndex,
      totalItems,
      isMobile,
      onCardClick = () => {}, // <-- Provide default
    }) => {
      // Determine if this card is front-and-center
      const isMainCard = index === currentIndex;
      const [playing, setPlaying] = useState(false);
      const [muted, setMuted] = useState(true);
      // Sync autoplay when this becomes the main card
      useEffect(() => {
        setPlaying(isMainCard);
      }, [isMainCard]);

      // Memoize the transform for performance
      const cardTransform = useMemo(() => {
        const angleStep = (2 * Math.PI) / totalItems;
        const angle = (index - currentIndex) * angleStep;
        const radius = isMobile ? 200 : 320;
        const cardWidth = isMobile ? 240 : 320;
        const cardHeight = isMobile ? 320 : 440;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const scale =
          z > 0 ? 1 : Math.max(isMobile ? 0.6 : 0.7, 0.7 + (z / radius) * 0.3);
        const opacity = isMainCard ? 1 : 1;
        const tiltY = isMainCard ? 0 : x > 0 ? -15 : 15;
        return {
          transform: `translate3d(${x}px, 0, ${z}px) rotateY(${
            angle + (tiltY * Math.PI) / 180
          }rad) scale(${scale})`,
          opacity,
          zIndex: Math.round((z + radius) * 10),
          isMainCard,
          width: cardWidth,
          height: cardHeight,
        };
      }, [index, currentIndex, totalItems, isMainCard, isMobile]);
      const handlePlayPause = useCallback(() => {
        setPlaying((p) => !p);
      }, []);

      const handleMute = useCallback(() => {
        setMuted((m) => !m);
      }, []);
      if (testimonial.videoUrl) {
        return (
          <div
            className="absolute w-80 h-[440px] transition-all duration-500 ease-out cursor-pointer will-change-transform"
            style={{
              transform: cardTransform.transform,
              opacity: cardTransform.opacity,
              zIndex: cardTransform.zIndex,
              width: cardTransform.width,
              height: cardTransform.height,
            }}
            onClick={onCardClick}
          >
            <ReactPlayer
              url={testimonial.videoUrl}
              playing={playing}
              loop
              muted={muted}
              controls={false}
              width="100%"
              height="100%"
              light={!playing && testimonial.avatar}
              playIcon={
                <Play
                  className={`${
                    isMobile ? "w-8 h-8" : "w-12 h-12"
                  } text-yellow-600 bg-white rounded-full p-2 shadow-lg`}
                />
              }
              style={{ borderRadius: "inherit" }}
            />
            {/* Custom controls overlay */}
            {isMainCard && (
              <div
                className={`absolute ${
                  isMobile ? "bottom-2 left-[5rem]" : "bottom-4 left-[7rem]"
                } flex space-x-2`}
              >
                <button
                  onClick={handlePlayPause}
                  className="bg-white/80 p-2 rounded-full shadow-lg"
                >
                  {playing ? (
                    <Pause
                      className={`${
                        isMobile ? "w-4 h-4" : "w-6 h-6"
                      } text-gray-800`}
                    />
                  ) : (
                    <Play
                      className={`${
                        isMobile ? "w-4 h-4" : "w-6 h-6"
                      } text-gray-800`}
                    />
                  )}
                </button>
                <button
                  onClick={handleMute}
                  className="bg-white/80 p-2 rounded-full shadow-lg"
                >
                  {muted ? (
                    <VolumeX
                      className={`${
                        isMobile ? "w-4 h-4" : "w-6 h-6"
                      } text-gray-800`}
                    />
                  ) : (
                    <Volume2
                      className={`${
                        isMobile ? "w-4 h-4" : "w-6 h-6"
                      } text-gray-800`}
                    />
                  )}
                </button>
              </div>
            )}
          </div>
        );
      }
      return (
        <div
          className="absolute w-80 h-[440px] transition-all duration-500 ease-out cursor-pointer will-change-transform"
          style={{
            transform: cardTransform.transform,
            opacity: cardTransform.opacity,
            zIndex: cardTransform.zIndex,
            width: cardTransform.width,
            height: cardTransform.height,
          }}
          onClick={onCardClick}
        >
          {testimonial.videoUrl ? (
            <ReactPlayer
              url={testimonial.videoUrl}
              playing={playing}
              controls={isMainCard}
              loop={true}
              width="100%"
              height="100%"
              light={!playing && testimonial.avatar}
              playIcon={
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-yellow-600 bg-white rounded-full p-2 shadow-lg" />
                </div>
              }
              style={{ borderRadius: "inherit" }}
            />
          ) : (
            <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="h-[35%] bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className={`${
                    isMobile ? "w-16 h-16" : "w-20 h-20"
                  } rounded-full border-4 border-white shadow-lg object-cover`}
                />
              </div>
              <div
                className={`h-[65%] ${
                  isMobile ? "p-3" : "p-5"
                } flex flex-col justify-between`}
              >
                <blockquote
                  className={`text-gray-700 ${
                    isMobile ? "text-xs" : "text-sm"
                  } flex-1 overflow-hidden`}
                >
                  "{testimonial.content}"
                </blockquote>
                <div className="border-t border-gray-200 pt-3 mt-auto">
                  <p
                    className={`font-semibold text-gray-900 ${
                      isMobile ? "text-sm" : ""
                    }`}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className={`text-xs text-gray-600 ${
                      isMobile ? "text-[10px]" : ""
                    }`}
                  >
                    {testimonial.role}
                  </p>
                  <p
                    className={`text-xs text-yellow-600 font-medium ${
                      isMobile ? "text-[10px]" : ""
                    }`}
                  >
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  );

export default function AnimatedTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<TestimonialItem | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollAccumulator = useRef(0);
  const total = testimonials.length;
  const autoScrollRef = useRef<NodeJS.Timeout>();
  const isUserInteracting = useRef(false);

  const scrollTimeout = useRef<NodeJS.Timeout>();
  const [isAutoScrollSuspended, setIsAutoScrollSuspended] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-scroll functionality for mobile
  useEffect(() => {
    if (!isMobile) return;

    const startAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }

      autoScrollRef.current = setInterval(() => {
        if (!isUserInteracting.current && !isAutoScrollSuspended) {
          setCurrentIndex((prev) => (prev + 1) % total);
        }
      }, 3000); // Change every 3 seconds
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isMobile, total, isAutoScrollSuspended]);

  // Pause auto-scroll when user interacts
  const handleUserInteraction = useCallback(() => {
    if (!isMobile) return;

    isUserInteracting.current = true;

    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }

    // Resume auto-scroll after 5 seconds of no interaction
    setTimeout(() => {
      isUserInteracting.current = false;
      if (isMobile) {
        autoScrollRef.current = setInterval(() => {
          if (!isUserInteracting.current) {
            setCurrentIndex((prev) => (prev + 1) % total);
          }
        }, 3000);
      }
    }, 5000);
  }, [isMobile, total]);

  useEffect(() => {
    if (titleRef.current) {
      const text = "Our Products Are Loved By";
      titleRef.current.innerHTML = text
        .split(" ")
        .map(
          (char) =>
            `<span class="char" style="display:inline-block;opacity:0;transform:translateY(100px);background: linear-gradient(to right, #1f2937, #d97706);-webkit-background-clip: text;background-clip: text;color: transparent;">${char}</span>`
        )
        .join(" ");
      const chars = titleRef.current.querySelectorAll<HTMLElement>(".char");
      gsap.set(chars, { opacity: 0, y: 100 });
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }, []);

  // Scroll-based navigation
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = (e: WheelEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isInCardsArea =
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2;

      if (!isInCardsArea) return;

      const scrollDirection = e.deltaY > 0 ? "down" : "up";

      // Check if we're at the boundaries
      const isAtFirstCard = currentIndex === 0;
      const isAtLastCard = currentIndex === total - 1;

      // Allow normal scrolling if at boundaries
      if (
        (isAtFirstCard && scrollDirection === "up") ||
        (isAtLastCard && scrollDirection === "down")
      ) {
        // Don't prevent default - allow normal page scrolling
        return;
      }

      e.preventDefault();

      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Accumulate scroll delta
      scrollAccumulator.current += e.deltaY;

      // Determine if we should change cards (threshold of 100px)
      const threshold = 100;
      if (Math.abs(scrollAccumulator.current) >= threshold) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;

        setCurrentIndex((prevIndex) => {
          let newIndex;
          if (direction > 0) {
            newIndex = Math.min(prevIndex + 1, total - 1); // Don't go past last
          } else {
            newIndex = Math.max(prevIndex - 1, 0); // Don't go past first
          }
          return newIndex;
        });

        // Reset accumulator
        scrollAccumulator.current = 0;
      }

      // Set timeout to reset accumulator if no scrolling for a while
      scrollTimeout.current = setTimeout(() => {
        scrollAccumulator.current = 0;
      }, 150);
    };

    // Add scroll event listener
    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [total, currentIndex, isMobile]);

  const handleCardClick = useCallback(() => {
    if (isMobile) {
      setIsAutoScrollSuspended(true);
      isUserInteracting.current = true;
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);

      // Resume auto-scroll only after swipe
      // No timer resume here
    }
  }, [isMobile]);

  // Touch/swipe support for mobile
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isInCardsArea =
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2;

      if (!isInCardsArea) return;

      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isInCardsArea =
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2;

      if (!isInCardsArea) return;

      touchEnd.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchStart.current.x - touchEnd.current.x;
      const deltaY = touchStart.current.y - touchEnd.current.y;

      // Check if it's a horizontal swipe (more horizontal than vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        e.preventDefault();

        if (deltaX > 0) {
          // Swipe left - next card
          setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
        } else {
          // Swipe right - previous card
          setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? total - 1 : prevIndex - 1
          );
        }

        // Resume autoscroll after swipe
        if (isMobile) {
          setIsAutoScrollSuspended(false);
          isUserInteracting.current = false;

          // Restart interval if needed (will happen via effect)
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [total, isMobile, handleUserInteraction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, []);

  // Escape key to close video
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedVideo(null);
        setIsPlaying(false);
      }
    };

    if (selectedVideo) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [selectedVideo]);

  // Memoized handlers to prevent unnecessary re-renders
  const handlePrevious = useCallback(() => {
    if (isMobile) {
      handleUserInteraction();
    }
    const newIndex = currentIndex === 0 ? total - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollAccumulator.current = newIndex * 100;
  }, [currentIndex, total, handleUserInteraction, isMobile]);

  const handleNext = useCallback(() => {
    if (isMobile) {
      handleUserInteraction();
    }
    const newIndex = (currentIndex + 1) % total;
    setCurrentIndex(newIndex);
    scrollAccumulator.current = newIndex * 100;
  }, [currentIndex, total, handleUserInteraction, isMobile]);

  const handleVideoPlay = useCallback((t: TestimonialItem) => {
    if (t.videoUrl) {
      setSelectedVideo(t);
      setIsPlaying(true);
    }
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedVideo(null);
    setIsPlaying(false);
  }, []);

  const handleDotClick = useCallback(
    (index: number) => {
      if (isMobile) {
        handleUserInteraction();
      }
      setCurrentIndex(index);
      scrollAccumulator.current = index * 100;
    },
    [isMobile, handleUserInteraction]
  );

  return (
    <div className="w-full">
      <section
        ref={sectionRef}
        className="w-full min-h-screen bg-gradient-to-b from-yellow-50 to-white py-20 px-4 overflow-hidden relative"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            ref={titleRef}
            className={`font-bold ${
              isMobile ? "text-3xl" : "text-4xl md:text-6xl lg:text-7xl"
            } mb-8 bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text`}
          >
            Our products are loved by
          </h1>
          <p
            className={`text-gray-600 ${
              isMobile ? "text-base" : "text-lg"
            } max-w-2xl mx-auto animate-subheader`}
          >
            Don't just take our word for it. Hear from real customers who have
            transformed their businesses with our solutions.
          </p>
        </div>

        {/* 3D Circular Gallery */}
        <div
          ref={containerRef}
          className={`relative ${
            isMobile ? "h-[450px]" : "h-[600px]"
          } flex items-center justify-center transform-gpu`}
          style={{
            perspective: isMobile ? "700px" : "900px",
            perspectiveOrigin: "center center",
          }}
        >
          {/* Testimonial Cards */}
          <div className="relative w-full h-full flex items-center justify-center transform-gpu">
            {testimonials.map((t, index) => (
              <CircularTestimonialCard
                key={`testimonial-${t.id}`}
                testimonial={t}
                index={index}
                currentIndex={currentIndex}
                totalItems={total}
                onVideoPlay={handleVideoPlay}
                isMobile={isMobile}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {/* Navigation Controls - Hidden on mobile */}
          {!isMobile && (
            <>
              <Button
                onClick={handlePrevious}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-yellow-50 border border-yellow-400 text-yellow-600 hover:text-yellow-700 rounded-full w-12 h-12 p-0 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MoveRight className="w-5 h-5 rotate-180" />
              </Button>

              <Button
                onClick={handleNext}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-yellow-50 border border-yellow-400 text-yellow-600 hover:text-yellow-700 rounded-full w-12 h-12 p-0 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MoveRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Dots Indicator */}
          <div
            className={`absolute ${
              isMobile ? "bottom-[-30px]" : "bottom-[-50px]"
            } left-1/2 -translate-x-1/2 flex gap-2 z-30`}
          >
            {testimonials.map((_, i) => (
              <button
                key={`dot-${i}`}
                onClick={() => handleDotClick(i)}
                className={`${
                  isMobile ? "w-2 h-2" : "w-3 h-3"
                } rounded-full border border-yellow-500 transition-all duration-200 ${
                  i === currentIndex
                    ? "bg-yellow-500 scale-110"
                    : "bg-white hover:bg-yellow-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`bg-white rounded-2xl ${
                isMobile ? "w-full max-w-sm" : "max-w-4xl w-full"
              } max-h-[90vh] overflow-hidden`}
            >
              {/* Video Player */}
              <div className="aspect-video bg-gray-900 relative">
                {selectedVideo.videoUrl ? (
                  <div className="h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Play
                        className={`${
                          isMobile ? "w-12 h-12" : "w-20 h-20"
                        } mx-auto mb-4 text-yellow-400`}
                      />
                      <h3
                        className={`${
                          isMobile ? "text-lg" : "text-2xl"
                        } font-bold mb-2`}
                      >
                        {selectedVideo.name}
                      </h3>
                      <p className="text-yellow-400">Video Player</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Play
                        className={`${
                          isMobile ? "w-12 h-12" : "w-20 h-20"
                        } mx-auto mb-4 text-yellow-400`}
                      />
                      <h3
                        className={`${
                          isMobile ? "text-lg" : "text-2xl"
                        } font-bold mb-2`}
                      >
                        {selectedVideo.name}
                      </h3>
                      <p className="text-yellow-400">Video not available</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleModalClose}
                  className={`absolute top-4 right-4 text-white hover:bg-white/20 rounded-full ${
                    isMobile ? "w-8 h-8" : "w-10 h-10"
                  } p-0 text-2xl`}
                >
                  ×
                </Button>
              </div>

              {/* Modal Content */}
              <div className={`${isMobile ? "p-4" : "p-6"}`}>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={selectedVideo.avatar}
                    alt={selectedVideo.name}
                    className={`${
                      isMobile ? "w-10 h-10" : "w-12 h-12"
                    } rounded-full object-cover`}
                  />
                  <div>
                    <h3
                      className={`font-semibold ${
                        isMobile ? "text-base" : "text-lg"
                      }`}
                    >
                      {selectedVideo.name}
                    </h3>
                    <p
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } text-gray-600`}
                    >
                      {selectedVideo.role} at {selectedVideo.company}
                    </p>
                  </div>
                </div>

                <blockquote
                  className={`text-gray-700 italic mb-4 ${
                    isMobile ? "text-sm" : ""
                  }`}
                >
                  "{selectedVideo.content}"
                </blockquote>

                <Button
                  onClick={handleModalClose}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <style>{`
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        .will-change-transform {
          will-change: transform, opacity;
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-header {
          animation: fadeSlideIn 1s ease-out forwards;
        }
        
        .animate-subheader {
          animation: fadeSlideIn 1s ease-out 0.3s forwards;
        }

        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .transform-gpu {
            perspective: 600px;
          }
        }
      `}</style>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import gsap from "gsap";
import { LoaderCircleIcon } from "lucide-react";
import { optimizeCloudinaryUrl } from "../../utils/utility-functions";

export interface ISampleBanners {
  _id: string;
  imageUrl: { url: string; publicId: string };
  bannerName: string;
  bannerText: string;
  bannerType: string;
  bannerColours?: [string, string];
  bannerElementUrl?: { url: string; publicId: string };
}

const SAMPLE_BANNERS: ISampleBanners[] = [
  {
    _id: "1",
    imageUrl: { url: "https://res.cloudinary.com/dh7d6iho8/image/upload/v1762778654/1_loff6u.webp", publicId: "banner1" },
    bannerName: "Namak Para",
    bannerText: "Namak Para",
    bannerType: "hero",
    bannerColours: ["A2D2DF", "FF8383"],
    bannerElementUrl: { url: "https://res.cloudinary.com/dh7d6iho8/image/upload/v1762778654/2_1_h5yxtr.webp", publicId: "element1" },
  },
  {
    _id: "2",
    imageUrl: { url: "https://res.cloudinary.com/dh7d6iho8/image/upload/v1762778655/3_hsndbo.webp", publicId: "banner2" },
    bannerName: "Shakkar Para",
    bannerText: "Shakkar Para",
    bannerType: "hero",
    bannerColours: ["7BD3EA", "9694FF"],
    bannerElementUrl: { url: "https://res.cloudinary.com/dh7d6iho8/image/upload/v1762778656/4_crqsnh.webp", publicId: "element2" },
  },
  {
    _id: "3",
    imageUrl: { url: "https://res.cloudinary.com/dh7d6iho8/image/upload/v1762778659/daadi_kaju_katli_s5chbp.webp", publicId: "banner3" },
    bannerName: "Kaju Katli",
    bannerText: "Kaju Katli",
    bannerType: "hero",
    bannerColours: ["FFFFFF", "1B3C73"],
    bannerElementUrl: { url: "https://res.cloudinary.com/dthrjonaq/image/upload/v1734551218/daadis.in/banners/cashew_xba4ll.png", publicId: "element3" },
  },
  {
    _id: "4",
    imageUrl: { url: "https://res.cloudinary.com/dh7d6iho8/image/upload/v1762778658/5_pdhlas.webp", publicId: "banner4" },
    bannerName: "Peri Peri Khakhra",
    bannerText: "Peri Peri Khakhra",
    bannerType: "hero",
    bannerColours: ["F3B95F", "3B1E54"],
    bannerElementUrl: { url: "https://res.cloudinary.com/dh7d6iho8/image/upload/v1762778658/6_hhkebx.webp", publicId: "element4" },
  },
];

export const HomePageHeroCarousel = ({
  bannerHero,
}: {
  bannerHero?: ISampleBanners[];
}) => {
  const bannerHeros = bannerHero && bannerHero.length > 0 ? bannerHero : SAMPLE_BANNERS;
  const bannerElementChangeValues: any[] = [
    {
      0: {
        scale: 0.6,
        left: 5,
        top: 20,
        rotation: 10,
        scaleX: 1
      },
      1: {
        scale: 0.5,
        left: 20,
        top: 5,
        rotation: 50,
        scaleX: -1
      },
      2: {
        scale: 1,
        left: 7,
        top: 65,
        rotation: 90,
        scaleX: 1
      },
      3: {
        scale: 0.72,
        left: 25,
        top: 55,
        rotation: 165,
        scaleX: 1
      },
      4: {
        scale: 1,
        left: 55,
        top: 20,
        rotation: 120,
        scaleX: 1
      },
      5: {
        scale: 0.4,
        left: 60,
        top: 75,
        rotation: 30,
        scaleX: -1
      },
      6: {
        scale: 0.8,
        left: 67,
        top: -10,
        rotation: 240,
        scaleX: 1
      },
      7: {
        scale: 0.8,
        left: 90,
        top: 15,
        rotation: -20,
        scaleX: 1
      },
      8: {
        scale: 0.6,
        left: 80,
        top: 80,
        rotation: 120,
        scaleX: 1
      },
      9: {
        scale: 0.4,
        left: 75,
        top: 45,
        rotation: -30,
        scaleX: -1
      },
      10: {
        scale: 0.6,
        left: 15,
        top: 35,
        rotation: -30,
        scaleX: 1
      }
    },
    {
      0: {
        scale: 0.4,
        left: 52,
        top: 12,
        rotation: 10,
        scaleX: 1
      },
      1: {
        scale: 0.8,
        left: 15,
        top: 15,
        rotation: 65,
        scaleX: -1
      },
      2: {
        scale: 0.6,
        left: 1,
        top: 6,
        rotation: 90,
        scaleX: 1
      },
      3: {
        scale: 0.8,
        left: 25,
        top: 55,
        rotation: 165,
        scaleX: 1
      },
      4: {
        scale: 1,
        left: 62,
        top: 18,
        rotation: 110,
        scaleX: 1
      },
      5: {
        scale: 0.6,
        left: 65,
        top: 55,
        rotation: -30,
        scaleX: -1
      },
      6: {
        scale: 0.56,
        left: 67,
        top: -10,
        rotation: 240,
        scaleX: 1
      },
      7: {
        scale: 0.8,
        left: 90,
        top: 15,
        rotation: -20,
        scaleX: 1
      },
      8: {
        scale: 0.6,
        left: 80,
        top: 80,
        rotation: 120,
        scaleX: 1
      },
      9: {
        scale: 0.6,
        left: 6,
        top: 62,
        rotation: -30,
        scaleX: -1
      },
      10: {
        scale: 0.6,
        left: 22,
        top: 12,
        rotation: -30,
        scaleX: 1
      }
    },
    {
      0: {
        scale: 0.6,
        left: 12,
        top: 12,
        rotation: 10,
        scaleX: 1
      },
      1: {
        scale: 1,
        left: 65,
        top: 28,
        rotation: 65,
        scaleX: -1
      },
      2: {
        scale: 0.6,
        left: 1,
        top: 80,
        rotation: 90,
        scaleX: 1
      },
      3: {
        scale: 0.8,
        left: 25,
        top: 55,
        rotation: 165,
        scaleX: 1
      },
      4: {
        scale: 1,
        left: 80,
        top: 65,
        rotation: 110,
        scaleX: 1
      },
      5: {
        scale: 0.6,
        left: 55,
        top: 65,
        rotation: -30,
        scaleX: -1
      },
      6: {
        scale: 0.56,
        left: 67,
        top: -10,
        rotation: 240,
        scaleX: 1
      },
      7: {
        scale: 0.6,
        left: 80,
        top: 80,
        rotation: 120,
        scaleX: 1
      },
      8: {
        scale: 0.8,
        left: 90,
        top: 15,
        rotation: -20,
        scaleX: 1
      },
      9: {
        scale: 0.6,
        left: 22,
        top: 12,
        rotation: -30,
        scaleX: 1
      },
      10: {
        scale: 0.6,
        left: 6,
        top: 62,
        rotation: -30,
        scaleX: -1
      }
    },
  ];

  let activeIndex = 0;
  let previousIndex = activeIndex - 1;
  let nextIndex = activeIndex + 1;
  const itemRefs = useRef([]);
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const bannerElementsRef = useRef([]);

  const changeBackgorund = (index: number, isNext: boolean) => {
    if (activeIndex > bannerHeros.length - 1 || activeIndex < 0) return;

    gsap.fromTo(gradientRef.current, {
        // @ts-ignore
        background: `radial-gradient(circle, #${bannerHeros[index]?.bannerColours[0]!} 0%, #${bannerHeros[index]?.bannerColours[1]} 100%)`,
        clipPath: 'circle(0% at 50% 0%)',
        onComplete: () => {
          if ( nameRef.current )
            nameRef.current.innerText! = bannerHeros[index]?.bannerText;
        }
      }, {
        clipPath: 'circle(100% at 50% 100%)',
        duration: 0.8,
        delay: 0.2,
        onComplete: () => {
          gsap.to("#hero-section", {
            // @ts-ignore
            background: `radial-gradient(circle, #${bannerHeros[index].bannerColours[0]} 0%, #${bannerHeros[index].bannerColours[1]} 100%)`
          });
        },
    });

    
    if ( isNext ) {
      previousIndex = activeIndex - 1;
        gsap.to(itemRefs.current[activeIndex], {
          rotation: -100,
          duration: 0.2,
          onComplete: () => {
            gsap.to(itemRefs.current[activeIndex], {
            top: '50%',
            scale: 1,
            left: '50%',
            xPercent: -60,
            yPercent: -50,      
            duration: 0.6,
            rotation: 10,
            onComplete: () => {
              gsap.to(itemRefs.current[activeIndex], {
                xPercent: -50,
                rotation: 0,
                duration: 0.2,
              });
            }
          });
        }
      });

      if (previousIndex >= 0)
        gsap.to(itemRefs.current[previousIndex], {
          rotation: -10,
          duration: 0.2,
          onComplete: () => {
            gsap.to(itemRefs.current[previousIndex], {
              scale: 0.4,
              top: "50%",
              left: "-5%",
              xPercent: -50,
              yPercent: -50,
              rotation: 90,
              duration: 0.8,
            });
          }
        });

    } else {
      previousIndex = activeIndex;
      nextIndex = activeIndex + 1;
      // @ts-ignore
      //console.log(itemRefs.current[previousIndex]?.src!);
      //console.log(previousIndex);
      
      gsap.to(itemRefs.current[previousIndex], {
        rotation: 100,
        duration: 0.2,
        onComplete: () => {
          gsap.to(itemRefs.current[previousIndex], {
            top: '50%',
            scale: 1,
            left: '50%',
            xPercent: -40,
            yPercent: -50,      
            duration: 0.6,
            rotation: -10,
            onComplete: () => {
              gsap.to(itemRefs.current[previousIndex], {
                xPercent: -50,
                rotation: 0,
                duration: 0.2,
              });
            }
          })
        }
      });

      if (previousIndex >= 0)
        gsap.to(itemRefs.current[nextIndex], {
          rotation: 10,
          duration: 0.2,
          onComplete: () => {
            gsap.to(itemRefs.current[nextIndex], {
              scale: 0.4,
              top: "50%",
              right: "-25%",
              left: "auto",
              xPercent: 0,
              yPercent: -50,
              rotation: -90,
              duration: 0.8
            });
          }
        });
    }


    bannerElementsRef.current.forEach((el, index) => {
      
      if (el) {
        gsap.to(
          el,
          { 
            left: bannerElementChangeValues[activeIndex % (bannerElementChangeValues.length - 1)][index].left! + "%",
            top: bannerElementChangeValues[activeIndex % (bannerElementChangeValues.length - 1)][index].top! + "%",
            // ease: "power2.out",
            scale: 0,
            duration: 0.5,
            onComplete: () => {
              // @ts-ignore
              el.src = bannerHeros[activeIndex].bannerElementUrl?.url;
              gsap.to(el, {
                // width: Math.floor(Math.random() * (200 - 100) + 100),
                scale: bannerElementChangeValues[activeIndex % (bannerElementChangeValues.length - 1)][index].scale!,
                // rotation: Math.floor(Math.random() * (20) + 1),
                rotation: bannerElementChangeValues[activeIndex % (bannerElementChangeValues.length - 1)][index]?.rotation,
                scaleX: bannerElementChangeValues[activeIndex % (bannerElementChangeValues.length - 1)][index]?.scaleX,
                duration: 0.5
              });
            }
          },
        );
      } 
    });
    
  };

  useEffect(() => {
    if ( !bannerHeros || (bannerHeros?.length == 0) ) return;
      changeBackgorund(0, true);
  }, [bannerHeros]);

  const nextSlide = () => {

    if ( activeIndex > bannerHeros.length - 1 ) {
      return console.log(false);
    } 
    if ( activeIndex < 0 ) activeIndex = 0; 
    // setActiveIndex(activeIndex + 1);
    ++activeIndex;
    //console.log(`active index : ${activeIndex}`);
    changeBackgorund(activeIndex, true);
  };

  const previousSlide = () => {
    if (activeIndex <= 0) 
      return console.log(false);
    if ( activeIndex == bannerHeros.length) activeIndex = bannerHeros.length - 1;
    --activeIndex;
    //console.log(`active index : ${activeIndex}`);
    changeBackgorund(activeIndex, false);
  };

  return bannerHeros.length == 0 ? <div id="hero-section" className="p-0 m-0 overflow-hidden flex justify-center relative items-center sm:h-[calc(100vh-56px)] z-0 w-full h-[auto] aspect-square"><LoaderCircleIcon className="w-14 h-14 animate-spin stroke-yellow-500" /> </div> : (
    <div id="hero-section" className="p-0 m-0 overflow-hidden flex justify-center relative items-center sm:h-[calc(100vh-56px)] z-0 w-full h-[auto] aspect-square">
      {/* Maintenance Banner 
      <div className="absolute top-0 left-0 right-0 z-[200] bg-red-600 text-white py-3 px-4 text-center font-bold">
        <p className="text-lg sm:text-xl md:text-2xl">
          🚧 WEBSITE UNDER MAINTENANCE UNTIL FURTHER NOTICE 🚧
        </p>
      </div>*/}
      <button className="absolute left-0 z-[100] top-1/2 w-14 h-48 -translate-y-1/2 opacity-0" onClick={(e) => {
        e.preventDefault();
        previousSlide();
        // @ts-ignore
        e.target.disabled = true;
        setTimeout(() => {
          // @ts-ignore
          e.target.disabled = false
        }, 1000);
      }}></button>
      <div ref={gradientRef} className="absolute hero-section-animation-elements top-0 left-0 right-0 bottom-0 flex justify-center items-center"><p ref={nameRef} className="text-[50px] sm:text-[150px] font-bold text-center text-white">{bannerHeros[0].bannerText}</p></div>
      <div className="absolute w-[full] h-[full] top-0 right-0 bottom-0 left-0 z-[1]" id="banner-elements">
          <div className="relative w-full h-full">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => {
              // @ts-ignore
              return <img src={optimizeCloudinaryUrl(bannerHeros[0].bannerElementUrl?.url)} ref={(el) => (bannerElementsRef.current[index] = el)} key={index} className="hero-section-animation-elements sm:w-[250px] w-[70px] absolute aspect-square z-10 mix-blend-multiply object-contain" />
            })}
          </div>
      </div>
      <div className="relative  w-full z-12 flex justify-center overflow-hidden items-center h-full">
        {bannerHeros.map((banner, index) => {
            return (
                <>
                  <img src={optimizeCloudinaryUrl(banner.imageUrl.url)} ref={(el) => {
                      // @ts-ignore
                      return (itemRefs.current[index] = el)
                    }} className={cn(`hero-section-animation-elements sm:h-[90%] sm:-right-[25%] -right-[40%] -rotate-90 scale-[0.4] sm:w-[auto] w-[70%] z-[50] absolute object-contain`)} />
                </>
            );
          })}
      </div>
      <button className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-14 h-48 opacity-0" onClick={(e) => {
          e.preventDefault();
          nextSlide();
          // @ts-ignore
          e.target.disabled = true;
          setTimeout(() => {
            // @ts-ignore
            e.target.disabled = false
          }, 1000);
      }}></button>
    </div>
  );
};
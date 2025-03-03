import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Menu, X, Instagram, Facebook, Twitter, Phone, Mail, MapPin, Scissors, Feather, Palette, ChevronLeft, ChevronRight, UsersRound } from 'lucide-react';
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Lazy load logo
// const logo = lazy(() => import("../src/assets/logo.jpg"));
import logo from "../src/assets/logo.jpg"

// Import image paths but don't load them immediately
const imageImports = {
  makeup: [
    "../src/assets/ff.jpg", "../src/assets/aa.jpg", "../src/assets/a.jpg",
    "../src/assets/b.jpg", "../src/assets/dd.jpg",
    "../src/assets/c.jpg", "../src/assets/d.jpg", "../src/assets/gg.jpg", "../src/assets/bb.jpg", 
    "../src/assets/e.jpg", "../src/assets/ee.jpg", "../src/assets/f.jpg", "../src/assets/g.jpg", 
    "../src/assets/ff.jpg", "../src/assets/h.jpg", "../src/assets/cc.jpg", "../src/assets/i.jpg", 
    "../src/assets/j.jpg", "../src/assets/k.jpg", "../src/assets/l.jpg", "../src/assets/m.jpg", 
    "../src/assets/n.jpg", "../src/assets/o.jpg", "../src/assets/p.jpg", "../src/assets/q.jpg", 
    "../src/assets/r.jpg", "../src/assets/s.jpg", "../src/assets/t.jpg", "../src/assets/u.jpg", 
    "../src/assets/v.jpg", "../src/assets/w.jpg", "../src/assets/x.jpg", "../src/assets/y.jpg", 
    "../src/assets/z.jpg"
  ],
  embroidery: [
    "../src/assets/a1.jpg", "../src/assets/a2.jpg", "../src/assets/a3.jpg", 
    "../src/assets/a4.jpg", "../src/assets/a5.jpg", "../src/assets/a6.jpg", 
    "../src/assets/a7.jpg", "../src/assets/a8.jpg", "../src/assets/a9.jpg"
  ],
  hairstyles: [
    "../src/assets/h19.jpg", "../src/assets/h1.jpg", "../src/assets/h2.jpg", 
    "../src/assets/h3.jpg", "../src/assets/h4.jpg", "../src/assets/h5.jpg", 
    "../src/assets/h6.jpg", "../src/assets/h7.jpg", "../src/assets/h8.jpg", 
    "../src/assets/h9.jpg", "../src/assets/h10.jpg", "../src/assets/h11.jpg", 
    "../src/assets/h12.jpg", "../src/assets/h13.jpg", "../src/assets/h14.jpg", 
    "../src/assets/h15.jpg", "../src/assets/h16.jpg", "../src/assets/h17.jpg", 
    "../src/assets/h18.jpg"
  ],
  videos: [
    "../src/assets/vid1.mp4", "../src/assets/vid2.mp4", "../src/assets/vid3.mp4"
  ]
};

// Image loader component that loads images when they become visible
const LazyImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;
    const currentRef = imgRef.current;

    if (currentRef && IntersectionObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Dynamically import the image when it's in view
              import(src)
                .then((image) => setImageSrc(image.default))
                .catch(err => console.error("Failed to load image:", src));
              observer.unobserve(currentRef);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(currentRef);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      import(src)
        .then((image) => setImageSrc(image.default))
        .catch(err => console.error("Failed to load image:", src));
    }

    return () => {
      if (currentRef && observer) {
        observer.unobserve(currentRef);
      }
    };
  }, [src]);

  return (
    <div ref={imgRef} className={className}>
      {imageSrc ? (
        <img src={imageSrc} alt={alt} className="w-full h-full object-cover rounded-lg" />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
      )}
    </div>
  );
};

// Video loader component
const LazyVideo = ({ src, className, controls, onClick, videoRef }) => {
  const [videoSrc, setVideoSrc] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let observer;
    const currentRef = containerRef.current;

    if (currentRef && IntersectionObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Dynamically import the video when it's in view
              import(src)
                .then((video) => setVideoSrc(video.default))
                .catch(err => console.error("Failed to load video:", src));
              observer.unobserve(currentRef);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(currentRef);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      import(src)
        .then((video) => setVideoSrc(video.default))
        .catch(err => console.error("Failed to load video:", src));
    }

    return () => {
      if (currentRef && observer) {
        observer.unobserve(currentRef);
      }
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`${className} relative`}>
      {videoSrc ? (
        <video 
          ref={videoRef}
          src={videoSrc} 
          className="w-full h-auto max-h-96 rounded-lg" 
          controls={controls}
          playsInline
          onClick={onClick}
          preload="metadata"
        />
      ) : (
        <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Loading video...</p>
        </div>
      )}
    </div>
  );
};

const BeautyAndEmbroideryWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState('makeup');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hairstyles, setHairstyles] = useState([]);
  
  const sliderRef = useRef(null);
  const videoSliderRef = useRef(null);
  const videoRefs = useRef([]);
  
  // For continuous horizontal scrolling
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Load videos
    setTimeout(() => {
      setVideos(imageImports.videos.map((src, index) => ({
        id: index + 1,
        src: src
      })));
      setLoading(false);
    }, 500);
    
    // Load hairstyles
    setTimeout(() => {
      setHairstyles(imageImports.hairstyles);
    }, 500);
    
    // Set up continuous scrolling for hairstyles
    const scrollTimeout = setTimeout(() => {
      // Reset the animation every 69 seconds (just before the 70-second animation completes)
      // This creates a seamless loop effect
      setResetKey(prev => prev + 1);
    }, 69000);
    
    return () => clearTimeout(scrollTimeout);
  }, [resetKey]);

  // Play the selected video & pause others
  const handleVideoClick = (index) => {
    videoRefs.current.forEach((vid, i) => {
      if (vid && i !== index) {
        vid.pause();
        vid.muted = true;
      }
    });

    // Play the clicked video
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.muted = false;
        video.play();
      } else {
        video.pause();
      }
    }
  };

  // Navigation items
  const navItems = ["Home", "Services", "Portfolio", "Reel", "Hairstyles", "About", "Instagram", "Contact"];

  // Services data
  const services = [
    {
      title: "🧵 Bridal Blouse Embroidery",
      includes: [
        "Aari work – Elegant & intricate designs",
        "Heavy embellishments with beads, pearls & stones for a royal look",
      ],
    },
    {
      title: "✨ Party Blouse Embroidery",
      includes: [
        "Sequins & Thread work – Perfect for festive & party wear",
        "Custom motifs & patterns to match your outfit",
      ],
    },
    {
      title: "🌸 Casual Blouse Embroidery",
      includes: [
        "Minimal & elegant embroidery for everyday wear",
        "Light thread & mirror work for a stylish touch",
      ],
    },
  ];

  const makeupServices = [
    {
      title: "💄 Bridal/Engagement Makeup ",
      includes: [
        "HD / Airbrush Makeup – Flawless & long-lasting finish",
        "Long-wear waterproof makeup – Perfect for all-day events",
      ],
    },
    {
      title: "💃 Party Makeup ",
      includes: [
        "HD Makeup – Radiant & photo-ready finish",
        "Perfect for various occasions – Birthdays, Anniversaries, & Night-outs",
      ],
    },
    {
      title: "👰 Photoshoots Makeup ",
      includes: [
        "Soft Glam or Bold Look – As per preference",
        "Ideal for pre-wedding photoshoots & engagement ceremonies",
      ],
    },
  ];

  const prebridal = [
    {
      title: "💆‍♀️ Pre-Bridal Beauty Package",
      includes: [
        "Glow Boosting Facial – Deep cleansing & hydration",
        "Body Polishing – Exfoliation for soft, radiant skin",
        "Waxing & Threading – Smooth & flawless finish ",
        "Manicure & Pedicure – Perfect nails & soft hands/feet",
        "Hair Spa & Treatment – Nourished & silky hair",
      ],
    },
  ];

  // Portfolio images
  const portfolioImages = {
    makeup: imageImports.makeup,
    embroidery: imageImports.embroidery,
  };

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false,
        }
      }
    ]
  };

  // Video slider settings
  const videoSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => {
      // Pause all videos when changing slides
      videoRefs.current.forEach((vid) => {
        if (vid) {
          vid.pause();
          vid.muted = true;
        }
      });
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false,
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-orange-600">Kranti's Studio – Beauty & Embroidery</div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={item}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  onClick={() => setActiveSection(item.toLowerCase())}
                  className={`${
                    activeSection === item.toLowerCase()
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "text-gray-600 hover:text-pink-600"
                  } transition-all duration-300 cursor-pointer`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "max-h-screen" : "max-h-0"
          } overflow-hidden transition-all duration-300`}
        >
          <div className="px-4 py-2 space-y-2 bg-white">
            {navItems.map((item) => (
              <Link
                key={item}
                to={item}
                smooth={true}
                duration={500}
                offset={-70}
                onClick={() => {
                  setActiveSection(item.toLowerCase());
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className={`pt-20 pb-10 px-4 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } transition-all duration-1000`} 
        id="Home"
      >
        <div className="max-w-7xl mx-auto text-center mt-12 md:mt-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Where Beauty Meets Art – 
            <span className="block text-pink-600">Makeup, Embroidery & Styling Perfected</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto pt-3 md:pt-7">
            Experience the perfect blend of makeup artistry and traditional embroidery. Each creation is crafted to enhance your natural beauty and style. Let every detail reflect your elegance, confidence, and timeless charm.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 pt-5 md:pt-10">
            <div className="flex items-center justify-center text-pink-600">
              <Palette className="mr-2" /> Makeup Artistry
            </div>
            <div className="flex items-center justify-center text-pink-600">
              <Scissors className="mr-2" /> Blouse Embroidery
            </div>
            <div className="flex items-center justify-center text-pink-600">
              <UsersRound className="mr-2" /> Hairstyling Elegance
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-4 bg-white pt-16 md:pt-20" id="Services">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">Our Services</h2>
          
          {/* Makeup Services */}
          <div className="mb-12">
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center text-pink-600">
              <Palette className="inline mr-2" />
              Makeup Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {makeupServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-pink-50 p-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">{service.title}</h3>
                  <h3 className="text-base font-semibold text-gray-800 mt-2">🌟 What's Included?</h3>
                  <ul className="list-disc pl-4 text-gray-700 mt-1 space-y-0.5 text-sm">
                    {service.includes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Embroidery Services */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center text-pink-600">
              <Scissors className="inline mr-2" />
              Embroidery Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-pink-50 p-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">{service.title}</h3>
                  <h3 className="text-base font-semibold text-gray-800 mt-2">🌟 What's Included?</h3>
                  <ul className="list-disc pl-4 text-gray-700 mt-1 space-y-0.5 text-sm">
                    {service.includes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Bridal Services */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-6 mt-10 text-center text-pink-600">
              <Feather className="inline mr-2" />
              Pre-Bridal Grooming Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {prebridal.map((service, index) => (
                <div
                  key={index}
                  className="bg-pink-50 p-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">{service.title}</h3>
                  <h3 className="text-base font-semibold text-gray-800 mt-2">🌟 What's Included?</h3>
                  <ul className="list-disc pl-4 text-gray-700 mt-1 space-y-0.5 text-sm">
                    {service.includes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section
        className="py-12 px-4 bg-gradient-to-b from-white to-pink-50 pt-16 md:pt-20 -mt-8"
        id="Portfolio"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Portfolio</h2>

          {/* Portfolio Toggle */}
          <div className="flex justify-center mb-8 space-x-4">
            <button
              onClick={() => setActivePortfolio("makeup")}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${
                activePortfolio === "makeup"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-pink-300"
              }`}
            >
              <Palette className="mr-2 inline" /> Makeup
            </button>
            <button
              onClick={() => setActivePortfolio("embroidery")}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${
                activePortfolio === "embroidery"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-pink-300"
              }`}
            >
              <Scissors className="mr-2 inline" /> Embroidery
            </button>
          </div>

          {/* Auto-Scrolling Image Slider - Responsive and Optimized */}
          <div className="relative w-full overflow-hidden bg-gray-100 p-4 rounded-lg shadow-lg">
            <div className="flex justify-center">
              <div className="w-full max-w-6xl overflow-hidden">
                <motion.div
                  key={`portfolio-${activePortfolio}-${resetKey}`}
                  className="flex space-x-4"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ 
                    ease: "linear", 
                    duration: 70, 
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                  style={{ display: "flex", width: "max-content" }}
                >
                  {[...portfolioImages[activePortfolio], ...portfolioImages[activePortfolio]].map(
                    (img, index) => (
                      <div
                        key={index}
                        className="w-48 h-56 md:w-64 md:h-72 lg:w-72 lg:h-80 flex-shrink-0 mx-2"
                      >
                        <LazyImage
                          src={img}
                          alt={`Portfolio ${activePortfolio} ${index + 1}`}
                          className="w-full h-full"
                        />
                      </div>
                    )
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reels/video Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-white to-gray-50 pt-16 md:pt-20" id="Reel">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Reels</h2>

          {loading ? (
            <p className="text-lg text-gray-500">Loading videos...</p>
          ) : (
            <div className="relative w-full flex justify-center items-center">
              {/* Left Button */}
              <button
                onClick={() => videoSliderRef.current?.slickPrev()}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg z-10"
                aria-label="Previous video"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Video Slider - Optimized */}
              <div className="w-full max-w-3xl">
                <Slider ref={videoSliderRef} {...videoSettings}>
                  {videos.map((video, index) => (
                    <div key={video.id} className="px-2">
                      <LazyVideo
                        src={video.src}
                        className="w-full"
                        controls={true}
                        videoRef={(el) => (videoRefs.current[index] = el)}
                        onClick={() => handleVideoClick(index)}
                      />
                    </div>
                  ))}
                </Slider>
              </div>

              {/* Right Button */}
              <button
                onClick={() => videoSliderRef.current?.slickNext()}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg z-10"
                aria-label="Next video"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Hair Styles Section - Continuous Scrolling Fixed */}
      <div className="relative w-full overflow-hidden bg-gray-100 p-4 pt-16 md:pt-20 -mt-8" id="Hairstyles">
        {/* Fixed Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mt-0.5 mb-8">
          Trending Hairstyles
        </h2>

        {/* Auto-Scrolling Images with Continuous Loop */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            key={`hairstyles-${resetKey}`}
            className="flex space-x-4"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ 
              ease: "linear", 
              duration: 70, 
              repeat: Infinity,
              repeatType: "loop" 
            }}
            style={{ display: "flex", width: "max-content" }}
          >
            {/* Double the array to ensure continuous scrolling */}
            {[...hairstyles, ...hairstyles].map((img, index) => (
              <div key={index} className="w-48 h-56 md:w-64 md:h-72 flex-shrink-0 mx-2">
                <LazyImage
                  src={img}
                  alt={`Hairstyle ${index + 1}`}
                  className="w-full h-full"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* About Section */}
           <section className="py-12 px-4 bg-white pt-20 -mt-11" id='About'>
             <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div>
                   <h2 className="text-3xl font-bold mb-6 text-gray-800">About Us</h2>
                   <p className="text-gray-600 mb-6">
                   At Kranti Beauty & Embroidery, we bring together the art of beauty and craftsmanship under one roof. With over a 4+ years of experience in makeup artistry, hairstyling, embroidery, and salon services, we are committed to enhancing your natural beauty while preserving cultural elegance.
     
     Our services range from professional bridal and party makeup, trending hairstyles, and pre-bridal beauty treatments to customized embroidery work on outfits. Whether you're preparing for a special occasion or indulging in self-care, we ensure a luxurious and personalized experience for every client.
     
     We believe in quality, creativity, and customer satisfaction, making every service a reflection of artistry and passion. Step into Kranti Beauty & Embroidery and experience beauty with perfection! ✨
                   </p>
                   <div className="space-y-4">
                     <div className="flex items-center text-gray-600">
                       <Palette className="text-pink-600 mr-3" />
                       Expert Makeup Artist with 4+ years experience
                     </div>
                     <div className="flex items-center text-gray-600">
                       <Scissors className="text-pink-600 mr-3" />
                       Master Embroiderer specializing in traditional and modern designs
                     </div>
                   </div>
                 </div>
                 <div className=" h-90 rounded-lg overflow-hidden flex items-center justify-center mt-2">
             <img src={logo} alt="Logo" className="w-full h-full object-cover" />
           </div>
               </div>
             </div>
           </section>
     
           
     
           <motion.div
       className="w-full flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-r from-pink-500 to-red-500 shadow-2xl text-white text-center pt-20"
       initial={{ opacity: 0, y: 50 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.8, ease: "easeOut" }} id='Instagram'
     >
       {/* Instagram Icon Animation */}
       <motion.div
         className="p-6 bg-white rounded-full shadow-lg w-full max-w-[80px] sm:max-w-[100px] lg:max-w-[120px] flex justify-center items-center "
         whileHover={{ scale: 1.2, rotate: 10 }}
         whileTap={{ scale: 0.9 }}
         animate={{ y: [0, -10, 0] }}
         transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
       >
         <Instagram size={50} className="text-pink-600" />
       </motion.div>
       {/* Heading with Bounce Animation */}
       <motion.h3
         className="text-2xl sm:text-3xl font-bold mt-6 tracking-wide"
         animate={{ scale: [1, 1.1, 1], color: ["#fff", "#ffd700", "#fff"] }}
         transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
       >
         Join our Instagram family!
         <div className='text-sm'>Follow. Like. Shine</div>
       </motion.h3>
     
       {/* Instagram Link with Hover Glow Effect */}
       <motion.a
         href="https://www.instagram.com/makeup_artist_kranti?igsh=MXRoeWF2ZjRsNG9vNA=="
         target="_blank"
         rel="noopener noreferrer"
         className="mt-6 px-6 sm:px-8 py-3 bg-white text-pink-600 font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 hover:bg-pink-700 hover:text-white hover:shadow-2xl"
         whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.8)" }}
         whileTap={{ scale: 0.9 }}
       >
         @makeup_artist_kranti
       </motion.a>
     </motion.div>
     
     {/* Contact */}
     <motion.section
           className="py-16 px-4 bg-pink-50 pt-20"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1 }} id='Contact'
         >
           <div className="max-w-7xl mx-auto">
             {/* Animated Heading */}
             <motion.h2
               className="text-3xl font-bold text-center mb-12 text-gray-800"
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1, delay: 0.3 }}
             >
               Get in Touch
               <div className='text-[11px] mt-1.5'>( Call us to schedule your visit! )</div>
             </motion.h2>
     
             {/* Contact Details with Animation */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { icon: <Phone className="text-pink-600 mr-3" />, text: "+91 866 859 8946" },
                 { icon: <Mail className="text-pink-600 mr-3" />, text: "www.krantipawar2114@gmail.com" },
                 { icon: <MapPin className="text-pink-600 mr-3" />, text: "Karad, Satara, Maharashtra" },
               ].map((item, index) => (
                 <motion.div
                   key={index}
                   className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md cursor-pointer"
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ duration: 0.8, delay: 0.3 * index }}
                   whileHover={{ scale: 1.05 }}
                 >
                   {item.icon}
                   <span className="text-gray-600">{item.text}</span>
                 </motion.div>
               ))}
             </div>
           </div>
         </motion.section>
           {/* Footer */}
           <footer className="bg-gray-900 text-white py-12 px-4">
             <div className="max-w-7xl mx-auto">
               <div className="flex flex-col md:flex-row justify-between items-center">
                 <div className="text-2xl font-bold mb-6 md:mb-0">Kranti's Studio – Beauty & Embroidery</div>
                 {/* <div className="flex space-x-6">
                   <Instagram className="hover:text-pink-400 cursor-pointer transition-colors duration-300" />
                   <Facebook className="hover:text-pink-400 cursor-pointer transition-colors duration-300" />
                   <Twitter className="hover:text-pink-400 cursor-pointer transition-colors duration-300" />
                 </div> */}
                 Thank you for visiting! Stay beautiful, stay confident! ✨
               </div>
               <div className="mt-8 text-center text-gray-400">
                 © 2025 Kranti's Studio–Beauty&Embroidery.
               </div>
             </div>
           </footer>
         </div>
       );
     };
     
     export default BeautyAndEmbroideryWebsite;

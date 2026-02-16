import { ReactLenis } from "lenis/react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Shield, Clock, Star, Play, Rocket } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHeroMedia, getParallaxMedia, Media } from "../services/mediaService";

interface SmoothScrollHeroProps {
  heroVideo?: Media | null;
}

export const SmoothScrollHero = ({ heroVideo: propHeroVideo }: SmoothScrollHeroProps) => {
  const [heroMedia, setHeroMedia] = useState<Media | null>(propHeroVideo || null);
  const [parallaxMedia, setParallaxMedia] = useState<Media[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        if (!propHeroVideo) {
          const hero = await getHeroMedia();
          if (hero) setHeroMedia(hero);
        }
        
        const parallax = await getParallaxMedia();
        if (parallax.length > 0) setParallaxMedia(parallax);
      } catch (error) {
        console.log('Media table not yet created. Using fallback media.');
        // Silently fail and use fallback media
      }
    };

    fetchMedia();
  }, [propHeroVideo]);

  return (
    <div className="bg-[#0B1220] dark:bg-[#0B1220]">
      <ReactLenis
        root
        options={{
          lerp: 0.05,
        }}
      >
        <Hero heroMedia={heroMedia} parallaxMedia={parallaxMedia} />
      </ReactLenis>
    </div>
  );
};

const SECTION_HEIGHT = 1500;

interface HeroProps {
  heroMedia: Media | null;
  parallaxMedia: Media[];
}

const Hero = ({ heroMedia, parallaxMedia }: HeroProps) => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage heroMedia={heroMedia} />
      <ParallaxImages parallaxMedia={parallaxMedia} />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-[#0B1220]/0 to-[#0B1220]" />
    </div>
  );
};

interface CenterImageProps {
  heroMedia: Media | null;
}

const CenterImage = ({ heroMedia }: CenterImageProps) => {
  const { scrollY } = useScroll();
  const videoRef = useRef<HTMLVideoElement>(null);

  const clip1 = useTransform(scrollY, [0, 1500], [0, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [100, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const scale = useTransform(scrollY, [0, SECTION_HEIGHT + 500], [1.15, 1]);

  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  const mediaUrl = heroMedia?.media_url || '/assets/images/hero1.mp4';
  const altText = heroMedia?.alt_text || 'Hero background video showcasing skill development';
  const isVideo = heroMedia?.media_type === 'video' || mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm');

  return (
    <motion.div
      className="sticky top-0 h-screen w-full overflow-hidden"
      style={{
        clipPath,
        opacity,
      }}
    >
      {/* Video or Image Background with Animation */}
      {isVideo ? (
        <motion.video
          ref={videoRef}
          loop
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <source src={mediaUrl} type="video/mp4" />
          <img 
            src="/assets/images/view-3d-young-child-watching-movie.jpg" 
            alt={altText}
            className="w-full h-full object-cover"
          />
        </motion.video>
      ) : (
        <motion.img
          src={mediaUrl}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ x: '30%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            duration: 1.8, 
            ease: [0.43, 0.13, 0.23, 0.96],
            opacity: { duration: 1 }
          }}
          style={{ 
            scale,
            transformOrigin: 'center center'
          }}
        />
      )}
      
      {/* Hero Content Overlay - Positioned at bottom to avoid face */}
      <motion.div 
        className="absolute inset-0 flex items-end justify-center pb-32 bg-gradient-to-b from-transparent via-transparent to-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div 
          className="text-center space-y-4 px-4 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
            
            {/* Compact Modern Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            >
              <span className="text-white drop-shadow-lg">
                Anyone can learn skills
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                Only a few build a brand
              </span>
            </motion.h1>

            {/* Compact Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg text-white/90 max-w-xl mx-auto drop-shadow-md"
            >
              Build skills. Prove them. Brand yourself.
            </motion.p>

            {/* Compact Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2"
            >
              <Link to="/careers">
                <motion.button 
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="w-4 h-4" />
                  <span>Explore Careers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-base font-semibold rounded-lg transition-all duration-200 border border-white/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4" />
                  <span>Test Skills</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Compact Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 pt-4 text-xs sm:text-sm"
            >
              <motion.div 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                <Shield className="w-3 h-3 text-cyan-400" />
                <span className="text-white/90">Secure</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-white/90">1000+ Tests</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                <Clock className="w-3 h-3 text-cyan-400" />
                <span className="text-white/90">15 Min</span>
              </motion.div>
            </motion.div>
          </motion.div>
      </motion.div>

      {/* Animated Images on Right Side - Bottom to Top with Fade */}
      <AnimatedRightImages />
    </motion.div>
  );
};

// Animated images component
const AnimatedRightImages = () => {
  const images = [
    '/assets/images/boy-cartoon-character-surrounded-by-technology.jpg',
    '/assets/images/img2.jpeg',
    '/assets/images/img1.jpeg',
    '/assets/images/view-3d-young-child-watching-movie.jpg',
  ];

  return (
    <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none overflow-hidden z-10">
      <div className="relative w-full h-full">
        {images.map((src, index) => {
          // Calculate starting position with proper spacing
          // Each image starts 250% apart from bottom, moving upward
          const startPosition = 150 + (index * 250);
          
          return (
            <motion.div
              key={index}
              className="absolute right-8 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl"
              style={{
                mixBlendMode: 'screen',
                filter: 'brightness(0.9) contrast(1.1)'
              }}
              initial={{ top: `${startPosition}%` }}
              animate={{ 
                top: `-150%`,
                opacity: [0, 0.7, 0.9, 0.7, 0],
                scale: [0.8, 1, 1, 1, 0.8],
                rotate: [-5, 0, 0, 0, 5]
              }}
              transition={{
                duration: 20,
                delay: index * 6,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.15, 0.5, 0.85, 1]
              }}
            >
              <img
                src={src}
                alt={`Animated decoration ${index + 1}`}
                className="w-full h-full object-cover"
                loading="eager"
                style={{ mixBlendMode: 'lighten' }}
              />
              {/* Soft gradient overlay for blending */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" 
                   style={{ mixBlendMode: 'overlay' }} />
              {/* Animated glow for depth */}
              <motion.div 
                className="absolute inset-0 rounded-3xl"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(99, 102, 241, 0.3)',
                    '0 0 50px rgba(168, 85, 247, 0.4)',
                    '0 0 30px rgba(99, 102, 241, 0.3)',
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ mixBlendMode: 'soft-light' }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

interface ParallaxImagesProps {
  parallaxMedia: Media[];
}

const ParallaxImages = ({ parallaxMedia }: ParallaxImagesProps) => {
  const positions = [
    { start: -200, end: 200, className: "w-1/2 rounded-2xl shadow-2xl" },
    { start: 200, end: -250, className: "mx-auto w-2/3 rounded-2xl shadow-2xl" },
    { start: -200, end: 200, className: "ml-auto w-3/5 rounded-2xl shadow-2xl" },
    { start: 0, end: -500, className: "ml-24 w-2/5 rounded-2xl shadow-2xl" },
  ];

  // Career transformation messages
  const careerMessages = [
    {
      title: "Transform your profile into a Professional Brand",
      subtitle: "Join 1,000+ professionals who have built a personal brand that opens doors.",
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      title: "Your Journey to be Becoming Job-Ready",
      subtitle: "Identify skill gaps and become job-ready in weeks",
      gradient: "from-cyan-600 to-blue-600"
    },
    {
      title: "Prove Your Expertise",
      subtitle: "Stand out with verified technical assessments",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      title: "Accelerate Growth",
      subtitle: "Set goals, follow the recommended tasks and track your progress toward becoming job-ready.",
      gradient: "from-green-600 to-emerald-600"
    },
  ];

  // Fallback images if no media from database - using local assets
  const fallbackImages = [
    { src: "/assets/images/business-7836199.jpg", alt: "Business team collaboration and planning" },
    { src: "/assets/images/man-597178.jpg", alt: "Professional developer coding" },
    { src: "/assets/images/pexels-cottonbro-4880411.jpg", alt: "Technical assessment and evaluation" },
    { src: "/assets/images/student-7378904.jpg", alt: "Student learning and skill development" },
  ];

  const mediaToDisplay = parallaxMedia.length > 0 ? parallaxMedia : fallbackImages.map((img) => ({
    media_url: img.src,
    alt_text: img.alt,
    media_type: 'image' as const,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      {mediaToDisplay.slice(0, 4).map((media: Media | { media_url: string; alt_text: string; media_type: 'image' | 'video' }, index: number) => {
        const position = positions[index] || positions[0];
        const message = careerMessages[index] || careerMessages[0];
        return (
          <ParallaxMediaWithText
            key={index}
            src={media.media_url}
            alt={media.alt_text || `Media ${index + 1}`}
            mediaType={media.media_type}
            start={position.start}
            end={position.end}
            className={position.className}
            title={message.title}
            subtitle={message.subtitle}
            gradient={message.gradient}
          />
        );
      })}
    </div>
  );
};

interface ParallaxMediaWithTextProps {
  className: string;
  alt: string;
  src: string;
  mediaType?: 'image' | 'video';
  start: number;
  end: number;
  title: string;
  subtitle: string;
  gradient: string;
}

const ParallaxMediaWithText = ({ 
  className, 
  alt, 
  src, 
  start, 
  end,
  title,
  subtitle,
  gradient
}: ParallaxMediaWithTextProps) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.div
      ref={ref}
      className={`${className} relative overflow-hidden group`}
      style={{ transform, opacity }}
    >
      {/* Always render as image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />

      {/* Text Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
      >
        <div className="text-white space-y-2">
          <motion.h3 
            className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className="text-sm md:text-base text-gray-200"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            {subtitle}
          </motion.p>
        </div>
      </motion.div>

      {/* Always visible badge */}
      <motion.div
        className={`absolute top-4 right-4 px-4 py-2 bg-gradient-to-r ${gradient} rounded-full text-white text-xs md:text-sm font-semibold shadow-lg`}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        viewport={{ once: false, amount: 0.5 }}
      >
        ✨ Career Boost
      </motion.div>
    </motion.div>
  );
};

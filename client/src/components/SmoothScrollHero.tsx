import { ReactLenis } from "lenis/react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { Sparkles, ArrowRight, Shield, Clock, Star, Play, Rocket } from "lucide-react";
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

const SECTION_HEIGHT = 1200;

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

  const clip1 = useTransform(scrollY, [0, 1200], [0, 0]);
  const clip2 = useTransform(scrollY, [0, 1200], [100, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const scale = useTransform(scrollY, [0, SECTION_HEIGHT + 500], [1.15, 1]);

  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  const mediaUrl = heroMedia?.media_url || '/assets/images/206779_small.mp4';
  const altText = heroMedia?.alt_text || 'Professional skill assessment platform';
  const isVideo = heroMedia?.media_type === 'video' || mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm');

  return (
    <motion.div
      className="sticky top-0 h-screen w-full overflow-hidden"
      style={{
        clipPath,
        opacity,
      }}
    >
      {/* Video or Image Background */}
      {isVideo ? (
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale }}
        >
          <source src={mediaUrl} type="video/mp4" />
          <img 
            src="/assets/images/business-7836199.jpg" 
            alt={altText}
            className="w-full h-full object-cover"
          />
        </motion.video>
      ) : (
        <motion.img
          src={mediaUrl}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ scale }}
        />
      )}
      
      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/50 via-black/40 to-black/50">
        <div className="text-center space-y-6 px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm font-medium text-white"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI-Powered Skill Assessment Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Evaluate Skills.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Build Better Teams.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your hiring process with AI-generated assessments. Get instant, detailed insights into candidate skills across HTML, CSS, JavaScript, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link to="/careers">
              <button className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/50">
                <Rocket className="w-5 h-5" />
                <span>Start Free Assessment</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/login">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg font-semibold rounded-xl transition-all duration-200 border border-white/20">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-gray-300"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>1000+ Assessments</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>15 Min Tests</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

interface ParallaxImagesProps {
  parallaxMedia: Media[];
}

const ParallaxImages = ({ parallaxMedia }: ParallaxImagesProps) => {
  const positions = [
    { start: -200, end: 200, className: "w-1/3 rounded-2xl shadow-2xl" },
    { start: 200, end: -250, className: "mx-auto w-2/3 rounded-2xl shadow-2xl" },
    { start: -200, end: 200, className: "ml-auto w-1/3 rounded-2xl shadow-2xl" },
    { start: 0, end: -500, className: "ml-24 w-5/12 rounded-2xl shadow-2xl" },
  ];

  // Career transformation messages
  const careerMessages = [
    {
      title: "Transform Your Career",
      subtitle: "Join 1000+ professionals who leveled up their skills",
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      title: "Land Your Dream Job",
      subtitle: "Get hired faster with AI-powered skill validation",
      gradient: "from-cyan-600 to-blue-600"
    },
    {
      title: "Prove Your Expertise",
      subtitle: "Stand out with verified technical assessments",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      title: "Accelerate Growth",
      subtitle: "Identify skill gaps and become job-ready in weeks",
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

  const mediaToDisplay = parallaxMedia.length > 0 ? parallaxMedia : fallbackImages.map((img, i) => ({
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
  mediaType, 
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

  // Force images only in parallax section - videos not supported here
  const isVideo = false; // Disabled video support for parallax

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

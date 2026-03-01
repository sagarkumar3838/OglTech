import { motion } from "framer-motion";
import { useState } from "react";
import { MoveUpRight, Twitter, Linkedin, Github } from "lucide-react";

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  cardType: "yellow" | "white" | "pink" | "white-alt";
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
};

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isHovered, setIsHovered] = useState(false);

  // Card border colors based on type
  const cardBorder = {
    yellow: "border-yellow-300",
    white: "border-white",
    pink: "border-pink-500",
    "white-alt": "border-white",
  };

  return (
    <div
      className={`relative p-2 transition-all duration-300 transform hover:scale-105 ${
        isHovered ? "z-50" : "z-0"
      }`}
    >
      {/* Lanyard clip */}
      <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 w-8 h-8 dark:bg-white bg-black rounded-full flex items-center justify-center z-10">
        <div className="w-4 h-4 dark:bg-[#212121] bg-white rounded-full"></div>
      </div>

      {/* Lanyard */}
      <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 w-1 h-6 dark:bg-gray-300 bg-black"></div>

      {/* ID Card */}
      <motion.div
        className={`relative w-64 h-96 rounded-xl overflow-hidden shadow-lg border-2 gap-4 ${
          cardBorder[member.cardType]
        }`}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image (Black & White to Color on Hover) */}
        <div className="absolute inset-0">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className={`w-full h-full object-cover filter transition duration-300 ${
                isHovered ? "grayscale-0" : "grayscale"
              }`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900" />
          )}
        </div>

        {/* <div className="absolute bottom-2 left-0 right-0 z-10 text-center">
          <div className="text-xl font-bold text-white drop-shadow-md">
            Logo
          </div>
        </div> */}

        {/* Hover overlay with name and designation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 z-10"
        >
          <div className="text-center">
            <span className="text-2xl font-bold text-white leading-none">
              {member.name}
            </span>
            <p className="text-lg text-white mt-1">{member.role}</p>
            
            {/* Social Media Icons */}
            {member.social && (
              <div className="flex items-center justify-center gap-4 mt-4">
                {member.social.twitter && (
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-500 transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {member.social.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

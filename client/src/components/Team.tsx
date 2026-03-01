import { motion } from "framer-motion";
import TeamMemberCard, { type TeamMember } from "./TeamMemberCard";

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "James",
    role: "Founder",
    image:
      "https://res.cloudinary.com/harshitproject/image/upload/v1746774430/member-four.png",
    cardType: "white",
    social: {
      twitter: "https://twitter.com/harshitlog",
      linkedin: "https://linkedin.com/in/harshitlog",
      github: "https://github.com/harshitlog",
    },
  },
  {
    id: 2,
    name: "Charlotte",
    role: "Design Engineer",
    image:
      "https://res.cloudinary.com/harshitproject/image/upload/v1746774430/member-five.png",
    cardType: "white",
    social: {
      twitter: "https://twitter.com/harshitlog",
      linkedin: "https://linkedin.com/in/harshitlog",
      github: "https://github.com/harshitlog",
    },
  },
  {
    id: 3,
    name: "Alexander",
    role: "Social Media Manager",
    image:
      "https://res.cloudinary.com/harshitproject/image/upload/v1746774430/member-one.png",
    cardType: "white",
    social: {
      twitter: "https://twitter.com/harshitlog",
      linkedin: "https://linkedin.com/in/harshitlog",
      github: "https://github.com/harshitlog",
    },
  },
  {
    id: 4,
    name: "Olivia",
    role: "Product Manager",
    image:
      "https://res.cloudinary.com/harshitproject/image/upload/v1746774430/member-three.png",
    cardType: "white",
    social: {
      twitter: "https://twitter.com/harshitlog",
      linkedin: "https://linkedin.com/in/harshitlog",
      github: "https://github.com/harshitlog",
    },
  },
];

export default function Team() {
  return (
    <section className="py-16 flex flex-col items-center justify-center px-9 bg-white dark:bg-[#0B1220]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4"
      >
        <h2 className="text-4xl font-bold dark:text-white text-black text-center mb-12">
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 justify-items-center">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

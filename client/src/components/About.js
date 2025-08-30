import React from 'react';
import { FaLinkedin, FaEnvelope, FaGithub, FaReact, FaNodeJs, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { SiMongodb, SiExpress, SiJavascript, SiTailwindcss, SiFirebase } from "react-icons/si";
import { useTranslation } from 'react-i18next';

// ✅ Footer Tech Stack
const FooterTechStack = () => {
  const { t } = useTranslation();
  const techs = [
    { name: "React", icon: <FaReact className="text-sky-400" size={36} />, link: "https://react.dev/" },
    { name: "Node.js", icon: <FaNodeJs className="text-green-600" size={36} />, link: "https://nodejs.org/" },
    { name: "Express", icon: <SiExpress className="text-gray-300" size={36} />, link: "https://expressjs.com/" },
    { name: "JavaScript", icon: <SiJavascript className="text-yellow-400" size={36} />, link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "Tailwind", icon: <SiTailwindcss className="text-sky-400" size={36} />, link: "https://tailwindcss.com/" },
    { name: "HTML5", icon: <FaHtml5 className="text-orange-600" size={36} />, link: "https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5" },
    { name: "CSS3", icon: <FaCss3Alt className="text-blue-500" size={36} />, link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black py-12  mt-16 rounded-t-2xl shadow-inner justify-items-center overflow-x-visible">
      <h2 className="text-center text-gray-200 text-2xl font-bold mb-10 tracking-wide">
        {t('tech_stack_used')}
      </h2>
      <div className="flex gap-4 justify-items-center px-2">
        {techs.map((tech, i) => (
          <a
            key={i}
            href={tech.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 transform transition duration-300 hover:scale-110 hover:drop-shadow-lg bg-gray-800/40 px-6 py-4 rounded-xl backdrop-blur-md border border-gray-700/40"
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            {tech.icon}
            <span className="text-gray-300 font-medium text-sm">{tech.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

// ✅ About Section
const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent drop-shadow-lg mb-6">
          {t('about_this_app')}
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed mb-10">
          {t('about_description_part1')} <span className="text-pink-400 font-semibold">{t('ai_powered_video_interview_bot')}</span> {t('about_description_part2')}
          {t('about_description_part3')} <span className="text-yellow-300 font-semibold">{t('ai')}</span> {t('about_description_part4')}
          <span className="text-green-400 font-semibold">{t('comprehensive_reports')}</span>. 
          {t('about_description_part5')} <span className="text-purple-400 font-semibold">{t('efficient')}</span>, 
          <span className="text-blue-400 font-semibold">{t('objective')}</span>, {t('and')}
          <span className="text-pink-400 font-semibold">{t('scalable')}</span>.
          {t('about_description_part6')}
        </p>

        {/* Social Links */}
        <div className="flex justify-center space-x-8">
          <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener noreferrer"
             className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition-all duration-300 shadow-md">
            <FaLinkedin size={28} />
          </a>
          <a href="mailto:sandeepgkp@example.com"
             className="p-3 rounded-full bg-gray-800 hover:bg-red-600 transition-all duration-300 shadow-md">
            <FaEnvelope size={28} />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer"
             className="p-3 rounded-full bg-gray-800 hover:bg-gray-600 transition-all duration-300 shadow-md">
            <FaGithub size={28} />
          </a>
        </div>

        <FooterTechStack />
      </div>
    </div>
  );
};

export default About;

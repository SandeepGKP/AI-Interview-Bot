import React, { useState, useEffect } from 'react';

const TypewriterEffect = ({ text, typingDelay = 100, deletingDelay = 100, pauseDelay = 2000 ,cursorRenderer}) => {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer;

    if (!isDeleting && charIndex < text.length) {
      // Typing phase
      timer = setTimeout(() => {
        setCurrentText(text.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, typingDelay);
    } else if (!isDeleting && charIndex === text.length) {
      // Pause after typing, then start deleting
      timer = setTimeout(() => setIsDeleting(true), pauseDelay);
    } else if (isDeleting && charIndex > 0) {
      // Deleting phase
      timer = setTimeout(() => {
        setCurrentText(text.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, deletingDelay);
    } else if (isDeleting && charIndex === 0) {
      // Pause after deleting, then start typing again
      timer = setTimeout(() => setIsDeleting(false), pauseDelay);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, text, typingDelay, deletingDelay, pauseDelay]);

  return (
    <span>
      {currentText}
      {cursorRenderer && cursorRenderer()}
    </span>
  );
};

export default TypewriterEffect;

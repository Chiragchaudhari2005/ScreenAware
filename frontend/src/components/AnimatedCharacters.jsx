import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

// Custom hook to calculate and update pupil position reactively
const usePupilPosition = (mouseX, mouseY, eyeRef, pupilRadius) => {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // This function will be called whenever the mouse position changes.
    const updatePupilPosition = () => {
      if (!eyeRef.current) return;
      
      const eyeElement = eyeRef.current;
      const eyeRect = eyeElement.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;
      
      const mouseXVal = mouseX.get();
      const mouseYVal = mouseY.get();

      const angle = Math.atan2(mouseYVal - eyeCenterY, mouseXVal - eyeCenterX);
      // This is the max distance the pupil's center can be from the eye's center
      const maxDistance = (eyeRect.width / 2) - pupilRadius;
      const distance = Math.min(maxDistance, Math.sqrt(Math.pow(mouseXVal - eyeCenterX, 2) + Math.pow(mouseYVal - eyeCenterY, 2)));

      // Calculate the pupil's position relative to its eye
      const pupilRelX = Math.cos(angle) * distance;
      const pupilRelY = Math.sin(angle) * distance;

      setPupilPos({ x: pupilRelX, y: pupilRelY });
    };

    // Subscribe to changes in mouseX and mouseY motion values
    const unsubscribeX = mouseX.onChange(updatePupilPosition);
    const unsubscribeY = mouseY.onChange(updatePupilPosition);

    // Unsubscribe on cleanup to prevent memory leaks
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, eyeRef, pupilRadius]);

  return pupilPos;
};

// Character Components with updated SVGs and animations

const OrangeCharacter = ({ isPasswordFocused, mouseX, mouseY }) => {
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
 
  // Use our custom hook to get reactive pupil positions
  const leftPupilPos = usePupilPosition(mouseX, mouseY, leftEyeRef, 2);
  const rightPupilPos = usePupilPosition(mouseX, mouseY, rightEyeRef, 2);

  return (
    <div className="character orange">
      <svg width="258" height="155" viewBox="0 0 258 155" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M258 155H0C0 69.3959 57.7126 0 129 0C200.287 0 258 69.3959 258 155Z" fill="#FF8C00"/>
        
        {/* Left Eye */}
        <motion.circle
          ref={leftEyeRef}
          cx="85"
          cy="85"
          fill="black"
          initial={{ r: 8 }} // The starting radius
          animate={{ r: isPasswordFocused ? 4 : 8 }} // Shrinks to 4px, returns to 8px
          transition={springTransition}
        />
        <motion.circle
          cx={85 + leftPupilPos.x}
          cy={85 + leftPupilPos.y}
          r="4" fill="white"
          initial={{ opacity: 1 }}
          animate={{ opacity: isPasswordFocused ? 0 : 1 }}
          transition={springTransition}
        />
        
        {/* Right Eye */}
        <motion.circle
          ref={rightEyeRef}
          cx="173"
          cy="85"
          fill="black"
          initial={{ r: 8 }} // The starting radius
          animate={{ r: isPasswordFocused ? 4 : 8 }} // Shrinks to 4px, returns to 8px
          transition={springTransition}
        />
        <motion.circle
          cx={173 + rightPupilPos.x}
          cy={85 + rightPupilPos.y}
          r="4" fill="white"
          initial={{ opacity: 1 }}
          animate={{ opacity: isPasswordFocused ? 0 : 1 }}
          transition={springTransition}
        />
        
        {/* Smile */}
        <path d="M100 110 C110 120 148 120 158 110" stroke="black" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};


const PurpleCharacter = ({ isPasswordFocused, mouseX, mouseY }) => {
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  // Use our custom hook to get reactive pupil positions
  const leftPupilPos = usePupilPosition(mouseX, mouseY, leftEyeRef, 1.5);
  const rightPupilPos = usePupilPosition(mouseX, mouseY, rightEyeRef, 1.5);

  return (
    <div className="character purple">
       <svg width="120" height="300" viewBox="0 0 120 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="300" fill="#8A2BE2"/>

        {/* UPDATED: Left eye with pupil */}
        <motion.circle
          ref={leftEyeRef}
          cx="46"
          cy="36"
          r="6"
          fill="black"
          animate={{ scale: isPasswordFocused ? 0.2 : 1 }}
          transition={springTransition}
        />
        <motion.circle
          cx={46 + leftPupilPos.x}
          cy={36 + leftPupilPos.y}
          r="2"
          fill="white"
          initial={{ opacity: 1 }}
          animate={{ opacity: isPasswordFocused ? 0 : 1 }}
          transition={springTransition}
        />

        {/* UPDATED: Right eye with pupil */}
        <motion.circle
          ref={rightEyeRef}
          cx="76"
          cy="36"
          r="6"
          fill="black"
          animate={{ scale: isPasswordFocused ? 0.2 : 1 }}
          transition={springTransition}
        />
        <motion.circle
          cx={76 + rightPupilPos.x}
          cy={36 + rightPupilPos.y}
          r="2"
          fill="white"
          initial={{ opacity: 1 }}
          animate={{ opacity: isPasswordFocused ? 0 : 1 }}
          transition={springTransition}
        />

        {/* Smile below eyes */}
        <path d="M50 65 C55 70 75 70 80 65" stroke="black" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const BlackCharacter = ({ isPasswordFocused, mouseX, mouseY }) => {
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  const leftPupilPos = usePupilPosition(mouseX, mouseY, leftEyeRef, 3);
  const rightPupilPos = usePupilPosition(mouseX, mouseY, rightEyeRef, 3);

  return (
    <div className="character black">
      <svg width="150" height="300" viewBox="0 0 150 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="300" fill="#1E1E1E"/>
        {/* Left Eye */}
        <motion.circle ref={leftEyeRef} cx="70" cy="80" r="10" fill="white" animate={{ scale: isPasswordFocused ? 0.2 : 1 }} transition={springTransition} />
        <motion.circle
          cx={70 + leftPupilPos.x}
          cy={80 + leftPupilPos.y}
          r="4" fill="black"
          initial={{ opacity: 1 }}
          animate={{ opacity: isPasswordFocused ? 0 : 1 }}
          transition={springTransition}
        />
        {/* Right Eye */}
        <motion.circle ref={rightEyeRef} cx="110" cy="80" r="10" fill="white" animate={{ scale: isPasswordFocused ? 0.2 : 1 }} transition={springTransition} />
        <motion.circle
          cx={110 + rightPupilPos.x}
          cy={80 + rightPupilPos.y}
          r="4" fill="black"
          initial={{ opacity: 1 }}
          animate={{ opacity: isPasswordFocused ? 0 : 1 }}
          transition={springTransition}
        />
        {/* Smile */}
        <path d="M85 105 C90 110 105 110 110 105" stroke="white" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const YellowCharacter = ({ isPasswordFocused, mouseX, mouseY }) => {
  const eyeRef = useRef(null);
  const pupilPos = usePupilPosition(mouseX, mouseY, eyeRef, 3);

  return (
    <div className="character yellow">
      <svg width="100" height="250" viewBox="0 0 100 250" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 250H0V125C0 55.9644 44.7715 0 100 0V250Z" fill="#FFD700"/>
        {/* Eye */}
        <motion.circle ref={eyeRef} cx="50" cy="70" r="10" fill="black" animate={{ scale: isPasswordFocused ? 0.2 : 1 }} transition={springTransition} />
        <motion.circle
          cx={50 + pupilPos.x}
          cy={70 + pupilPos.y}
          r="4" fill="white"
          initial={{ opacity: 1 }}
          animate={{ opacity: isPasswordFocused ? 0 : 1 }}
          transition={springTransition}
        />
        {/* Half-smile, with more distance from eye */}
        <path d="M65 105 C80 110 105 110 105 105" stroke="black" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};


const AnimatedCharacters = ({ isPasswordFocused }) => {
  // Create motion values to hold the current mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Effect to listen to the window's mousemove event
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="characters-wrapper">
      <OrangeCharacter isPasswordFocused={isPasswordFocused} mouseX={mouseX} mouseY={mouseY} />
      <PurpleCharacter isPasswordFocused={isPasswordFocused} mouseX={mouseX} mouseY={mouseY} />
      <YellowCharacter isPasswordFocused={isPasswordFocused} mouseX={mouseX} mouseY={mouseY} />
      <BlackCharacter isPasswordFocused={isPasswordFocused} mouseX={mouseX} mouseY={mouseY} />
    </div>
  );
};

export default AnimatedCharacters;
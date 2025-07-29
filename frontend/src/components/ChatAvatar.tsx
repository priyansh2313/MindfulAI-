import Lottie from "lottie-react";
import React from "react";
// Import your Lottie JSON files
import happyAnimation from "../assets/lottie/happy.json";
import sadAnimation from "../assets/lottie/sad.json";
import idleAnimation from "../assets/lottie/talking.json";
import typingAnimation from "../assets/lottie/typing.json";

interface ChatAvatarProps {
  status: "idle" | "typing" | "happy" | "sad";
  size?: number;
}

const animationMap = {
  idle: idleAnimation,
  typing: typingAnimation,
  happy: happyAnimation,
  sad: sadAnimation,
};

const ChatAvatar: React.FC<ChatAvatarProps> = ({ status, size = 80 }) => {
  const animationData = animationMap[status] || idleAnimation;
  return (
    <div style={{ width: size, height: size, margin: "0 auto" }}>
      <Lottie
        autoplay
        loop
        animationData={animationData}
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default ChatAvatar; 
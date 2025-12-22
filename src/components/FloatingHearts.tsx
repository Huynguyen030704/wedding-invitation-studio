import { Heart } from 'lucide-react';

const FloatingHearts = () => {
  const hearts = [
    { size: 24, top: '10%', left: '5%', delay: '0s' },
    { size: 16, top: '20%', right: '8%', delay: '1s' },
    { size: 20, top: '60%', left: '3%', delay: '2s' },
    { size: 18, top: '75%', right: '5%', delay: '0.5s' },
    { size: 14, top: '40%', left: '8%', delay: '1.5s' },
    { size: 22, top: '85%', left: '10%', delay: '2.5s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {hearts.map((heart, index) => (
        <div
          key={index}
          className="absolute animate-float-slow"
          style={{
            top: heart.top,
            left: heart.left,
            right: heart.right,
            animationDelay: heart.delay,
          }}
        >
          <Heart
            size={heart.size}
            className="text-rose/40 fill-rose/20"
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;

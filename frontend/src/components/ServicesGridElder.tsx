import { Activity, Book, Brain, ClipboardCheck, Image, MessageSquareHeart, Moon, Music, Users } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  { title: 'Evaluation Test', desc: 'Take an assessment', icon: <ClipboardCheck size={48} />, path: '/evaluation', tooltip: 'Start a quick mental health checkup.' },
  { title: 'Journal', desc: 'Record your thoughts', icon: <Book size={48} />, path: '/journal', tooltip: 'Write and reflect on your feelings.' },
  { title: 'Community Chat', desc: 'Connect with others', icon: <Users size={48} />, path: '/community', tooltip: 'Join the community and share your journey.' },
  { title: 'Peaceful Music', desc: 'Listen to calming sounds', icon: <Music size={48} />, path: '/music', tooltip: 'Relax with soothing music.' },
  { title: 'Mindful Assistant', desc: 'Get AI support', icon: <MessageSquareHeart size={48} />, path: '/assistant', tooltip: 'Ask the AI assistant for help.' },
  { title: 'Encyclopedia', desc: 'Learn about mental health', icon: <Brain size={48} />, path: '/encyclopedia', tooltip: 'Read about mental health topics.' },
  { title: 'Daily Activities', desc: 'Mindfulness exercises', icon: <Activity size={48} />, path: '/daily-activities', tooltip: 'Try daily mindfulness activities.' },
  { title: 'Image Analyzer', desc: 'Analyze your images', icon: <Image size={48} />, path: '/image-analyzer', tooltip: 'Discover emotions in your images.' },
  { title: 'Sleep Cycle Analysis', desc: 'Better sleep insights', icon: <Moon size={48} />, path: '/sleep-cycle', tooltip: 'Get insights into your sleep patterns.' },
];

function Ripple({ x, y, show }: { x: number; y: number; show: boolean }) {
  return show ? (
    <span
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 120,
        height: 120,
        marginLeft: -60,
        marginTop: -60,
        background: 'rgba(59,130,246,0.25)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'ripple 0.6s linear',
        zIndex: 1,
      }}
    />
  ) : null;
}

export default function ServicesGridElder() {
  const navigate = useNavigate();
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);
  const [ripple, setRipple] = useState<{ idx: number; x: number; y: number; show: boolean }>({ idx: -1, x: 0, y: 0, show: false });
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Ripple animation cleanup
  React.useEffect(() => {
    if (ripple.show) {
      const timeout = setTimeout(() => setRipple(r => ({ ...r, show: false })), 600);
      return () => clearTimeout(timeout);
    }
  }, [ripple]);

  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-black mb-2 text-center">Our Features</h2>
      <div className="text-xl text-gray-800 mb-6 text-center">Explore what Mindful AI offers</div>
      <div className="w-full h-1 bg-gray-800 rounded mb-8" />
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {services.map((s, idx) => (
          <div key={s.title} className="relative">
            <button
              ref={el => (cardRefs.current[idx] = el)}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setRipple({ idx, x, y, show: false });
                setTimeout(() => setRipple({ idx, x, y, show: true }), 10);
                setTimeout(() => navigate(s.path), 200); // slight delay for ripple
              }}
              onMouseEnter={() => setTooltipIdx(idx)}
              onFocus={() => setTooltipIdx(idx)}
              onMouseLeave={() => setTooltipIdx(null)}
              onBlur={() => setTooltipIdx(null)}
              className="
                flex flex-col items-center justify-center
                bg-white text-black border-4 border-gray-800 rounded-2xl
                py-10 px-8 shadow-xl text-2xl font-bold
                hover:bg-blue-50 hover:scale-105 hover:shadow-2xl
                focus:outline-none focus:ring-4 focus:ring-blue-400
                transition-all duration-200
                active:bg-blue-100
                cursor-pointer
                min-h-[220px]
                relative
                overflow-hidden
              "
              aria-label={s.title}
              tabIndex={0}
            >
              <Ripple x={ripple.idx === idx ? ripple.x : 0} y={ripple.idx === idx ? ripple.y : 0} show={ripple.idx === idx && ripple.show} />
              <div className="mb-4 z-10">{s.icon}</div>
              <span className="mb-2 text-2xl font-bold z-10">{s.title}</span>
              <span className="text-lg font-normal text-gray-700 z-10">{s.desc}</span>
            </button>
            {/* Tooltip */}
            {tooltipIdx === idx && (
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-4 z-20 bg-black text-white text-base rounded-lg px-4 py-2 shadow-lg pointer-events-none"
                style={{ whiteSpace: 'nowrap', transform: 'translate(-50%, -110%)' }}
                role="tooltip"
              >
                {s.tooltip}
              </div>
            )}
          </div>
        ))}
      </section>
      {/* Ripple animation keyframes */}
      <style>{`
        @keyframes ripple {
          0% { opacity: 0.5; transform: scale(0.2); }
          80% { opacity: 0.3; }
          100% { opacity: 0; transform: scale(2.5); }
        }
      `}</style>
    </div>
  );
} 
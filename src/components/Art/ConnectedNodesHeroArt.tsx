import * as React from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

/**
 * ConnectedNodesHeroArt
 * -----------------------------------------------------
 * SVG animado de nodos conectados (conexiones que laten y se iluminan)
 * pensado para ocupar la columna derecha del hero. Ligero, responsive
 * y con accesibilidad (respeta prefers-reduced-motion).
 *
 * Uso:
 * <ConnectedNodesHeroArt className="h-[420px] w-full" accent="#0370FF" />
 */

export type ConnectedNodesHeroArtProps = {
  className?: string;
  accent?: string; // color principal de acento (hex o css var)
  background?: string; // color base del fondo SVG
  density?: 8 | 12 | 16; // cuántos nodos (aprox)
};

const DEFAULTS = {
  accent: '#0370FF',
  background: 'transparent',
  density: 12 as const,
};

// Utilidad simple para generar posiciones reproducibles
function seededRandom(seed: number) {
  let t = seed % 2147483647;
  return () => (t = (t * 48271) % 2147483647) / 2147483647;
}

export default function ConnectedNodesHeroArt({
  className,
  accent = DEFAULTS.accent,
  background = DEFAULTS.background,
  density = DEFAULTS.density,
}: ConnectedNodesHeroArtProps) {
  const prefersReduced = usePrefersReducedMotion();
  const controls = useAnimation();
  const [hovered, setHovered] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const seed = 12345; // fijo para reproducibilidad; puedes randomizar si quieres
  const rand = React.useMemo(() => seededRandom(seed), []);

  // Genera nodos dentro de un grid suave para balance visual
  const nodes = React.useMemo(() => {
    const cols = 4;
    const rows = Math.ceil(density / cols);
    const out: { id: number; x: number; y: number; r: number }[] = [];
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols && i < density; c++, i++) {
        const gx = (c + 0.5) / cols; // centro de celda
        const gy = (r + 0.5) / rows;
        // jitter sutil
        const jx = (rand() - 0.5) * 0.18;
        const jy = (rand() - 0.5) * 0.18;
        out.push({ id: i, x: gx + jx, y: gy + jy, r: 5 + rand() * 10 });
      }
    }
    return out;
  }, [density, rand]);

  // Crea aristas conectando cada nodo con sus vecinos más cercanos
  const edges = React.useMemo(() => {
    const arr: { id: string; a: number; b: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      // conecta con 2 vecinos más cercanos
      const dists = nodes
        .map((n, j) => ({ j, d: dist(nodes[i], n) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const k of dists) {
        const id = `${Math.min(i, k.j)}-${Math.max(i, k.j)}`;
        if (!arr.find((e) => e.id === id)) arr.push({ id, a: i, b: k.j });
      }
    }
    return arr;
  }, [nodes]);

  // Parallax sutil con el mouse
  const parX = useTransform(mouseX, (v) => (hovered ? (v - 0.5) * 10 : 0));
  const parY = useTransform(mouseY, (v) => (hovered ? (v - 0.5) * 10 : 0));

  React.useEffect(() => {
    if (prefersReduced) return;
    controls.start({
      opacity: [0.85, 1, 0.85],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
    });
  }, [controls, prefersReduced]);

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.svg
      ref={svgRef}
      className={className}
      role="img"
      aria-label="Visual de conexiones entre founders e inversionistas"
      viewBox="0 0 800 520"
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background }}
    >
      {/* Defs: gradientes y glow */}
      <defs>
        <radialGradient id="g-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <filter id="f-soft">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feBlend in="SourceGraphic" in2="b" mode="screen" />
        </filter>
      </defs>

      {/* Background sutil con blobs */}
      <motion.circle cx={120} cy={120} r={160} fill="url(#g-glow)" style={{ x: parX, y: parY }} />
      <motion.circle cx={700} cy={440} r={220} fill="url(#g-glow)" style={{ x: parX, y: parY }} />

      {/* Aristas */}
      <g>
        {edges.map((e, idx) => {
          const a = nodes[e.a];
          const b = nodes[e.b];
          const x1 = a.x * 800;
          const y1 = a.y * 520;
          const x2 = b.x * 800;
          const y2 = b.y * 520;
          const len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <motion.line
              key={e.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={accent}
              strokeWidth={1.4}
              strokeOpacity={0.35}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={
                prefersReduced
                  ? { pathLength: 1 }
                  : { pathLength: [0, 1], transition: { duration: 1.4, delay: idx * 0.05 } }
              }
              style={{ filter: 'url(#f-soft)' }}
              strokeDasharray={len}
              //strokeDashoffset={prefersReduced ? 0 : [len, 0, len]}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          );
        })}
      </g>

      {/* Nodos */}
      <g>
        {nodes.map((n) => (
          <motion.g key={n.id} animate={controls}>
            <circle cx={n.x * 800} cy={n.y * 520} r={n.r} fill={accent} opacity={0.18} />
            <motion.circle
              cx={n.x * 800}
              cy={n.y * 520}
              r={n.r * 0.35}
              fill={accent}
              initial={false}
              animate={prefersReduced ? { scale: 1 } : { scale: [1, 1.25, 1] }}
              transition={{ duration: 2.2 + (n.id % 5) * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'url(#f-soft)' }}
            />
          </motion.g>
        ))}
      </g>

      {/* Etiquetas sutiles (opcional, se podrían hacer props) */}
      <Label x={120} y={80} text="AI Match" accent={accent} />
      <Label x={650} y={120} text="Investors" accent={accent} />
      <Label x={520} y={420} text="Founders" accent={accent} />
    </motion.svg>
  );
}

function Label({ x, y, text, accent }: { x: number; y: number; text: string; accent: string }) {
  return (
    <g aria-hidden="true">
      <rect
        x={x - 10}
        y={y - 22}
        rx={12}
        ry={12}
        width={110}
        height={32}
        fill="rgba(255,255,255,0.06)"
      />
      <circle cx={x + 8} cy={y - 6} r={4} fill={accent} />
      <text
        x={x + 20}
        y={y - 3}
        fontSize={14}
        fill="rgba(255,255,255,0.9)"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
      >
        {text}
      </text>
    </g>
  );
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefers(media.matches);
    onChange();
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);
  return prefers;
}

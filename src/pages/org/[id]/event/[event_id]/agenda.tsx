import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  alpha,
  useTheme,
  Divider,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import { ProtectedLayout } from '@/components/Dashboard/DashboardLayout';

// ============
// Agenda Admin (Agora)
// Interactivo, visual, minimalista y artístico
// - Vista calendario por día o rango de días
// - Click para crear bloque (modal)
// - Drag & drop para mover bloques
// - Eliminar bloques
// Sin dependencias externas (usa MUI + eventos pointer)
// ============

// time helpers
const HOURS = Array.from({ length: 16 }).map((_, i) => 7 + i); // 07:00 - 22:00
const STEP_MIN = 15; // granularidad de 15 minutos
const STEP_PX = 12; // alto por step en px
const HOUR_PX = (60 / STEP_MIN) * STEP_PX; // altura de una hora

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const pad = (v: number) => (v < 10 ? `0${v}` : `${v}`);
  return `${pad(h)}:${pad(m)}`;
}

function* dateRange(start: Date, end: Date) {
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (d <= last) {
    yield new Date(d);
    d.setDate(d.getDate() + 1);
  }
}

type Block = {
  id: string;
  title: string;
  dayISO: string; // yyyy-mm-dd
  startMin: number; // minutos desde 00:00
  endMin: number; // minutos desde 00:00
  color: string; // css color
};

const COLORS = [
  '#7C3AED', // violeta
  '#06B6D4', // cian
  '#22C55E', // verde
  '#F59E0B', // ámbar
  '#EF4444', // rojo
  '#3B82F6', // azul
];

const initialBlocks: Block[] = [
  {
    id: 'b1',
    title: 'Registro & Bienvenida',
    dayISO: new Date().toISOString().slice(0, 10),
    startMin: 9 * 60,
    endMin: 10 * 60,
    color: COLORS[0],
  },
  {
    id: 'b2',
    title: 'Keynote: El futuro del funding',
    dayISO: new Date().toISOString().slice(0, 10),
    startMin: 11 * 60 + 30,
    endMin: 12 * 60 + 30,
    color: COLORS[3],
  },
];

export default function EventAgendaAdmin() {
  const theme = useTheme();
  const [startDate, setStartDate] = React.useState(() => new Date());
  const [endDate, setEndDate] = React.useState(() => new Date());
  const [blocks, setBlocks] = React.useState<Block[]>(initialBlocks);

  // modal state
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Block | null>(null);

  // drag state
  const [dragId, setDragId] = React.useState<string | null>(null);
  const gridRef = React.useRef<HTMLDivElement | null>(null);

  const days = React.useMemo(() => {
    const list = Array.from(dateRange(startDate, endDate));
    return list.map((d) => ({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    }));
  }, [startDate, endDate]);

  const openCreateAt = (dayISO: string, yPx: number) => {
    const minuteFromTop = Math.round(yPx / STEP_PX) * STEP_MIN + HOURS[0] * 60;
    const startMin = clamp(minuteFromTop, HOURS[0] * 60, HOURS[HOURS.length - 1] * 60);
    const endMin = clamp(startMin + 60, HOURS[0] * 60 + STEP_MIN, HOURS[HOURS.length - 1] * 60);
    setDraft({
      id: `new-${Date.now()}`,
      title: '',
      dayISO,
      startMin,
      endMin,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
    setOpen(true);
  };

  const saveDraft = () => {
    if (!draft) return;
    setBlocks((prev) => {
      const others = prev.filter((b) => b.id !== draft.id);
      return [...others, draft].sort((a, b) =>
        (a.dayISO + a.startMin).localeCompare(b.dayISO + b.startMin),
      );
    });
    setOpen(false);
    setDraft(null);
  };

  const deleteBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));

  const onGridClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // dentro del grid
    const y = e.clientY - rect.top;

    const columnWidth = rect.width / days.length;
    const dayIdx = Math.floor(x / columnWidth);
    const dayISO = days[clamp(dayIdx, 0, days.length - 1)].iso;

    // y relativo dentro de la columna excluyendo el header de horas (primera fila)
    // grid tiene un header de 40px aprox (definido abajo). Ajusta si cambias estilos.
    const yInside = y - 40; // header alto
    if (yInside < 0) return;

    openCreateAt(dayISO, yInside);
  };

  // drag handlers
  const onPointerDown = (e: React.PointerEvent, id: string) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragId(id);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragId || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top - 40; // quitar header
    if (y < 0) return;

    const columnWidth = rect.width / days.length;
    const dayIdx = clamp(Math.floor(x / columnWidth), 0, days.length - 1);
    const dayISO = days[dayIdx].iso;

    const minuteFromTop = Math.round(y / STEP_PX) * STEP_MIN + HOURS[0] * 60;

    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === dragId);
      if (idx === -1) return prev;
      const b = prev[idx];
      const duration = b.endMin - b.startMin;
      const startMin = clamp(minuteFromTop, HOURS[0] * 60, HOURS[HOURS.length - 1] * 60 - duration);
      const endMin = startMin + duration;
      const next = [...prev];
      next[idx] = { ...b, dayISO, startMin, endMin };
      return next;
    });
  };

  const onPointerUp = () => {
    if (!dragId) return;
    setDragId(null);
  };

  // styles
  const bg = `radial-gradient(1200px 600px at 10% -10%, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 60%),
              radial-gradient(1200px 600px at 110% 10%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 60%)`;

  return (
    <ProtectedLayout title={'Event agenda'}>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={900}>
              Agenda del evento
            </Typography>
            <Typography color="text.secondary">
              Administra los segmentos como si fueran piezas de una obra: precisos, memorables y
              hermosos.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
            <TextField
              label="Inicio"
              type="date"
              value={startDate.toISOString().slice(0, 10)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              size="small"
            />
            <TextField
              label="Fin"
              type="date"
              value={endDate.toISOString().slice(0, 10)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => openCreateAt(days[0]?.iso ?? new Date().toISOString().slice(0, 10), 0)}
            >
              Nuevo
            </Button>
          </Stack>
        </Stack>

        {/* Canvas calendario */}
        <Box
          ref={gridRef}
          onClick={onGridClick}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          sx={{
            position: 'relative',
            overflow: 'auto',
            borderRadius: 3,
            background: bg,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          }}
        >
          {/* grid wrapper */}
          <Box sx={{ display: 'grid', gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
            {/* header row */}
            <Box
              sx={{ height: 40, borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}` }}
            />
            {days.map((d) => (
              <Box
                key={d.iso}
                sx={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip size="small" label={'Sat, Nov 1'} />
                </Stack>
              </Box>
            ))}

            {/* time rows */}
            {HOURS.map((h, i) => (
              <React.Fragment key={h}>
                {/* time label */}
                <Box
                  sx={{
                    height: HOUR_PX,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    pr: 1,
                    borderTop:
                      i === 0 ? 'none' : `1px dashed ${alpha(theme.palette.text.primary, 0.08)}`,
                    color: 'text.secondary',
                    fontSize: 12,
                  }}
                >
                  {`${h}:00`}
                </Box>
                {/* day columns */}
                {days.map((d) => (
                  <Box
                    key={`${d.iso}-${h}`}
                    sx={{
                      height: HOUR_PX,
                      position: 'relative',
                      borderTop:
                        i === 0 ? 'none' : `1px dashed ${alpha(theme.palette.text.primary, 0.08)}`,
                      borderLeft: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.03) },
                    }}
                  />
                ))}
              </React.Fragment>
            ))}
          </Box>

          {/* blocks layer */}
          <Box sx={{ position: 'absolute', inset: 40 + 'px 0 0 80px', pointerEvents: 'none' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
              {days.map((d) => (
                <Box key={d.iso} sx={{ position: 'relative', minHeight: HOURS.length * HOUR_PX }}>
                  {blocks
                    .filter((b) => b.dayISO === d.iso)
                    .map((b) => {
                      const top = (b.startMin - HOURS[0] * 60) * (STEP_PX / STEP_MIN);
                      const height = (b.endMin - b.startMin) * (STEP_PX / STEP_MIN);
                      return (
                        <Box
                          key={b.id}
                          onPointerDown={(e) => onPointerDown(e, b.id)}
                          sx={{
                            position: 'absolute',
                            left: 8,
                            right: 8,
                            top,
                            height,
                            borderRadius: 2,
                            boxShadow: `0 8px 24px ${alpha(b.color, 0.25)}`,
                            background: `linear-gradient(135deg, ${alpha(b.color, 0.9)}, ${alpha('#000', 0.15)})`,
                            backdropFilter: 'blur(4px)',
                            color: '#fff',
                            p: 1,
                            cursor: 'grab',
                            pointerEvents: 'auto',
                            userSelect: 'none',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <DragIndicatorRoundedIcon sx={{ fontSize: 16, opacity: 0.85 }} />
                            <Typography variant="body2" fontWeight={800} sx={{ flex: 1 }}>
                              {b.title || 'Sin título'}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => deleteBlock(b.id)}
                              sx={{ color: '#fff' }}
                            >
                              <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                          <Typography variant="caption" sx={{ opacity: 0.85 }}>
                            {formatTime(b.startMin)} – {formatTime(b.endMin)}
                          </Typography>
                        </Box>
                      );
                    })}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Modal crear/editar */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>
            {draft?.id?.startsWith('new-') ? 'Nuevo bloque' : 'Editar bloque'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Título"
                value={draft?.title ?? ''}
                onChange={(e) => setDraft((d) => (d ? { ...d, title: e.target.value } : d))}
                fullWidth
                placeholder="Ej. Taller de Pitch, Networking, Coffee Break"
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Día"
                  type="date"
                  value={draft?.dayISO ?? ''}
                  onChange={(e) => setDraft((d) => (d ? { ...d, dayISO: e.target.value } : d))}
                  fullWidth
                />
                <TextField
                  select
                  label="Inicio"
                  value={draft?.startMin ?? 9 * 60}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, startMin: Number(e.target.value) } : d))
                  }
                  fullWidth
                >
                  {Array.from({
                    length: ((HOURS[HOURS.length - 1] - HOURS[0]) * 60) / STEP_MIN + 1,
                  }).map((_, i) => {
                    const min = HOURS[0] * 60 + i * STEP_MIN;
                    return (
                      <MenuItem key={min} value={min}>
                        {formatTime(min)}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <TextField
                  select
                  label="Fin"
                  value={draft?.endMin ?? 10 * 60}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, endMin: Number(e.target.value) } : d))
                  }
                  fullWidth
                >
                  {Array.from({
                    length: ((HOURS[HOURS.length - 1] - HOURS[0]) * 60) / STEP_MIN + 1,
                  }).map((_, i) => {
                    const min = HOURS[0] * 60 + i * STEP_MIN;
                    return (
                      <MenuItem key={min} value={min}>
                        {formatTime(min)}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ColorLensRoundedIcon sx={{ opacity: 0.6 }} />
                {COLORS.map((c) => (
                  <Box
                    key={c}
                    onClick={() => setDraft((d) => (d ? { ...d, color: c } : d))}
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: c,
                      border: `2px solid ${alpha('#000', 0.2)}`,
                      boxShadow: draft?.color === c ? `0 0 0 3px ${alpha(c, 0.35)}` : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            {!draft?.id?.startsWith('new-') && (
              <Button
                color="error"
                startIcon={<DeleteRoundedIcon />}
                onClick={() => {
                  if (draft) deleteBlock(draft.id);
                  setOpen(false);
                }}
              >
                Eliminar
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Button onClick={() => setOpen(false)} startIcon={<CloseRoundedIcon />}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={saveDraft}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <Divider sx={{ my: 3, opacity: 0.12 }} />
        <Typography variant="caption" color="text.secondary">
          Tip: haz click en el lienzo para crear un bloque. Arrastra los bloques para moverlos entre
          horas o días.
        </Typography>
      </Box>
    </ProtectedLayout>
  );
}

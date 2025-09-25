// Agora Admin Events Page — Material UI 5 + TypeScript (Next.js friendly)
// Features:
// 1) Uses ProtectedLayout (or segment layout) to guard auth
// 2) Admin toolbar: text search, date range, attendee-range select, categories select, Create button
// 3) Data table with per-row actions (edit/delete) + dialogs
//
// Save as: app/(app)/events/page.tsx  (App Router)
// If you don't use a segment layout, you can wrap the page content with <ProtectedLayout> directly.

import * as React from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    MenuItem,
    Chip,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    InputAdornment,
    Snackbar,
    Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import {ProtectedLayout} from "@/components/App/ProtectedLayout";
import {useRouter} from "next/navigation";

// If your App Router segment already wraps with ProtectedLayout, you don't need this import.
// import { ProtectedLayout } from "../_components/AgoraLayout";

// --------------------
// Mock data & helpers
// --------------------

export type EventRow = {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO YYYY-MM-DD
    attendees: number;
    categories: string[];
};

const ALL_CATEGORIES = ["AI", "Fintech", "Climate", "Web3", "SaaS", "HealthTech", "EdTech"];

const ATTENDEE_RANGES = [
    { value: "any", label: "Cualquiera" },
    { value: "0-50", label: "0–50" },
    { value: "51-200", label: "51–200" },
    { value: "201-500", label: "201–500" },
    { value: "501+", label: "500+" },
] as const;

function inRange(att: number, range: typeof ATTENDEE_RANGES[number]["value"]) {
    switch (range) {
        case "0-50":
            return att >= 0 && att <= 50;
        case "51-200":
            return att >= 51 && att <= 200;
        case "201-500":
            return att >= 201 && att <= 500;
        case "501+":
            return att >= 501;
        default:
            return true;
    }
}

const seed: EventRow[] = [
    {
        id: "evt-1",
        title: "Pitch Day CDMX",
        description: "Encuentro de startups locales y fondos.",
        date: "2025-10-15",
        attendees: 280,
        categories: ["AI", "Fintech"],
    },
    {
        id: "evt-2",
        title: "AI & Fintech Summit",
        description: "Tendencias, demos y networking.",
        date: "2025-11-02",
        attendees: 520,
        categories: ["AI", "SaaS"],
    },
    {
        id: "evt-3",
        title: "Climate Tech Meetup",
        description: "Soluciones verdes y fondos especializados.",
        date: "2025-09-30",
        attendees: 110,
        categories: ["Climate"],
    },
];

// --------------------
// Dialog forms
// --------------------

type EditState = {
    open: boolean;
    mode: "create" | "edit";
    row?: EventRow | null;
};

const emptyEvent: EventRow = {
    id: "",
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    attendees: 0,
    categories: [],
};

function EventFormDialog({ state, onClose, onSave }: {
    state: EditState;
    onClose: () => void;
    onSave: (row: EventRow) => void;
}) {
    const [form, setForm] = React.useState<EventRow>(state.row ?? emptyEvent);

    React.useEffect(() => {
        setForm(state.row ?? emptyEvent);
    }, [state]);

    const isEdit = state.mode === "edit";

    return (
        <Dialog open={state.open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEdit ? "Editar evento" : "Crear nuevo evento"}</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Título"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                        fullWidth
                        InputProps={{ startAdornment: (<InputAdornment position="start"><EventRoundedIcon /></InputAdornment>) }}
                    />
                    <TextField
                        label="Descripción"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        fullWidth
                        multiline
                        minRows={3}
                    />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                type="date"
                                label="Fecha"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                type="number"
                                label="Asistentes (estimado)"
                                value={form.attendees}
                                onChange={(e) => setForm({ ...form, attendees: Number(e.target.value) })}
                                fullWidth
                                InputProps={{ startAdornment: (<InputAdornment position="start"><GroupsRoundedIcon /></InputAdornment>) }}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        select
                        SelectProps={{ multiple: true, renderValue: (selected) => (
                                <Stack direction="row" gap={0.5} flexWrap="wrap">
                                    {(selected as string[]).map((c) => (
                                        <Chip key={c} size="small" label={c} sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Stack>
                            ) }}
                        label="Categorías"
                        value={form.categories}
                        onChange={(e) => setForm({ ...form, categories: (e.target.value as unknown as string[]) })}
                        fullWidth
                    >
                        {ALL_CATEGORIES.map((c) => (
                            <MenuItem key={c} value={c}><CategoryRoundedIcon fontSize="small" style={{ marginRight: 8 }} /> {c}</MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button onClick={() => onSave({ ...form, id: form.id || `evt-${Date.now()}` })} variant="contained">
                    {isEdit ? "Guardar cambios" : "Crear evento"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function ConfirmDialog({ open, title, content, onClose, onConfirm }: {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <Typography>{content}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button onClick={onConfirm} color="error" variant="contained">Eliminar</Button>
            </DialogActions>
        </Dialog>
    );
}

// --------------------
// Page
// --------------------

export default function AdminEventsPage(): React.JSX.Element {
    const [rows, setRows] = React.useState<EventRow[]>(seed);
    const router = useRouter();

    // Filters
    const [q, setQ] = React.useState("");
    const [dateFrom, setDateFrom] = React.useState("");
    const [dateTo, setDateTo] = React.useState("");
    const [attRange, setAttRange] = React.useState<typeof ATTENDEE_RANGES[number]["value"]>("any");
    const [categories, setCategories] = React.useState<string[]>([]);

    const [editState, setEditState] = React.useState<EditState>({ open: false, mode: "create", row: null });
    const [confirm, setConfirm] = React.useState<{ open: boolean; id?: string }>({ open: false });
    const [toast, setToast] = React.useState<{ open: boolean; message: string; severity: "success" | "info" | "warning" | "error" }>({ open: false, message: "", severity: "success" });

    const filtered = React.useMemo(() => {
        return rows.filter((r) => {
            const matchesText = q.trim().length === 0 || (r.title + " " + (r.description ?? "")).toLowerCase().includes(q.toLowerCase());
            const matchesFrom = !dateFrom || r.date >= dateFrom;
            const matchesTo = !dateTo || r.date <= dateTo;
            const matchesRange = inRange(r.attendees, attRange);
            const matchesCats = categories.length === 0 || categories.every((c) => r.categories.includes(c));
            return matchesText && matchesFrom && matchesTo && matchesRange && matchesCats;
        });
    }, [rows, q, dateFrom, dateTo, attRange, categories]);

    // Handlers
    const onCreate = () => setEditState({ open: true, mode: "create", row: emptyEvent });
    const onEdit = (row: EventRow) => setEditState({ open: true, mode: "edit", row });
    const onDelete = (id: string) => setConfirm({ open: true, id });

    const saveEvent = (row: EventRow) => {
        setRows((prev) => {
            const exists = prev.some((p) => p.id === row.id);
            const next = exists ? prev.map((p) => (p.id === row.id ? row : p)) : [row, ...prev];
            return next;
        });
        setEditState({ open: false, mode: "create", row: null });
        setToast({ open: true, message: existsMessage(row), severity: "success" });
    };
    const existsMessage = (row: EventRow) => (seed.find((s) => s.id === row.id) ? "Evento actualizado" : "Evento creado");

    const confirmDelete = () => {
        setRows((prev) => prev.filter((p) => p.id !== confirm.id));
        setConfirm({ open: false });
        setToast({ open: true, message: "Evento eliminado", severity: "success" });
    };

    return (
        // If your segment layout already wraps with ProtectedLayout, return just the content.
        // Otherwise, uncomment:
        <ProtectedLayout>
        <Stack spacing={2}>
            {/* Header */}
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
                <Box>
                    <Typography variant="h4" fontWeight={900}>Eventos</Typography>
                    <Typography color="text.secondary">Administra tus eventos: crea, edita y elimina.</Typography>
                </Box>
                <Button onClick={() => router.push('/manage/events/create')} variant="contained" startIcon={<AddRoundedIcon />}>Nuevo evento</Button>
            </Stack>

            {/* Filters */}
            <Card>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por título o descripción…"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>) }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            <TextField type="date" label="Desde" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            <TextField type="date" label="Hasta" value={dateTo} onChange={(e) => setDateTo(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 2 }}>
                            <TextField select label="Asistentes" value={attRange} onChange={(e) => setAttRange(e.target.value as never)} fullWidth>
                                {ATTENDEE_RANGES.map((r) => (<MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 2 }}>
                            <TextField
                                select
                                label="Categorías"
                                value={categories}
                                onChange={(e) => setCategories(e.target.value as unknown as string[])}
                                SelectProps={{ multiple: true, renderValue: (selected) => (
                                        <Stack direction="row" gap={0.5} flexWrap="wrap">
                                            {(selected as string[]).map((c) => (<Chip key={c} size="small" label={c} />))}
                                        </Stack>
                                    ) }}
                                fullWidth
                            >
                                {ALL_CATEGORIES.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent>
                    <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                        <Box component="thead" sx={{ '& th': { textAlign: 'left', py: 1, color: 'text.secondary', borderBottom: (t) => `1px solid ${alpha('#FFFFFF', 0.08)}` } }}>
                            <Box component="tr">
                                <Box component="th">Título</Box>
                                <Box component="th">Fecha</Box>
                                <Box component="th">Asistentes</Box>
                                <Box component="th">Categorías</Box>
                                <Box component="th" sx={{ textAlign: 'right' }}>Acciones</Box>
                            </Box>
                        </Box>
                        <Box component="tbody" sx={{ '& td': { py: 1.25, borderBottom: (t) => `1px solid ${alpha('#FFFFFF', 0.06)}` } }}>
                            {filtered.map((r) => (
                                <Box component="tr" key={r.id}>
                                    <Box component="td">
                                        <Stack spacing={0.25}>
                                            <Typography fontWeight={700}>{r.title}</Typography>
                                            {r.description && (<Typography variant="body2" color="text.secondary" noWrap>{r.description}</Typography>)}
                                        </Stack>
                                    </Box>
                                    <Box component="td"><Typography>{new Date(r.date).toDateString()}</Typography></Box>
                                    <Box component="td"><Typography>{r.attendees}</Typography></Box>
                                    <Box component="td">
                                        <Stack direction="row" gap={0.5} flexWrap="wrap">
                                            {r.categories.map((c) => (<Chip key={c} size="small" label={c} />))}
                                        </Stack>
                                    </Box>
                                    <Box component="td" sx={{ textAlign: 'right' }}>
                                        <Tooltip title="Editar"><IconButton onClick={() => onEdit(r)}><EditRoundedIcon /></IconButton></Tooltip>
                                        <Tooltip title="Eliminar"><IconButton color="error" onClick={() => onDelete(r.id)}><DeleteRoundedIcon /></IconButton></Tooltip>
                                    </Box>
                                </Box>
                            ))}
                            {filtered.length === 0 && (
                                <Box component="tr">
                                    <Box component="td" colSpan={5} sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                                        No hay eventos con los filtros actuales.
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Dialogs */}
            <EventFormDialog state={editState} onClose={() => setEditState((s) => ({ ...s, open: false }))} onSave={saveEvent} />
            <ConfirmDialog open={confirm.open} title="Eliminar evento" content="Esta acción no se puede deshacer." onClose={() => setConfirm({ open: false })} onConfirm={confirmDelete} />

            <Snackbar open={toast.open} autoHideDuration={2200} onClose={() => setToast((t) => ({ ...t, open: false }))}>
                <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
            </Snackbar>
        </Stack>
        </ProtectedLayout>
    );
}

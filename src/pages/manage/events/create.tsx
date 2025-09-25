// Agora — /events/new Wizard (Material UI 5 + TypeScript)
// Path suggestion (Next.js App Router): app/(app)/events/new/page.tsx
// Features:
//  - Stepper wizard (1.1 -> 1.5)
//  - Dynamic forms with pretty, modular components
//  - Optional Excel/CSV upload for attendees + manual attendee creation
//  - Single handleFormSubmit that posts the consolidated payload to backend
//  - Minimal client-side validation & examples
//
// Notes:
//  - For Excel parsing, install `xlsx`: npm i xlsx --save
//  - If you don't have xlsx, CSV parsing fallback is included (very basic)

import * as React from "react";
import {
    Box,
    Stack,
    Typography,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Grid,
    Chip,
    IconButton,
    Divider,
    MenuItem,
    InputAdornment,
    Switch,
    FormControlLabel,
    Avatar,
    Tooltip,
    Snackbar,
    Alert, Container,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddRounded from "@mui/icons-material/AddRounded";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import EventRounded from "@mui/icons-material/EventRounded";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import ImageRounded from "@mui/icons-material/ImageRounded";
import ScheduleRounded from "@mui/icons-material/ScheduleRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import CloudUploadRounded from "@mui/icons-material/CloudUploadRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import {ProtectedLayout} from "@/components/App/ProtectedLayout";

// Optional: enable Excel parsing if you installed xlsx
// import * as XLSX from "xlsx";

// -----------------------
// Types
// -----------------------

type SubEvent = {
    id: string;
    title: string;
    description?: string;
    coverUrl?: string;
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
    speaker?: string;
    requiresRegistration: boolean;
};

type RoleKey = "founder" | "investor" | "attendee";

type RoleRule = {
    role: RoleKey;
    mfaRequired: boolean;
    validationRequired: boolean;
    notes?: string;
};

type EventCategory = string; // e.g., "Speaker", "Staff", "Tecnólogo"

type Attendee = {
    id: string;
    name: string;
    email: string;
    role: RoleKey;
    category?: EventCategory;
};

type EventForm = {
    general: {
        title: string;
        description: string;
        coverUrl?: string;
        date: string; // YYYY-MM-DD
    };
    agenda: SubEvent[];
    roles: RoleRule[]; // founder, investor, attendee
    categories: EventCategory[]; // sub-roles
    attendees: Attendee[]; // manual + from excel
};

// Default initial state
const initialForm: EventForm = {
    general: { title: "", description: "", date: new Date().toISOString().slice(0, 10) },
    agenda: [],
    roles: [
        { role: "founder", mfaRequired: false, validationRequired: false, },
        { role: "investor", mfaRequired: true, validationRequired: true, },
        { role: "attendee", mfaRequired: false, validationRequired: false, },
    ],
    categories: ["Speaker", "Staff", "Tecnólogo"],
    attendees: [],
};

const steps = [
    { key: "general", label: "Datos generales" },
    { key: "agenda", label: "Agenda" },
    { key: "roles", label: "Roles y reglas" },
    { key: "categories", label: "Categorías" },
    { key: "attendees", label: "Asistentes" },
] as const;

// -----------------------
// Utilities
// -----------------------

const uid = () => Math.random().toString(36).slice(2, 10);

const roleLabel = (r: RoleKey) =>
    r === "founder" ? "Founder" : r === "investor" ? "Inversionista" : "Asistente";

// Very simple CSV parser (expects header: name,email,role,category)
async function parseCSV(file: File): Promise<Attendee[]> {
    const text = await file.text();
    const [head, ...lines] = text.split(/\r?\n/).filter(Boolean);
    const headers = head.split(",").map((h) => h.trim().toLowerCase());
    return lines.map((line) => {
        const cols = line.split(",");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const rec: never = {};
        headers.forEach((h, i) => (rec[h] = (cols[i] ?? "").trim() as never));
        const role = (rec["role"] as string)?.toLowerCase();
        const mapped: RoleKey = ["founder", "investor", "attendee"].includes(role)
            ? (role as RoleKey)
            : "attendee";
        return {
            id: uid(),
            name: rec["name"] ?? "",
            email: rec["email"] ?? "",
            role: mapped,
            category: rec["category"] ?? undefined,
        } as Attendee;
    });
}

// Optional Excel parser (uncomment if using xlsx)
// async function parseExcel(file: File): Promise<Attendee[]> {
//   const buffer = await file.arrayBuffer();
//   const wb = XLSX.read(buffer, { type: "array" });
//   const ws = wb.Sheets[wb.SheetNames[0]];
//   const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
//   return rows.map((r) => ({
//     id: uid(),
//     name: r.name || r.Nombre || "",
//     email: r.email || r.Correo || "",
//     role: ((r.role || r.Rol || "attendee").toString().toLowerCase().trim()) as RoleKey,
//     category: r.category || r.Categoría || undefined,
//   } as Attendee));
// }

function formatTimeInput(value: string) {
    // Ensure 00:00 pattern
    const m = value.match(/^([0-2]?\d):?([0-5]?\d)$/);
    if (!m) return value;
    const hh = String(Math.min(23, parseInt(m[1] ?? "0", 10))).padStart(2, "0");
    const mm = String(Math.min(59, parseInt(m[2] ?? "0", 10))).padStart(2, "0");
    return `${hh}:${mm}`;
}

// -----------------------
// Step components (inline for demo, can be split into files)
// -----------------------

const StepGeneral: React.FC<{
    form: EventForm;
    setForm: React.Dispatch<React.SetStateAction<EventForm>>;
}> = ({ form, setForm }) => {
    const g = form.general;
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Título del evento"
                            value={g.title}
                            onChange={(e) => setForm((s) => ({ ...s, general: { ...s.general, title: e.target.value } }))}
                            fullWidth
                            required
                            InputProps={{ startAdornment: (<InputAdornment position="start"><EventRounded /></InputAdornment>) }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Descripción"
                            value={g.description}
                            onChange={(e) => setForm((s) => ({ ...s, general: { ...s.general, description: e.target.value } }))}
                            fullWidth
                            multiline
                            minRows={3}
                            InputProps={{ startAdornment: (<InputAdornment position="start"><DescriptionRounded /></InputAdornment>) }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            type="date"
                            label="Fecha"
                            value={g.date}
                            onChange={(e) => setForm((s) => ({ ...s, general: { ...s.general, date: e.target.value } }))}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Portada (URL)"
                            value={g.coverUrl ?? ""}
                            onChange={(e) => setForm((s) => ({ ...s, general: { ...s.general, coverUrl: e.target.value } }))}
                            fullWidth
                            placeholder="https://..."
                            InputProps={{ startAdornment: (<InputAdornment position="start"><ImageRounded /></InputAdornment>) }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const StepAgenda: React.FC<{
    form: EventForm;
    setForm: React.Dispatch<React.SetStateAction<EventForm>>;
}> = ({ form, setForm }) => {
    const add = () => setForm((s) => ({
        ...s,
        agenda: [
            ...s.agenda,
            { id: uid(), title: "Nuevo sub-evento", startTime: "09:00", endTime: "10:00", requiresRegistration: false },
        ],
    }));
    const update = (id: string, patch: Partial<SubEvent>) =>
        setForm((s) => ({ ...s, agenda: s.agenda.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
    const remove = (id: string) => setForm((s) => ({ ...s, agenda: s.agenda.filter((e) => e.id !== id) }));

    return (
        <Stack spacing={2}>
            {form.agenda.map((e) => (
                <Card key={e.id}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Título" value={e.title} onChange={(ev) => update(e.id, { title: ev.target.value })} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Descripción" value={e.description ?? ""} onChange={(ev) => update(e.id, { description: ev.target.value })} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField label="Inicio" value={e.startTime} onChange={(ev) => update(e.id, { startTime: formatTimeInput(ev.target.value) })} fullWidth placeholder="09:00" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField label="Fin" value={e.endTime} onChange={(ev) => update(e.id, { endTime: formatTimeInput(ev.target.value) })} fullWidth placeholder="10:00" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Portada (URL)" value={e.coverUrl ?? ""} onChange={(ev) => update(e.id, { coverUrl: ev.target.value })} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Speaker (opcional)" value={e.speaker ?? ""} onChange={(ev) => update(e.id, { speaker: ev.target.value })} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControlLabel control={<Switch checked={e.requiresRegistration} onChange={(ev) => update(e.id, { requiresRegistration: ev.target.checked })} />} label="Requiere registro" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: { xs: "left", md: "right" } }}>
                                <Tooltip title="Eliminar sub-evento"><IconButton color="error" onClick={() => remove(e.id)}><DeleteRounded /></IconButton></Tooltip>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}

            <Button onClick={add} variant="outlined" startIcon={<AddRounded />}>Agregar sub-evento</Button>
        </Stack>
    );
};

const StepRoles: React.FC<{
    form: EventForm;
    setForm: React.Dispatch<React.SetStateAction<EventForm>>;
}> = ({ form, setForm }) => {
    const toggle = (role: RoleKey, key: keyof RoleRule, value: never) =>
        setForm((s) => ({ ...s, roles: s.roles.map((r) => (r.role === role ? { ...r, [key]: value } : r)) }));

    return (
        <Grid container spacing={2}>
            {form.roles.map((r) => (
                <Grid key={r.role} size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Stack spacing={1.25}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Avatar><PersonRounded /></Avatar>
                                    <Typography variant="h6" fontWeight={800}>{roleLabel(r.role)}</Typography>
                                </Stack>
                                <Divider sx={{ opacity: 0.2 }} />
                                <FormControlLabel label="Requiere MFA" control={<Switch checked={r.mfaRequired} onChange={(e) => toggle(r.role, "mfaRequired", e.target.checked as never)} />} />
                                <FormControlLabel label="Requiere validación" control={<Switch checked={r.validationRequired} onChange={(e) => toggle(r.role, "validationRequired", e.target.checked as never)} />} />
                                <TextField label="Notas (opcional)" value={r.notes ?? ""} onChange={(e) => toggle(r.role, "notes", e.target.value as never)} fullWidth multiline minRows={2} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

const StepCategories: React.FC<{
    form: EventForm;
    setForm: React.Dispatch<React.SetStateAction<EventForm>>;
}> = ({ form, setForm }) => {
    const [newCat, setNewCat] = React.useState("");
    const add = () => {
        const v = newCat.trim();
        if (!v) return;
        if (form.categories.includes(v)) return;
        setForm((s) => ({ ...s, categories: [...s.categories, v] }));
        setNewCat("");
    };
    const remove = (c: string) => setForm((s) => ({ ...s, categories: s.categories.filter((x) => x !== c) }));

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        <TextField label="Nueva categoría" value={newCat} onChange={(e) => setNewCat(e.target.value)} fullWidth />
                        <Button onClick={add} variant="contained" startIcon={<AddRounded />}>Agregar</Button>
                    </Stack>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                        {form.categories.map((c) => (
                            <Chip key={c} label={c} onDelete={() => remove(c)} />
                        ))}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

const StepAttendees: React.FC<{
    form: EventForm;
    setForm: React.Dispatch<React.SetStateAction<EventForm>>;
}> = ({ form, setForm }) => {
    const addManual = () => setForm((s) => ({ ...s, attendees: [...s.attendees, { id: uid(), name: "", email: "", role: "attendee" }] }));
    const update = (id: string, patch: Partial<Attendee>) => setForm((s) => ({ ...s, attendees: s.attendees.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
    const remove = (id: string) => setForm((s) => ({ ...s, attendees: s.attendees.filter((a) => a.id !== id) }));

    const onFile = async (file: File) => {
        const ext = file.name.toLowerCase();
        try {
            let parsed: Attendee[] = [];
            if (ext.endsWith(".csv")) parsed = await parseCSV(file);
            // else if (ext.endsWith(".xlsx") || ext.endsWith(".xls")) parsed = await parseExcel(file);
            else parsed = await parseCSV(file); // fallback to CSV parser
            setForm((s) => ({ ...s, attendees: [...s.attendees, ...parsed] }));
        } catch (e) {
            console.error(e);
            alert("No se pudo leer el archivo. Asegúrate de usar CSV o XLSX");
        }
    };

    return (
        <Stack spacing={2}>
            <Card>
                <CardContent>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }} justifyContent="space-between">
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
                            <Button component="label" variant="outlined" startIcon={<CloudUploadRounded />}>
                                Cargar Excel/CSV
                                <input hidden type="file" accept=".csv,.xlsx,.xls" onChange={(e) => e.target.files && onFile(e.target.files[0])} />
                            </Button>
                            <Button variant="text" startIcon={<DownloadRounded />} onClick={() => {
                                const csv = "name,email,role,category\nJuan Perez,juan@ejemplo.com,founder,Speaker";
                                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                                const a = document.createElement("a");
                                a.href = URL.createObjectURL(blob);
                                a.download = "agora_attendees_template.csv";
                                a.click();
                            }}>Descargar plantilla CSV</Button>
                        </Stack>
                        <Button onClick={addManual} variant="contained" startIcon={<AddRounded />}>Agregar asistente</Button>
                    </Stack>
                </CardContent>
            </Card>

            <Stack spacing={1.5}>
                {form.attendees.length === 0 && (
                    <Typography color="text.secondary">Aún no agregas asistentes.</Typography>
                )}
                {form.attendees.map((a) => (
                    <Card key={a.id}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <TextField label="Nombre" value={a.name} onChange={(e) => update(a.id, { name: e.target.value })} fullWidth />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <TextField type="email" label="Correo" value={a.email} onChange={(e) => update(a.id, { email: e.target.value })} fullWidth />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <TextField select label="Rol" value={a.role} onChange={(e) => update(a.id, { role: e.target.value as RoleKey })} fullWidth>
                                        <MenuItem value="founder">Founder</MenuItem>
                                        <MenuItem value="investor">Inversionista</MenuItem>
                                        <MenuItem value="attendee">Asistente</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 2 }}>
                                    <TextField label="Categoría" value={a.category ?? ""} onChange={(e) => update(a.id, { category: e.target.value })} fullWidth placeholder="Speaker/Staff…" />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 1 }} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                                    <Tooltip title="Eliminar"><IconButton color="error" onClick={() => remove(a.id)}><DeleteRounded /></IconButton></Tooltip>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Stack>
    );
};

// -----------------------
// Page — Wizard
// -----------------------

export default function NewEventWizardPage(): React.JSX.Element {
    const [active, setActive] = React.useState(0);
    const [form, setForm] = React.useState<EventForm>(initialForm);
    const [saving, setSaving] = React.useState(false);
    const [toast, setToast] = React.useState<{open: boolean; message: string; severity: "success" | "error"}>({ open: false, message: "", severity: "success" });

    const next = () => setActive((s) => Math.min(s + 1, steps.length - 1));
    const prev = () => setActive((s) => Math.max(s - 1, 0));

    // Simple guards
    const canNext = () => {
        if (active === 0) return Boolean(form.general.title && form.general.date);
        if (active === 1) return form.agenda.every((e) => e.title && e.startTime && e.endTime);
        return true;
    };

    const handleFormSubmit = async () => {
        // Consolidated payload for backend
        const payload = { ...form };
        try {
            setSaving(true);
            // Example POST — replace with your API call
            // await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            await new Promise((res) => setTimeout(res, 800));
            setToast({ open: true, message: "Evento creado con éxito", severity: "success" });
            // router.push("/events");
            console.log("Submitted payload", payload);
        } catch (e) {
            setToast({ open: true, message: "No se pudo crear el evento", severity: "error" });
        } finally {
            setSaving(false);
        }
    };

    return <ProtectedLayout>
        <Container>
            <Stack spacing={4}>
                {/* Header */}
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
                    <Box>
                        <Typography variant="h4" fontWeight={900}>Nuevo evento</Typography>
                        <Typography color="text.secondary">Crea tu evento y configura agenda, roles, categorías y asistentes.</Typography>
                    </Box>
                </Stack>

                <Card>
                    <CardContent>
                        <Stepper activeStep={active} alternativeLabel>
                            {steps.map((s) => (
                                <Step key={s.key}>
                                    <StepLabel>{s.label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </CardContent>
                </Card>

                {/* Step content */}
                {active === 0 && <StepGeneral form={form} setForm={setForm} />}
                {active === 1 && <StepAgenda form={form} setForm={setForm} />}
                {active === 2 && <StepRoles form={form} setForm={setForm} />}
                {active === 3 && <StepCategories form={form} setForm={setForm} />}
                {active === 4 && <StepAttendees form={form} setForm={setForm} />}

                {/* Footer actions */}
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={1.5}>
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" color="inherit" disabled={active === 0} onClick={prev}>Atrás</Button>
                        {active < steps.length - 1 ? (
                            <Button variant="contained" onClick={next} disabled={!canNext()}>Continuar</Button>
                        ) : (
                            <Button variant="contained" onClick={handleFormSubmit} disabled={saving}>{saving ? "Creando…" : "Crear evento"}</Button>
                        )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                        Paso {active + 1} de {steps.length}
                    </Typography>
                </Stack>

                <Snackbar open={toast.open} autoHideDuration={2200} onClose={() => setToast((t) => ({ ...t, open: false }))}>
                    <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
                </Snackbar>
            </Stack>
        </Container>
    </ProtectedLayout>;
}

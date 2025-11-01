

import * as React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  Divider,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import { ProtectedLayout } from '@/components/Dashboard/DashboardLayout';

// Helper: a11y props for tabs
function a11yProps(index: number) {
  return {
    id: `event-admin-tab-${index}`,
    'aria-controls': `event-admin-tabpanel-${index}`,
  };
}

// Tab Panel
function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-admin-tabpanel-${index}`}
      aria-labelledby={`event-admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// --- General Info Form ---
function GeneralInfoForm() {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [capacity, setCapacity] = React.useState<number | ''>('');
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Replace with real API call
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Información general
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nombre del evento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              placeholder="Ej. Agora Summit 2025"
            />
            <TextField
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={4}
              placeholder="Describe de qué trata tu evento…"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Ubicación"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                placeholder="Ciudad de México, MX o URL si es virtual"
              />
              <TextField
                label="Cupo"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Chip label="Público" variant="outlined" />
              <Chip label="Tecnología" variant="outlined" />
              {/* TODO: categorías reales */}
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined">Cancelar</Button>
              <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

// --- Agenda Builder ---
type AgendaItem = {
  id: string;
  title: string;
  startsAt: string; // ISO time
  endsAt: string; // ISO time
  speaker?: string;
  room?: string;
};

function AgendaBuilder() {
  const [items, setItems] = React.useState<AgendaItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<AgendaItem>({
    id: '',
    title: '',
    startsAt: '',
    endsAt: '',
    speaker: '',
    room: '',
  });

  const resetDraft = () =>
    setDraft({ id: '', title: '', startsAt: '', endsAt: '', speaker: '', room: '' });

  const openCreate = () => {
    resetDraft();
    setOpen(true);
  };

  const openEdit = (it: AgendaItem) => {
    setDraft(it);
    setOpen(true);
  };

  const saveDraft = () => {
    if (!draft.title) return;
    if (draft.id) {
      setItems((arr) => arr.map((it) => (it.id === draft.id ? { ...draft } : it)));
    } else {
      setItems((arr) => [...arr, { ...draft, id: crypto.randomUUID() }]);
    }
    setOpen(false);
    resetDraft();
  };

  const remove = (id: string) => setItems((arr) => arr.filter((it) => it.id !== id));

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Agenda</Typography>
          <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}>
            Agregar bloque
          </Button>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {items.length === 0 ? (
          <Typography color="text.secondary">Aún no hay agenda. Crea tu primer bloque.</Typography>
        ) : (
          <List>
            {items.map((it) => (
              <ListItem
                key={it.id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton aria-label="Editar" onClick={() => openEdit(it)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="Eliminar" onClick={() => remove(it.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText
                  primary={it.title}
                  secondary={`${it.startsAt} - ${it.endsAt} ${it.room ? `• ${it.room}` : ''} ${
                    it.speaker ? `• ${it.speaker}` : ''
                  }`}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{draft.id ? 'Editar bloque' : 'Nuevo bloque'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Título"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                fullWidth
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Inicio"
                  type="time"
                  value={draft.startsAt}
                  onChange={(e) => setDraft((d) => ({ ...d, startsAt: e.target.value }))}
                  fullWidth
                  inputProps={{ step: 300 }}
                />
                <TextField
                  label="Fin"
                  type="time"
                  value={draft.endsAt}
                  onChange={(e) => setDraft((d) => ({ ...d, endsAt: e.target.value }))}
                  fullWidth
                  inputProps={{ step: 300 }}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Ponente"
                  value={draft.speaker ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, speaker: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Sala"
                  value={draft.room ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, room: e.target.value }))}
                  fullWidth
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={saveDraft} variant="contained" startIcon={<SaveIcon />}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// --- Sub-events Manager ---
type SubEvent = {
  id: string;
  name: string;
  date?: string;
};

function SubEventsManager() {
  const [subs, setSubs] = React.useState<SubEvent[]>([]);
  const [name, setName] = React.useState('');

  const add = () => {
    if (!name) return;
    setSubs((arr) => [...arr, { id: crypto.randomUUID(), name }]);
    setName('');
  };

  const remove = (id: string) => setSubs((arr) => arr.filter((s) => s.id !== id));

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Sub-eventos</Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
          <TextField
            label="Nombre del sub-evento"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Button onClick={add} startIcon={<AddIcon />} variant="contained">
            Agregar
          </Button>
        </Stack>
        {subs.length === 0 ? (
          <Typography color="text.secondary">No hay sub-eventos aún.</Typography>
        ) : (
          <List>
            {subs.map((s) => (
              <ListItem
                key={s.id}
                secondaryAction={
                  <IconButton aria-label="Eliminar" onClick={() => remove(s.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={s.name} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

// --- Attendees Manager ---
type Attendee = {
  id: string;
  name: string;
  email?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
};

function AttendeesManager() {
  const [attendees, setAttendees] = React.useState<Attendee[]>([]);
  const [query, setQuery] = React.useState('');

  const filtered = attendees.filter((a) =>
    (a.name + (a.email ?? '')).toLowerCase().includes(query.toLowerCase()),
  );

  const addMock = () => {
    const n = attendees.length + 1;
    setAttendees((arr) => [
      ...arr,
      { id: crypto.randomUUID(), name: `Asistente ${n}`, email: `user${n}@mail.com`, status: 'pending' },
    ]);
  };

  const remove = (id: string) => setAttendees((arr) => arr.filter((a) => a.id !== id));

  const confirm = (id: string) =>
    setAttendees((arr) => arr.map((a) => (a.id === id ? { ...a, status: 'confirmed' } : a)));

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Asistentes</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width={{ xs: '100%', sm: 'auto' }}>
            <TextField
              placeholder="Buscar por nombre o correo…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="small"
            />
            <Button variant="contained" startIcon={<AddIcon />} onClick={addMock}>
              Agregar demo
            </Button>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {filtered.length === 0 ? (
          <Typography color="text.secondary">No hay asistentes que coincidan.</Typography>
        ) : (
          <List>
            {filtered.map((a) => (
              <ListItem
                key={a.id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    {a.status !== 'confirmed' && (
                      <Button size="small" onClick={() => confirm(a.id)}>
                        Confirmar
                      </Button>
                    )}
                    <IconButton aria-label="Eliminar" onClick={() => remove(a.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{a.name}</Typography>
                      {a.status && <Chip size="small" label={a.status} />}
                    </Stack>
                  }
                  secondary={a.email}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

// --- Page ---
export default function EventAdminPage() {
  // router.query will have two 'id' params due to the route folders;
  // for real usage, prefer distinct names: [orgId]/event/[eventId]

  const [value, setValue] = React.useState(0);

  return (
    <ProtectedLayout title="Evento">
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Panel del evento
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Administra la información, agenda, sub-eventos y asistentes de tu evento.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={(_, v) => setValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Pestañas de administración de evento"
          >
            <Tab icon={<EditIcon />} iconPosition="start" label="Info general" {...a11yProps(0)} />
            <Tab icon={<EventNoteIcon />} iconPosition="start" label="Agenda" {...a11yProps(1)} />
            <Tab icon={<PlaylistAddIcon />} iconPosition="start" label="Sub-eventos" {...a11yProps(2)} />
            <Tab icon={<GroupIcon />} iconPosition="start" label="Asistentes" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <GeneralInfoForm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AgendaBuilder />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <SubEventsManager />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <AttendeesManager />
        </TabPanel>
      </Box>
    </ProtectedLayout>
  );
};
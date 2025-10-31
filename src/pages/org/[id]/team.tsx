

import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormHelperText,
  useMediaQuery,
  Card, CardContent, CardActions, Grid, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import SearchRounded from '@mui/icons-material/SearchRounded';
import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import { ProtectedLayout } from '@/components/Dashboard/DashboardLayout';

// -----------------------------
// Types & mock data (replace with API wiring)
// -----------------------------
export type MemberStatus = 'activo' | 'inactivo' | 'pendiente';
export type OrgRole = { id: string; name: string };
export type Member = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleId: string;
  joinedAt: string; // ISO date
  status: MemberStatus;
};

const initialRoles: OrgRole[] = [
  { id: 'owner', name: 'Owner' },
  { id: 'admin', name: 'Admin' },
  { id: 'staff', name: 'Staff' },
  { id: 'vol', name: 'Volunteer' },
];

const initialMembers: Member[] = [
  {
    id: 'm1',
    name: 'Maggy Chaparro',
    email: 'maggie@agora.dev',
    avatarUrl: 'https://i.pravatar.cc/80?img=12',
    roleId: 'admin',
    joinedAt: '2025-08-20',
    status: 'activo',
  },
  {
    id: 'm2',
    name: 'Alex Gómez',
    email: 'alex@agora.dev',
    avatarUrl: 'https://i.pravatar.cc/80?img=5',
    roleId: 'owner',
    joinedAt: '2025-06-01',
    status: 'activo',
  },
  {
    id: 'm3',
    name: 'Rafa Zamora',
    email: 'rafa@agora.dev',
    avatarUrl: 'https://i.pravatar.cc/80?img=32',
    roleId: 'staff',
    joinedAt: '2025-09-04',
    status: 'pendiente',
  },
  {
    id: 'm4',
    name: 'Uri Cohen',
    email: 'uri@agora.dev',
    avatarUrl: 'https://i.pravatar.cc/80?img=18',
    roleId: 'vol',
    joinedAt: '2025-09-10',
    status: 'inactivo',
  },
  {
    id: 'm3',
    name: 'Rafa Zamora',
    email: 'rafa@agora.dev',
    avatarUrl: 'https://i.pravatar.cc/80?img=32',
    roleId: 'staff',
    joinedAt: '2025-09-04',
    status: 'pendiente',
  },
  {
    id: 'm4',
    name: 'Uri Cohen',
    email: 'uri@agora.dev',
    avatarUrl: 'https://i.pravatar.cc/80?img=18',
    roleId: 'vol',
    joinedAt: '2025-09-10',
    status: 'inactivo',
  },
  {
    id: 'm3',
    name: 'Rafa Zamora',
    email: 'rafa@agora.dev',
    avatarUrl: 'https://i.pravatar.cc/80?img=32',
    roleId: 'staff',
    joinedAt: '2025-09-04',
    status: 'pendiente',
  },
  {
    id: 'm4',
    name: 'Uri Cohen',
    email: 'uri@agora.dev',
    avatarUrl: 'https://i.pravatar.cc/80?img=18',
    roleId: 'vol',
    joinedAt: '2025-09-10',
    status: 'inactivo',
  },
];

// Helper renderers
const StatusChip: React.FC<{ status: MemberStatus }> = ({ status }) => {
  const map: Record<MemberStatus, { label: string; color: 'success' | 'default' | 'warning' }> = {
    activo: { label: 'Activo', color: 'success' },
    inactivo: { label: 'Inactivo', color: 'default' },
    pendiente: { label: 'Pendiente', color: 'warning' },
  };
  const cfg = map[status];
  return <Chip size="small" color={cfg.color} label={cfg.label} variant={status === 'inactivo' ? 'outlined' : 'filled'} />;
};

// MemberCard component
const MemberCard: React.FC<{
  member: Member;
  roles: OrgRole[];
  onChangeRole: (id: string, roleId: string) => void;
  onResend?: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ member, roles, onChangeRole, onResend, onDelete }) => {
  const theme = useTheme();
  const border = `1px solid ${alpha(theme.palette.text.primary, 0.08)}`;

  return (
    <Card
      sx={{
        borderRadius: 1,
        border,
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.5}>
          {/* Header */}
          <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar src={member.avatarUrl}>{member.name.charAt(0)}</Avatar>
                {/* status dot */}
                <Box sx={{
                  position: 'absolute',
                  right: -2,
                  bottom: -2,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: member.status === 'activo' ? theme.palette.success.main : member.status === 'pendiente' ? theme.palette.warning.main : alpha(theme.palette.text.primary, 0.3),
                  boxShadow: (t) => `0 0 0 2px ${t.palette.background.paper}`,
                }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={800} noWrap>{member.name}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{member.email}</Typography>
              </Box>
            </Stack>
            <StatusChip status={member.status} />
          </Stack>

          {/* Role selector */}
          <Box sx={{ p: 1, borderRadius: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72 }}>Rol</Typography>
              <FormControl size="small" fullWidth>
                <Select value={member.roleId} onChange={(e) => onChangeRole(member.id, (e.target.value as string))}>
                  {roles.map((r) => (
                    <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>

          {/* Meta */}
          <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
            <CalendarMonthRounded fontSize="small" />
            <Typography variant="caption">
              Ingresó {new Date(member.joinedAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' })}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      {/* Footer actions */}
      <CardActions sx={{ pt: 0, px: 2.25, pb: 2.25, justifyContent: 'flex-end', gap: 0.5 }}>
        {member.status === 'pendiente' && (
          <Button size="small" onClick={() => onResend?.(member.id)}>Reenviar</Button>
        )}
        <Button size="small" color="error" onClick={() => onDelete(member.id)}>Eliminar</Button>
      </CardActions>
    </Card>
  );
};

// -----------------------------
// Invite Member Dialog
// -----------------------------
const InviteDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onInvite: (payload: { email: string; roleId: string }) => void;
  roles: OrgRole[];
}> = ({ open, onClose, onInvite, roles }) => {
  const [email, setEmail] = React.useState('');
  const [roleId, setRoleId] = React.useState(roles[2]?.id ?? 'staff');
  const [error, setError] = React.useState('');

  const handleInvite = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Correo inválido');
      return;
    }
    onInvite({ email, roleId });
    setEmail('');
    setRoleId(roles[2]?.id ?? 'staff');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Invitar miembro</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error || 'Se enviará una invitación por correo'}
            fullWidth
          />
          <FormControl fullWidth>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>Rol</Typography>
            <Select size="small" value={roleId} onChange={(e) => setRoleId(e.target.value as string)}>
              {roles.map((r) => (
                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Podrás cambiarlo después</FormHelperText>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleInvite} startIcon={<PersonAddRounded />}>Enviar invitación</Button>
      </DialogActions>
    </Dialog>
  );
};

// -----------------------------
// Define Roles Dialog
// -----------------------------
const RolesDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  roles: OrgRole[];
  onChange: (next: OrgRole[]) => void;
}> = ({ open, onClose, roles, onChange }) => {
  const [local, setLocal] = React.useState<OrgRole[]>(roles);
  React.useEffect(() => setLocal(roles), [roles, open]);

  const addRole = () => {
    const base = 'Nuevo rol';
    let name = base;
    let i = 1;
    while (local.some((r) => r.name.toLowerCase() === name.toLowerCase())) name = `${base} ${i++}`;
    setLocal((prev) => [...prev, { id: crypto.randomUUID(), name }]);
  };
  const rename = (id: string, name: string) => setLocal((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
  const remove = (id: string) => setLocal((prev) => prev.filter((r) => !['owner'].includes(r.id) && r.id !== id));

  const save = () => {
    onChange(local);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Roles de la organización</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          {local.map((r) => (
            <Stack key={r.id} direction="row" spacing={1} alignItems="center">
              <ShieldRounded fontSize="small" />
              <TextField size="small" value={r.name} onChange={(e) => rename(r.id, e.target.value)} fullWidth />
              <IconButton size="small" onClick={() => remove(r.id)} disabled={r.id === 'owner'}>
                <DeleteOutlineRounded fontSize="small" />
              </IconButton>
            </Stack>
          ))}
          <Button onClick={addRole} startIcon={<ShieldRounded />}>Agregar rol</Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={save}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

// -----------------------------
// Confirm Delete Dialog
// -----------------------------
const ConfirmDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}> = ({ open, onClose, onConfirm, title, message }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>Eliminar</Button>
    </DialogActions>
  </Dialog>
);

// -----------------------------
// Page
// -----------------------------
export default function OrgTeamPage() {
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));

  const [roles, setRoles] = React.useState<OrgRole[]>(initialRoles);
  const [members, setMembers] = React.useState<Member[]>(initialMembers);
  const [query, setQuery] = React.useState('');
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [rolesOpen, setRolesOpen] = React.useState(false);
  const [confirmState, setConfirmState] = React.useState<{ open: boolean; memberId?: string }>({ open: false });
  const [viewMode, setViewMode] = React.useState<'cards' | 'table'>('cards');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.name, m.email, roles.find((r) => r.id === m.roleId)?.name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [members, query, roles]);

  const updateRole = (id: string, roleId: string) => setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, roleId } : m)));
  const resendInvite = (id: string) => {
    // TODO: call API
    // feedback could be added with enqueueSnackbar if you use notistack
    console.log('Resent invite to', id);
  };
  const deleteMember = () => {
    if (!confirmState.memberId) return;
    setMembers((prev) => prev.filter((m) => m.id !== confirmState.memberId));
    setConfirmState({ open: false });
  };
  const inviteMember = ({ email, roleId }: { email: string; roleId: string }) => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      roleId,
      joinedAt: new Date().toISOString().slice(0, 10),
      status: 'pendiente',
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  // Table header cell style helper
  const thSx = {
    fontWeight: 700,
    color: theme.palette.text.secondary,
    borderBottomColor: alpha(theme.palette.text.primary, 0.08),
    whiteSpace: 'nowrap' as const,
  };

  return (
    <ProtectedLayout title="Tu equipo">
      <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Tu equipo</Typography>
            <Typography variant="body2" color="text.secondary">Administra miembros, roles e invitaciones</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<ShieldRounded />} onClick={() => setRolesOpen(true)}>Roles de la organización</Button>
            <Button variant="contained" startIcon={<PersonAddRounded />} onClick={() => setInviteOpen(true)}>Invitar</Button>
          </Stack>
        </Stack>

        {/* Toolbar */}
        <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, backgroundImage: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
            <TextField
              fullWidth
              placeholder="Buscar por nombre, correo o rol"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded />
                  </InputAdornment>
                ),
              }}
            />
            <ToggleButtonGroup
              size="small"
              value={viewMode}
              exclusive
              onChange={(_, v) => v && setViewMode(v)}
            >
              <ToggleButton value="cards">Tarjetas</ToggleButton>
              <ToggleButton value="table">Tabla</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Paper>

        {/* Members section: Table or Cards */}
        {viewMode === 'table' ? (
          <TableContainer sx={{ borderRadius: 2, backgroundImage: 'none' }}>
            <Table size={upSm ? 'medium' : 'small'}>
              <TableHead>
                <TableRow>
                  <TableCell sx={thSx}>Miembro</TableCell>
                  <TableCell sx={thSx}>Rol</TableCell>
                  <TableCell sx={thSx}>Fecha de ingreso</TableCell>
                  <TableCell sx={thSx}>Estado</TableCell>
                  <TableCell sx={{ ...thSx, textAlign: 'right' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id} hover>
                    <TableCell sx={{ maxWidth: 340 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={m.avatarUrl}>{m.name.charAt(0)}</Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={700} noWrap>{m.name}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>{m.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select value={m.roleId} onChange={(e) => updateRole(m.id, e.target.value as string)}>
                          {roles.map((r) => (
                            <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(m.joinedAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' })}</TableCell>
                    <TableCell><StatusChip status={m.status} /></TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        {m.status === 'pendiente' && (
                          <IconButton size="small" onClick={() => resendInvite(m.id)} title="Reenviar invitación">
                            <MailOutlineRounded fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => setConfirmState({ open: true, memberId: m.id })} color="error" title="Eliminar">
                          <DeleteOutlineRounded fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Stack alignItems="center" spacing={1.5} sx={{ py: 5, color: 'text.secondary' }}>
                        <SearchRounded />
                        <Typography variant="body2">No se encontraron miembros con ese criterio</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box>
            {filtered.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, backgroundImage: 'none' }}>
                <Stack alignItems="center" spacing={1.5} sx={{ color: 'text.secondary' }}>
                  <SearchRounded />
                  <Typography variant="body2">No se encontraron miembros con ese criterio</Typography>
                </Stack>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {filtered.map((m) => (
                  <Grid key={m.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <MemberCard
                      member={m}
                      roles={roles}
                      onChangeRole={updateRole}
                      onResend={resendInvite}
                      onDelete={(id) => setConfirmState({ open: true, memberId: id })}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Helpers below table */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mt: 1.5 }}>
          <Chip size="small" icon={<RefreshRounded />} label="Actualizar" clickable sx={{ bgcolor: alpha(theme.palette.primary.main, 0.06) }} />
          <Chip size="small" icon={<EditRounded />} label="Editar columnas (próximamente)" variant="outlined" />
        </Stack>
      </Box>

      {/* Dialogs */}
      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={inviteMember} roles={roles} />
      <RolesDialog open={rolesOpen} onClose={() => setRolesOpen(false)} roles={roles} onChange={setRoles} />
      <ConfirmDialog
        open={confirmState.open}
        onClose={() => setConfirmState({ open: false })}
        onConfirm={deleteMember}
        title="Eliminar miembro"
        message="Esta acción removerá al miembro de la organización."
      />
    </ProtectedLayout>
  );
}
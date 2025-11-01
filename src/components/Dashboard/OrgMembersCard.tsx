import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  alpha,
  Button,
  Avatar,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import SendRounded from '@mui/icons-material/SendRounded';
import useSWR from 'swr';
import { ListOrgMembers } from '@/lib/v1/types';

const OrgMembersCard: React.FC<{
  title?: string;
  orgId?: string;
  onWatchAll: () => any;
}> = ({ title = '👨‍💻 Tu equipo', orgId, onWatchAll }) => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const { data, isLoading } = useSWR<ListOrgMembers>(`/api/dashboard/org/${orgId}/members`);

  console.log(data);

  const team = data ? data?.organization_members : [];

  // Visible caps by breakpoint (fewer on small screens)
  const maxVisible = upMd ? 6 : upSm ? 5 : 4;
  const extraCount = Math.max(team.length - maxVisible, 0);
  const visible = extraCount > 0 ? team.slice(0, maxVisible - 1) : team.slice(0, maxVisible);

  if (isLoading) {
    return (
      <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none', backgroundImage: 'none' }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Skeleton variant="text" width={120} height={28} />
            <Skeleton variant="rounded" width={72} height={28} />
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'nowrap' }}>
            {[...Array(4)].map((_, i) => (
              <Stack key={i} alignItems="center" spacing={0.5} sx={{ minWidth: 96 }}>
                <Skeleton variant="circular" width={56} height={56} />
                <Skeleton variant="text" width={70} height={16} />
                <Skeleton variant="text" width={50} height={14} />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none', backgroundImage: 'none' }}>
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={800}>
            {title}
          </Typography>
          <Button variant="text" size="small" onClick={onWatchAll}>
            Ver todos
          </Button>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'nowrap' }}>
          {visible.map((m) => (
            <Stack key={m.name} alignItems="center" spacing={0.5} sx={{ minWidth: 96 }}>
              <Box sx={{ position: 'relative' }}>
                {/* circular soft background */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: (t) =>
                      alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.2 : 0.12),
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Avatar src={m.avatarUrl} alt={m.name} sx={{ width: 46, height: 46 }} />
                </Box>
                {/* status dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: (t) =>
                      m.status === 'online'
                        ? t.palette.success.main
                        : alpha(t.palette.text.primary, 0.3),
                    boxShadow: (t) => `0 0 0 2px ${t.palette.background.paper}`,
                  }}
                />
                {/* action overlay */}
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    right: -6,
                    bottom: -6,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: (t) =>
                      alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.22 : 0.16),
                    '&:hover': {
                      bgcolor: (t) =>
                        alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.3 : 0.22),
                    },
                  }}
                >
                  <SendRounded fontSize="inherit" />
                </IconButton>
              </Box>
              <Typography
                variant="body2"
                fontWeight={700}
                textAlign="center"
                noWrap
                sx={{ maxWidth: 100 }}
              >
                {m.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                noWrap
                sx={{ maxWidth: 100 }}
              >
                {m.role}
              </Typography>
            </Stack>
          ))}

          {extraCount > 0 && (
            <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 96 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: (t) => alpha(t.palette.text.primary, 0.08),
                  border: (t) => `1px solid ${alpha(t.palette.text.primary, 0.12)}`,
                }}
              >
                <Avatar
                  sx={{
                    width: 46,
                    height: 46,
                    bgcolor: 'transparent',
                    color: 'text.primary',
                    fontWeight: 800,
                  }}
                >
                  +{extraCount}
                </Avatar>
              </Box>
              <Typography
                variant="body2"
                fontWeight={700}
                textAlign="center"
                noWrap
                sx={{ maxWidth: 100 }}
              >
                Más
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                noWrap
                sx={{ maxWidth: 100 }}
              >
                miembros
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrgMembersCard;

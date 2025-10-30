import { useOrgEvents } from "@/hooks/useOrg";
import { TextField, MenuItem, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import WarningIcon from '@mui/icons-material/Warning';

export default function EventSelector({ orgId }: { orgId: string }) {
  const { events, isLoading, error } = useOrgEvents(orgId);
  const [selected, setSelected] = useState<string | null>(null);

  const handleEventchange = (eventId: string) => {
    setSelected(eventId);
  };

  const StartAdornment = () => {
    if (isLoading) return <CircularProgress size="small" />;
    if (error) return <WarningIcon fontSize="small" />
    return null;
  };

  useEffect(() => {
    setSelected(events ? events[0]?.id : null);
  }, [events, isLoading]);

  return (
    <TextField
      select
      label="Evento"
      size="small"
      value={selected}
      onChange={(e) => handleEventchange(e.target.value)}
      sx={{ minWidth: 220 }}
      disabled={isLoading}
      InputProps={{
        startAdornment: <StartAdornment />
      }}
    >
      {events?.length && events?.map((ev) => (
        <MenuItem key={ev.id} value={ev.id}>
          {ev.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

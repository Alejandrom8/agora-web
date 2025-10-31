"use client";
import * as React from "react";
import { Box, ButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useAppTheme } from "./ThemeProvider";

const SwitchRoot = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 20,
  border: `1.5px solid ${theme.palette.divider}`,
  padding: 2,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.03)' 
    : 'rgba(0, 0, 0, 0.03)',
  transition: 'all 0.2s ease',
  minWidth: 64,
  minHeight: 32,
  boxSizing: 'border-box',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.05)',
  },
}));

const Option = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{
  selected?: boolean;
}>(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 28,
  borderRadius: 16,
  background: selected 
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : '#FFFFFF'
    : 'transparent',
  color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
  boxShadow: selected 
    ? theme.palette.mode === 'dark'
      ? '0 1px 6px 0 rgba(0,0,0,0.2)'
      : '0 1px 6px 0 rgba(0,0,0,0.06)'
    : 'none',
  border: 'none',
  fontWeight: 700,
  fontSize: 16,
  transition: 'all 0.25s ease',
}));

export const ThemeToggleSwitch: React.FC = () => {
  const { mode, toggle } = useAppTheme();

  return (
    <SwitchRoot aria-label="toggle theme" onClick={toggle}>
      <Option selected={mode === 'light'}>
        <LightModeOutlinedIcon sx={{ fontSize: 18, transition: 'color 0.25s' }} />
      </Option>
      <Option selected={mode === 'dark'}>
        <DarkModeOutlinedIcon sx={{ fontSize: 18, transition: 'color 0.25s' }} />
      </Option>
    </SwitchRoot>
  );
};
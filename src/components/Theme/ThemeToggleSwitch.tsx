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
  background: 'transparent',
  transition: 'border-color 0.2s',
  minWidth: 64,
  minHeight: 32,
  boxSizing: 'border-box',
  overflow: 'hidden',
  cursor: 'pointer',
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
  background: selected ? '#fff' : 'transparent',
  color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
  boxShadow: selected ? '0 1px 6px 0 rgba(0,0,0,0.04)' : 'none',
  border: 'none',
  fontWeight: 700,
  fontSize: 16,
  transition: 'background 0.25s, color 0.25s',
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
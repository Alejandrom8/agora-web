import React, { useRef, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';

interface AvatarUploaderProps {
  onFileUpload: (file: File | null) => void;
  size?: number;
  initialImageUrl?: string | null;
  accept?: string[]; // mime types
}

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'isdrag',
})<{ size: number; isdrag: boolean }>(({ theme, size, isdrag }) => ({
  width: size,
  height: size,
  minWidth: size,
  minHeight: size,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: theme.shadows[1],
  border: `2px solid ${isdrag ? theme.palette.primary.main : alpha(theme.palette.divider, 0.6)}`,
  transition: theme.transitions.create(['box-shadow', 'border-color', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[3],
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export default function AvatarUploader({
  onFileUpload,
  size = 120,
  initialImageUrl = null,
  accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // notify parent if initial image provided
    if (!file && initialImageUrl) {
      setPreview(initialImageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImageUrl]);

  useEffect(() => {
    // revoke object URL when unmount or file changes
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateFile = useCallback(
    (f: File) => {
      if (!accept.includes(f.type)) {
        return 'Tipo de archivo no permitido. Usa JPEG, JPG, PNG o SVG.';
      }
      return null;
    },
    [accept],
  );

  const handleSelectFile = (f: File) => {
    const validation = validateFile(f);
    if (validation) {
      setError(validation);
      onFileUpload(null);
      return;
    }
    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    onFileUpload(f);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectFile(e.target.files[0]);
    }
  };

  const handleRemove = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onFileUpload(null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const triggerFileDialog = () => {
    setError(null);
    inputRef.current?.click();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <StyledRoot
        size={size}
        isdrag={isDragActive}
        onClick={triggerFileDialog}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        aria-label="Subir avatar"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(',')}
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />

        {preview ? (
          <>
            <Box
              component="img"
              src={preview}
              alt="Avatar preview"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                zIndex: 1,
              }}
            />
            <IconButton
              size="small"
              onClick={handleRemove}
              aria-label="Eliminar imagen"
              sx={(theme) => ({
                position: 'absolute',
                top: 6,
                right: 6,
                zIndex: 2,
                backgroundColor: alpha(theme.palette.common.black, 0.6),
                color: theme.palette.common.white,
                '&:hover': { backgroundColor: alpha(theme.palette.common.black, 0.75) },
              })}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Box textAlign="center" px={1}>
            <CloudUploadIcon sx={{ color: 'text.secondary', fontSize: Math.max(20, size / 4) }} />
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 0.5 }}
              color="text.secondary"
            >
              Arrastra o haz click
            </Typography>
          </Box>
        )}
      </StyledRoot>

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

(AvatarUploader as any).propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  size: PropTypes.number,
  initialImageUrl: PropTypes.string,
  accept: PropTypes.arrayOf(PropTypes.string),
};

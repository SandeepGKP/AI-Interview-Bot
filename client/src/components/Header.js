import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { VideoCall, Dashboard, Home, Assessment, AccountCircle, Notifications, PhotoCamera, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import i18n from '../i18n';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profilePhoto') || null);
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profilePhoto) {
      localStorage.setItem('profilePhoto', profilePhoto);
    } else {
      localStorage.removeItem('profilePhoto');
    }
  }, [profilePhoto]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
    handleMenuClose();
  };

  const handlePhotoRemove = () => {
    setProfilePhoto(null);
    handleMenuClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <AppBar position="sticky" elevation={2} sx={{ backgroundColor: '#ffffff', color: '#333' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => navigate('/')}>
          <VideoCall sx={{ color: '#1976d2' }} />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' ,color:"blue" }}>
          {t('header_title')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            color="inherit"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              color: location.pathname === '/' ? '#1976d2' : 'inherit'
            }}
          >
            {t('home')}
          </Button>
          
          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => navigate('/recruiter')}
            sx={{
              fontWeight: location.pathname === '/recruiter' ? 'bold' : 'normal',
              color: location.pathname === '/recruiter' ? '#1976d2' : 'inherit'
            }}
          >
            {t('Dashboard')}
          </Button>
          <IconButton color="inherit" aria-label="notifications">
            <Notifications />
          </IconButton>
          
          <IconButton color="inherit" aria-label="account" onClick={handleMenuOpen}>
            {profilePhoto ? (
              <Avatar src={profilePhoto} alt="Profile" sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={triggerFileInput}>
              <PhotoCamera sx={{ mr: 1 }} /> {t('upload_photo')}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </MenuItem>
            {profilePhoto && (
              <MenuItem onClick={handlePhotoRemove}>
                <Delete sx={{ mr: 1 }} /> {t('remove_photo')}
              </MenuItem>
            )}
          </Menu>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, ml: 2 }}>
            <InputLabel id="language-select-label" sx={{ color: 'inherit' }}>Select Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={i18n.language}
              onChange={(event) => i18n.changeLanguage(event.target.value)}
              label={t('language_selector_label')}
              sx={{ color: 'inherit', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '.MuiSvgIcon-root': { color: 'inherit' } }}
            >
              {Object.keys(i18n.options.resources).map((lang) => (
                <MenuItem key={lang} value={lang}>
              {t(lang === 'en' ? 'English' : lang === 'es' ? 'Spanish' : lang === 'fr' ? 'French' : lang === 'hi' ? 'Hindi' : lang)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

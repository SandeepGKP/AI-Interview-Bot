import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { VideoCall, Dashboard, Home, Info, Assessment, AccountCircle, Notifications, PhotoCamera, Delete } from '@mui/icons-material';
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: "blue", fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          {t('header_title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 2 }, alignItems: 'center' }}>
          <Button
            color="inherit"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              color: location.pathname === '/' ? '#1976d2' : 'inherit',
              fontSize: { xs: '0.75rem', sm: 'inherit' }, // Smaller font on xs
              minWidth: { xs: 'auto', sm: '64px' }, // Adjust minWidth for smaller screens
              padding: { xs: '4px 8px', sm: '6px 16px' } // Adjust padding
            }}
          >
            <span className="hidden sm:inline">{t('home')}</span>
            <span className="sm:hidden">Home</span>
          </Button>

          <Button
            color="inherit"
            startIcon={<Dashboard />}
            onClick={() => navigate('/recruiter')}
            sx={{
              fontWeight: location.pathname === '/recruiter' ? 'bold' : 'normal',
              color: location.pathname === '/recruiter' ? '#1976d2' : 'inherit',
              fontSize: { xs: '0.75rem', sm: 'inherit' },
              minWidth: { xs: 'auto', sm: '64px' },
              padding: { xs: '4px 8px', sm: '6px 16px' }
            }}
          >
            <span className="hidden sm:inline">{t('Dashboard')}</span>
            <span className="sm:hidden">Dash</span>
          </Button>
          <IconButton color="inherit" aria-label="notifications" sx={{ padding: { xs: '4px', sm: '8px' } }}>
            <Notifications sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          </IconButton>

          <IconButton color="inherit" aria-label="account" onClick={handleMenuOpen} sx={{ padding: { xs: '4px', sm: '8px' } }}>
            {profilePhoto ? (
              <Avatar src={profilePhoto} alt="Profile" sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }} />
            ) : (
              <AccountCircle sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
            )}
          </IconButton>

          <Button
            color="inherit"
            startIcon={<Info />}
            onClick={() => navigate('/about')}
            sx={{
              fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
              color: location.pathname === '/about' ? '#1976d2' : 'inherit',
              fontSize: { xs: '0.75rem', sm: 'inherit' },
              minWidth: { xs: 'auto', sm: '64px' },
              padding: { xs: '4px 8px', sm: '6px 16px' }
            }}
          >
            <span className="hidden sm:inline">{t('about')}</span>
            <span className="sm:hidden">{t('about')}</span>
          </Button>


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

          {!localStorage.getItem('token') ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{
                  fontWeight: 'bold',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  px: 1,
                  ml: 1,
                  mr: 1
                }}
              >
                {t('login')}
              </Button>
              <Button
                color="inherit"
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  px: 0,
                  ml: 0
                }}
              >
                {t('register')}
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
                window.location.reload(); // Refresh to reset authentication state
              }}
              sx={{
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                px: 0,
                ml: 0
              }}
            >
              {t('logout')}
            </Button>
          )}

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
                  {t(`language.${lang}`)}
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

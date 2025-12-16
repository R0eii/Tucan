import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog, DialogContent,
    Divider,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import { Calendar, Check, Edit2, Mail, Shield, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { APP_THEMES, useAppTheme } from '../../context/ThemeContext'; // ✅ New Context

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { user, login, token } = useAuth();
  const { currentTheme, setTheme, gradient } = useAppTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Edit States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (open && user) {
      setName(user.name);
      setEmail(user.email);
      setError('');
      setIsEditing(false);
    }
  }, [open, user]);

  const handleSave = async () => {
    // 1. Frontend Validation
    if (!name.trim() || !email.trim()) {
      setError('Name and email cannot be empty');
      return;
    }
    // Simple Email Regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // 2. Call Real API
      const res = await fetch('http://localhost:5000/api/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      // 3. Update Context (so the UI updates immediately)
      login(token!, { ...user!, name: data.name, email: data.email });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      {/* ✅ Impactful Header: Uses Global Gradient */}
      <Box sx={{ height: 120, background: gradient, position: 'relative', transition: 'background 0.5s ease' }}>
        <IconButton 
          onClick={onClose} 
          sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.1)' }}
        >
          <X size={20} />
        </IconButton>
        {!isEditing && (
          <IconButton 
            onClick={() => setIsEditing(true)} 
            sx={{ position: 'absolute', top: 8, left: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.1)' }}
          >
            <Edit2 size={16} />
          </IconButton>
        )}
      </Box>

      <DialogContent sx={{ px: 3, pb: 4, pt: 0, mt: -6, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              width: 96, height: 96, bgcolor: 'white', 
              color: 'text.primary', fontSize: 32, fontWeight: 700,
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 2
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>

          {isEditing ? (
            <Box sx={{ width: '100%', mt: 1 }}>
              {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }}>{error}</Alert>}
              
              <TextField 
                fullWidth label="Full Name" size="small" sx={{ mb: 2 }}
                value={name} onChange={(e) => setName(e.target.value)}
              />
              <TextField 
                fullWidth label="Email" size="small" sx={{ mb: 2 }}
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              
              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  APP THEME
                </Typography>
              </Divider>

              {/* ✅ Global Theme Selector */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3, justifyContent: 'center' }}>
                {(Object.keys(APP_THEMES) as Array<keyof typeof APP_THEMES>).map((key) => (
                  <Box
                    key={key}
                    onClick={() => setTheme(key)}
                    sx={{
                      width: 36, height: 36, borderRadius: '50%', 
                      background: APP_THEMES[key].gradient,
                      cursor: 'pointer',
                      border: currentTheme === key ? '3px solid #fff' : '3px solid transparent',
                      boxShadow: currentTheme === key ? '0 0 0 2px #0f172a' : 'none',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  />
                ))}
              </Box>

              <Button 
                variant="contained" fullWidth 
                startIcon={isSaving ? <CircularProgress size={16} color="inherit"/> : <Check size={16}/>}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                {name}
              </Typography>
              <Chip 
                label={user.role.toUpperCase()} 
                size="small" 
                sx={{ mt: 1, fontWeight: 700, bgcolor: '#f1f5f9', color: '#64748b' }} 
              />
              
              <Box sx={{ mt: 4, textAlign: 'left', width: '100%' }}>
                <InfoRow icon={Mail} label="Email Address" value={email} />
                <InfoRow icon={Shield} label="Account Type" value={user.role === 'admin' ? 'Administrator' : 'Viewer'} />
                <InfoRow icon={Calendar} label="Member Since" value="Dec 2025" />
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

const InfoRow = ({ icon: Icon, label, value }: any) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
    <Box sx={{ p: 1, bgcolor: '#f8fafc', borderRadius: 2 }}><Icon size={18} color="#64748b"/></Box>
    <Box>
      <Typography variant="caption" color="#94a3b8" display="block">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value}</Typography>
    </Box>
  </Box>
);
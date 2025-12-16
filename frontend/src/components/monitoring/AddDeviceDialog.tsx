import { 
  Dialog, DialogContent, DialogTitle, Box, TextField, Button, 
  MenuItem, Grid, CircularProgress 
} from '@mui/material';
import { useState } from 'react';

interface AddDeviceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDeviceDialog({ open, onClose, onSuccess }: AddDeviceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    company: '',
    location: '',
    type: 'Gen-X Standard'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Add New Device</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{xs: 12}}>
              <TextField fullWidth label="Device Name" name="name" required onChange={handleChange} />
            </Grid>
            <Grid size={{xs: 6}}>
              <TextField fullWidth label="IP Address" name="ip" required placeholder="192.168.1.1" onChange={handleChange} />
            </Grid>
            <Grid size={{xs: 6}}>
              <TextField fullWidth label="Device Type" name="type" onChange={handleChange} defaultValue="Gen-X Standard" />
            </Grid>
            <Grid size={{xs: 6}}>
              <TextField fullWidth label="Company" name="company" required helperText="Creates new company if not exists" onChange={handleChange} />
            </Grid>
            <Grid size={{xs: 6}}>
              <TextField fullWidth label="Location" name="location" required onChange={handleChange} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button onClick={onClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Create Device'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
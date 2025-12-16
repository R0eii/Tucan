import { 
  Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, 
  IconButton, TextField, Box, Button, Typography, Alert 
} from '@mui/material';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Company {
  id: number;
  name: string;
  deviceCount: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onChange: () => void; // Trigger refresh
}

export default function CompanyManagerDialog({ open, onClose, onChange }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCompanies = () => {
    fetch('http://localhost:5000/api/devices/stats/companies')
      .then(res => res.json())
      .then(setCompanies);
  };

  useEffect(() => {
    if (open) fetchCompanies();
  }, [open]);

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete ${name} and ALL its devices?`)) return;
    await fetch(`http://localhost:5000/api/devices/companies/${name}`, { method: 'DELETE' });
    fetchCompanies();
    onChange();
  };

  const startEdit = (company: Company) => {
    setEditingId(company.id);
    setEditName(company.name);
  };

  const saveEdit = async (oldName: string) => {
    await fetch(`http://localhost:5000/api/devices/companies/${oldName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newName: editName })
    });
    setEditingId(null);
    fetchCompanies();
    onChange();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Manage Companies</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Deleting a company removes all its devices. Renaming updates all associated devices.
        </Alert>
        <List>
          {companies.map((company) => (
            <ListItem
              key={company.id}
              sx={{ borderBottom: '1px solid #f1f5f9', py: 1 }}
              secondaryAction={
                editingId === company.id ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="success" onClick={() => saveEdit(company.name)}><Check size={18} /></IconButton>
                    <IconButton size="small" color="error" onClick={() => setEditingId(null)}><X size={18} /></IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => startEdit(company)}><Edit2 size={18} /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(company.name)}><Trash2 size={18} /></IconButton>
                  </Box>
                )
              }
            >
              {editingId === company.id ? (
                <TextField 
                  size="small" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  sx={{ width: '70%' }}
                />
              ) : (
                <ListItemText 
                  primary={company.name} 
                  secondary={`${company.deviceCount} Devices`} 
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
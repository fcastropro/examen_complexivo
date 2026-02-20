import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControlLabel, Checkbox
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Table, listTablesApi, createTableApi, updateTableApi, deleteTableApi } from "../api/tables.api";

export default function AdminMesasPage() {
  const [items, setItems] = useState<Table[]>([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [is_available, setIsAvailable] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listTablesApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar mesas.");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!name.trim()) return setError("Nombre requerido");

      const payload = { name: name.trim(), capacity: Number(capacity), is_available };
      if (editId) await updateTableApi(editId, payload);
      else await createTableApi(payload);

      setName("");
      setCapacity(4);
      setIsAvailable(true);
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar mesa.");
    }
  };

  const startEdit = (t: Table) => {
    setEditId(t.id);
    setName(t.name);
    setCapacity(t.capacity);
    setIsAvailable(t.is_available);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteTableApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar mesa.");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Mesas</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} sx={{ minWidth: 140 }} />
          <TextField label="Capacidad" type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} sx={{ width: 100 }} />
          <FormControlLabel control={<Checkbox checked={is_available} onChange={(e) => setIsAvailable(e.target.checked)} />} label="Disponible" />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setName(""); setCapacity(4); setIsAvailable(true); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.capacity}</TableCell>
                <TableCell>{t.is_available ? "Sí" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(t)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(t.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

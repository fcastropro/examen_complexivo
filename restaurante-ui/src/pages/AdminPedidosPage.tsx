import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Table as Mesa, listTablesApi } from "../api/tables.api";
import { type Order, type OrderStatus, listOrdersAdminApi, createOrderApi, updateOrderApi, deleteOrderApi } from "../api/orders.api";

const STATUS_OPTIONS: OrderStatus[] = ["PENDING", "IN_PROGRESS", "SERVED", "PAID"];

export default function AdminPedidosPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [tables, setTables] = useState<Mesa[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [table, setTable] = useState<number>(0);
  const [items_summary, setItemsSummary] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState<OrderStatus>("PENDING");

  const load = async () => {
    try {
      setError("");
      const data = await listOrdersAdminApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar pedidos.");
    }
  };

  const loadTables = async () => {
    try {
      const data = await listTablesApi();
      setTables(data.results);
      if (!table && data.results.length > 0) setTable(data.results[0].id);
    } catch {}
  };

  useEffect(() => { load(); loadTables(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!table) return setError("Seleccione una mesa");
      if (!items_summary.trim()) return setError("Resumen de items requerido");
      const totalNum = parseFloat(total);
      if (Number.isNaN(totalNum) || totalNum < 0) return setError("Total debe ser un número válido");

      const payload = {
        table: Number(table),
        items_summary: items_summary.trim(),
        total: String(totalNum),
        status,
      };

      if (editId) await updateOrderApi(editId, { items_summary: payload.items_summary, total: payload.total, status: payload.status });
      else await createOrderApi(payload);

      setEditId(null);
      setItemsSummary("");
      setTotal("");
      setStatus("PENDING");
      await load();
    } catch {
      setError("No se pudo guardar pedido.");
    }
  };

  const startEdit = (o: Order) => {
    setEditId(o.id);
    setTable(o.table);
    setItemsSummary(o.items_summary);
    setTotal(o.total);
    setStatus(o.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteOrderApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar pedido.");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Pedidos</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 260 }}>
              <InputLabel id="table-label">Mesa</InputLabel>
              <Select
                labelId="table-label"
                label="Mesa"
                value={table}
                onChange={(e) => setTable(Number(e.target.value))}
              >
                {tables.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.name} (#{t.id})</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Resumen items" value={items_summary} onChange={(e) => setItemsSummary(e.target.value)} fullWidth placeholder="Hamburguesa x2; Cola x1" />
            <TextField label="Total" value={total} onChange={(e) => setTotal(e.target.value)} sx={{ width: 120 }} type="number" inputProps={{ step: 0.01 }} />
            <FormControl sx={{ width: 160 }}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select labelId="status-label" label="Estado" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setItemsSummary(""); setTotal(""); setStatus("PENDING"); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadTables(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Resumen</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.table_name ?? o.table}</TableCell>
                <TableCell>{o.items_summary}</TableCell>
                <TableCell>{o.total}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(o)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(o.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

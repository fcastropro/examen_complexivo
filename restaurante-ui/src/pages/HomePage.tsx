import { Container, Paper, Typography, Stack } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";

export default function HomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <RestaurantIcon />
          <Typography variant="h5">Restaurante — Gestión de Pedidos</Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Consulta el estado de pedidos (público) o accede al panel admin para mesas y pedidos.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Flujo: Pedidos (estado) → Login → Admin → CRUD Mesas / Pedidos.
        </Typography>
      </Paper>
    </Container>
  );
}

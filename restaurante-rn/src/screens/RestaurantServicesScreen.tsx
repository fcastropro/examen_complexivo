import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listTablesApi } from "../api/tables.api";
import { listMenusApi } from "../api/menus.api";
import { listRestaurantServicesApi, createRestaurantServiceApi, deleteRestaurantServiceApi } from "../api/restaurantServices.api";

import type { Table } from "../types/table";
import type { Menu } from "../types/menu";
import type { RestaurantService } from "../types/restaurantService";
import { toArray } from "../types/drf";

function menuLabel(m: Menu): string {
  return `${m.name} ($${m.price})`;
}

function parseOptionalNumber(input: string): { value?: number; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { value: undefined };
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return { error: "Costo debe ser numérico" };
  return { value: parsed };
}

export default function RestaurantServicesScreen() {
  const [services, setServices] = useState<RestaurantService[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");

  const [notes, setNotes] = useState("");
  const [costInput, setCostInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [menusError, setMenusError] = useState("");

  const tableById = useMemo(() => {
    const map = new Map<number, Table>();
    tables.forEach((t) => map.set(t.id, t));
    return map;
  }, [tables]);

  const menuById = useMemo(() => {
    const map = new Map<string, Menu>();
    menus.forEach((m) => map.set(m.id, m));
    return map;
  }, [menus]);

  const loadAll = async (): Promise<void> => {
    setErrorMessage("");
    setMenusError("");
    try {
      const [servicesData, tablesData] = await Promise.all([
        listRestaurantServicesApi(),
        listTablesApi(),
      ]);
      const servicesList = toArray(servicesData);
      const tablesList = toArray(tablesData);
      setServices(servicesList);
      setTables(tablesList);
      if (selectedTableId === null && tablesList.length) setSelectedTableId(tablesList[0].id);

      try {
        const menusData = await listMenusApi();
        const menusList = toArray(menusData).filter((m) => m && m.id && m.is_available !== false);
        setMenus(menusList);
        if (menusList.length && !selectedMenuId) setSelectedMenuId(menusList[0].id);
        if (menusList.length === 0 && !toArray(menusData).length)
          setMenusError("Backend devolvió 0 ítems. Revise: 1) .env del backend con MONGO_DB=restaurant_logs  2) Estar logueado en la app  3) GET /api/menus/ con token en Postman");
      } catch {
        setMenusError("Menú no cargó. ¿Logueado? ¿Backend en marcha? Emulador: 10.0.2.2:8000. Dispositivo real: IP del PC (ej. 192.168.1.x:8000) en src/config.ts");
        setMenus([]);
      }
    } catch {
      setErrorMessage("No se pudo cargar info.");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createService = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedTableId === null) return setErrorMessage("Seleccione una mesa");
      if (!selectedMenuId) return setErrorMessage("Seleccione un ítem del menú");

      const trimmedNotes = notes.trim() ? notes.trim() : undefined;
      const { value: parsedCost, error } = parseOptionalNumber(costInput);
      if (error) return setErrorMessage(error);

      const created = await createRestaurantServiceApi({
        table_id: selectedTableId,
        menu_id: selectedMenuId,
        notes: trimmedNotes,
        cost: parsedCost,
      });

      setServices((prev) => [created, ...prev]);
      setNotes("");
      setCostInput("");
    } catch {
      setErrorMessage("No se pudo crear servicio");
    }
  };

  const removeService = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteRestaurantServiceApi(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar servicio");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios restaurante</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      {!!menusError && <Text style={styles.error}>{menusError}</Text>}

      <Text style={styles.label}>Mesa</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedTableId ?? ""}
          onValueChange={(value) => setSelectedTableId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {tables.map((t) => (
            <Picker.Item key={t.id} label={t.name} value={t.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Ítem del menú</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedMenuId || ""}
          onValueChange={(value) => setSelectedMenuId(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          <Picker.Item label={menus.length === 0 ? "No hay ítems (refresque)" : "Seleccione..."} value="" />
          {menus.map((m) => (
            <Picker.Item key={m.id} label={menuLabel(m)} value={m.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Notas (opcional)</Text>
      <TextInput
        placeholder="Notas"
        placeholderTextColor="#8b949e"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
      />

      <Text style={styles.label}>Costo (opcional)</Text>
      <TextInput
        placeholder="40"
        placeholderTextColor="#8b949e"
        value={costInput}
        onChangeText={setCostInput}
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable onPress={createService} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const t = tableById.get(item.table_id);
          const menu = (item.menu_id && menuById.get(item.menu_id)) || (item.service_type_id && menuById.get(item.service_type_id));

          const line1 = t ? t.name : `table_id: ${item.table_id}`;
          const line2 = menu ? menu.name : (item.menu_id || item.service_type_id || "-");

          const extras: string[] = [];
          if (item.cost !== undefined) extras.push(`Costo: ${item.cost}`);
          if (item.notes) extras.push(`Notas: ${item.notes}`);
          if (item.date) extras.push(`Fecha: ${item.date}`);

          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>{line1}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>{line2}</Text>
                {extras.map((ext, idx) => (
                  <Text key={idx} style={styles.rowSub} numberOfLines={1}>{ext}</Text>
                ))}
              </View>

              <Pressable onPress={() => removeService(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },

  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },

  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "800" },
});

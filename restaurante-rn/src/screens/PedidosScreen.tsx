import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listTablesApi } from "../api/tables.api";
import { listOrdersApi, createOrderApi, updateOrderApi } from "../api/orders.api";
import type { Table } from "../types/table";
import type { Order, OrderStatus } from "../types/order";
import { toArray } from "../types/drf";

const STATUS_OPTIONS: OrderStatus[] = ["PENDING", "IN_PROGRESS", "SERVED", "PAID"];

export default function PedidosScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [items_summary, setItemsSummary] = useState("");
  const [total, setTotal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const tableById = useMemo(() => {
    const map = new Map<number, Table>();
    tables.forEach((t) => map.set(t.id, t));
    return map;
  }, [tables]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const [ordersData, tablesData] = await Promise.all([
        listOrdersApi(),
        listTablesApi(),
      ]);
      setOrders(toArray(ordersData));
      const tablesList = toArray(tablesData);
      setTables(tablesList);
      if (selectedTableId === null && tablesList.length) setSelectedTableId(tablesList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar datos.");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createOrder = async (): Promise<void> => {
    try {
      setErrorMessage("");
      if (selectedTableId === null) return setErrorMessage("Seleccione una mesa");
      if (!items_summary.trim()) return setErrorMessage("Resumen requerido");
      const totalNum = parseFloat(total);
      if (Number.isNaN(totalNum) || totalNum < 0) return setErrorMessage("Total inválido");

      const created = await createOrderApi({
        table: selectedTableId,
        items_summary: items_summary.trim(),
        total: String(totalNum),
        status: "PENDING",
      });
      setOrders((prev) => [created, ...prev]);
      setItemsSummary("");
      setTotal("");
    } catch {
      setErrorMessage("No se pudo crear pedido.");
    }
  };

  const updateStatus = async (order: Order, newStatus: OrderStatus): Promise<void> => {
    try {
      setErrorMessage("");
      await updateOrderApi(order.id, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
    } catch {
      setErrorMessage("No se pudo actualizar estado.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Mesa</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedTableId ?? ""}
          onValueChange={(v) => setSelectedTableId(Number(v))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {tables.map((t) => (
            <Picker.Item key={t.id} label={t.name} value={t.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Resumen items</Text>
      <TextInput
        placeholder="Hamburguesa x2; Cola x1"
        placeholderTextColor="#8b949e"
        value={items_summary}
        onChangeText={setItemsSummary}
        style={styles.input}
      />

      <Text style={styles.label}>Total</Text>
      <TextInput
        placeholder="0.00"
        placeholderTextColor="#8b949e"
        value={total}
        onChangeText={setTotal}
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable onPress={createOrder} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear pedido</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const t = tableById.get(item.table);
          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText}>#{item.id} · {t ? t.name : item.table}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>{item.items_summary}</Text>
                <Text style={styles.rowSub}>Total: {item.total} · {item.status}</Text>
              </View>
              <View>
                {STATUS_OPTIONS.map((s) => (
                  item.status !== s && (
                    <Pressable key={s} onPress={() => updateStatus(item, s)} style={styles.statusBtn}>
                      <Text style={styles.statusBtnText}>{s}</Text>
                    </Pressable>
                  )
                ))}
              </View>
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
  statusBtn: { paddingVertical: 4, paddingHorizontal: 8, marginBottom: 4, backgroundColor: "#21262d", borderRadius: 6 },
  statusBtnText: { color: "#58a6ff", fontSize: 12 },
});

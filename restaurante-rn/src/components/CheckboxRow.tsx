import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function CheckboxRow({ label, checked, onChange }: Props) {
  return (
    <Pressable onPress={() => onChange(!checked)} style={styles.row}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, marginBottom: 8 },
  box: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: "#30363d",
    backgroundColor: "#161b22",
    alignItems: "center", justifyContent: "center",
    marginRight: 10,
  },
  boxChecked: { borderColor: "#58a6ff" },
  tick: { color: "#58a6ff", fontWeight: "900" },
  text: { color: "#c9d1d9", fontWeight: "700" },
});
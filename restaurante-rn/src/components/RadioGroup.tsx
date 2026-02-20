import { View, Text, Pressable, StyleSheet } from "react-native";

export type RadioOption<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
};

export default function RadioGroup<T extends string>({ label, value, onChange, options }: Props<T>) {
  return (
    <View style={styles.wrap}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable key={opt.value} onPress={() => onChange(opt.value)} style={styles.row}>
            <View style={[styles.outer, selected && styles.outerSelected]}>
              {selected && <View style={styles.inner} />}
            </View>
            <Text style={styles.text}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  outer: {
    width: 22, height: 22, borderRadius: 999,
    borderWidth: 2, borderColor: "#30363d",
    justifyContent: "center", alignItems: "center",
    marginRight: 10, backgroundColor: "#161b22",
  },
  outerSelected: { borderColor: "#58a6ff" },
  inner: { width: 10, height: 10, borderRadius: 999, backgroundColor: "#58a6ff" },
  text: { color: "#c9d1d9", fontWeight: "700" },
});
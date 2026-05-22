import { Text, View } from "react-native";

import { Card } from "./Card";

export function StatTile({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card variant="tile" className="flex-1 gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-muted text-caption">{label}</Text>
        {icon}
      </View>
      <Text className="text-[28px] font-bold text-text tracking-tight">{value}</Text>
      {sub ? <Text className="text-caption text-muted">{sub}</Text> : null}
    </Card>
  );
}

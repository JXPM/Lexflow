import { Text, View } from "react-native";

export function Eyebrow({ children }: { children: string }) {
  return <Text className="text-eyebrow font-semibold uppercase text-secondary">{children}</Text>;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View className="mb-6 flex-row items-start justify-between gap-3">
      <View className="flex-1">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Text className="text-h1 font-bold text-text mt-1">{title}</Text>
        {subtitle ? <Text className="text-muted mt-1">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

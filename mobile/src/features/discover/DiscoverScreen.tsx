import { LinearGradient } from "expo-linear-gradient";
import { Check, ChevronUp, RotateCcw, Volume2 } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { FlatList, LayoutChangeEvent, Pressable, Text, View, type ViewToken } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SEED_WORDS } from "@/data/words";
import { cn } from "@/lib/cn";
import { wordVisual } from "@/lib/wordVisual";
import { speak } from "@/services/tts";
import { useAppStore } from "@/store/useAppStore";
import type { Word } from "@/types";

/** One round action on the Reels-style right rail. */
function RailButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="items-center gap-1.5 active:scale-90">
      <View
        className={cn(
          "h-14 w-14 items-center justify-center rounded-full",
          active ? "bg-white" : "bg-white/20",
        )}
        style={{ backdropFilter: "blur(8px)" } as object}
      >
        {icon}
      </View>
      <Text className="text-white text-[11px] font-semibold">{label}</Text>
    </Pressable>
  );
}

function FeedItem({ word, size }: { word: Word; size: { w: number; h: number } }) {
  const { notebook, toggleSave, markLearned, setStatus } = useAppStore();
  const saved = notebook[word.id]?.saved;
  const learned = notebook[word.id]?.status === "understood" || notebook[word.id]?.status === "mastered";
  const { gradient, Icon } = wordVisual(word);

  return (
    <View style={{ width: size.w, height: size.h }}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Watermark icon */}
        <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
          <Icon size={Math.min(size.w, size.h) * 0.7} color="rgba(255,255,255,0.12)" />
        </View>

        {/* Content column — centered & width-capped on large screens */}
        <View className="flex-1 justify-end px-6 pb-12 pt-16">
          <Animated.View entering={FadeInDown.duration(450)} className="self-center w-full max-w-[560px]">
            <View className="self-start rounded-full bg-white/20 px-3 py-1 mb-4">
              <Text className="text-white text-[12px] font-semibold uppercase tracking-wider">{word.tag}</Text>
            </View>

            <Text className="text-white font-extrabold tracking-tight text-[52px] leading-[56px]">
              {word.term}
            </Text>
            <View className="flex-row items-center gap-3 mt-2">
              <Text className="text-white/80 italic text-body">{word.pos}</Text>
              <Text className="text-white/80 font-mono text-caption">{word.phon}</Text>
            </View>

            <View className="mt-5 rounded-3xl bg-black/20 p-4 gap-2">
              <Text className="text-white text-[17px] leading-6">{word.def}</Text>
              <Text className="text-white/75 italic">« {word.ex} »</Text>
            </View>
          </Animated.View>
        </View>

        {/* Right action rail (Reels style) */}
        <View className="absolute right-4 bottom-28 gap-5 items-center">
          <RailButton
            icon={<Volume2 size={24} color="#fff" />}
            label="Écouter"
            onPress={() => speak(word.term)}
          />
          <RailButton
            icon={<Check size={24} color={learned ? "#34C759" : "#fff"} />}
            label="Compris"
            active={learned}
            onPress={() => markLearned(word.id)}
          />
          <RailButton
            icon={<RotateCcw size={22} color="#fff" />}
            label="Revoir"
            onPress={() => setStatus(word.id, "discovered")}
          />
          <RailButton
            icon={
              <Text style={{ fontSize: 22 }}>{saved ? "🔖" : "📑"}</Text>
            }
            label={saved ? "Gardé" : "Garder"}
            active={saved}
            onPress={() => toggleSave(word.id)}
          />
        </View>

        {/* Scroll hint */}
        <Animated.View
          entering={FadeIn.delay(600)}
          className="absolute bottom-6 self-center flex-row items-center gap-1.5"
          pointerEvents="none"
        >
          <ChevronUp size={16} color="rgba(255,255,255,0.7)" />
          <Text className="text-white/70 text-caption">Fais défiler pour découvrir</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const viewedRef = useRef(new Set<number>());

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  }, []);

  const onViewable = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const idx = viewableItems[0]?.index;
    if (idx != null && !viewedRef.current.has(idx)) {
      viewedRef.current.add(idx);
      speak(SEED_WORDS[idx].term); // auto-play audio when a word scrolls into view
    }
  }, []);

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }} onLayout={onLayout}>
      {size.h > 0 && (
        <FlatList
          data={SEED_WORDS}
          keyExtractor={(w) => w.id}
          renderItem={({ item }) => <FeedItem word={item} size={size} />}
          pagingEnabled
          snapToInterval={size.h}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          getItemLayout={(_, index) => ({ length: size.h, offset: size.h * index, index })}
        />
      )}
    </View>
  );
}

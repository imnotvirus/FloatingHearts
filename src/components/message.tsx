import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AnimatedHearts from "./AnimatedHearts";
import Animated, {
  Extrapolate,
  interpolate,
  spring,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
const { width: WINDOW_WIDTH } = Dimensions.get("window");

interface MessageProps {
  message: string;
  image: string;
}
const Message: React.FC<MessageProps> = ({ message, image }) => {
  const [heartCount, setHeartCount] = useState(0);

  const [hearts, setHearts] = useState<{ id: string }[]>([]);

  const heartCountAnimatedValue = useSharedValue(0); // useRef(new Animated.Value(0)).current;

  const heartTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleCompleteAnimation = (id: string) => {
    setHearts((old) => [...old].filter((heart) => heart.id !== id));
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: heartCountAnimatedValue.value },
        {
          scale: interpolate(
            heartCountAnimatedValue.value,
            [-50, 0],
            [1, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
      zIndex: interpolate(heartCountAnimatedValue.value, [-50, 0], [150, 0]),
    };
  });

  const handleLike = () => {
    if (heartTimeout.current) {
      clearTimeout(heartTimeout.current);
    }
    setHeartCount(heartCount + 1);
    setHearts([...hearts, { id: new Date().getTime().toString() }]);
    heartTimeout.current = setTimeout(() => {
      heartCountAnimatedValue.value = withSpring(0);
    }, 500);
    heartCountAnimatedValue.value = withSpring(-50);
  };

  return (
    <View style={styles.messageContainer}>
      <Image
        style={styles.messageAvatar}
        source={{ uri: image }}
        resizeMode="contain"
      />
      <View style={styles.messageContent}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleLike}
        style={[styles.reactionButton, styles.heartButton, { zIndex: 101 }]}
      >
        {heartCount ? (
          <AntDesign color="red" name="heart" />
        ) : (
          <AntDesign color="red" name="hearto" />
        )}
      </TouchableOpacity>
      <Animated.View
        style={[styles.reactionButton, styles.heartCountCircle, animatedStyle]}
      >
        <Text>{hearts.length}</Text>
      </Animated.View>

      {hearts.map((heart) => (
        <AnimatedHearts
          key={heart.id}
          id={heart.id}
          onCompleteAnimation={handleCompleteAnimation}
        />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  reactionButton: {
    position: "absolute",
    bottom: -8,
    right: -4,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  messageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
  },
  messageContent: {
    width: WINDOW_WIDTH * 0.7,
    backgroundColor: "#19A3FE",
    borderRadius: 8,
    padding: 8,
  },
  messageText: {
    fontSize: 20,
    color: "white",
  },
  heartContainer: {
    position: "absolute",
    bottom: -80,
    right: 0,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  heartButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",

    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "grey",
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowOffset: {
          width: 0.5,
          height: 0.5,
        },
      },
    }),
  },
  heartIcon: {
    position: "absolute",
    width: 18,
    height: 18,
  },
  heartCountCircle: {
    width: 32,
    height: 32,
    right: -8,
    borderRadius: 16,
    backgroundColor: "#FFAA33",
    zIndex: 100,
  },
});

export default Message;

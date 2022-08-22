import React, { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  concat,
  Easing,
  Extrapolate,
  interpolate,
  timing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");
const getRandomSignedValue = () => (Math.random() > 0.5 ? 1 : -1);
const getRandomXOutput = () => {
  return getRandomSignedValue() < 0
    ? -Math.random() * WINDOW_WIDTH * 0.7
    : Math.random() * 10;
};
const getRandomRotateOutput = () => {
  return [getRandomSignedValue() < 0 ? -90 : 90, 0];
};

type AnimatedHeartsProps = {
  id: string;
  onCompleteAnimation: (id: string) => void;
};
const AnimatedHearts: React.FC<AnimatedHeartsProps> = ({
  id,
  onCompleteAnimation,
}) => {
  const animatedValueY = useSharedValue(0);
  const randomXOutput = useRef(getRandomXOutput()).current;
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    animatedValueY.value = withTiming(-WINDOW_HEIGHT * 0.7, {
      duration: 3000,
    });
    rotateValue.value = withTiming(
      getRandomRotateOutput()[0],
      {
        duration: 3000,
      },
      (finished) => {
        if (finished) {
          //onCompleteAnimation(id);
        }
      }
    );

    return () => {
      onCompleteAnimation(id);
    };
  }, [id]);

  const AnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      animatedValueY.value,
      [-WINDOW_HEIGHT, 0],
      [rotateValue.value, 0]
    );
    return {
      transform: [
        {
          translateX: interpolate(
            animatedValueY.value,
            [-WINDOW_HEIGHT, 0],
            [randomXOutput, 0]
          ),
        },
        {
          translateY: interpolate(
            animatedValueY.value,
            [-WINDOW_HEIGHT, -10, 0],
            [-WINDOW_HEIGHT, -50, 0]
          ),
        },
        {
          rotate: `${rotate}deg`,
        },
        {
          scale: interpolate(animatedValueY.value, [-50, 0], [1, 0], "clamp"),
        },
      ],
      opacity: interpolate(
        animatedValueY.value,
        [-WINDOW_HEIGHT * 0.7, 0],
        [0, 1]
      ),
    };
  });
  return (
    <Animated.View style={[styles.heartIcon, AnimatedStyle]}>
      <AntDesign size={24} color="red" name="heart" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  heartIcon: {
    position: "absolute",
    width: 24,
    height: 24,
    right: 0,
  },
});

export default AnimatedHearts;

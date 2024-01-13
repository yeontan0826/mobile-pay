import {useRef} from 'react';
import {Animated, useWindowDimensions} from 'react-native';

interface CardProps {
  index: number;
  color: string;
  xAnim: Animated.Value;
  yAnim: Animated.Value;
  rotateZAnim: Animated.Value;
}

const Card = ({
  index,
  color,
  xAnim,
  yAnim,
  rotateZAnim,
}: CardProps): JSX.Element => {
  const {width} = useWindowDimensions();

  const multiplyValue = useRef(new Animated.Value(index - 3)).current;
  const translateY = Animated.multiply(yAnim, multiplyValue);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        backgroundColor: color,
        width: width * 0.7,
        height: width * 0.7 * 0.58,
        marginTop: index * 20,
        borderRadius: 6,
        shadowOffset: {
          width: -3,
          height: -3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        transform: [
          {translateX: xAnim},
          {translateY: translateY},
          {
            rotateZ: rotateZAnim.interpolate({
              inputRange: [0, 20],
              outputRange: ['0deg', '2deg'],
            }),
          },
        ],
      }}
    />
  );
};

export default Card;

import {useRef, useState} from 'react';
import {Animated, PanResponder, View, useWindowDimensions} from 'react-native';
import Card from '../components/card';

const MobilePay = (): JSX.Element => {
  const {width} = useWindowDimensions();

  const [focus, setFocus] = useState(5);
  const cardRef = useRef<'fold' | 'unfold'>('fold'); // fold, unfold
  const yAnim = useRef(new Animated.Value(0)).current;
  const rotateZAnim = useRef(new Animated.Value(0)).current;

  const card = [
    {color: '#aaa', xAnim: useRef(new Animated.Value(0)).current},
    {color: '#bbb', xAnim: useRef(new Animated.Value(0)).current},
    {color: '#ccc', xAnim: useRef(new Animated.Value(0)).current},
    {color: '#ddd', xAnim: useRef(new Animated.Value(0)).current},
    {color: '#eee', xAnim: useRef(new Animated.Value(0)).current},
    {color: '#f2f2f2f2', xAnim: useRef(new Animated.Value(0)).current},
  ];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const {dy, dx} = gestureState;

      // dx, dy 중 뭐가 더 크게 변했을까
      const XSlider = Math.abs(dy) < Math.abs(dx);
      const YSlider = Math.abs(dx) < Math.abs(dy);

      if (XSlider) {
        if (dx < -5 && cardRef.current === 'fold' && focus >= 0) {
          card[focus].xAnim.setValue(dx);
        }
      }

      if (YSlider) {
        if (dy > 5 && dy < 100 && cardRef.current === 'fold') {
          yAnim.setValue(dy);
        }

        if (dy > 5 && dy < 100 && cardRef.current === 'unfold') {
          rotateZAnim.setValue(dy);
        }

        if (dy < 5 && dy > -75 && cardRef.current === 'unfold') {
          yAnim.setValue(65 + dy);
        }
      }
    },
    onPanResponderEnd: (_, gestureState) => {
      const {dy, dx} = gestureState;

      // dx, dy 중 뭐가 더 크게 변했을까
      const XSlider = Math.abs(dy) < Math.abs(dx);
      const YSlider = Math.abs(dx) < Math.abs(dy);

      if (XSlider) {
        // 카드 버리기
        if (dx < -5 && cardRef.current === 'fold' && focus >= 0) {
          Animated.timing(card[focus].xAnim, {
            toValue: -600,
            duration: 300,
            useNativeDriver: false,
          }).start(({finished}) => {
            if (finished) {
              setFocus(prev => prev - 1);
            }
          });
        }

        // 카드 가져오기
        if (dx > 5 && cardRef.current === 'fold' && focus < 5) {
          Animated.timing(card[focus + 1].xAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start(({finished}) => {
            if (finished) {
              setFocus(prev => prev + 1);
            }
          });
        }
      }

      if (YSlider) {
        if (dy > 5) {
          Animated.spring(yAnim, {
            toValue: 65,
            useNativeDriver: false,
          }).start();
          cardRef.current = 'unfold';
        }

        if (dy > 5 && cardRef.current === 'unfold') {
          Animated.spring(rotateZAnim, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }

        if (dy < -5) {
          Animated.spring(yAnim, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          cardRef.current = 'fold';
        }
      }
    },
  });

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          position: 'relative',
          width: width * 0.7,
          height: width * 0.7 * 0.58 + (card.length - 1) * 20,
        }}>
        {card.map((value, index) => (
          <Card
            key={String(index)}
            {...value}
            index={index}
            yAnim={yAnim}
            rotateZAnim={rotateZAnim}
          />
        ))}
      </View>
    </View>
  );
};

export default MobilePay;

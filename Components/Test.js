// Components/Test.js

import React from 'react'
import {StyleSheet, View, Animated, Easing} from 'react-native'

class Test extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            topPosition: new Animated.Value(0),
            leftPosition: new Animated.Value(0),
        }
    }

    componentDidMount() {
        Animated.timing(
            this.state.topPosition, {
                toValue: 100,
                duration: 3000,
                easing: Easing.bounce
            }
        ).start()
/*        Animated.spring(
            this.state.topPosition,
            {
                toValue: 100,
                speed: 4,
                bounciness: 30
            }
        ).start();*/

/*        Animated.decay(
            this.state.topPosition,
            {
                velocity: 0.8,
                deceleration: 0.997,
            }
        ).start();*/

/*        Animated.parallel([
            Animated.spring(
                this.state.topPosition,
                {
                    toValue: 100,
                    tension: 8,
                    friction: 3
                }
            ),
            Animated.timing(
                this.state.leftPosition,
                {
                    toValue: 100,
                    duration: 1000,
                    easing: Easing.elastic(2)
                }
            )
        ]).start()*/
    }

    render() {
        return (
            <View style={styles.main_container}>
                <Animated.View
                    style={[
                        styles.animation_view,
                        {
                            top: this.state.topPosition,
                            left: this.state.leftPosition
                        }]
                    }>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    animation_view: {
        backgroundColor: 'red',
        width: 100,
        height: 100
    }
})

export default Test

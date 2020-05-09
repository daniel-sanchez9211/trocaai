import React from 'react';
import { Text, Dimensions, Image, Animated, PanResponder } from 'react-native';

import { MainContainer, Cards, Icons, Button, ButtonContainer, Scrollable, DescriptionContainer, CardTitle, Logo, Header, DescriptionText } from './styles';

import api from '~/services/api'

import Background from '~/components/Background'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width



export default class Feed extends React.Component {

    constructor() {
        super()

        this.position = new Animated.ValueXY()
        this.state = {
            products: [],
            currentIndex: 0
        }

        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: ['-10deg', '0deg', '10deg'],
            extrapolate: 'clamp'
        })

        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
            ...this.position.getTranslateTransform()
            ]
        }

        this.likeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        })
        this.dislikeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp'
        })

        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
        })
        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
        })

    }

    loadProducts = async () => {
        const response = await api.get('property')

        this.setState({ products: response.data })
    }

    componentWillMount() {

        this.loadProducts()

        this.PanResponder = PanResponder.create({

            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {

                this.position.setValue({ x: gestureState.dx, y: gestureState.dy })

                if (gestureState.dy < -200 || gestureState.dy > 200) {
                    Animated.spring(this.position, {
                        useNativeDriver: true,
                        toValue: { x: 0, y: 0 },
                        friction: 4
                    }).start()
                }

            },
            onPanResponderRelease: (evt, gestureState) => {

                if (gestureState.dx > 120) {
                    Animated.spring(this.position, {
                        useNativeDriver: true,
                        toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                        this.state.currentIndex >= this.state.products.length && this.setState({ currentIndex: 0 })
                    })

                    this.handleLike(this.state.products[this.state.currentIndex].id)
                }
                else if (gestureState.dx < -120) {
                    Animated.spring(this.position, {
                        useNativeDriver: true,
                        toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                        this.state.currentIndex >= this.state.products.length && this.setState({ currentIndex: 0 })
                    })

                    this.handleDislike(this.state.products[this.state.currentIndex].id)
                }
                else {
                    Animated.spring(this.position, {
                        useNativeDriver: true,
                        toValue: { x: 0, y: 0 },
                        friction: 4
                    }).start()
                }
            }
        })
    }

    renderProducts = () => {

        return this.state.products.map((item, i) => {

            if (i < this.state.currentIndex) {
                return null
            }
            else if (i == this.state.currentIndex) {

                return (
                    <Animated.View
                        {...this.PanResponder.panHandlers}
                        key={item.id} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT * 0.65, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
                        <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 2, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '900', padding: 10 }}>GOSTEI!</Text>

                        </Animated.View>

                        <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 2, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '900', padding: 10 }}>NOPE</Text>

                        </Animated.View>

                        <Image
                            style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                            source={{ uri: item.photos[0].url }} />

                        <CardTitle>{item.photos[0].title}</CardTitle>
                    </Animated.View>
                )
            }
            else {
                return (
                    <Animated.View
                        key={item.id} style={[{
                            opacity: this.nextCardOpacity,
                            transform: [{ scale: this.nextCardScale }],
                            height: SCREEN_HEIGHT * 0.65, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
                        }]}>
                        <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

                        </Animated.View>

                        <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

                        </Animated.View>

                        <Image
                            style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                            source={{ uri: item.photos[0].url }} />
                    </Animated.View>
                )
            }
        }).reverse()
    }

    renderDescription = () => {

        return this.state.products.map((item, i) => {

            if (i < this.state.currentIndex) {
                return null
            }
            else if (i == this.state.currentIndex) {

                return (
                    <DescriptionText>{item.photos[0].description}</DescriptionText>
                )
            }
        }).reverse()

    }

    renderButtons = () => {

        return this.state.products.map((item, i) => {

            if (i < this.state.currentIndex) {
                return null
            }
            else if (i == this.state.currentIndex) {

                return (
                    <>
                        <ButtonContainer onPress={() => this.handleDislikeButton(item.id)}>
                            <Button name="block" size={30} color="#000" />
                        </ButtonContainer>
                        <ButtonContainer onPress={() => this.handleLikeButton(item.id)}>
                            <Button name="favorite" size={30} color="#f64c75" />
                        </ButtonContainer>
                    </>
                )
            }
        }).reverse()

    }

    handleLike = async (id) => {
        await api.post('actions', {
            user_id: "5eb2a364cd6bf4e7d052d0d4",
            property_id: id,
            action_type: 1,
        })
    }

    handleDislike = async (id) => {-nari
        await api.post('actions', {
            user_id: "5eb2a364cd6bf4e7d052d0d4",
            property_id: id,
            action_type: 2,
        })
    }

    handleLikeButton = (id) => {
        Animated.spring(this.position, {
            useNativeDriver: true,
            toValue: { x: SCREEN_WIDTH + 100, y: 36 }
        }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                this.position.setValue({ x: 0, y: 0 })
            })
            this.state.currentIndex >= this.state.products.length && this.setState({ currentIndex: 0 })
        })

        this.handleLike(id)
    }

    handleDislikeButton = (id) => {
        Animated.spring(this.position, {
            useNativeDriver: true,
            toValue: { x: -SCREEN_WIDTH - 100, y: 18 }
        }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                this.position.setValue({ x: 0, y: 0 })
            })
            this.state.currentIndex >= this.state.products.length && this.setState({ currentIndex: 0 })
        })

        this.handleDislike(id)
    }

    render() {
        return (
            <Background>
                <Scrollable>
                    <MainContainer>

                        <Header>
                            <Logo>Logo</Logo>
                        </Header>

                        <Cards>
                            {this.renderProducts()}
                        </Cards>

                        <Icons>
                            {this.renderButtons()}
                        </Icons>

                    </MainContainer>
                    <DescriptionContainer>
                        {this.renderDescription()}

                    </DescriptionContainer>

                </Scrollable>
            </Background>

        );
    }
}


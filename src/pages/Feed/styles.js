import styled from 'styled-components/native';
import { Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export const Scrollable = styled.ScrollView`
`;

export const MainContainer = styled.View`
    height: ${SCREEN_HEIGHT * 0.95}px;
    justify-content: space-between;
`;

export const Header = styled.View`
    justify-content: center;
    align-items: center;
    margin: 20px 0 15px;
`;

export const Logo = styled.Text`
    font-size: 30px;
    color: rgba(255,255,255,0.8);
`;

export const Cards = styled.View`
    flex: 1;
`;

export const CardTitle = styled.Text`
    position: absolute;
    bottom: 30px;
    left: 40px; 
    z-index: 2000; 
    color: #fff; 
    text-shadow: 2px 2px 2px rgba(0,0,0,0.21);
    font-size: 25px;
    font-weight: 600;
    max-width: ${SCREEN_WIDTH * 0.75}px;
`;

export const Icons = styled.View`
    align-self: center;
    flex-direction: row;
`;

export const ButtonContainer = styled.TouchableOpacity`
    height: 60px;
    width: 60px;
    background: rgba(255,255,255,0.05);
    border-radius: 30px;
    justify-content: center;
    align-items: center;
    margin: 10px 6px;
    z-index: -1;
`;

export const Button = styled(Icon)`
`;

export const DescriptionContainer = styled.View`
    justify-content: space-between;
    align-items: center;   
    margin-bottom: 20px;
`;

export const DescriptionText = styled.Text`
    max-width: ${SCREEN_WIDTH * 0.85}px;
`;



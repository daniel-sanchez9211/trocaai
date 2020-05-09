import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

import Feed from './pages/Feed'

export default (signedIn = false) => createAppContainer(
    createSwitchNavigator({
        Sign: createSwitchNavigator({
            SignIn,
            SignUp,
        }),
        App: createStackNavigator({
            Feed,
        }, {
            headerMode: null,
        }),
    }, {
        initialRouteName: signedIn ? 'App' : 'Sign'
        // initialRouteName: 'App'
    }),
);
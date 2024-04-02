import React, { Component } from "react";
import {
    Text,
    StatusBar,
    Image,
    View,
    ImageBackground,
    Platform
} from "react-native";
// import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { useDispatch } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import SideMenu from "../components/SideMenu"
// import {
//     createReduxContainer,
//     createReactNavigationReduxMiddleware,
//     createNavigationReducer,
//   } from 'react-navigation-redux-helpers';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import storageMiddleware, { actions as storageActions } from '../middleware/storageMiddleware';


import { reducer as app } from '../reducers/AppReducer';

import AppContainer from "../screens/AppContainer";
import SplashScreen from "../screens/SplashScreen";
import SignUp from "../screens/auth/SignUp";
import SignIn from "../screens/auth/SignIn";
import Home from "../screens/app/Home";
import IncidentReporting from "../screens/app/IncidentReporting";
import HealthEmergencyInfo from "../screens/app/HealthEmergencyInfo";
import PersonalInfo from "../screens/app/PersonalInfo";
import IncidentListing from "../screens/app/IncidentListing";
import ChangePassword from "../screens/app/ChangePassword";
import ForgotPassword from "../screens/auth/ForgotPassword";
import { actions as appActions } from "../actions/AppActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const logger = createLogger({
    collapsed: true,
    level: 'info',
});

const reducers = combineReducers({ app });
const rootReducer = (state, action) => {
    return reducers(state, action);
}

const middleware = applyMiddleware(thunk, storageMiddleware, logger);
const store = createStore(rootReducer, middleware);
store.dispatch(storageActions.appLoad());


console.disableYellowBox = true;
const SplasStackNew = createStackNavigator();
function GetSplashStack() {
    return (
        <SplasStackNew.Navigator screenOptions={{ headerShown: false }} initialRouteName='SplashScreen'>
            <SplasStackNew.Screen name="SplashScreen" component={SplashScreen} />
        </SplasStackNew.Navigator>
    )
}

// createStackNavigator({
//     SplashScreen: {
//         screen: SplashScreen
//     }
// },
//     {
//         headerMode: "none",
//         initialRouteName: 'SplashScreen'
//     }
// );

const AuthStackNew = createStackNavigator();
function GetAuthStack() {
    return (
        <AuthStackNew.Navigator screenOptions={{ headerShown: false }} initialRouteName='SignIn'>
            <AuthStackNew.Screen name="SignIn" component={SignIn} />
            <AuthStackNew.Screen name="ForgotPassword" component={ForgotPassword} />
        </AuthStackNew.Navigator>
    )
}

// createStackNavigator({

//     SignIn: {
//         screen: SignIn
//     },
//     ForgotPassword: {
//         screen: ForgotPassword
//     }
// },
//     {
//         headerMode: "none",
//         initialRouteName: 'SignIn'
//     }
// );

const HomeStackNew = createStackNavigator();
function GetHomeStack() {
    return (
        <HomeStackNew.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
            <HomeStackNew.Screen name="Home" component={Home} />
            <HomeStackNew.Screen name="IncidentReporting" component={IncidentReporting} />
            <HomeStackNew.Screen name="IncidentListing" component={IncidentListing} />
        </HomeStackNew.Navigator>
    )
}

// createStackNavigator({
//     Home: {
//         screen: Home
//     },
//     IncidentReporting: {
//         screen: IncidentReporting
//     },
//     IncidentListing: {
//         screen: IncidentListing
//     },

//     IncidentReporting: {
//         screen: IncidentReporting
//     }
// },
//     {
//         headerMode: "none",
//         initialRouteName: 'Home'
//     }
// );

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const dispatch = useDispatch();
    return (
        <ImageBackground resizeMode="cover" source={require('../../src/assets/images/sidemenuBG.jpg')} style={{ height:'100%', width: '100%', flexGrow: 1 }} >
            <View {...props} style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'rgba(177, 177, 177, 0.7)'}}>
                <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: Platform.OS === 'ios' ? 70 : 30 }}>
                    <DrawerItemList {...props} />
                    <DrawerItem
                        style={{
                            position: 'relative',
                            left: -15,
                            height: wp(12),
                            width: '75%',
                        }}
                        labelStyle={{ fontSize: wp(4), color: '#fff', fontWeight:'600', paddingLeft: 10 }}
                        label="Logout"
                        onPress={() => {
                            dispatch(appActions.setUserDetails(''));
                            props.navigation.navigate('Auth');
                        }}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}

function MyDrawer() {
    return (
        <Drawer.Navigator
            backBehavior="none"
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: '#FBCA1A',
                drawerItemStyle: {
                    width: '75%',
                    position: 'relative',
                    left: -15,
                    height: wp(12)
                },
                drawerLabelStyle: {
                    letterSpacing: 1,
                    width: wp(200),
                    fontSize: wp(4), 
                    color: '#fff', 
                    fontWeight:'600',
                    paddingLeft: 10
                }
            }}
            initialRouteName={'Dashboard'}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            {/* <Drawer.Screen name="Home" component={SideMenu} /> */}
            <Drawer.Screen name="Dashboard" component={GetHomeStack} options={{ swipeEnabled: false }} />
            <Drawer.Screen name="IncidentReporting" component={IncidentReporting} />
            <Drawer.Screen name="HealthEmergencyInfo" component={HealthEmergencyInfo} />
            <Drawer.Screen name="PersonalInfo" component={PersonalInfo} />
            <Drawer.Screen name="ChangePassword" component={ChangePassword} />
            {/* <Drawer.Screen name="Logout" component={ChangePassword} /> */}
        </Drawer.Navigator>
    )
}

// createDrawerNavigator({

//     Dashboard: {
//         screen: HomeStack
//     },
//     IncidentReporting: {
//         screen: IncidentReporting
//     },
//     HealthEmergencyInfo: {
//         screen: HealthEmergencyInfo
//     },
//     PersonalInfo: {
//         screen: PersonalInfo
//     },

//     ChangePassword: {
//         screen: ChangePassword
//     },
// },
//     {

//         initialRouteName: 'Dashboard',
//         contentComponent: SideMenu,
//         drawerWidth: '70%',
//     }
// )

// let Navigation = <NavigationContainer>
//     {
//         createSwitchNavigator(
//             {
//                 Splash: SplasStack,
//                 Auth: AuthStack,
//                 App: Drawer,
//             },
//             {
//                 initialRouteName: 'Splash'
//             })
//     }
// </NavigationContainer>;

const Stack = createStackNavigator();
export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <NavigationContainer initialRouteName={'Splash'} >
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Splash" component={GetSplashStack} />
                        <Stack.Screen name="Auth" component={GetAuthStack} />
                        <Stack.Screen name="App" component={MyDrawer} />
                    </Stack.Navigator>
                    {/* {getSplashStack()}
                    {getAuthStack()}
                    {getHomeStack()}
                    {myDrawer()} */}
                </NavigationContainer>
            </Provider>
        );
    }
}
import React, { Component } from "react";

import {
    Text,
    SafeAreaView,
    Button,
    View,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    Alert
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { actions as appActions } from "../../actions/AppActions";
import Spinner from "react-native-loading-spinner-overlay";
import showAlertMessage from '../../components/AlertMsg'
var _ = require('lodash');

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userid: '',
            useridError: false,
            password: '',
            passwordError: false
        };
    }

    componentDidMount() {
        this.requestPermission();
    }


    requestPermission = async () => {
        try {
            const grantedLocation = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Access",
                    message:
                        "Gainwell need to access your location for SOS and report incident",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            //   const grantedCamera = await PermissionsAndroid.request(
            //     PermissionsAndroid.PERMISSIONS.CAMERA,
            //     {
            //       title: "Photo App Camera Permission",
            //       message:
            //         "gainwell needs access to your camera ",
            //       buttonNeutral: "Ask Me Later",
            //       buttonNegative: "Cancel",
            //       buttonPositive: "OK"
            //     }
            //   );
            if (grantedLocation === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("1");
            } else {
                console.log("0");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    _onPressButton() {
        this.props.setUserDetails({
            name: "Subhashis Routh",
            eligiblity: "nothing",
            address: "Garia"
        });
        this.props.navigation.navigate('App');
    }

    login() {
        if (!this.state.userid) {
            this.setState({ useridError: true });
            return;
        }
        else {
            this.setState({ useridError: false });
        }
        if (!this.state.password) {
            this.setState({ passwordError: true });
            return;
        }
        else {
            this.setState({ passwordError: false });
        }
        let data = {
            "username": this.state.userid,
            "password": this.state.password
        }
        this.setState({ loading: true })
        this.props.signIn(data).then((res) => {
            console.log('----+++', res.token);
            this.getUserDetails(res.token);
        }).catch((error) => {
            console.log('err >>>>>>>>>', error, error?.response);
            this.setState({ loading: false })
            showAlertMessage('Error', error?.response?.data?.details);
        })
    }

    getUserDetails(token) {
        console.log('tok', token);
        let header = {
            'x-access-token': token
        }
        this.props.getUserDetails(header).then((res) => {
            console.log('11', res, _.maxBy(res, 'role_id'), _.indexOf(res, _.maxBy(res, 'role_id')));
            let data = {
                details: _.maxBy(res, 'role_id'),
                token,
                userRoles: res,
                activeRoleIndex: _.indexOf(res, _.maxBy(res, 'role_id')),
                empRoleIndex: _.indexOf(res, _.minBy(res, 'role_id')),
            }
            this.props.setUserDetails(data)
            this.setState({ loading: false })
            this.props.navigation.navigate('App')
        })
            .catch((error) => {
                console.log(error.response);
                this.setState({ loading: false })
            })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Spinner
                    visible={this.state.loading}
                    color={'#000'}
                />
                <Image source={require('../../assets/images/logo.jpg')}
                    style={{ width: wp(70), height: wp(15), resizeMode: 'contain' }}></Image>

                <View style={{ alignItems: 'center', marginTop: hp(15) }}>
                    {/* <Text style={{fontSize:wp(4)}}>Employee ID</Text> */}
                    <TextInput
                        placeholder='Enter employee ID'
                        placeholderTextColor='#a3a3a3'
                        style={{ ...styles.textInput, borderColor: this.state.useridError ? 'red' : '#ccc', color: '#a3a3a3' }}
                        onChangeText={(text) => this.setState({ userid: text })}></TextInput>
                    <TextInput
                        placeholder='Enter password'
                        placeholderTextColor='#a3a3a3'
                        style={{ ...styles.textInput, borderColor: this.state.passwordError ? 'red' : '#ccc', color: '#a3a3a3' }}
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({ password: text })}
                    ></TextInput>

                    <TouchableOpacity style={styles.btnStyle} onPress={() => this.login()}>
                        <Text style={styles.btnText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.push('ForgotPassword')}>
                        <Text style={{ fontSize: wp(3.4), color: '#a3a3a3' }}>Forgot Password?</Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    textInput: {
        width: wp(80),
        height: wp(12),
        borderBottomWidth: 1,
        borderColor: '#ccc',
        fontSize: wp(3.8),
        marginBottom: wp(5)
    },
    btnStyle: {
        width: wp(40), height: wp(11), justifyContent: 'center', alignItems: 'center', borderRadius: wp(5.5),
        backgroundColor: '#FBCA1A', marginVertical: wp(10)
    },
    btnText: { fontSize: wp(4), fontWeight: 'bold' }
})


const mapDispatchToProps = dispatch => ({
    signIn: (data) => dispatch(appActions.signIn(data)),
    getUserDetails: (header) => dispatch(appActions.getUserDetails(header)),
    setUserDetails: (data) => dispatch(appActions.setUserDetails(data)),
});



export default connect(
    null,
    mapDispatchToProps
)(SignIn);

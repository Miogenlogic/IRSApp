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
    Platform,
    StatusBar
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { actions as appActions } from "../../actions/AppActions";
import Header from '../../components/Header';
import Spinner from "react-native-loading-spinner-overlay";
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            oldPassword: '',
            oldPasswordError: false,
            newPassword: '',
            newPasswordError: false
        };
    }
    openDrawer() {
        this.props.navigation.openDrawer();
    }
    changePassword() {
        if (!this.state.oldPassword) {
            this.setState({ oldPasswordError: true });
            return;
        }
        else {
            this.setState({ oldPasswordError: false });
        }
        if (!this.state.newPassword) {
            this.setState({ newPasswordError: true });
            return;
        }
        else {
            this.setState({ newPasswordError: false });
        }

        let data = {
            "old": this.state.oldPassword,
            "password": this.state.newPassword
        }
        let header = {
            'x-access-token': this.props.user.token
        }
        // this.props.navigation.navigate('App');
        console.log(data, header);
        this.setState({ loading: true })
        this.props.changePassword(data, header).then((res) => {
            console.log(res);
            this.setState({ loading: false })
            showAlertMessage('Success', res.message);
        })
            .catch((error) => {
                console.log(error.response);
                this.setState({ loading: false })
                showAlertMessage('Error', error.response.data.details);
            })
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                {Platform.OS === 'ios' && <View style={{
                    width: "100%",
                    height: APPBAR_HEIGHT,
                    backgroundColor: "#FBCA1A"
                }}>
                    <StatusBar
                        barStyle="dark-content"
                    />
                </View>}
                <Spinner
                    visible={this.state.loading}
                    color={'#000'}
                />
                <Header title={'Change Password'} onMenuPress={() => this.openDrawer()}></Header>

                <View style={{ alignItems: 'center', marginTop: hp(15) }}>
                    {/* <Text style={{fontSize:wp(4)}}>Employee ID</Text> */}
                    <TextInput
                        placeholder='Enter old password'
                        secureTextEntry={true}
                        placeholderTextColor='#a3a3a3'
                        style={{ ...styles.textInput, borderColor: this.state.oldPasswordError ? 'red' : '#ccc', color: '#a3a3a3' }}
                        onChangeText={(text) => this.setState({ oldPassword: text })}></TextInput>
                    <TextInput
                        placeholder='Enter new password'
                        secureTextEntry={true}
                        placeholderTextColor='#a3a3a3'
                        style={{ ...styles.textInput, borderColor: this.state.newPasswordError ? 'red' : '#ccc', color: '#a3a3a3' }}
                        onChangeText={(text) => this.setState({ newPassword: text })}></TextInput>

                    <TouchableOpacity style={styles.btnStyle} onPress={() => this.changePassword()}>
                        <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>



                </View>

            </View>
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

function mapStateToProps(state) {
    return {
        user: state.app.userDetails
    };
}
const mapDispatchToProps = dispatch => ({
    changePassword: (data, header) => dispatch(appActions.changePassword(data, header))
});



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword);

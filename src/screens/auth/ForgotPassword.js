import React, { Component } from "react";

import {
    Text,
    SafeAreaView,
    Button,
    View,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { actions as appActions } from "../../actions/AppActions";
import Spinner from "react-native-loading-spinner-overlay";

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userId: '',
            userIdError: false
        };
    }

    submit() {
        if (!this.state.userId) {
            this.setState({ userIdError: true })
            return
        }
        else {
            this.setState({ userIdError: false })
        }

        let data = {
            username: this.state.userId
        }
        this.setState({ loading: true })
        this.props.forgotPassword(data).then((res) => {
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
                        placeholder='Enter email'
                        placeholderTextColor='#a3a3a3'
                        value={this.state.userId}
                        onChangeText={(text) => this.setState({ userId: text })}
                        style={{ ...styles.textInput, borderColor: this.state.userIdError ? 'red' : '#ccc', color: '#a3a3a3' }}>
                    </TextInput>


                    <TouchableOpacity style={styles.btnStyle} onPress={() => this.submit()}>
                        <Text style={styles.btnText}>Send</Text>
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
    forgotPassword: (data) => dispatch(appActions.forgotPassword(data))
});



export default connect(
    null,
    mapDispatchToProps
)(ForgotPassword);

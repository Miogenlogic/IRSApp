import React, { Component } from "react";

import {
    Text,
    SafeAreaView,
    Button
} from "react-native";
import { connect } from 'react-redux';

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    _onPressButton() {
        this.props.navigation.push('SignIn');
    }


    render() {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

                <Text>Register</Text>

                <Button 
                    onPress={this._onPressButton.bind(this)}
                    title="Already registered ? Login"
                    />

            </SafeAreaView>
        );
    }
}



export default connect(
    null,
    null
)(SignUp);

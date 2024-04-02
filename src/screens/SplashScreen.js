import React, { Component } from "react";

import {
    Text,
    StatusBar,
    Image,
    View,
    ImageBackground
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { actions as appActions } from "../actions/AppActions";
var _ = require('lodash');

class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        // 


        var that = this;
        setTimeout(() => {
            
            if(that.props.user && that.props.user.token){
             that.getUserDetails(that.props.user.token)   
            }
            else{
             that.props.navigation.navigate('Auth');   
            }
            
            
        }, 1000);
    }

    getUserDetails(token) {
        console.log('tok', token);
        let header = {
            'x-access-token': token
        }
        this.props.getUserDetails(header).then((res) => {
            console.log('11', res);
            let data = {
                details: _.maxBy(res, 'role_id'),
                token,
                userRoles:res,
                activeRoleIndex:_.indexOf(res,_.maxBy(res, 'role_id')),
                empRoleIndex:_.indexOf(res,_.minBy(res, 'role_id')),
            }
            this.props.setUserDetails(data)
            // this.setState({loading:false})
            this.props.navigation.navigate('App')
        })
            .catch((error) => {
                console.log(error.response);
                // this.setState({loading:false})
                this.props.navigation.navigate('Auth')
            })
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <StatusBar barStyle="light-content" hidden={false}
                    backgroundColor={'#000'} translucent={false} />
                {/* <ImageBackground source={require('../assets/images/sidemenuBG.jpg')} imageStyle={{ resizeMode: 'cover' }} style={{ flex: 1, width: wp(100), justifyContent: "center", alignItems: "center" }}> */}
                <View style={{ flex: 1, width: '100%', backgroundColor: '#F7F7F7', paddingVertical: hp(3), justifyContent: "center", alignItems: "center" }}>
                    <Image source={require('../assets/images/logo2.jpg')}
                        style={{ width: wp(70), height: hp(70), resizeMode: 'contain' }}>

                    </Image>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: hp(3) }}>
                        <Image source={require('../assets/images/logo.jpg')}
                            style={{ width: wp(50), height: hp(9), resizeMode: 'contain', marginRight: wp(5), borderWidth: .5, borderColor: '#fff' }}></Image>
                        {/* <Image source={require('../assets/images/cat75.png')}
                            style={{ width: wp(13), height: hp(13), resizeMode: 'contain' }}></Image> */}
                    </View>


                </View>

                {/* </ImageBackground> */}



            </View>
        );
    }
}



function mapStateToProps(state) {
    return {
        user: state.app.userDetails,
    };
}


const mapDispatchToProps = dispatch => ({
    internalLogin: header => dispatch(authActions.internalLogin(header)),
    getUserDetails: (header) => dispatch(appActions.getUserDetails(header)),
    setUserDetails: (data) => dispatch(appActions.setUserDetails(data)),

});



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SplashScreen);
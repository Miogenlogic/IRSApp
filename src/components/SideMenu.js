import React, { Component } from "react";
import {
    Text,
    SafeAreaView,
    View,
    Dimensions,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView, Platform, UIManager,
    LayoutAnimation,
    ImageBackground

} from "react-native";
import { connect } from 'react-redux';
// import { GoogleSignin, statusCodes } from "react-native-google-signin";
import { Dimension, Images, FontFamily, Colors } from '../components/Theme'
import { actions as appActions } from "../actions/AppActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { width, height } = Dimensions.get('window');

const SECTIONS = [
    {
        title: 'My Account',
        content: [
            { value: 'Orders', key: 1 },
            { value: 'Cart', key: 2 },
            { value: 'Profile', key: 3 },
            { value: 'Change Password', key: 4 },
            { value: 'Address', key: 5 }
        ]
    },

];

class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSections: [],
            active: false,
            isSubmenu: false
        };
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }

    }

    logOut = () => {
        this.props.setUserDetails('')
        this.props.navigation.navigate('Auth')
    }
    componentDidMount() {
        console.log('userDetails', this.props.userDetails)
    }

    changeRole() {
        let data = { ...this.props.user }
        data.details = data.userRoles[data.activeRoleIndex == 0 ? 1 : 0];
        data.activeRoleIndex = data.activeRoleIndex == 0 ? 1 : 0;

        let APIdata = {
            role: data.details.role
        }
        let header = {
            'x-access-token': this.props.user?.token
        }
        this.props.getIncidentCount(APIdata, header).then((res) => {
            console.log(res);
            data.incidentCount = res[0];
            this.props.setUserDetails(data);
            this.props.navigation.navigate('Dashboard');
        })
            .catch((error) => {
                console.log(error.response);
                // this.setState({ loading: false })
                // showAlertMessage('Error', error.response.data.details);
            })
    }

    getIncidentCount() {

        let data = {
            role: this.props.user?.details.role
        }
        let header = {
            'x-access-token': this.props.user?.token
        }
        this.props.getIncidentCount(data, header).then((res) => {
            console.log(res);
            // this.setState({ loading: false })
            // showAlertMessage('Success', res.message);
            this.setState({ incidentCount: res[0] })
            let data = { ...this.props.user };
            data.incidentCount = res[0];
            this.props.setUserDetails(data)

        })
            .catch((error) => {
                console.log(error.response);
                // this.setState({ loading: false })
                // showAlertMessage('Error', error.response.data.details);
            })
    }



    render() {
        const { details, userRoles, activeRoleIndex } = this.props.user ? this.props.user : {}
        console.log('side menu --',this.props.navigation);
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
                <ImageBackground source={require('../../src/assets/images/sidemenuBG.jpg')} style={{ flex: 1, width: '100%' }} imageStyle={{ resizeMode: 'stretch' }}>
                    <View style={{ flex: 1, width: '100%', backgroundColor: 'rgba(177, 177, 177,.7)', paddingVertical: hp(3) }}>
                        <Text style={{ fontSize: wp(10), color: '#fff', alignSelf: 'center' }}>Hello!</Text>
                        <Text style={{ fontSize: wp(5), color: '#fff', alignSelf: 'center' }}>{details?.employeeName}</Text>

                        <View style={{ marginTop: hp(10) }}>
                            <TouchableOpacity style={{
                                height: wp(12), backgroundColor: '#FBCA1A',
                                justifyContent: 'center', alignItems: 'center', width: wp(68),
                                flexDirection: 'row', borderTopRightRadius: wp(6), borderBottomRightRadius: wp(6), marginBottom: wp(3)
                            }}
                                onPress={() => {
                                    this.props.navigation.closeDrawer();
                                    let data = { ...this.props.user }
                                    data.details = data.userRoles[data.activeRoleIndex];
                                    // data.activeRoleIndex = data.activeRoleIndex == 0 ? 1 : 0;

                                    let APIdata = {
                                        role: data.details.role
                                    }
                                    let header = {
                                        'x-access-token': this.props.user?.token
                                    }
                                    this.props.getIncidentCount(APIdata, header).then((res) => {
                                        console.log(res);
                                        data.incidentCount = res[0];
                                        this.props.setUserDetails(data);
                                        this.props.navigation.navigate('Dashboard');
                                    })
                                        .catch((error) => {
                                            console.log(error.response);
                                            // this.setState({ loading: false })
                                            // showAlertMessage('Error', error.response.data.details);
                                        })
                                }}>
                                <Text style={{ fontSize: wp(4) }}>{this.props.user?.userRoles?.length<=1?'Dashboard': this.props.user?.userRoles[this.props.user?.activeRoleIndex].role == "employee"?'Employee Dashboard':this.props.user?.userRoles[this.props.user?.activeRoleIndex].role == "safety_head"?'SH Dashboard':'RM Dashboard'}</Text>
                            </TouchableOpacity>


                            {
                                this.props.user?.details.role != "safety_head" ?
                                    <TouchableOpacity style={{
                                        height: wp(12), backgroundColor: '#FBCA1A',
                                        justifyContent: 'center', alignItems: 'center', width: wp(68),
                                        flexDirection: 'row', borderTopRightRadius: wp(6), borderBottomRightRadius: wp(6), marginBottom: wp(3)
                                    }}
                                        onPress={() => {
                                            this.props.navigation.closeDrawer();
                                            this.props.navigation.navigate('IncidentReporting', { isNonEditable: false });
                                        }}>
                                        <Text style={{ fontSize: wp(4) }}>Incident Reporting</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                            }


                            {/* {
                                this.props.user.details.role != "safety_head" ? */}
                                    <TouchableOpacity style={{
                                        height: wp(12), backgroundColor: '#FBCA1A',
                                        justifyContent: 'center', alignItems: 'center', width: wp(68),
                                        flexDirection: 'row', borderTopRightRadius: wp(6), borderBottomRightRadius: wp(6), marginBottom: wp(3)
                                    }}
                                        onPress={() => {
                                            this.props.navigation.closeDrawer();
                                            this.props.navigation.navigate('HealthEmergencyInfo')
                                        }}>
                                        <Text style={{ fontSize: wp(4) }}>Health & Emergency Information</Text>
                                    </TouchableOpacity>
                                    {/* :
                                    null
                            } */}



                            {/* {
                                this.props.user.details.role != "safety_head" ? */}
                                    <TouchableOpacity style={{
                                        height: wp(12), backgroundColor: '#FBCA1A',
                                        justifyContent: 'center', alignItems: 'center', width: wp(68),
                                        flexDirection: 'row', borderTopRightRadius: wp(6), borderBottomRightRadius: wp(6), marginBottom: wp(3)
                                    }}
                                        onPress={() => {
                                            this.props.navigation.closeDrawer();
                                            this.props.navigation.navigate('PersonalInfo')
                                        }}>
                                        <Text style={{ fontSize: wp(4) }}>Personal Information</Text>
                                    </TouchableOpacity>
                                    {/* :
                                    null
                            } */}



                            {
                                userRoles?.length > 1 && userRoles ?
                                    <TouchableOpacity style={{
                                        height: wp(12), backgroundColor: '#FBCA1A',
                                        justifyContent: 'center', alignItems: 'center', width: wp(68),
                                        flexDirection: 'row', borderTopRightRadius: wp(6), borderBottomRightRadius: wp(6), marginBottom: wp(3)
                                    }}
                                        onPress={() => {
                                            // this.changeRole()
                                            this.props.navigation.closeDrawer();
                                            let data = { ...this.props.user }
                                            data.details = data.userRoles[data.empRoleIndex];
                                            // data.activeRoleIndex = data.activeRoleIndex == 0 ? 1 : 0;

                                            let APIdata = {
                                                role: data.details.role
                                            }
                                            let header = {
                                                'x-access-token': this.props.user?.token
                                            }
                                            this.props.getIncidentCount(APIdata, header).then((res) => {
                                                console.log(res);
                                                data.incidentCount = res[0];
                                                this.props.setUserDetails(data);
                                                this.props.navigation.navigate('Dashboard');
                                            })
                                                .catch((error) => {
                                                    console.log(error.response);
                                                    // this.setState({ loading: false })
                                                    // showAlertMessage('Error', error.response.data.details);
                                                })
                                        }}>
                                        <Text style={{ fontSize: wp(4) }}>Employee Dashboard</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                            }
                        </View>
                        <View style={{ position: 'absolute', bottom: wp(8), alignSelf: 'center', alignItems: 'center' }}>
                            {/* {userRoles.length > 1 && userRoles ? <TouchableOpacity style={{ marginBottom: wp(2) }}
                                onPress={() => this.changeRole()}>
                                <Text style={{ fontSize: wp(4), color: '#FBCA1A', }}>Switch to <Text style={{ fontSize: wp(4), color: '#FBCA1A', fontWeight: 'bold' }}>{userRoles[activeRoleIndex == 0 ? 1 : 0].display_name}</Text></Text>
                            </TouchableOpacity> : null} */}
                            <TouchableOpacity style={{ marginBottom: wp(2) }}
                                onPress={() => this.props.navigation.navigate('ChangePassword')}>
                                <Text style={{ fontSize: wp(4), color: '#FBCA1A', }}>Change Password</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.setUserDetails(null)
                                    this.props.navigation.navigate('Auth')
                                }}>
                                <Text style={{ fontSize: wp(4), color: '#FBCA1A', }}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ImageBackground>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    textGreen: {
        // fontFamily: FontFamily.MuliExtraBold,
        color: Colors.PrimaryColor,
        fontSize: wp(3.5)
    },
    textGrey: {
        // fontFamily: FontFamily.MuliSemiBold,
        color: Colors.Grey,
        fontSize: wp(3)
    }
});
function mapStateToProps(state) {
    return {
        user: state.app.userDetails
    };
}
const mapDispatchToProps = dispatch => ({
    setUserDetails: (data) => dispatch(appActions.setUserDetails(data)),
    getIncidentCount: (data, header) => dispatch(appActions.getIncidentCount(data, header)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SideMenu);

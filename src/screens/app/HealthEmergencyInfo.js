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
    Alert,
    ScrollView,
    Platform,
    StatusBar
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { actions as appActions } from "../../actions/AppActions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker';
import Header from '../../components/Header';
import Modal from 'react-native-modal';
import Spinner from "react-native-loading-spinner-overlay";
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const bloodGroups = [
    'A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'
]
const user = {
    allergic: "",
    blood_group: "",
    bp_problem: "",
    branch: "",
    branch_loc: "",
    dept: "",
    desg: "",
    diabetic: "",
    display_name: "",
    doj: "",
    email: "",
    emergency_contactname: "",
    emergency_number: "",
    employeeName: "",
    employee_address: "",
    employee_age: "",
    employee_dob: "",
    employee_mobile: "",
    employee_sex: "",
    employee_zone: "",
    first_vaccine: "",
    grade: "",
    id: 0,
    illness: "",
    information_share: "",
    primary_no: "",
    relation: null,
    reporting_manager: "",
    reporting_manager_code: "",
    role: "",
    role_id: 0,
    sbu: "",
    second_vaccine: "",
    sinus: "",
    status: "",
    username: "",
}

class HealthEmergencyInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userDetails: user,
            payload: {},
            isDropdownOpen: false,
            data: [
                {
                    title: 'Are you suffering from any illness or disease?',
                    isActive: false
                },
                {
                    title: 'Do you have history of Blood Pressure?',
                    isActive: false
                },
                {
                    title: 'Are you suffering from any respiratory disorders?',
                    isActive: false
                },
                {
                    title: 'Are you Diabetic?',
                    isActive: false
                },
                {
                    title: 'Are you allergic to anything?',
                    isActive: true
                },
            ]
        };

    }

    componentDidMount() {
        let that = this;
        setTimeout(() => {
            let data = [
                {
                    title: 'Are you suffering from any illness or disease?',
                    key: 'illness',
                    isActive: this.props.user.details.illness == 'no' ? false : true
                },
                {
                    title: 'Do you have history of Blood Pressure?',
                    key: 'bp_problem',
                    isActive: this.props.user.details.bp_problem == 'no' ? false : true
                },
                {
                    title: 'Are you suffering from any respiratory disorders?',
                    key: 'sinus',
                    isActive: this.props.user.details.sinus == 'no' ? false : true
                },
                {
                    title: 'Are you Diabetic?',
                    key: 'diabetic',
                    isActive: this.props.user.details.diabetic == 'no' ? false : true
                },
                {
                    title: 'Are you allergic to anything?',
                    key: 'allergic',
                    isActive: this.props.user.details.allergic == 'no' ? false : true
                },
            ]
            that.setState({ userDetails: this.props.user.details, data })
        }, 500);
    }




    openDrawer() {
        this.props.navigation.openDrawer();
    }

    checkItem(key, i) {
        console.log(key);
        let data = [...this.state.data];
        let userDetails = { ...this.state.userDetails }
        let payload = { ...this.state.payload }
        userDetails[key] = !data[i]['isActive'] ? 'yes' : 'no'

        payload[key] = !data[i]['isActive'] ? 'yes' : 'no';
        data[i]['isActive'] = !data[i]['isActive'];
        this.setState({ data, userDetails, payload })
    }

    handelChange(key, val) {
        let data = { ...this.state.userDetails };
        let data2 = { ...this.state.payload };
        data[key] = val;
        data2[key] = val;
        this.setState({ userDetails: data, payload: data2 });
    }

    // updateUser() {
    //     console.log(this.state.payload);
    // }

    updateUser() {
        console.log(this.state.payload);
        let header = {
            'x-access-token': this.props.user.token
        }
        this.setState({ loading: true })
        this.props.updateUser(this.state.payload, header).then((res) => {
            console.log(res);
            let data = this.props.user;
            data.details = this.state.userDetails;
            this.props.setUserDetails(data)
            console.log(this.state.userDetails);
            this.setState({ loading: false })
            showAlertMessage('success', res.message);

        })
            .catch((error) => {
                console.log(error.response);
                this.setState({ loading: false })
                // showAlertMessage('Error', error.response.data.details);
            })
    }


    render() {
        const { userDetails, payload } = this.state;
        console.log(userDetails, payload);
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
                <Modal isVisible={this.state.isDropdownOpen} onBackdropPress={() => this.setState({ isDropdownOpen: false })}>
                    <View style={{ width: wp(80), paddingHorizontal: wp(5), backgroundColor: '#fff', alignSelf: 'center', borderRadius: wp(2), padding: wp(3) }}>
                        <ScrollView>
                            {bloodGroups.map((item, index) => (
                                <TouchableOpacity key={index} style={{ height: wp(10), justifyContent: 'center' }} onPress={() => {
                                    let data = { ...userDetails };
                                    data.blood_group = item
                                    let payload = { ...this.state.payload };
                                    payload['blood_group'] = item;
                                    this.setState({ userDetails: data, isDropdownOpen: false, payload })
                                }}>
                                    <Text style={{ color: '#a3a3a3' }}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        {/* <Text>I am the modal content!</Text> */}
                    </View>
                </Modal>
                <Header title={'Health & Emergency Information'} onMenuPress={() => this.openDrawer()}></Header>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: wp(3), marginTop: wp(6) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Emergency Contact Person Name<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                        <TextInput
                            placeholder='Enter a name'
                            placeholderTextColor='#a3a3a3'
                            value={userDetails.emergency_contactname}
                            onChangeText={(text) => this.handelChange('emergency_contactname', text)}
                            style={styles.textInput}></TextInput>

                    </View>


                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Emergency Contact Number<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter a phone number'
                                placeholderTextColor='#a3a3a3'
                                // editable={false}
                                value={userDetails.emergency_number}
                                onChangeText={(text) => this.handelChange('emergency_number', text)}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>


                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Blood Group<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                        <TouchableOpacity onPress={() => this.setState({ isDropdownOpen: true })}>
                            <TextInput
                                placeholder='Enter blood group'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={userDetails.blood_group}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>


                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Any other information you want to share?<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter other information'
                                placeholderTextColor='#a3a3a3'
                                // editable={false}
                                onChangeText={(text) => this.handelChange('information_share', text)}
                                value={userDetails.information_share}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>



                    {
                        this.state.data.map((item, index) => (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: wp(4) }}>
                                <Text style={{ fontSize: wp(3.8), color: '#6d6d6d', fontWeight: 'bold', width: wp(72) }}>{item.title}<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                                <TouchableOpacity style={{ width: wp(6), height: wp(6), borderRadius: wp(3), borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this.checkItem(item.key, index)}>
                                    {item.isActive ? <View style={{ width: wp(6), height: wp(6), borderRadius: wp(3), backgroundColor: '#5AD002', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={require('../../assets/images/check-mark.png')} style={{ width: wp(3), height: wp(3), resizeMode: 'contain' }}></Image>
                                    </View>
                                        :
                                        <View style={{ width: wp(6), height: wp(6), borderRadius: wp(3), backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../../assets/images/letter-x.png')} style={{ width: wp(3), height: wp(3), resizeMode: 'contain' }}></Image>
                                        </View>}
                                </TouchableOpacity>
                            </View>
                        ))
                    }





                    <TouchableOpacity style={styles.btnStyle} onPress={() => this.updateUser()}>
                        <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>



                </KeyboardAwareScrollView>

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
        marginBottom: wp(5),
        color: '#a3a3a3'
    },
    btnStyle: {
        width: wp(40), height: wp(11), justifyContent: 'center', alignItems: 'center', borderRadius: wp(5.5),
        backgroundColor: '#FBCA1A', marginVertical: wp(10), alignSelf: 'center'
    },
    btnText: { fontSize: wp(4), fontWeight: 'bold' }
})

function mapStateToProps(state) {
    return {
        user: state.app.userDetails
    };
}
const mapDispatchToProps = dispatch => ({
    setUserDetails: (data) => dispatch(appActions.setUserDetails(data)),
    updateUser: (data, header) => dispatch(appActions.updateUser(data, header)),
});



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HealthEmergencyInfo);

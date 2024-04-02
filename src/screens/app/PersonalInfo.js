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
import moment from 'moment';
import Modal from 'react-native-modal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Spinner from "react-native-loading-spinner-overlay";
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
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

let gender = [{ id: 'M', value: 'Male' }, { id: 'F', value: 'Female' }]
class PersonalInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userDetails: user,
            isDropdownOpen: false,
            payload: {}
        };
    }

    componentDidMount() {

        let that = this;
        setTimeout(() => {
            that.setState({ userDetails: this.props.user.details })
        }, 500);
    }

    _onPressButton() {

        this.props.navigation.navigate('App');
    }

    selectImagefromGallery() {
        ImagePicker.openPicker({
            width: 600,
            height: 600,
            cropping: true
        }).then(image => {
            console.log(image);
        });
    }

    selectImagefromCamera() {
        ImagePicker.openCamera({
            width: 600,
            height: 600,
            cropping: true,
        }).then(image => {
            console.log(image);
        });
    }
    openDrawer() {
        this.props.navigation.openDrawer();
    }

    handelChange(key, val) {
        let data = { ...this.state.userDetails };
        let data2 = { ...this.state.payload };
        data[key] = val;
        data2[key] = val;
        this.setState({ userDetails: data, payload: data2 });
    }

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
        console.log(this.state.userDetails);
        const { userDetails } = this.state;
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
                            {
                                gender.map((item, index) => (
                                    <TouchableOpacity key={index} style={{ height: wp(10), justifyContent: 'center' }} onPress={() => {
                                        this.handelChange('employee_sex', item.id);
                                        this.setState({ isDropdownOpen: false });
                                    }}>
                                        <Text style={{ color: '#a3a3a3' }}>{item.value}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                        {/* <Text>I am the modal content!</Text> */}
                    </View>
                </Modal>
                <Header title={'Personal Information'} onMenuPress={() => this.openDrawer()}></Header>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: wp(3), marginTop: wp(6) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Employee ID</Text>
                        <TextInput
                            placeholder='Enter employee id'
                            placeholderTextColor='#a3a3a3'
                            value={userDetails.username}
                            editable={false}
                            style={styles.textInput}></TextInput>

                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Employee Name</Text>
                        <TextInput
                            placeholder='Enter employee name'
                            placeholderTextColor='#a3a3a3'
                            value={userDetails.employeeName}
                            editable={false}
                            style={styles.textInput}></TextInput>

                    </View>
                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Grade</Text>
                        <TouchableOpacity >
                            <TextInput
                                placeholder='Enter a grade'
                                placeholderTextColor='#a3a3a3'
                                // value={'G2'}
                                editable={false}
                                value={userDetails.grade}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Email ID</Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter a email id'
                                placeholderTextColor='#a3a3a3'
                                // value={'falguni.mukhopadhyay@gainwellindia.com'}
                                editable={false}
                                value={userDetails.email}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>DOB<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                        <TouchableOpacity onPress={() => this.setState({ isCalenderVisible: true })}>
                            <TextInput
                                placeholder='Enter a date of birth'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={moment(userDetails.employee_dob).format('DD-MM-YYYY')}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Sex<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                        <TouchableOpacity onPress={() => this.setState({ isDropdownOpen: true })}>
                            <TextInput
                                placeholder='Enter sex'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={userDetails.employee_sex == 'M' ? 'Male' : 'Female'}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>DOJ</Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter date of joining'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={moment(userDetails.doj).format('DD-MM-YYYY')}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Designation</Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter designation'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={userDetails.desg}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>SBU</Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter SBU'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={userDetails.sbu}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Department</Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter department'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={userDetails.dept}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Branch</Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter branch'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={userDetails.branch}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>


                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Primary Mobile number<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter a mobile number'
                                placeholderTextColor='#a3a3a3'
                                // editable={false}
                                onChangeText={(text) => this.handelChange('primary_no', text)}
                                value={userDetails.primary_no}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Secondary Mobile number</Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter a mobile number'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={userDetails.employee_mobile}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Reporting Manager</Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter reporting manager'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={userDetails.reporting_manager}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Address<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter a address'
                                placeholderTextColor='#a3a3a3'
                                // editable={false}
                                onChangeText={(text) => this.handelChange('employee_address', text)}
                                value={userDetails.employee_address}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: wp(3) }}>
                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Safety Head</Text>
                        <TouchableOpacity>
                            <TextInput
                                placeholder='Enter safety head'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={'Shibu Varghese'}
                                style={styles.textInput}></TextInput>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity style={styles.btnStyle} onPress={() => this.updateUser()}>
                        <Text style={styles.btnText}>Submit</Text>
                    </TouchableOpacity>


                </KeyboardAwareScrollView>
                <DateTimePickerModal
                    isVisible={this.state.isCalenderVisible}
                    mode="date"
                    onConfirm={(date) => this.handelChange('employee_dob', moment(date).format('YYYY-MM-DD'))}
                    onCancel={() => this.hideDatePicker()}
                />
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
)(PersonalInfo);

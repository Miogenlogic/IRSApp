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
    Linking,
    StatusBar
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { actions as appActions } from "../../actions/AppActions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker';
import Header from '../../components/Header';
import moment from 'moment';
import { initialWindowMetrics } from "react-native-safe-area-context";
import Geolocation from 'react-native-geolocation-service';
import Modal from 'react-native-modal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import showAlertMessage from '../../components/AlertMsg'
import Spinner from "react-native-loading-spinner-overlay";
const a = moment().subtract(9, 'days').calendar();
const status = [{ value: 'close' }, { value: 'open' }];
const addonInfoOption = [{ value: 'yes' }, { value: 'no' }];
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class IncidentReporting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            rmComment: [],
            shComment: [],
            name: '',
            incidentDate: '',
            incidentTime: '',
            incidentType: {},
            incidentDesc: '',
            personStatus: {},
            location: '',
            states: {},
            district: {},
            city: {},
            photo: null,
            isDropdownOpen: false,
            dropdownData: null,
            activeDropdownVal: [],
            dropdownType: '',
            isCalenderVisible: false,
            isTimerVisible: false,
            comment: '',
            incidentId: null,
            isError: false,
            status: { value: 'close' },
            isAddonInfo: { value: 'no' },
            addonInfo: '',
            save_draft: 1,
            need_informationsh: null,
            incidentStatus: '0'
        };
    }

    componentDidMount() {
        let isNonEditable = this.props.route.params?.isNonEditable;
        console.log('isNonEditable ----->>>>>', isNonEditable);
        if (!isNonEditable) {
            console.log('inside ----', this.props.getLocation)
            this.setState({ incidentDate: '', incidentTime: '', incidentType: {}, incidentDesc: '', personStatus: {} })
            this.setState({ name: this.props.user.details.employeeName })
            Geolocation.requestAuthorization('whenInUse').then((status) => {
                // console.log('permission status ---', status);
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log(latitude, longitude);
                        let data = { latitude, longitude }
                        let header = {
                            'x-access-token': this.props.user.token
                        }
                        this.props.getLocation(data, header).then((res) => {
                            console.log('current location ---->>>', res);
                            // this.setState({ dropdownData: {...this.state.dropdownData,...res} })
                            this.setState({ states: res.state, district: res.district, city: res.city.id ? res.city : {}, location: res.address });
                            this.getMasterData({ state: res.state.value })

                        })
                            .catch((error) => {
                                console.log('error ----', error.response);
                                // this.setState({ loading: false })
                                // showAlertMessage('Error', error.response.data.details);
                            })
                    },
                    (error) => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                        Alert.alert(
                            "Open setting?",
                            "Location access required. Enable it from setting",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "Ok", onPress: () => this.onenSetting() }
                            ]
                        );
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            })


        }
        else {
            this.getIncidentDetails();
        }
        this.getMasterData();
    }


    onenSetting() {
        if (Platform.OS === 'android') {
            Linking.openSettings();
        } else {
            Linking.openURL('app-settings:');
        }
    }

    getMasterData(data = null) {
        let header = {
            'x-access-token': this.props.user.token
        }
        this.props.getMasterData(data, header).then((res) => {
            console.log('master res --->>', res);
            if (!data) {
                this.setState({ dropdownData: res })
            }
            else {
                let data = { ...this.state.dropdownData };
                data.cities = res.cities;
                data.districts = res.districts;
                this.setState({ dropdownData: data })
            }

        })
            .catch((error) => {
                console.log(error.response);
                // this.setState({ loading: false })
                // showAlertMessage('Error', error.response.data.details);
            })
    }

    getIncidentDetails() {
        console.log('getting incident ++++')
        let data = this.props.route.params?.incidentId;
        let header = {
            'x-access-token': this.props.user.token,
        }
        this.setState({ loading: true });
        this.props.getIncidentDetails(data, header).then((res) => {
            console.log('incident detail is --->>++', res[0][0]);
            // this.setState({allIncident:res})
            let data = res[0][0];
            this.setState({
                incidentId: data.id,
                incidentDate: moment(data.incident_date).format('l'),
                incidentTime: data.incident_time,
                incidentStatus: data.status_e,
                incidentType: { value: data.incident_type, id: data.inc_type },
                incidentDesc: data.incident_description,
                personStatus: { value: data.status_name, id: data.injured_status },
                location: data.incident_location,
                image: data.image,
                rmComment: data.RMComments,
                shComment: data.SHComments,
                states: { value: data.stateName, id: data.state },
                district: { value: data.districtName, id: data.district },
                city: { value: data.cityName, id: data.city },
                loading: false,
                name: data.employee_name,
                save_draft: data.save_draft,
                need_informationsh: data.need_informationsh
            })
            this.getMasterData({ state: data.stateName })
        })
            .catch((error) => {
                console.log('error +++----++++++', error.response);
                this.setState({ loading: false })
                showAlertMessage('Error', error.response.data.details);
            })
    }


    selectImagefromGallery() {
        ImagePicker.openPicker({
            width: 900,
            height: 600,
            cropping: true
        }).then(image => {
            console.log(image);
            this.setImage(image);
        });
    }

    selectImagefromCamera() {
        ImagePicker.openCamera({
            width: 900,
            height: 600,
            cropping: true,
        }).then(image => {
            console.log(image);
            this.setImage(image);
        });
    }

    setImage(data) {
        console.log(data);
        this.setState({
            photo: {
                uri: data.path,
                type: "image/jpeg",
                name: Math.floor(Math.random() * 100000000 + 1) + ".jpg"
            }
            // photo:data
        })
    }
    openDrawer() {
        this.props.navigation.openDrawer();
    }
    back() {
        this.props.navigation.pop();
    }

    setDropdownValue(val) {
        if (this.state.dropdownType === 'incidentTypes') {
            this.setState({ incidentType: val });
        }
        else if (this.state.dropdownType === 'status') {
            this.setState({ personStatus: val });
        }
        else if (this.state.dropdownType === 'states') {
            this.setState({ states: val });
            this.getMasterData({ state: val.value })
        }
        else if (this.state.dropdownType === 'districts') {
            this.setState({ district: val });
        }
        else if (this.state.dropdownType === 'cities') {
            console.log('cities', val);
            this.setState({ city: val });
        }
        else if (this.state.dropdownType === 'isopen') {
            this.setState({ status: val });
        }
        else if (this.state.dropdownType === 'addOn') {
            this.setState({ isAddonInfo: val });
            if (val.value === 'yes') {
                this.setState({ isAddonInfo: val, status: { value: 'open' }, comment: '' });
            }
        }
        this.setState({ isDropdownOpen: false });
    }

    submitIncident(save_draft) {
        console.log(
            this.state.name,
            this.state.incidentDate,
            this.state.incidentTime,
            this.state.incidentType,
            this.state.incidentDesc,
            this.state.personStatus,
            this.state.location,
            this.state.states,
            this.state.district,
            this.state.city,
            this.state.photo,
            // this.state.isDropdownOpen,
            // this.state.dropdownData,
            // this.state.activeDropdownVal,
            // this.state.dropdownType
        );

        if (!this.state.name) {
            showAlertMessage('error', 'Please enter name!');
            return
        }
        if (!this.state.incidentDate) {
            showAlertMessage('error', 'Please enter date!');
            return
        }
        if (!this.state.incidentTime) {
            showAlertMessage('error', 'Please enter time!');
            return
        }
        if (!this.state.incidentType.value) {
            showAlertMessage('error', 'Please enter type of incident!');
            return
        }
        if (!this.state.incidentDesc) {
            showAlertMessage('error', 'Please enter incident description!');
            return
        }
        if (!this.state.personStatus.value) {
            showAlertMessage('error', 'Please enter injured person status!');
            return
        }
        if (!this.state.location) {
            showAlertMessage('error', 'Please enter exact location!');
            return
        }
        if (!this.state.states.value) {
            showAlertMessage('error', 'Please enter state!');
            return
        }
        if (!this.state.district.value) {
            showAlertMessage('error', 'Please enter district!');
            return
        }
        if (!this.state.city.value) {
            showAlertMessage('error', 'Please enter city!');
            return
        }
        // if (!this.state.photo) {
        //     showAlertMessage('error', 'Please upload a photo!');
        //     return
        // }


        let data = new FormData();
        data.append('date', this.state.incidentDate);
        data.append('time', this.state.incidentTime);
        data.append('type', this.state.incidentType.id);
        data.append('location', this.state.location);
        data.append('description', this.state.incidentDesc);
        data.append('status', this.state.personStatus.id);
        data.append('city', this.state.city.id);
        data.append('state', this.state.states.id);
        data.append('district', this.state.district.id);
        data.append('image', this.state.photo);
        data.append('save_draft', save_draft);
        let header = {
            'Content-Type': 'multipart/form-data',
            'x-access-token': this.props.user.token,
        }
        this.setState({ loading: true })
        this.props.createIncident(data, header).then((res) => {
            console.log(res.message);
            showAlertMessage('success', res.message);
            this.props.navigation.navigate('Dashboard');
            this.setState({ loading: false })

        })
            .catch((error) => {
                this.setState({ loading: false })

                console.log(error.response);
            })

    }


    updateIncident() {
        console.log(
            this.state.name,
            this.state.incidentDate,
            this.state.incidentTime,
            this.state.incidentType,
            this.state.incidentDesc,
            this.state.personStatus,
            this.state.location,
            this.state.states,
            this.state.district,
            this.state.city,
            this.state.photo,
            // this.state.isDropdownOpen,
            // this.state.dropdownData,
            // this.state.activeDropdownVal,
            // this.state.dropdownType
        );

        if (!this.state.name) {
            showAlertMessage('error', 'Please enter name!');
            return
        }
        if (!this.state.incidentDate) {
            showAlertMessage('error', 'Please enter date!');
            return
        }
        if (!this.state.incidentTime) {
            showAlertMessage('error', 'Please enter time!');
            return
        }
        if (!this.state.incidentType.value) {
            showAlertMessage('error', 'Please enter type of incident!');
            return
        }
        if (!this.state.incidentDesc) {
            showAlertMessage('error', 'Please enter incident description!');
            return
        }
        if (!this.state.personStatus.value) {
            showAlertMessage('error', 'Please enter injured person status!');
            return
        }
        if (!this.state.location) {
            showAlertMessage('error', 'Please enter exact location!');
            return
        }
        if (!this.state.states.value) {
            showAlertMessage('error', 'Please enter state!');
            return
        }
        if (!this.state.district.value) {
            showAlertMessage('error', 'Please enter district!');
            return
        }
        if (!this.state.city.value) {
            showAlertMessage('error', 'Please enter city!');
            return
        }
        if (!this.state.image) {
            if (!this.state.photo) {
                showAlertMessage('error', 'Please upload a photo!');
                return
            }
        }



        let data = new FormData();
        data.append('date', this.state.incidentDate);
        data.append('time', this.state.incidentTime);
        data.append('type', this.state.incidentType.id);
        data.append('location', this.state.location);
        data.append('description', this.state.incidentDesc);
        data.append('status', this.state.personStatus.id);
        data.append('city', this.state.city.id);
        data.append('state', this.state.states.id);
        data.append('district', this.state.district.id);
        if (!this.state.image) {
            data.append('image', this.state.photo);
        }

        data.append('save_draft', 1);
        let header = {
            'Content-Type': 'multipart/form-data',
            'x-access-token': this.props.user.token,
        }
        this.setState({ loading: true })
        this.props.updateIncident(this.state.incidentId, data, header).then((res) => {
            console.log(res.message);
            showAlertMessage('success', res.message);
            this.props.navigation.pop();
            this.setState({ loading: false })

        })
            .catch((error) => {
                this.setState({ loading: false })

                console.log(error.response);
            })

    }



    submitComment() {
        let header = {
            'x-access-token': this.props.user.token,
        }


        // if (this.state.isAddonInfo.value === 'yes' && !this.state.addonInfo) {
        //     showAlertMessage('Error', 'Please enter additional comment!');
        //     return
        // }
        if (this.props.user.details.role == "safety_head") {
            if (this.state.isAddonInfo.value === 'yes' && !this.state.addonInfo) {
                showAlertMessage('Error', 'Please enter additional comment!');
                return
            }
            let data = {
                "incidentId": `${this.state.incidentId}`,
                "safetyHeadDate": `${moment(moment(new Date)).format('YYYY-MM-DD')}`,
                "safetyHeadTime": `${moment(moment(new Date)).format('HH:mm')}`,
                "comment": this.state.comment,
                "status": this.state.status.value,
                "safetyHeadNeedInformation": this.state.addonInfo,
            }
            this.setState({ loading: true });
            this.props.submitSHcomment(data, header).then((res) => {
                console.log(res.message);
                showAlertMessage('success', res.message);
                this.getIncidentDetails();
                this.setState({ loading: false });
                this.props.navigation.pop()

            })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error.response);
                })
        }
        if (this.props.user.details.role == "report_manager") {
            if (!this.state.comment) {
                showAlertMessage('Error', 'Please enter a comment!');
                return
            }
            let data = {
                "incidentId": `${this.state.incidentId}`,
                "managerActionDate": `${moment(moment(new Date)).format('YYYY-MM-DD')}`,
                "managerActionTime": `${moment(moment(new Date)).format('HH:mm')}`,
                "comment": this.state.comment
            }
            this.setState({ loading: true });
            this.props.submitRMcomment(data, header).then((res) => {
                console.log(res.message);
                showAlertMessage('success', res.message);
                this.getIncidentDetails();
                this.setState({ loading: false });
                this.props.navigation.pop()
            })
                .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error.response);
                })
        }

    }




    render() {
        const minDate = new Date(moment().subtract(9, 'days').calendar());
        console.log(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        const isNonEditable = this.props.route.params?.isNonEditable;
        const isSafetyHead = this.props.route.params?.isSafetyHead;
        const isTotal = this.props.route.params?.isTotal;
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
                    <View style={{ width: wp(80), maxHeight: wp(80), backgroundColor: '#fff', alignSelf: 'center', borderRadius: wp(2), padding: wp(3) }}>
                        <ScrollView>
                            {console.log('opening modal --', this.state.activeDropdownVal)}
                            {this.state.activeDropdownVal.map((item, index) => (
                                <TouchableOpacity style={{ height: wp(10), justifyContent: 'center' }} onPress={() => this.setDropdownValue(item)}>
                                    <Text style={{ color: '#a3a3a3' }}>{item.value}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        {/* <Text>I am the modal content!</Text> */}
                    </View>
                </Modal>
                <Header title={'Incident Reporting'} isBack={this.props.route.params?.isNonEditable ? true : false} onBackPress={() => this.back()} onMenuPress={() => this.openDrawer()}></Header>

                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center' }}>

                        <View style={{ marginBottom: wp(3), marginTop: wp(6) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Employee Name</Text>
                            <TextInput
                                placeholder='Enter employee name'
                                placeholderTextColor='#a3a3a3'
                                editable={false}
                                value={this.state.name}
                                style={styles.textInput}>
                            </TextInput>
                        </View>


                        <View style={{ marginBottom: wp(3) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Date of Incident<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                            <TouchableOpacity disabled={this.state.save_draft == '0' ? false : isNonEditable} onPress={() => this.setState({ isCalenderVisible: true })}>
                                <View pointerEvents='none'>
                                    <TextInput
                                        placeholder='Enter a date'
                                        placeholderTextColor='#a3a3a3'
                                        editable={false}
                                        value={this.state.incidentDate}
                                        style={styles.textInput}>
                                    </TextInput>
                                </View>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginBottom: wp(3) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Time of Incident<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                            <TouchableOpacity disabled={this.state.save_draft == '0' ? false : isNonEditable} onPress={() => this.setState({ isTimerVisible: true })}>
                                <View pointerEvents='none'>
                                    <TextInput
                                        placeholder='Enter a time'
                                        placeholderTextColor='#a3a3a3'
                                        editable={false}
                                        value={this.state.incidentTime}
                                        style={styles.textInput}>
                                    </TextInput>
                                </View>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginBottom: wp(3) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Type of Incident<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                            <TouchableOpacity disabled={this.state.save_draft == '0' ? false : isNonEditable} onPress={() => {
                                console.log('this.state.dropdownData +++', this.state.dropdownData ? this.state.dropdownData['incidentTypes'] : [])
                                this.setState({ isDropdownOpen: true, activeDropdownVal: this.state.dropdownData ? this.state.dropdownData['incidentTypes'][0] : [], dropdownType: 'incidentTypes' })
                            }}>
                                <View pointerEvents='none'>
                                    <TextInput
                                        placeholder='Enter incident type'
                                        placeholderTextColor='#a3a3a3'
                                        editable={false}
                                        value={this.state.incidentType.value}
                                        style={styles.textInput}></TextInput>
                                </View>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginBottom: wp(3) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Brief Description of Incident<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                            <TouchableOpacity>
                                <TextInput
                                    placeholder={'Enter a Brief Description of Incident\n \n500 Character(s)'}
                                    placeholderTextColor='#a3a3a3'
                                    multiline={true}
                                    numberOfLines={5}
                                    textAlignVertical='top'
                                    maxLength={500}
                                    // editable={false}
                                    value={this.state.incidentDesc}
                                    style={{ ...styles.textInput, height: wp(25), color: '#a3a3a3' }}
                                    onChangeText={(text) => this.setState({ incidentDesc: text })}></TextInput>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginBottom: wp(3) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Status of Injured Person<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                            <TouchableOpacity disabled={this.state.save_draft == '0' ? false : isNonEditable} onPress={() => this.setState({ isDropdownOpen: true, activeDropdownVal: this.state.dropdownData['status'][0], dropdownType: 'status' })}>
                                <View pointerEvents='none'>
                                    <TextInput
                                        placeholder='Enter status of Injured Person'
                                        placeholderTextColor='#a3a3a3'
                                        editable={false}
                                        value={this.state.personStatus.value}
                                        style={styles.textInput}></TextInput>
                                </View>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginBottom: wp(3) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Exact Location of Incident<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                            <TouchableOpacity>
                                <TextInput
                                    placeholder='Current location'
                                    placeholderTextColor='#a3a3a3'
                                    // editable={false}
                                    value={this.state.location}
                                    style={styles.textInput}
                                    onChangeText={(text) => this.setState({ location: text })}></TextInput>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginBottom: wp(3) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>State<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                            <TouchableOpacity disabled={this.state.save_draft == '0' ? false : isNonEditable} onPress={() => this.setState({ isDropdownOpen: true, activeDropdownVal: this.state.dropdownData['states'][0], dropdownType: 'states' })}>
                                <View pointerEvents='none'>
                                    <TextInput
                                        placeholder='Enter a state'
                                        placeholderTextColor='#a3a3a3'
                                        editable={false}
                                        value={this.state.states.value}
                                        style={styles.textInput}></TextInput>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginBottom: wp(3) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>District<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                            <TouchableOpacity disabled={this.state.save_draft == '0' ? false : isNonEditable} onPress={() => this.setState({ isDropdownOpen: true, activeDropdownVal: this.state.dropdownData['districts'].length > 0 ? this.state.dropdownData['districts'][0] : [], dropdownType: 'districts' })}>
                                <View pointerEvents='none'>
                                    <TextInput
                                        placeholder='Enter a district'
                                        placeholderTextColor='#a3a3a3'
                                        editable={false}
                                        value={this.state.district.value}
                                        style={styles.textInput}></TextInput>
                                </View>
                            </TouchableOpacity>
                        </View>


                        <View style={{ marginBottom: wp(3) }}>
                            <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>City<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                            <TouchableOpacity disabled={this.state.save_draft == '0' ? false : isNonEditable} onPress={() => this.setState({ isDropdownOpen: true, activeDropdownVal: this.state.dropdownData['cities'].length > 0 ? this.state.dropdownData['cities'][0] : [], dropdownType: 'cities' })}>
                                <View pointerEvents='none'>
                                    <TextInput
                                        placeholder='Enter a city'
                                        placeholderTextColor='#a3a3a3'
                                        editable={false}
                                        value={this.state.city.value}
                                        style={styles.textInput}></TextInput>
                                </View>
                            </TouchableOpacity>
                        </View>


                        {this.state.image ?
                            <View>
                                {/* {this.props.user.details.role === "report_manager" && !isSafetyHead && isNonEditable ?<TouchableOpacity
                                    onPress={() => {
                                        console.log(1);
                                        this.setState({ image: null })
                                    }}
                                    style={{
                                        width: wp(10), height: wp(10), borderRadius: wp(5),
                                        backgroundColor: '#000', justifyContent: 'center',
                                        alignItems: 'center', position: 'absolute', right: 0, top: 0, zIndex: 999
                                    }}
                                >
                                    <Image source={require('../../assets/images/letter-x.png')} style={{ width: wp(6), height: wp(6), resizeMode: 'cover' }} />
                                </TouchableOpacity>:null} */}
                                <Image source={{ uri: this.state.image }} style={{ width: wp(80), height: wp(50), resizeMode: 'cover' }} />
                            </View>
                            :
                            this.state.photo ?
                                <View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log(1);
                                            this.setState({ photo: null })
                                        }}
                                        style={{
                                            width: wp(10), height: wp(10), borderRadius: wp(5),
                                            backgroundColor: '#000', justifyContent: 'center',
                                            alignItems: 'center', position: 'absolute', right: 0, top: 0, zIndex: 999
                                        }}
                                    ><Image source={require('../../assets/images/letter-x.png')} style={{ width: wp(6), height: wp(6), resizeMode: 'cover' }} />
                                    </TouchableOpacity>
                                    <Image source={{ uri: this.state.photo.uri }} style={{ width: wp(80), height: wp(50), resizeMode: 'cover' }} />
                                </View>
                                :

                                <TouchableOpacity style={{
                                    width: wp(30), height: wp(30), borderWidth: 1, borderColor: '#1389B9',
                                    borderRadius: wp(2), justifyContent: 'center', alignItems: 'center'
                                }}
                                    onPress={() => {
                                        if (!this.props.route.params?.isNonEditable) {
                                            Alert.alert(
                                                "Image Upload",
                                                "Chose an option",
                                                [
                                                    {
                                                        text: "Cancel",
                                                        onPress: () => console.log("Cancel Pressed"),
                                                        style: "cancel"
                                                    },
                                                    { text: "Camera", onPress: () => this.selectImagefromCamera() },
                                                    { text: "Gallery", onPress: () => this.selectImagefromGallery() }
                                                ]
                                            );
                                        }
                                    }}>
                                    <Text style={{ color: '#1389B9' }}>Add Image</Text>
                                </TouchableOpacity>
                        }

                        {this.state.incidentStatus != '0' && !isTotal ?
                            <View>
                                {
                                    this.props.user.details.role === "report_manager" && !isSafetyHead && isNonEditable ?
                                        <View style={{ marginTop: wp(10) }}>
                                            <View style={{ marginBottom: wp(3) }}>
                                                <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Corrective Action<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                                                <TouchableOpacity>
                                                    <TextInput
                                                        placeholder={'Enter a comment\n \n150 Character(s)'}
                                                        placeholderTextColor='#a3a3a3'
                                                        multiline={true}
                                                        numberOfLines={5}
                                                        textAlignVertical='top'
                                                        maxLength={150}
                                                        // editable={false}
                                                        value={this.state.comment}
                                                        style={{ ...styles.textInput, height: wp(25), color: '#a3a3a3' }}
                                                        onChangeText={(text) => this.setState({ comment: text })}></TextInput>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity style={styles.btnStyle} onPress={() => this.submitComment()}>
                                                <Text style={styles.btnText}>Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                        : null
                                }

                                {
                                    this.props.user.details.role === "safety_head" && isSafetyHead && isNonEditable ?
                                        <View style={{ marginTop: wp(10) }}>
                                            {
                                                this.state.isAddonInfo.value != 'yes' ?
                                                    <View style={{ marginBottom: wp(3) }}>
                                                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Corrective Action<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                                                        <TouchableOpacity>
                                                            <TextInput
                                                                placeholder={'Enter a comment\n \n150 Character(s)'}
                                                                placeholderTextColor='#a3a3a3'
                                                                multiline={true}
                                                                numberOfLines={5}
                                                                textAlignVertical='top'
                                                                maxLength={150}
                                                                // editable={false}
                                                                value={this.state.comment}
                                                                style={{ ...styles.textInput, height: wp(25), color: '#a3a3a3' }}
                                                                onChangeText={(text) => this.setState({ comment: text })}></TextInput>
                                                        </TouchableOpacity>
                                                    </View> : null}
                                            <View style={{ marginBottom: wp(3) }}>
                                                <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Incident Close<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                                                <TouchableOpacity onPress={() => this.setState({ isDropdownOpen: true, activeDropdownVal: status, dropdownType: 'isopen' })}>
                                                    <View pointerEvents='none'>
                                                        <TextInput
                                                            // placeholder='Enter a city'
                                                            placeholderTextColor='#a3a3a3'
                                                            editable={false}
                                                            value={this.state.status.value}
                                                            style={styles.textInput}></TextInput>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ marginBottom: wp(3) }}>
                                                <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Additional Information<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                                                <TouchableOpacity onPress={() => this.setState({ isDropdownOpen: true, activeDropdownVal: addonInfoOption, dropdownType: 'addOn' })}>
                                                    <View pointerEvents='none'>
                                                        <TextInput
                                                            // placeholder='Enter a city'
                                                            placeholderTextColor='#a3a3a3'
                                                            editable={false}
                                                            value={this.state.isAddonInfo.value}
                                                            style={styles.textInput}></TextInput>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>


                                            {
                                                this.state.isAddonInfo.value === 'yes' ?
                                                    <View style={{ marginBottom: wp(3) }}>
                                                        <Text style={{ fontSize: wp(3.8), color: '#6d6d6d' }}>Proposed Corrective Actions<Text style={{ fontSize: wp(3.8), color: 'red' }}>*</Text></Text>
                                                        <TouchableOpacity>
                                                            <TextInput
                                                                placehoylder={'Enter additional comment\n \n150 Character(s)'}
                                                                placeholderTextColor='#a3a3a3'
                                                                multiline={true}
                                                                numberOfLines={5}
                                                                textAlignVertical='top'
                                                                maxLength={150}
                                                                // editable={false}
                                                                value={this.state.addonInfo}
                                                                style={{ ...styles.textInput, height: wp(25), color: '#a3a3a3' }}
                                                                onChangeText={(text) => this.setState({ addonInfo: text })}></TextInput>
                                                        </TouchableOpacity>
                                                    </View>
                                                    :
                                                    null
                                            }


                                            <TouchableOpacity style={styles.btnStyle} onPress={() => this.submitComment()}>
                                                <Text style={styles.btnText}>Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                        : null
                                }
                            </View>
                            :
                            null
                        }

                    </View>

                    {
                        this.props.route.params?.isNonEditable && this.state.save_draft == '1' ?
                            <View style={{ marginTop: hp(3), backgroundColor: '#eae8e8', width: wp(100), paddingHorizontal: wp(3), paddingVertical: wp(3) }}>
                                <Text style={{ fontSize: wp(5), fontWeight: 'bold' }}>Reporting Manager comments table</Text>

                                {this.state.rmComment.length ?
                                    this.state.rmComment.map((item, index) => (
                                        <View style={{
                                            backgroundColor: '#fff',
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            margin: wp(2),
                                            elevation: 2,
                                            padding: wp(2),
                                            borderRadius: 5
                                        }}>
                                            <Text style={{ marginBottom: 5 }}>{item.rm_comment}</Text>
                                            <Text style={{ color: '#ccc' }}>{`${item.rm_date}  ${item.rm_time}`}</Text>
                                        </View>
                                    ))
                                    :

                                    <View style={{
                                        backgroundColor: '#fff',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        margin: wp(2),
                                        elevation: 2,
                                        padding: wp(2),
                                        borderRadius: 5
                                    }}>
                                        <Text style={{ marginBottom: 5 }}>{'No comment found!'}</Text>
                                        {/* <Text style={{ color: '#ccc' }}>{`${item.sf_date}  ${item.sf_time}`}</Text> */}
                                    </View>
                                }

                                <Text style={{ fontSize: wp(5), fontWeight: 'bold' }}>Safety Head comments table</Text>

                                {this.state.need_informationsh ?
                                    <View style={{
                                        backgroundColor: '#fff',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        margin: wp(2),
                                        elevation: 2,
                                        padding: wp(2),
                                        borderRadius: 5
                                    }}>
                                        <Text style={{ marginBottom: 5 }}>{this.state.need_informationsh}</Text>
                                        {/* <Text style={{ color: '#ccc' }}>{`${item.sf_date}  ${item.sf_time}`}</Text> */}
                                    </View>
                                    :
                                    this.state.shComment.length ?
                                        // this.state.shComment.map((item, index) => (
                                        <View style={{
                                            backgroundColor: '#fff',
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            margin: wp(2),
                                            elevation: 2,
                                            padding: wp(2),
                                            borderRadius: 5
                                        }}>
                                            <Text style={{ marginBottom: 5 }}>{this.state.shComment[0].sf_comment}</Text>
                                            <Text style={{ color: '#ccc' }}>{`${this.state.shComment[0].sf_date}  ${this.state.shComment[0].sf_time}`}</Text>
                                        </View>
                                        // ))
                                        :
                                        <View style={{
                                            backgroundColor: '#fff',
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            margin: wp(2),
                                            elevation: 2,
                                            padding: wp(2),
                                            borderRadius: 5
                                        }}>
                                            <Text style={{ marginBottom: 5 }}>{'No comment found!'}</Text>
                                            {/* <Text style={{ color: '#ccc' }}>{`${item.sf_date}  ${item.sf_time}`}</Text> */}
                                        </View>
                                }

                            </View>
                            :
                            null
                    }



                    {
                        !this.props.route.params?.isNonEditable ?
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={styles.btnStyle} onPress={() => {
                                    Alert.alert(
                                        "Alert",
                                        "Are you sure you want to submit?",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            { text: "OK", onPress: () => this.submitIncident(1) }
                                        ]
                                    );
                                }}>
                                    <Text style={styles.btnText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.btnStyle, marginLeft: wp(3) }} onPress={() => {
                                    Alert.alert(
                                        "Alert",
                                        "Are you sure you want to draft?",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            { text: "OK", onPress: () => this.submitIncident(0) }
                                        ]
                                    );
                                }}>
                                    <Text style={styles.btnText}>Draft</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            this.state.save_draft == '0' ?
                                <TouchableOpacity style={styles.btnStyle} onPress={() => {
                                    Alert.alert(
                                        "Alert",
                                        "Are you sure you want to submit?",
                                        [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            { text: "OK", onPress: () => this.updateIncident() }
                                        ]
                                    );
                                }}>
                                    <Text style={styles.btnText}>Submit</Text>
                                </TouchableOpacity>
                                :
                                null
                    }



                </KeyboardAwareScrollView>
                <DateTimePickerModal
                    maximumDate={new Date()}
                    minimumDate={new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)}
                    isVisible={this.state.isCalenderVisible}
                    mode="date"
                    onConfirm={(date) => this.setState({ incidentDate: moment(date).format('YYYY-MM-DD'), isCalenderVisible: false })}
                    onCancel={() => this.setState({ isCalenderVisible: false })}
                />
                <DateTimePickerModal
                    maximumDate={new Date()}
                    isVisible={this.state.isTimerVisible}
                    mode="time"
                    date={new Date()}
                    onConfirm={(time) => {
                        console.log(moment.duration(moment(moment(time).format('YYYY-MM-DD')).diff(moment(this.state.incidentDate))).asDays());
                        console.log(moment.duration(moment(time).diff(new Date())).asSeconds());
                        if (moment.duration(moment(moment(time).format('YYYY-MM-DD')).diff(moment(this.state.incidentDate))).asDays() == 0 && moment.duration(moment(time).diff(new Date())).asSeconds() > 0) {
                            showAlertMessage('error', 'please select a past time!');
                            this.setState({ isTimerVisible: false })
                        }
                        else {
                            this.setState({ incidentTime: moment(time).format('HH:mm'), isTimerVisible: false })
                        }

                    }
                    }
                    onCancel={() => this.setState({ isTimerVisible: false })}
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
        color: '#2e2a2a'
    },
    btnStyle: {
        width: wp(40), height: wp(11), justifyContent: 'center', alignItems: 'center', borderRadius: wp(5.5),
        backgroundColor: '#FBCA1A', marginVertical: wp(10), alignSelf: 'center'
    },
    btnText: { fontSize: wp(4), fontWeight: 'bold', }
})


function mapStateToProps(state) {
    return {
        user: state.app.userDetails
    };
}

const mapDispatchToProps = dispatch => ({
    setUserDetails: (data) => dispatch(appActions.setUserDetails(data)),
    getIncidentDetails: (data, header) => dispatch(appActions.getIncidentDetails(data, header)),
    getLocation: (data, header) => dispatch(appActions.getLocation(data, header)),
    getMasterData: (data, header) => dispatch(appActions.getMasterData(data, header)),
    createIncident: (data, header) => dispatch(appActions.createIncident(data, header)),
    submitRMcomment: (data, header) => dispatch(appActions.submitRMcomment(data, header)),
    submitSHcomment: (data, header) => dispatch(appActions.submitSHcomment(data, header)),
    updateIncident: (id, data, header) => dispatch(appActions.updateIncident(id, data, header)),
});



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IncidentReporting);

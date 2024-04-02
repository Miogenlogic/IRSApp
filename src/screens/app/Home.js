import React, { Component } from "react";
import { connect } from 'react-redux';
import { actions as appActions } from "../../actions/AppActions";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    View,
    TextInput,
    Image,
    Platform,
    StatusBar,
    ScrollView
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Header from '../../components/Header';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isStartCalenderVisible: false,

        };
        this.getIncidentCount = this.getIncidentCount.bind(this);
        this.didFocusSubscription = this.props.navigation.addListener(
            'focus',
            this.getIncidentCount
        );
    }

    componentDidMount() {
        console.log('this props++', JSON.stringify(this.props.user))
        this.getIncidentCount()
    }

    hideDatePicker() {
        this.setState({ isStartCalenderVisible: false })
    }

    showDatePicker() {
        this.setState({ isStartCalenderVisible: true })
    }

    openDrawer() {
        this.props.navigation.openDrawer();
    }

    getIncidentCount() {
        let data = {
            role: this.props?.user?.details?.role
        }
        let header = {
            'x-access-token': this.props?.user?.token
        }
        this.props.getIncidentCount(data, header).then((res) => {
            console.log('incidents >>>>>', res[0][0]);
            // this.setState({ loading: false })
            // showAlertMessage('Success', res.message);
            this.setState({ incidentCount: res[0][0] })
            let data = { ...this.props.user };
            data.incidentCount = res[0][0];
            this.props.setUserDetails(data)
        })
            .catch((error) => {
                console.log(error.response);
                // this.setState({ loading: false })
                // showAlertMessage('Error', error.response.data.details);
            })
    }



    render() {
        const { details, userRoles, activeRoleIndex, incidentCount } = this.props.user ? this.props.user : {}

        return (
            <View style={{ flex: 1, alignItems: "center" }}>
                {Platform.OS === 'ios' && <View style={{
                    width: "100%",
                    height: APPBAR_HEIGHT,
                    backgroundColor: "#FBCA1A"
                }}>
                    <StatusBar
                        barStyle="dark-content"
                    />
                </View>}
                {/* <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'#FBCA1A'}
                />
                {Platform.OS === 'ios' && <View style={{ width: "100%", backgroundColor: '#FBCA1A', height: APPBAR_HEIGHT }} />} */}
                <Header title={this.props.user?.userRoles?.length <= 1 ? 'Dashboard' : this.props.user?.details?.role == "employee" ? 'Employee Dashboard' : this.props.user?.details?.role == "safety_head" ? 'SH Dashboard' : 'RM Dashboard'} onMenuPress={() => this.openDrawer()}></Header>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: "center" }}
                >
               
               
                <Text style={{ fontSize: wp(4.5), color: '#92278F', marginTop: wp(5) }}>Welcome {details?.employeeName}!</Text>

                <View style={{ width: wp(20), height: 2, backgroundColor: '#FBCA1A', marginBottom: wp(4), marginTop: wp(3) }}></View>

                <TouchableOpacity style={styles.tabStyle} onPress={() => this.props.navigation.navigate('IncidentListing', { headerTitle: 'Total Incidents', isTotal: true, count: incidentCount.totalIncident })}>
                    <Text style={{ fontSize: wp(3.8), color: '#fff' }}>{incidentCount && incidentCount.totalIncident ? incidentCount.totalIncident : 0}  {'Total Incidents'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ ...styles.tabStyle, backgroundColor: '#034a96' }} onPress={() => this.props.navigation.navigate('IncidentListing', { headerTitle: 'Pending With Reporting Manager', param: { status: 'pendingWithManager', isManagerClosed: 0 }, isSafetyHead: false, count: incidentCount.pendingIncidentWithManager })}>
                    <Text style={{ fontSize: wp(3.8), color: '#fff' }}>{incidentCount && incidentCount.pendingIncidentWithManager ? incidentCount.pendingIncidentWithManager : 0}  {details?.role_id == 3 ? 'Pending Incidents with Reporting Manager' : details?.role_id == 4 ? 'Pending Incidents with Reporting Manager(s)' : 'Pending Incidents with Reporting Manager'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ ...styles.tabStyle, backgroundColor: '#4BB5FF' }} onPress={() => this.props.navigation.navigate('IncidentListing', { headerTitle: 'Pending With Safety Head', param: { status: 'pendingWithSeafty', isSafetyHeadClosed: 0 }, isSafetyHead: true, count: incidentCount.pendingIncidentWithSafetyHead })}>
                    {/* <Text style={{ fontSize: wp(3.8), color: '#fff' }}>{incidentCount && incidentCount.pendingIncidentWithSafetyHead ? incidentCount.pendingIncidentWithSafetyHead : 0}  {details.role_id == 3 ? 'Pending Incidents with Safety Head' : details.role_id == 4 ? 'Pending Self Incidents' : 'Pending Incidents with Safety Head'}</Text> */}
                    <Text style={{ fontSize: wp(3.8), color: '#fff' }}>{incidentCount && incidentCount.pendingIncidentWithSafetyHead ? incidentCount.pendingIncidentWithSafetyHead : 0}  {'Pending Incidents with Safety Head'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ ...styles.tabStyle, backgroundColor: '#52AD4D' }} onPress={() => this.props.navigation.navigate('IncidentListing', { headerTitle: 'Closed Incidents', param: { status: 'close' } })}>
                    <Text style={{ fontSize: wp(3.8), color: '#fff' }}>{incidentCount && incidentCount.closedIncident ? incidentCount.closedIncident : 0}  Closed Incidents</Text>
                </TouchableOpacity>

                {this.props.user?.details?.role == "employee" ?
                    <TouchableOpacity style={{ ...styles.tabStyle, backgroundColor: '#ffcc35' }} onPress={() => this.props.navigation.navigate('IncidentListing', { headerTitle: 'Draft Incidents', param: { status: 'drafted', save_draft: 1 }, count: incidentCount.draftedIncident })}>
                        <Text style={{ fontSize: wp(3.8), color: '#fff' }}>{incidentCount && incidentCount.draftedIncident ? incidentCount.draftedIncident : 0}  Draft Incidents</Text>
                    </TouchableOpacity> : null}


                {
                    this.props.user?.details?.role != "safety_head" ?
                        <TouchableOpacity style={{ ...styles.btnStyle, marginTop: hp(15) }} onPress={() => this.props.navigation.navigate('IncidentReporting', { isNonEditable: false })}>
                            <Text style={styles.btnText}>Report Incident</Text>
                        </TouchableOpacity>
                        :
                        null
                }
</ScrollView>

                <DateTimePickerModal
                    isVisible={this.state.isStartCalenderVisible}
                    mode="date"
                    onConfirm={() => console.log('confirm clicked')}
                    onCancel={() => this.hideDatePicker()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabStyle: {
        width: wp(90), height: wp(18), backgroundColor: '#F96332',
        marginTop: wp(3), justifyContent: 'center', padding: wp(3),
        borderRadius: wp(1.5),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
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
    setUserDetails: (data) => dispatch(appActions.setUserDetails(data)),
    getIncidentCount: (data, header) => dispatch(appActions.getIncidentCount(data, header)),
});



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);



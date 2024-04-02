import React, { Component } from "react";

import {
    Text,
    StatusBar,
    Image,
    View,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { actions as appActions } from "../../actions/AppActions";
import Header from '../../components/Header';
import moment from 'moment';
import Spinner from "react-native-loading-spinner-overlay";
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class IncidentListing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: this.props?.route.params,
            allIncident: [],
            isloadMore: false,
            page: 1,
            listType: this.props?.navigation?.getState()?.routes[1]?.params?.param?.status ? this.props.navigation.getState().routes[1].params.param.status : 'all',
        };
        this.filterIncedentToShow = this.filterIncedentToShow.bind(this);

    }

    componentDidMount() {
        this.getIncidentList(this.state.page);
        this.didFocusSubscription = this.props?.navigation?.addListener(
            'didFocus',
            payload => {
                this.getIncidentList(this.state.page);
            }
        );
    }

    getIncidentList(page) {
        console.log('page ------->>>>++++', page)
        const pageSend = this.state.listType === 'drafted' ? 3 : page
        let data = {};
        if(this.state.listType === 'drafted'){
            data = { ...this.props?.route.params, role: this.props?.user?.details.role }
        }else {
            data = { ...this.props?.route.params, role: this.props?.user?.details.role, page }
        }
        // let data = { ...this.props?.route.params, role: this.props?.user?.details.role, page: pageSend }
        let header = {
            'x-access-token': this.props?.user.token
        }
        this.setState({ loading: true });
        this.props.getIncidentList(data, header).then((res) => {
            // console.log('insidents list++', page == 1 ? res[0] : [...this.state.allIncident, ...res[0]]);
            this.setState({ allIncident: page == 1 ? res[0] : [...this.state.allIncident, ...res[0]], loading: false, page })
            // this.setState({ loading: false });
        })
            .catch((error) => {
                console.log(error.response);
                this.setState({ loading: false })
                // showAlertMessage('Error', error.response.data.details);
            })
    }

    filterIncedentToShow(statusE, managerAction, safetyAction, saveDraft) {
        if (this.state.listType === 'pendingWithManager' && statusE === "1"  && saveDraft !== "0" && managerAction === "0") {
            return true
        } else if (this.state.listType === 'pendingWithSeafty' && statusE === "1"  && saveDraft !== "0" && safetyAction === "0") {
            return true
        } else if (this.state.listType === 'close' && statusE === "0" && saveDraft !== "0") {
            return true
        } else if (this.state.listType === 'drafted' && saveDraft === "0") {
            return true
        } else if (this.state.listType === 'all' && saveDraft !== "0") {
            return true
        }

        return false;
    }

    back() {
        this.props?.navigation.pop();
    }


    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    render() {
        console.log('navigation ---++', this.state.allIncident.length, this.props?.route, this.props?.navigation, this.state.allIncident);
        return (
            <View style={{ flex: 1, alignItems: "center", }}>
                {Platform.OS === 'ios' && <View style={{
                    width: "100%",
                    height: APPBAR_HEIGHT,
                    backgroundColor: "#FBCA1A"
                }}>
                    <StatusBar
                        barStyle="dark-content"
                    />
                </View>}
                <Header title={this.props?.route.params.headerTitle} isBack={true} onBackPress={() => this.back()}></Header>
                {
                    this.state.loading ?
                        <Spinner
                            visible={this.state.loading}
                            color={'#000'}
                        />
                        :
                        this.state.allIncident.length ?
                            <ScrollView
                                onScroll={({ nativeEvent }) => {
                                    if (this.isCloseToBottom(nativeEvent)) {
                                        console.log(1);
                                        this.setState({ isloadMore: true })
                                    }
                                }}
                                scrollEventThrottle={400}
                            >
                                <View style={{ width: wp(100), alignItems: "center" }}>
                                    {
                                        this.state.allIncident.map((item, index) => {
                                            if(!this.filterIncedentToShow(item.status_e, item.manager_action, item.safety_action, item.save_draft)){
                                                return <View key={index} />
                                            }
                                            return <View
                                                key={index}
                                                style={{
                                                    width: wp(95),
                                                    backgroundColor: '#fff',
                                                    shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 2,
                                                    },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,
                                                    elevation: 5,
                                                    marginTop: !index ? wp(5) : 0,
                                                    marginBottom: wp(10),
                                                    borderRadius: wp(2)
                                                }}
                                            >

                                                <Image source={item.image && item.image.indexOf('null') < 0 ? { uri: item.image } : require('../../assets/images/incident.jpg')}
                                                    style={{ width: wp(95), resizeMode: 'cover', height: wp(57.9), borderTopLeftRadius: wp(1), borderTopRightRadius: wp(1) }}></Image>
                                                <View style={{ padding: wp(2) }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: wp(1) }}>
                                                        <Text style={{ fontWeight: 'bold', color: 'gray' }}>Person Name : </Text>
                                                        <Text style={{ color: 'gray' }}>{item.employee_name}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: wp(1) }}>
                                                        <Text style={{ fontWeight: 'bold', color: 'gray' }}>Date & Time : </Text>
                                                        <Text style={{ color: 'gray' }}>{moment(item.incident_date).format('LL')} {item.incident_time}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: wp(1) }}>
                                                        <Text style={{ fontWeight: 'bold', color: 'gray' }}>Person Status : </Text>
                                                        <Text style={{ color: 'gray' }}>{item.status_name}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: wp(1) }}>
                                                        <Text style={{ fontWeight: 'bold', color: 'gray' }}>Type : </Text>
                                                        <Text style={{ color: 'gray' }}>{item.incident_type}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: wp(1) }}>
                                                        <Text style={{ fontWeight: 'bold', color: 'gray' }}>Location : </Text>
                                                        <Text style={{ width: wp(80), color: 'gray' }}>{item.incident_location}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: wp(1) }}>
                                                        <Text style={{ fontWeight: 'bold', color: 'gray' }}>RM Name : </Text>
                                                        <Text style={{ color: 'gray' }}>{item.manager_name}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: wp(1) }}>
                                                        <Text style={{ fontWeight: 'bold', color: 'gray' }}>Status : </Text>
                                                        <Text style={{ color: 'gray' }}>{item.status_e != '0' ? 'Open' : 'Closed'}</Text>
                                                    </View>
                                                </View>
                                                <TouchableOpacity style={styles.btnStyle} onPress={() => this.props?.navigation.push('IncidentReporting', { isNonEditable: true, incidentId: item.id, isSafetyHead: this.props?.route.params.isSafetyHead, isTotal: this.props?.route.params.isTotal })}>
                                                    <Text style={styles.btnText}>View Details</Text>
                                                </TouchableOpacity>
                                            </View>
                                        })
                                    }


                                    {
                                        this.state.isloadMore ?
                                            <TouchableOpacity style={{ marginBottom: wp(7) }}
                                                onPress={() => this.getIncidentList(this.state.page + 1)}>
                                                <Text style={{ fontWeight: 'bold' }}>Load more</Text>
                                            </TouchableOpacity>
                                            :
                                            null
                                    }

                                </View>
                            </ScrollView>
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>No data found</Text>
                            </View>
                }
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
        marginBottom: wp(2)
    },
    btnStyle: {
        width: wp(40), height: wp(11), justifyContent: 'center', alignItems: 'center', borderRadius: wp(5.5),
        backgroundColor: '#FBCA1A', marginVertical: wp(3), alignSelf: 'center'
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
    getIncidentList: (data, header) => dispatch(appActions.getIncidentList(data, header)),
});



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IncidentListing);
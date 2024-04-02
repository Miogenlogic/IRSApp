import React, { Component } from "react";
import { View, TouchableOpacity, Dimensions, Image, Text, Platform } from "react-native";
import { Colors } from "./Theme";
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { actions as appActions } from "../actions/AppActions";
import Geolocation from 'react-native-geolocation-service';
import showAlertMessage from '../components/AlertMsg'
class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        location:null,
    };
}

  componentDidMount(){
    Geolocation.getCurrentPosition(
      (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          let data = { latitude, longitude }
          this.setState({location:data});
          
      },
      (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
  }

  sos() {
    let header = {
        'x-access-token': this.props.user.token,
    }
    this.props.sos(this.state.location,header).then((res) => {
        console.log(res);
        // this.setState({allIncident:res})
        showAlertMessage('success', res.message);
        
    })
        .catch((error) => {
            console.log(error.response);
            // this.setState({ loading: false })
            showAlertMessage('Error', error.response.data.details);
        })
}



  render() {
    return (
      <View
        style={{
          width: wp(100),
          height: hp(8),
          backgroundColor: '#FBCA1A',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: Platform.OS === 'ios' ? 0 : 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: wp(3),
          borderBottomLeftRadius: wp(3),
          borderBottomRightRadius: wp(3)
        }}
      >
        {!this.props.isBack?<TouchableOpacity onPress={this.props.onMenuPress}>
          <Image source={require('../assets/images/square.png')} style={{ width: wp(10), height: wp(10), resizeMode: 'contain' }}></Image>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={this.props.onBackPress}>
          <Image source={require('../assets/images/arrow.png')} style={{ width: wp(8), height: wp(8), resizeMode: 'contain' }}></Image>
        </TouchableOpacity>}


        <Text style={{ fontSize: wp(4.5), fontWeight: 'bold' }}>{this.props.title}</Text>
        <TouchableOpacity onPress={()=>this.sos()}>
          <Image source={require('../assets/images/sos.png')}
          style={{ width: wp(10), height: wp(10), resizeMode: 'contain' }}></Image>
        </TouchableOpacity>
        
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.app.userDetails
  };
}

const mapDispatchToProps = dispatch => ({
  sos: (data,header) => dispatch(appActions.sos(data,header)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

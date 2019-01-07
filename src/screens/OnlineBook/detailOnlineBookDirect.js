import React, { Component } from "react";
import { Dimensions, TouchableHighlight, StatusBar, Image, Platform, Share } from "react-native";
import {
    Container,
	Header,
	Right, 
	Left, 
	Body,
	Title,
	Content,
	Icon,
	Button,
	Text,
	Spinner,
    View,
    Label,
	Thumbnail,
	Card, 
    CardItem,
    Item,
    Footer,
    FooterTab,
    Badge,
    Toast
} from "native-base";
import Communications from 'react-native-communications';
import { WebBrowser, FileSystem } from 'expo';
import { NavigationActions } from 'react-navigation';
import Barcode from 'react-native-barcode-builder'
import NumberFormat from 'react-number-format';
import styles from "./styles";
import * as session from '../../services/session';
import * as sessionSelectors from '../../services/session/selectors';
import * as api from '../../services/api';
import * as apipon from '../../data/pon/api';
const device = Dimensions.get("window");
const iconLogo = require("../../../assets/pos_indonesia_logo.png");
const onlinelogo = require("../../../assets/pon.png");
//--> Formating date to locale ID
const moment = require('moment');
const Idlocale = require('moment/locale/id');
moment.updateLocale('id',Idlocale);

class detailOnlineBookDirect extends Component {
    constructor(props) {
        super(props);
        this.onShareThis = this.onShareThis.bind(this);
        this._thisDownload = this._thisDownload.bind(this);
        this.state = {
        isLoading: false,
        result: [],
        hasToken: false, 
        };
    }

    onShareThis(item) {
        Share.share({
          message: `Berikut adalah No.Order online booking Anda.\n ${item.params.reftrans}`,
          url: 'http://posindonesia.co.id',
          title: 'POS Online Booking'
        }, {
          // Android only:
          dialogTitle: 'POS Online Booking',
          // iOS only:
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToTwitter'
          ]
        })
    }
    
    _thisDownload() {
        // const { params } = this.props.navigation.state;

        const downloadResumable = FileSystem.createDownloadResumable(
            'http://gahp.net/wp-content/uploads/2017/09/sample.pdf',
            FileSystem.documentDirectory + 'small.pdf'
        );
          
        downloadResumable.downloadAsync()
        .then(({ uri }) => {
            console.log('Finished downloading to ', uri);
        })
        .catch(error => {
            console.error(error);
        });

        // apipon.getDetailDownload()
        // .then((response) => {
        //     console.log('aya response:',response);
        //     if(response.status === 200){
        //         Toast.show({
        //             type: 'sucess',
        //             position: 'bottom',
        //             text: 'Downloading...',
        //             buttonText: "OK",
        //             duration:3600
        //           })	
        //     } else {
        //         if(response.errors) {
        //           const error = api.exceptionExtractError(response); 
        //           Toast.show({
        //             type: 'danger',
        //             position: 'bottom',
        //             text: error,
        //             buttonText: "OK",
        //             duration:3600
        //           })	
        //         }
        //     }
        // })
        // .catch((exception) => {
        //     // Displays only the first error message
        //     const error = api.exceptionExtractError(exception);
        //     this.setState({
        //         isLoading: false,
        //         ...(error ? { error } : {}),
        //     });
        //     if (!error) {
        //         throw exception;
        //     }
        // });
    }

    renderOnlineBook = () => {
        const ponData = this.props.navigation.state;        
        if(Object.keys(ponData).length > 0){
            const totalFee = Math.floor(ponData.params.detail.fee + ponData.params.detail.feetax + ponData.params.detail.insurance + ponData.params.detail.insurancetax)
            return (		
                <Card transparent style={{marginTop: 5}}>
                    <View style={styles.imageContainer}>
                        <View style={styles.logoContainer}>
                            <Image source={iconLogo} style={styles.logo} resizeMode='contain'/>		
                        </View>
                        <View style={styles.logoContainerPON}>
                            <Image source={onlinelogo} style={styles.logo} resizeMode='contain'/>	
                            <Text style={{ fontSize: 14 }}>Online Booking</Text>	
                        </View>
                    </View>
                <CardItem>
                    <Body style={styles.centerContain}>
                        <Text style={{ fontSize: 14 }}>{moment().format("dddd, LL")}</Text>	
                        <Text style={{ fontSize: 14 }}>{moment().format("h:mm:ss")}</Text>	
                        <View style={styles.barcodeView}>
                            <Barcode value={ponData.params.reftrans} format="CODE128"/>
                        </View>
                    </Body>    
                </CardItem>
                <CardItem>
                    <Body style={styles.centerContain}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>{ponData.params.reftrans}</Text>	
                    </Body>
                </CardItem>	
                <View style={styles.detailContainer}>
                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 16}}>Pengirim</Label> 
                        </Item>  
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Nama</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.name}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Alamat</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.address}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Asal</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.subdistrict}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Kode Pos</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.zipcode}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Telepon</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.shipper.phone}</Label>
                        </Item> 

                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 16}}>Penerima</Label> 
                        </Item>  
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Nama</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.name}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Alamat</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.address}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Asal</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.subdistrict}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Kode Pos</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.zipcode}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftText}>Telepon</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightText}>{ponData.params.receiver.phone}</Label>
                        </Item> 

                        <Item bordered style={{ paddingTop: 20, paddingBottom: 5 }}>
                            <Label style={{ color: '#f26623', fontSize: 14}}>Kiriman</Label> 
                        </Item>  
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftTextFooter}>Layanan</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightTextFooter}>{ponData.params.serviceName}</Label>
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftTextFooter}>Estimasi Biaya</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <NumberFormat value={Math.round(totalFee)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} renderText={value => <Label style={styles.labelRightTextFooter}>{value}</Label>} />
                        </Item> 
                        <Item style={styles.underlineDisable}>
                            <Label style={styles.labelLeftTextFooter}>Keterangan Kiriman</Label>
                            <Label style={styles.labelCenterText}>:</Label>
                            <Label style={styles.labelRightTextFooter}>{ponData.params.detail.desctrans}</Label>
                        </Item>  
                        <Item style={[styles.underlineDisable, { paddingTop: 20, paddingBottom: 20 }]}>
                            <Label style={{ color: '#f26623', fontSize: 12}}>* Pos Order Number ini bukan merupakan Tanda Terima Kiriman</Label> 
                        </Item>    
                </View>	
                </Card>
            );
        }else{
            return (
                <Card transparent>
                    <CardItem>
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', paddingVertical: device.height/3}}>
                        <Text>Tidak ada data</Text>
                    </View>
                    </CardItem>
                </Card>
            )
        }
    };
  
    render() {
        if (this.state.isLoading) {
            return (
                <Spinner size="large" color="#f26623" />
            );
        }
        const item = this.props.navigation.state;
        return (
        <Container style={styles.container}>
            <Content>
            {this.renderOnlineBook()}
            </Content>
            <Footer>
            <FooterTab>
                <Button onPress={() => this.onShareThis(item)}>
                <Icon name="md-share" />
                </Button>
                <Button onPress={() => this._thisDownload()}>
                <Icon name="md-download" />
                </Button>
            </FooterTab>
            </Footer>
        </Container>
        );
    }
}

export default detailOnlineBookDirect;

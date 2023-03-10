import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { API_URL } from "./env";
import { ThemeContext } from './AppProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import modalStyles from '../assets/styles/modalStyles';
import styles from '../assets/styles/styles';
import { TripDetailModal } from './Modal';

const Tab = createMaterialTopTabNavigator();

const Notifs = () => {
  const { darkMode, toggleDarkMode, GlobalLogin, logout } = useContext(ThemeContext);
  const [refreshing, setRefreshing] = useState(false);
  const [getReadNotifications, setReadNotifications] = useState([]);
  const [getUnreadNotifications, setUnreadNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tripDetails, setTripDetails] = useState(undefined);

  const fetchNotifs = async () => {
    // Récupération des notifications non lues
    try {
      const resp = await fetch(API_URL + "/NotificationUnread/samu");
      const data = await resp.json();
      console.log(data);
      setUnreadNotifications(data);
    } catch (error) {
      console.error(error);
    }
    // Récupération des notifications lues
    try {
      const resp = await fetch(API_URL + "/NotificationRead/samu");
      const data = await resp.json();
      console.log(data);
      setReadNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAsRead = (notificationID) => {
    fetch(API_URL + "/Notification/" + notificationID, {
      method: 'PUT',
    })
  };

  const acceptRequest = (notificationID) => {
  };

  const rejectRequest = (notificationID) => {
    // Code pour refuser la demande de trajet
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifs();
    setRefreshing(false);
 };

 const displayTrip = async (notificationRelatedID) => {
  console.log(notificationRelatedID);
  const resp = await fetch(API_URL + '/Trajet/' + notificationRelatedID, {
    method: 'GET'
  }).catch((error) => {console.log(error)});
  const dataTrip = await resp.json();
  console.log(dataTrip);
  if (dataTrip != undefined) {
    setTripDetails(dataTrip);
  }  
  setModalVisible(true);
};

  const renderNotification = (notification) => {
      return (
        <TouchableOpacity style={styles.tripTouchableTrajet} onPress={() => displayTrip(notification.relatedID)}>
    <Text style={styles.notiflabel}>{notification.Content}</Text>
    <View style={styles.notifbuttonContainer}>
        {notification.type === 'j' && (
          <>
            <TouchableOpacity style={styles.notifbutton} onPress={() => acceptRequest(notification.notificationID)}>
              <Ionicons name="checkmark-sharp" style={styles.notifbuttonIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notifbutton} onPress={() => rejectRequest(notification.notificationID)}>
              <Ionicons name="close-sharp" style={styles.notifbuttonIcon} />
            </TouchableOpacity>
          </>
        )}
        {notification.type === 'a' && (
          <TouchableOpacity style={styles.notifmarker}>
            <Ionicons name="checkmark-sharp" style={[styles.notifbuttonIcon, {color: 'green'}]} />
          </TouchableOpacity>
        )}
        {notification.type === 'r' && (
          <TouchableOpacity style={styles.notifmarker}>
            <Ionicons name="close-sharp" style={[styles.notifbuttonIcon, {color: 'red'}]} />
          </TouchableOpacity>
        )}
        {notification.type === 'l' && (
          <TouchableOpacity style={styles.notifmarker}>
            <Ionicons name="close-sharp" style={[styles.notifbuttonIcon, {color: 'red'}]} />
          </TouchableOpacity>
        )}
        {notification.read === false && (
          <>
        <TouchableOpacity style={styles.notifbutton} onPress={() => markAsRead(notification.notificationID)}>
          <Ionicons name="checkmark-done-sharp" style={styles.notifbuttonIcon} />
        </TouchableOpacity>
        </>)}
      </View>
    </TouchableOpacity>
      );
  };
  const renderAllNotifications = (notifications) => {
  return (
    <View>
      {notifications.map(notification => (
        <View key={notification.notificationID}>
          {renderNotification(notification)}
        </View>
      ))}
      <TripDetailModal visible={modalVisible} onClose={() => setModalVisible(false)} selectedTrip={tripDetails}/>
    </View>
  );
  };
  const NotificationRead = () => {
    return (
      <ScrollView
            refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkMode ? 'white' : 'black'}
          />
        }
      >
        {renderAllNotifications(getReadNotifications)}
      </ScrollView>
    );
  };
  const NotificationUnread = () => {
    return (
      <ScrollView
            refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkMode ? 'white' : 'black'}
          />
        }
      >
        {renderAllNotifications(getUnreadNotifications)}
      </ScrollView>
    );
  };
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: darkMode ? 'white' : 'black',
                tabBarInactiveTintColor: darkMode ? 'gray' : 'lightgray',
                tabBarStyle: {backgroundColor: darkMode ? 'black' : 'white'},
                tabBarActiveTintColor: '#1C6E8C',
                tabBarInactiveTintColor: 'gray',
                tabBarPressColor: '#1C6E8C',
                borderColor: '#1C6E8C',
                tabBarIndicatorStyle: {backgroundColor: '#1C6E8C'},
            }}>
            <Tab.Screen name="Lue" component={NotificationRead}/>
            <Tab.Screen name="Non lue" component={NotificationUnread} />
            
        </Tab.Navigator>
    );
};

export default Notifs;

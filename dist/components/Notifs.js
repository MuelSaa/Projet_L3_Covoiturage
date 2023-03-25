import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { API_URL } from "./env";
import { ThemeContext } from './AppProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getStyles from '../assets/styles/styles';
import { TripDetailModal } from './Modal';

const Tab = createMaterialTopTabNavigator();

const Notifs = () => {
  const { darkMode, toggleDarkMode, GlobalLogin, logout } = useContext(ThemeContext);
  const [refreshing, setRefreshing] = useState(false);
  const [getReadNotifications, setReadNotifications] = useState([]);
  const [getUnreadNotifications, setUnreadNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tripDetails, setTripDetails] = useState(undefined);
  const styles = getStyles(darkMode);
  const [selectedStars, setSelectedStars] = useState({});
  const [conducteur, setConducteur] = useState('');

  const login = GlobalLogin ? GlobalLogin : "Aleen80";

  const handleStarClick = async (notification, stars) => {
    const id = notification.notificationID;
    setSelectedStars({ ...selectedStars, [id]: stars });
    try {
      await fetch(API_URL + "/Notification/" + id, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log(error);
      return;
    }
    const trajetID = notification.relatedID;
    const commentaire = "none";
  
    try {
      const resp = await fetch(API_URL + '/Trajet/' + trajetID, {
        method: 'GET',
      }).catch((error) => { console.log(error) });
      const response = await resp.json();
      const conducteur = response[0]['conducteur'];
      console.log(conducteur);
  
      // Nouvelle fonction pour envoyer la requête POST
      await sendPostRequest(conducteur, stars, trajetID, login);
  
    } catch (error) {
      console.log(error);
      return;
    }
  
    fetchNotifs();
  };
  
  const sendPostRequest = async (conducteur, stars, trajetID, noteurLogin) => {
    const data = { note: stars, trajetID: trajetID, commentaire: 'none', noteurLogin: conducteur, noterLogin: noteurLogin };
    const url = API_URL + '/NoteC';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Une erreur est survenue.');
      }
  
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  


  const fetchNotifs = async () => {
    // Récupération des notifications non lues
    try {
      const resp = await fetch(API_URL + "/NotificationUnread/"+login);
      const data = await resp.json();
      setUnreadNotifications(data);
    } catch (error) {
      console.error(error);
    }
    // Récupération des notifications lues
    try {
      const resp = await fetch(API_URL + "/NotificationRead/"+login);
      const data = await resp.json();
      setReadNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAsRead = async (notificationID) => {
    await fetch(API_URL + "/Notification/" + notificationID, {
      method: 'PUT',
    }).catch((error) => {console.log(error)});
    fetchNotifs();
  };

  const deleteNotification = async (notificationID) => {
    await fetch(API_URL + "/Notification/" + notificationID, {
      method: 'DELETE',
    }).catch((error) => {console.log(error)});
    fetchNotifs();
  };

  const acceptRequest = async (notification) => {
    await fetch(API_URL + "/Passager/" + notification.relatedID + "/"+login+"/true/" + notification.notificationID, {
      method: 'PUT',
    }).catch((error) => {console.log(error)});
    fetchNotifs();
  };

  const rejectRequest = async (notification) => {
    await fetch(API_URL + "/Passager/" + notification.relatedID + "/"+login+"/false/" + notification.notificationID, {
      method: 'PUT',
    }).catch((error) => {console.log(error)});
    fetchNotifs();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifs();
    setRefreshing(false);
 };

 const displayTrip = async (notificationRelatedID) => {
  const resp = await fetch(API_URL + '/Trajet/' + notificationRelatedID, {
    method: 'GET'
  }).catch((error) => {console.log(error)});
  const dataTrip = await resp.json();
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
            <TouchableOpacity style={styles.notifbutton} onPress={() => acceptRequest(notification)}>
              <Ionicons name="checkmark-sharp" style={styles.notifbuttonIcon} />
            </TouchableOpacity>
            <Text style={styles.notifbuttonLabel}>Accepter</Text>
            <TouchableOpacity style={styles.notifbutton} onPress={() => rejectRequest(notification.notificationID)}>
              <Ionicons name="close-sharp" style={styles.notifbuttonIcon} />
            </TouchableOpacity>
            <Text style={styles.notifbuttonLabel}>Refuser</Text>
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
        {(notification.type !== 'j' && notification.type !== 'n') && (
          <>
          <TouchableOpacity style={styles.notifbutton} onPress={() => deleteNotification(notification.notificationID)}>
            <Ionicons name="close-sharp" style={[styles.notifbuttonIcon, {color: 'red'}]} />
          </TouchableOpacity>
          <Text style={styles.notifbuttonLabel}>Supprimer</Text>
          </>
        )}
        
        {notification.type === 'n' && (
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity key={value} onPress={() => handleStarClick(notification, value)}>
                <Ionicons
                  name={value <= selectedStars[notification.notificationID] ? 'star-sharp' : 'star-outline'}
                  style={styles.ratingStar}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {notification.read === false && (
          <>
            <TouchableOpacity style={styles.notifbutton} onPress={() => markAsRead(notification.notificationID)}>
              <Ionicons name="checkmark-done-sharp" style={styles.notifbuttonIcon} />
            </TouchableOpacity>
            <Text style={styles.notifbuttonLabel}>Marquer lu</Text>
          </>
        )}
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
            style = {{backgroundColor: darkMode ? 'black' : 'white'}}
            refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
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
            style = {{backgroundColor: darkMode ? 'black' : 'white'}}
            refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
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
            <Tab.Screen name="Non lue" component={NotificationUnread} />
            <Tab.Screen name="Lue" component={NotificationRead}/>
            
        </Tab.Navigator>
    );
};

export default Notifs;

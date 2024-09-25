import {COLORS} from "../mock/colors";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer} from "@react-navigation/native";
import {ProfileStack} from "./ProfileStack";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "../../config/firebase";
import {equalTo, get, getDatabase, orderByChild, query, ref} from "firebase/database";
import {setCurrentUser} from "../store/AuthSlice";
import {StyleSheet, View, Text, TouchableOpacity, Platform} from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import {NewQuestionPage} from "../pages/NewQuestionPage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {ForumStack} from "./ForumStack";
import * as Notifications from "expo-notifications";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                top: -20,
                justifyContent: 'center',
                alignItems: 'center',
                ...styles.shadow
            }}
        >
            <View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: 'lightgray'
            }}>
                {children}
            </View>
        </TouchableOpacity>
    )
}

export const RootNavigator = () => {

    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
      async function requestPermissions() {
        if (Platform.OS === 'ios') {
          await Notifications.requestPermissionsAsync({
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          });
        }
      }

      requestPermissions();

    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(true)
            if (user) {

                const uid = user.uid;

                const db = getDatabase();
                const userRef = ref(db, `users`);
                const sortedQuery = query(userRef, orderByChild('uid'), equalTo(uid));

                get(sortedQuery)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const userData = snapshot.val();

                            if (userData) {
                                const key = Object.keys(userData)[0]
                                dispatch(setCurrentUser(userData[key]))
                                setIsLoading(false)
                            } else {
                                dispatch(setCurrentUser(null))
                            }

                        } else {
                            setIsLoading(false)
                        }
                    })
                    .catch((error) => {
                        console.error(`Error getting user by id`, error.message);
                        setIsLoading(false)
                    });
            } else {
                setIsLoading(false)
            }
        });
        return () => unsubscribe();
    }, []);


    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={'Forum'}
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: styles.tabNavigator
                }}
            >
                <Tab.Screen
                    options={{
                        headerShown: false,
                        tabBarIcon: ({focused}) => (
                            <View style={styles.itemWrapper}>
                                <MaterialIcons name="question-answer" size={26} color={focused ? COLORS.lightText : COLORS.disabled} />
                                <Text
                                    style={{
                                        ...styles.tabElem,
                                        color: focused ? COLORS.lightText : COLORS.disabled
                                    }}
                                >Forum</Text>
                            </View>
                        ),
                    }}
                    name="Forum"
                    component={ForumStack}
                />


                <Tab.Screen
                    options={{
                        headerShown: false,
                        tabBarIcon: ({focused}) => (
                            <View>
                                <FontAwesome name="question" size={34} color={COLORS.primary} />
                            </View>
                        ),
                        tabBarButton: (props) => (
                            <CustomTabBarButton {...props} />
                        )
                    }}
                    name="newQuestion"
                    component={NewQuestionPage}
                />


                <Tab.Screen
                    options={{
                        headerShown: false,
                        tabBarIcon: ({focused}) => (
                            <View style={styles.itemWrapper}>
                                <Fontisto name="person" size={26} color={focused ? COLORS.lightText : COLORS.disabled} />
                                <Text
                                    style={{
                                        ...styles.tabElem,
                                        color: focused ? COLORS.lightText : COLORS.disabled
                                    }}
                                >Profile</Text>
                            </View>
                        ),
                    }}
                    name="User"
                    component={ProfileStack}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: COLORS.lightText,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
    },
    itemWrapper: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabNavigator: {
      position: 'absolute',
      bottom: 15,
      left: 20,
      right: 20,
      backgroundColor: COLORS.primary,
      borderRadius: 15,
      height: 75,
    },
    tabElem: {
      marginTop: 5,
      fontSize: 14,
    }
})

import {PageLayout} from "../../layouts/PageLayout";
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Switch} from 'react-native'
import {COLORS} from "../../mock/colors";
import {useDispatch, useSelector} from "react-redux";
import Fontisto from "react-native-vector-icons/Fontisto";
import {ProfileButton} from "../../components/ProfileButton";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {useNavigation} from "@react-navigation/native";
import {auth} from "../../../config/firebase";
import {USER_LOGOUT} from "../../store";
import {AppModal} from "../../components/AppModal";
import React, {useMemo, useState} from "react";
import {AppInput} from "../../components/AppInput";
import {deleteUser, getAuth, signOut, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import {equalTo, get, getDatabase, orderByChild, query, ref, remove} from "firebase/database";
import { getStorage, ref as storeRef, deleteObject } from "firebase/storage";

export const ProfilePage = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const {currentUser} = useSelector(state => state.auth)

    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const isDone = useMemo(() => {
        return password.trim() && password.length >= 6
    }, [password])

    const logout = () => {
        signOut(auth).then( async () => {
            dispatch({type: USER_LOGOUT})
            navigation.navigate('Forum')
        }).catch((error) => {
            console.log('Error logout: ', error)
        });
    };


    const deleteAccount = async () => {
        setIsLoading(true)
        try {
            const db = getDatabase();
            const auth = getAuth();
            const user = auth.currentUser;

            const credential = EmailAuthProvider.credential(user.email, password);

            await reauthenticateWithCredential(user, credential);

            await deleteUser(user);

            const userRef = ref(db, `users/${currentUser.id}`);
            await remove(userRef);

            const storage = getStorage();
            const desertRef = storeRef(storage, currentUser.uid);
            await deleteObject(desertRef);


            const questionsRef = ref(db, 'questions');
            const questionsToDeleteRef = query(questionsRef, orderByChild('creatorId'), equalTo(currentUser.uid));

            const snapshot = await get(questionsToDeleteRef);

            if (snapshot.val()) {
                for (const [childSnapshotKey, childSnapshot] of Object.entries(snapshot.val())) {
                    await remove(ref(db, `questions/${childSnapshotKey}`));
                }
            }

            setIsLoading(false);

            dispatch({type: USER_LOGOUT})

            navigation.navigate('Forum')
        } catch (error) {
            setError(`Error deleting account: ${error.message}`);
            setIsLoading(false);
        }
    };

    return (
        <PageLayout>
            <AppModal
                visible={showModal}
                onCansel={() => setShowModal(false)}
                onOk={deleteAccount}
                okBtnText={'Delete'}
                isOkBtnDisabled={!isDone}
            >
                <Text style={styles.title}>Deleting a profile</Text>
                <Text style={styles.warning}>Warning. After deleting a user, all information associated with it will be deleted.</Text>
                <AppInput
                    value={password}
                    placeholder={"Password"}
                    onChange={(text) => setPassword(text)}
                    iconLeft={<Fontisto name="locked" size={22} color={COLORS.lightText} />}
                    secureTextEntry={!showPassword}
                />

                <View style={styles.passwordToggle}>
                    <Text style={styles.passwordToggleText}>Show password</Text>
                    <Switch
                        trackColor={{true: COLORS.primary}}
                        value={showPassword}
                        onValueChange={() => setShowPassword(!showPassword)}

                    />
                </View>

                {isLoading &&
                    <ActivityIndicator style={styles.preloader} size="small" color={COLORS.lightText} />
                }

                {
                    error &&
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                }
            </AppModal>
            {
                currentUser
                    ? <View style={styles.wrapper}>
                        <Image
                            style={styles.userImage}
                            source={ currentUser.photoURL
                                ?{ uri: currentUser.photoURL }
                                : require('../../../assets/userImg.png')
                            }
                            resizeMode='cover'
                        />

                        <Text style={styles.userName}>{currentUser.displayName}</Text>

                        <View style={styles.divider}></View>

                    <ScrollView style={{width: '100%'}}>
                        <ProfileButton
                            text={'My answers'}
                            onPress={() => navigation.navigate('MyAnswersPage')}
                            icon={<FontAwesome5 name="hands-helping" size={30} color={COLORS.lightText} />}
                        />

                        <ProfileButton
                            text={'My questions'}
                            onPress={() => navigation.navigate('MyQuestionsPage')}
                            icon={<MaterialIcons name="my-library-books" size={30} color={COLORS.lightText} />}
                        />

                        <View style={styles.divider}></View>


                        <ProfileButton
                            text={'Edit profile'}
                            onPress={() => navigation.navigate('EditProfilePage')}
                            icon={<FontAwesome5 name="user-edit" size={30} color={COLORS.lightText} />}
                        />

                        <ProfileButton
                            text={'Delete profile'}
                            onPress={() => setShowModal(true)}
                            icon={<MaterialIcons name="delete" size={30} color={COLORS.lightText} />}
                        />

                        <View style={styles.divider}></View>

                        <ProfileButton
                            text={'Logout'}
                            onPress={logout}
                            icon={<MaterialIcons name="logout" size={30} color={COLORS.lightText} />}
                        />
                    </ScrollView>

                    </View>
                    : null
            }
        </PageLayout>
    )
}

const styles = StyleSheet.create({
    wrapper : {
        flex: 1,
        padding: 20,
        marginBottom: 100,
        alignItems: 'center',
        justifyContent: "center"
        // backgroundColor: 'yellow'
    },

    userImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.lightText
    },

    userName: {
        fontSize: 32,
        color: COLORS.lightText
    },

    divider: {
        borderBottomWidth: 2,
        borderColor: COLORS.primary,
        width: '100%',
        marginVertical: 15
    },


    //modal
    title: {
        color: COLORS.lightText,
        fontSize: 22,
        marginBottom: 15
    },
    warning: {
        color: COLORS.lightText,
        marginBottom: 10
    },
    preloader: {
        textAlign: 'center',
        marginBottom: 15
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15
    },
    passwordToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 15
    },
    passwordToggleText: {
        color: COLORS.lightText,
        fontSize: 16
    },
})

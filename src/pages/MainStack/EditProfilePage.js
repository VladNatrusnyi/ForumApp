import {useDispatch, useSelector} from "react-redux";
import {PageLayout} from "../../layouts/PageLayout";
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {GoBackBtn} from "../../components/GoBackBtn";
import {useNavigation} from "@react-navigation/native";
import {KeyboardLayout} from "../../layouts/KeyboardLayout";
import AntDesign from "react-native-vector-icons/AntDesign";
import {COLORS} from "../../mock/colors";
import React, {useMemo, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {MainButton} from "../../components/MainButton";
import Fontisto from "react-native-vector-icons/Fontisto";
import {AppInput} from "../../components/AppInput";
import {ref, set} from "firebase/database";
import {db} from "../../../config/firebase";
import {getUrlFromStorage} from "../../func/getUrlFromStorage";
import {setCurrentUser} from "../../store/AuthSlice";

export const EditProfilePage = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const {currentUser} = useSelector(state => state.auth)

    const [photo, setPhoto] = useState(currentUser ? currentUser.photoURL : null)

    const [name, setName] = useState(currentUser ? currentUser.displayName : '');

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const uploadPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri)
        }
    };

    const saveChanges =  async () => {
        setIsLoading(true)
        if (photo && photo !== currentUser.photoURL) {
            getUrlFromStorage(photo, currentUser.uid)
                .then((imageUrl) => {
                    const userRef = ref(db, `users/${currentUser.id}`);
                    const updatedData = {
                        ...currentUser,
                        displayName: name,
                        photoURL: imageUrl
                    }
                    set(userRef, updatedData)
                        .then(() => {
                            dispatch(setCurrentUser(updatedData))
                            console.log(`User data successfully updated`);
                            setIsLoading(false)
                            navigation.goBack()
                        })
                        .catch((error) => {
                            console.error(`Error updating user data`, error);
                            setError(error.message)
                            setIsLoading(false)
                        });

                })
                .catch((error) => {
                    setIsLoading(false)
                    setError(error.message)
                    console.error("Error getting url", error);
                });
        } else {
            const userRef = ref(db, `users/${currentUser.id}`);
            const updatedData = {
                ...currentUser,
                displayName: name
            }
            set(userRef, updatedData)
                .then(() => {
                    dispatch(setCurrentUser(updatedData))
                    setIsLoading(false)
                    console.log(`User data successfully updated`);
                    navigation.goBack()
                })
                .catch((error) => {
                    setIsLoading(false)
                    setError(error.message)
                    console.error(`Error updating user data`, error);
                });
        }
    }

    const isDone = useMemo(() => {
        return name.trim()
    }, [name])

    return (
        <PageLayout>
            {
                currentUser
                    ? <View style={styles.wrapper}>
                        <GoBackBtn onPress={() => navigation.goBack()} />
                        <KeyboardLayout>
                            <View style={styles.content}>
                                <View style={styles.editImageWrapper}>
                                    {
                                        photo ?
                                            <Image
                                                style={styles.userImage}
                                                source={{
                                                    uri: photo,
                                                }}
                                                resizeMode='cover'
                                            />
                                            :
                                            <Image
                                                style={styles.userImage}
                                                source={require('../../../assets/userImg.png')}
                                                resizeMode='cover'
                                            />
                                    }
                                    <TouchableOpacity onPress={uploadPhoto} style={styles.editImageButton}>
                                        <AntDesign name="plus" size={24} color={COLORS.lightText} />
                                    </TouchableOpacity>
                                </View>

                                <AppInput
                                    value={name}
                                    placeholder={"Name"}
                                    onChange={(text) => setName(text)}
                                    iconLeft={<Fontisto name="person" size={22} color={COLORS.lightText} />}
                                />

                                {isLoading &&
                                    <ActivityIndicator style={styles.preloader} size="small" color={COLORS.lightText} />
                                }

                                {
                                    error &&
                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                }


                                <MainButton
                                    style={{width: '100%'}}
                                    onPress={saveChanges}
                                    text={'Save changes'}
                                    disabled={!isDone}
                                />
                            </View>
                        </KeyboardLayout>
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
        // backgroundColor: 'yellow'
    },

    content: {
        flex: 1,
        alignItems: "center",
        gap: 20
    },

    userImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 15
    },

    editImageWrapper: {
        position: "relative"
    },

    editImageButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        alignItems: "center",
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: COLORS.secondary,
        borderWidth: 2,
        borderColor: COLORS.lightText
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
})

import React, {useMemo, useState} from 'react';
import {View, Text, Switch, StyleSheet, ActivityIndicator} from 'react-native';
import {KeyboardLayout} from "../../layouts/KeyboardLayout";
import {COLORS} from "../../mock/colors";
import {MainButton} from "../../components/MainButton";
import {AppInput} from "../../components/AppInput";
import Fontisto from "react-native-vector-icons/Fontisto";
import {AuthNavBtn} from "../../components/AuthNavBtn";
import {PageLayout} from "../../layouts/PageLayout";
import {useDispatch} from "react-redux";
import {auth} from "../../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const LoginPage = () => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const isDone = useMemo(() => {
        return email.trim() && password.trim() && (password.trim().length >= 6)
    }, [email, password])

    const handleLogin = () => {
        setIsLoading(true)

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const userData = userCredential.user;
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
                setError(error.message)
            });
    };

    return (
        <PageLayout>
            <KeyboardLayout>
                <View style={styles.container}>
                    <Text style={styles.heading}>Log in</Text>

                    {isLoading &&
                        <ActivityIndicator style={styles.preloader} size="small" color={COLORS.lightText} />
                    }

                    {
                        error &&
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    }

                    <AppInput
                        value={email}
                        placeholder={"Email"}
                        onChange={(text) => setEmail(text)}
                        iconLeft={<Fontisto name="email" size={22} color={COLORS.lightText} />}
                    />

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

                    <MainButton
                        style={{width: '100%'}}
                        onPress={handleLogin}
                        text={'Log in'}
                        disabled={!isDone}
                    />

                    <AuthNavBtn text={'Sign up'} to={'SIGNUP'} />

                </View>
            </KeyboardLayout>
        </PageLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 28,
        marginBottom: 20,
        color: COLORS.lightText
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
});

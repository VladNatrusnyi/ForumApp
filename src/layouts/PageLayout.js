import {ImageBackground, StyleSheet, SafeAreaView, Platform} from "react-native";

export const PageLayout = ({children}) => {
    return (
        <ImageBackground
            source={require('../../assets/bg.png')}
            style={styles.backgroundImage}
        >
            <SafeAreaView style={styles.container}>
                {children}
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 15 : 0
    },
});

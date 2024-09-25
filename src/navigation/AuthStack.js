import {createStackNavigator} from "@react-navigation/stack";
import {LoginPage} from "../pages/AuthStack/LoginPage";
import {SignUpPage} from "../pages/AuthStack/SignUpPage";

const Stack = createStackNavigator();

export const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={'LOGIN'}
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name='LOGIN'
                component={LoginPage}
            />
            <Stack.Screen
                name='SIGNUP'
                component={SignUpPage}
            />
        </Stack.Navigator>
    );
}

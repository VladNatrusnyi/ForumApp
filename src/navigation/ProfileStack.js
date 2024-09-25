import {createStackNavigator} from "@react-navigation/stack";
import {useSelector} from "react-redux";
import {AuthStack} from "./AuthStack";
import {MainStack} from "./MainStack";

const Stack = createStackNavigator();

export const ProfileStack = () => {

    const {currentUser} = useSelector(state => state.auth)

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            {currentUser
                ? <Stack.Screen name='Profile' component={MainStack} />
                : <Stack.Screen name='Auth' component={AuthStack} />}

        </Stack.Navigator>
    )
}
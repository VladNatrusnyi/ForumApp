import {createStackNavigator} from "@react-navigation/stack";
import {ProfilePage} from "../pages/MainStack/ProfilePage";
import {EditProfilePage} from "../pages/MainStack/EditProfilePage";
import {MyQuestionsPage} from "../pages/MainStack/MyQuestionsPage";
import {MyAnswersPage} from "../pages/MainStack/MyAnswersPage";

const Stack = createStackNavigator();

export const MainStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={'ProfilePage'}
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name='ProfilePage'
                component={ProfilePage}
            />
            <Stack.Screen
                name='EditProfilePage'
                component={EditProfilePage}
            />
            <Stack.Screen
                name='MyQuestionsPage'
                component={MyQuestionsPage}
            />
            <Stack.Screen
                name='MyAnswersPage'
                component={MyAnswersPage}
            />
        </Stack.Navigator>

    )
}

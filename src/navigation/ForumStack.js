
import {createStackNavigator} from "@react-navigation/stack";
import {HomePage} from "../pages/HomePage";
import {DiscussionPage} from "../pages/DiscussionPage";

const Stack = createStackNavigator();

export const ForumStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={'ForumList'}
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name='ForumList'
                component={HomePage}
            />
            <Stack.Screen
                name='DiscussionPage'
                component={DiscussionPage}
            />
        </Stack.Navigator>

    )
}

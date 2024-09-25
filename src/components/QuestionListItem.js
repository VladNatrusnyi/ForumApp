import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {COLORS} from "../mock/colors";
import {useMemo} from "react";
import {useSelector} from "react-redux";
import {convertDate} from "../func/convertDate";
import {useNavigation} from "@react-navigation/native";

export const QuestionListItem = ({questionData}) => {
    const navigation = useNavigation()

    const { users } = useSelector(state => state.questions)

    const userData = useMemo(() => {
        if (users) {
            return users.find(user => user.uid === questionData.creatorId)
        }
    }, [questionData, users])

    return (
        <TouchableOpacity onPress={() => navigation.navigate('DiscussionPage', {postId: questionData.id})} style={styles.container}>
            <LinearGradient
                colors={['#287c8a', '#46b8b2']}
                style={styles.wrap}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                {
                    userData &&
                    <View style={styles.userBlock}>
                        <Image
                            style={styles.userImage}
                            source={ userData.photoURL
                                ?{ uri: userData.photoURL }
                                : require('../../assets/userImg.png')
                            }
                            resizeMode='cover'
                        />
                        <Text style={styles.userName}>{userData.displayName}</Text>
                    </View>
                }
                <View style={styles.contentBlock}>
                    <Text style={styles.contentText} numberOfLines={3} ellipsizeMode="tail">
                        {questionData.questionText}
                    </Text>
                </View>
                <View style={styles.dateBlock}>
                    <Text style={styles.dateText}>
                        {convertDate(questionData.date)}
                    </Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.lightText,
        marginBottom: 20,
        borderTopLeftRadius: 60,
        borderBottomRightRadius: 60,
    },
    wrap: {
        gap: 15,
        height: 180,
        borderTopLeftRadius: 60,
        borderBottomRightRadius: 60,
        paddingVertical: 20,
        paddingHorizontal: 25
    },
    userBlock: {
        flex: 2,
        flexDirection: 'row',
        alignItems: "center",
        gap: 15,
    },
    userName: {
        fontSize: 24,
        color: COLORS.lightText
    },

    contentBlock: {
        flex: 3,
        overflow: 'hidden'
    },

    contentText: {
        color: COLORS.lightText,
        fontSize: 14
    },

    dateBlock: {
        flex: 1
    },
    dateText: {
        color: COLORS.disabled
    },

    backgroundImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 100,
        borderColor: COLORS.lightText,
        borderWidth: 1
    },
});

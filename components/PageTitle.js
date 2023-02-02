import { StyleSheet, Text, View } from "react-native"
import colors from "../constants/colors"

export default PageTitle = props => {
    return <View style={styles.container}>
        {props.text && <Text style={styles.text}>{props.text}</Text>}
    </View>
}

const styles = StyleSheet.create({
    
    text: {
        fontSize: 28,
        color: "white",
        fontFamily: 'bold',
        letterSpacing: 0.3
    }
})
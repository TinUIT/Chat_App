import { StyleSheet, View, ImageBackground } from "react-native"

const PageContainer = props => {
    return <ImageBackground source={require("../assets/background.jpg")} style={{ height: '100%' }}>
    <View style={{ ...styles.container, ...props.style }}>
        {props.children}
    </View>
    </ImageBackground>
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        //marginLeft:20,
        flex: 1,
        
    }
})

export default PageContainer;
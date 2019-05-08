import React from 'react'
import {View, TextInput, Button, StyleSheet} from 'react-native'

class Search extends React.Component {
    render() {
        return (
            <View style={styles.main_container}>
                <TextInput style={styles.textinput} placeholder="Titre du film"/>
                <Button title="Rechercher" onPress={function () {
                }}/>
            </View>

        )

    }
}


const styles = StyleSheet.create({
    main_container:{
        marginTop:25,
        flex:1
    },
    textinput: {

        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    }
})


export default Search

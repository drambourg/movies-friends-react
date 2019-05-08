import React from 'react'
import {View, TextInput, Button, StyleSheet, FlatList, Text} from 'react-native'
import films from '../Helpers/filmsData'
import FilmItem from './FilmItem'

class Search extends React.Component {
    render() {
        return (

            <View style={styles.main_container}>
                <TextInput style={styles.textinput} placeholder="Titre du film"/>
                <Button title="Rechercher" onPress={function () {
                }}/>
                <FlatList
                    data={films}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <FilmItem film={item}/>}
                />
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

import React from 'react'
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity} from "react-native";
import {getFilmDetailFromApi, getImageFromAPI} from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import {connect} from 'react-redux'

class FilmDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: true
        }
    }

    componentDidMount() {
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            })
        })
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                </View>
            )
        }
    }

    _displayFilm() {
        const {film} = this.state
        if (this.state.film != undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image
                        style={styles.movie_picture}
                        source={{uri: getImageFromAPI(film.backdrop_path)}}
                    />
                    <View style={styles.content_container}>
                        <View style={styles.header_container}>
                            <Text style={styles.movie_title}>{film.title}</Text>
                        </View>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text}>{film.overview}</Text>
                        </View>
                        <View style={styles.characteristics_container}>
                            <Text style={styles.characteristics_text}>Sorti
                                le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                            <Text style={styles.characteristics_text}>Note : {film.vote_average} / 10</Text>
                            <Text style={styles.characteristics_text}>Nombre de votes : {film.vote_count}</Text>
                            <Text style={styles.characteristics_text}>Budget
                                : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                            <Text style={styles.characteristics_text}>Genre(s) : {film.genres.map(function (genre) {
                                return genre.name;
                            }).join(" / ")}
                            </Text>
                            <Text style={styles.characteristics_text}>Companie(s)
                                : {film.production_companies.map(function (company) {
                                    return company.name;
                                }).join(" / ")}
                            </Text>
                        </View>
                    </View>

                </ScrollView>
            )
        }
    }


    render() {
        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container: {
        flex: 1,
        margin: 5
    },
    movie_picture: {
        height: 170,
    },
    header_container: {
        flex: 1,
        margin: 10
    },
    movie_title: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        flex: 1,
        flexWrap: 'wrap',
        padding: 1
    },
    description_container: {
        flex: 7
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666'
    },
    characteristics_container: {
        marginVertical: 5,
        flex: 1
    },
    characteristics_text: {
        fontWeight: 'bold',
        fontSize: 15,
    },

})


const mapStateToProps = (state) => {
    return {
        favoritesFilm : state.favoritesFilm
    }
}

export default connect(mapStateToProps)(FilmDetail)

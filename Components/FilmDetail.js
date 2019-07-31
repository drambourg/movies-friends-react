import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    TouchableOpacity,
    Share,
    Platform
} from "react-native";
import {getFilmDetailFromApi, getImageFromAPI} from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import {connect} from 'react-redux'
import EnlargeShrink from "../Animations/EnlargeShrink";

class FilmDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
        if (params.film != undefined && Platform.OS === 'ios') {
            return {
                // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
                headerRight: <TouchableOpacity
                    style={styles.share_touchable_headerrightbutton}
                    onPress={() => params.shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')}/>
                </TouchableOpacity>
            }
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: true
        }
        //...
        // Ne pas oublier de binder la fonction _shareFilm sinon, lorsqu'on va l'appeler depuis le headerRight de la navigation, this.state.film sera undefined et fera planter l'application
        this._shareFilm = this._shareFilm.bind(this)
    }

    // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
    _updateNavigationParams() {
        this.props.navigation.setParams({
            shareFilm: this._shareFilm,
            film: this.state.film
        })
    }

    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
        if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
            // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex],
                isLoading: false
            }, () => {
                this._updateNavigationParams()
            })
            return
        }
        // Le film n'est pas dans nos favoris, on n'a pas son détail
        // On appelle l'API pour récupérer son détail
        this.setState({isLoading: true})
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            }, () => {
                this._updateNavigationParams()
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

    _toggleFavorite() {
        const action = {type: "TOGGLE_FAVORITE", value: this.state.film}
        this.props.dispatch(action)
    }

    _displayFavoriteImage() {
        var sourceImage = require('../Images/ic_favorite_border.png')
        var shouldEnlarge = false
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            // Film dans nos favoris
            sourceImage = require('../Images/ic_favorite.png')
            shouldEnlarge = true
        }
        return (
            <EnlargeShrink shouldEnlarge={shouldEnlarge}>
                <Image
                    style={styles.favorite_image}
                    source={sourceImage}
                />
            </EnlargeShrink>
        )
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
                            <TouchableOpacity
                                style={styles.favorite_container}
                                onPress={() => this._toggleFavorite()}>
                                {this._displayFavoriteImage()}
                            </TouchableOpacity>
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


    _displayFloatingActionButton() {
        const {film} = this.state
        if (film != undefined && Platform.OS === 'android') {
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingactionbutton}
                    onPress={() => this._shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')}/>
                </TouchableOpacity>
            )
        }
    }

    _shareFilm() {
        const {film} = this.state
        Share.share({title: film.title, message: film.overview})
    }


    render() {
        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}
                {this._displayFloatingActionButton()}
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
    favorite_container: {
        alignItems: 'center',
    },
    favorite_image: {
        flex: 1,
        width: null,
        height: null
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
    },
    share_image: {
        width: 30,
        height: 30
    },
})


const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(FilmDetail)

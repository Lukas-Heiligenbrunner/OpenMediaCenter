package tmdb

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"regexp"
)

const apiKey = "9fd90530b11447f5646f8e6fb4733fb4"
const baseUrl = "https://api.themoviedb.org/3/"
const pictureBase = "https://image.tmdb.org/t/p/w500"

type VideoTMDB struct {
	Thumbnail string
	Overview  string
	Title     string
	GenreIds  []int
}

type TVShowTMDB struct {
	Thumbnail string
	Overview  string
	GenreIds  []int
}

type tmdbVidResult struct {
	Poster_path       string
	Adult             bool
	Overview          string
	Release_date      string
	Genre_ids         []int
	Id                int
	Original_title    string
	Original_language string
	Title             string
	Backdrop_path     string
	Popularity        int
	Vote_count        int
	Video             bool
	Vote_average      int
}

type TMDBGenre struct {
	Id   int
	Name string
}

func SearchVideo(MovieName string, year int) *VideoTMDB {
	fmt.Printf("Searching TMDB for: Moviename: %s, year:%d \n", MovieName, year)
	queryURL := fmt.Sprintf("%ssearch/movie?api_key=%s&query=%s", baseUrl, apiKey, url.QueryEscape(MovieName))
	resp, err := http.Get(queryURL)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	var t struct {
		Results []tmdbVidResult
	}
	err = json.Unmarshal(body, &t)

	fmt.Println(len(t.Results))

	// if there was no match with tmdb return 0
	if len(t.Results) == 0 {
		return nil
	}

	var tmdbVid tmdbVidResult
	if year != -1 {
		for _, result := range t.Results {
			r, _ := regexp.Compile(fmt.Sprintf(`^%d-[0-9]{2}?-[0-9]{2}?$`, year))
			if r.MatchString(result.Release_date) {
				tmdbVid = result
				// continue parsing
				goto cont
			}
		}
		// if there is no match use first one
		tmdbVid = t.Results[0]
	} else {
		tmdbVid = t.Results[0]
	}

	// continue label
cont:

	thumbnail := fetchPoster(tmdbVid.Poster_path)

	result := VideoTMDB{
		Thumbnail: *thumbnail,
		Overview:  tmdbVid.Overview,
		Title:     tmdbVid.Title,
		GenreIds:  tmdbVid.Genre_ids,
	}

	return &result
}

type tmdbTvResult struct {
	PosterPath       string   `json:"poster_path"`
	Popularity       int      `json:"popularity"`
	Id               int      `json:"id"`
	BackdropPath     string   `json:"backdrop_path"`
	VoteAverage      int      `json:"vote_average"`
	Overview         string   `json:"overview"`
	FirstAirDate     string   `json:"first_air_date"`
	OriginCountry    []string `json:"origin_country"`
	GenreIds         []int    `json:"genre_ids"`
	OriginalLanguage string   `json:"original_language"`
	VoteCount        int      `json:"vote_count"`
	Name             string   `json:"name"`
	OriginalName     string   `json:"original_name"`
}

func SearchTVShow(Name string) *TVShowTMDB {
	fmt.Printf("Searching TMDB for: TVShow: %s\n", Name)
	queryURL := fmt.Sprintf("%ssearch/tv?api_key=%s&query=%s", baseUrl, apiKey, url.QueryEscape(Name))
	resp, err := http.Get(queryURL)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	var t struct {
		Results []tmdbTvResult `json:"results"`
	}
	err = json.Unmarshal(body, &t)

	fmt.Println(len(t.Results))

	if len(t.Results) == 0 {
		return nil
	}

	res := TVShowTMDB{
		Thumbnail: "",
		Overview:  t.Results[0].Overview,
		GenreIds:  t.Results[0].GenreIds,
	}

	thumbnail := fetchPoster(t.Results[0].PosterPath)
	if thumbnail != nil {
		res.Thumbnail = *thumbnail
	}

	return &res
}

func fetchPoster(posterPath string) *string {
	url := fmt.Sprintf("%s%s", pictureBase, posterPath)

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	backpic64 := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(body)
	return &backpic64
}

var tmdbGenres *[]TMDBGenre

func fetchGenres() *[]TMDBGenre {
	url := fmt.Sprintf("%sgenre/movie/list?api_key=%s", baseUrl, apiKey)
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	var t []TMDBGenre
	err = json.Unmarshal(body, &t)

	return &t
}

func GetGenres() *[]TMDBGenre {
	// if generes are nil fetch them once
	if tmdbGenres == nil {
		tmdbGenres = fetchGenres()
	}
	return tmdbGenres
}

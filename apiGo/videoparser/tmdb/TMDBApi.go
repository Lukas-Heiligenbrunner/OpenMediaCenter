package tmdb

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
)

const apiKey = "9fd90530b11447f5646f8e6fb4733fb4"
const baseUrl = "https://api.themoviedb.org/3/"
const pictureBase = "https://image.tmdb.org/t/p/w500"

type VideoTMDB struct {
	Thumbnail string
	Overview  string
	Title     string
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

func SearchVideo(MovieName string, year int) *VideoTMDB {
	url := fmt.Sprintf("%ssearch/movie?api_key=%s&query=%s", baseUrl, apiKey, MovieName)
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

	var t struct {
		Results []tmdbVidResult
	}
	err = json.Unmarshal(body, &t)

	fmt.Println(len(t.Results))

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

	thumbnail := fetchPoster(tmdbVid)

	result := VideoTMDB{
		Thumbnail: *thumbnail,
		Overview:  tmdbVid.Overview,
		Title:     tmdbVid.Title,
	}

	return &result
}

func fetchPoster(vid tmdbVidResult) *string {
	url := fmt.Sprintf("%s%s", pictureBase, vid.Poster_path)

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

<?php

class TMDBMovie
{
    private $apikey = "9fd90530b11447f5646f8e6fb4733fb4";
    private $baseurl = "https://api.themoviedb.org/3/";
    public $picturebase = "https://image.tmdb.org/t/p/w500";

    /**
     * search for a specific movie
     *
     * @param string $moviename moviename
     * @return object movie object or null if not found
     */
    public function searchMovie(string $moviename)
    {
        $reply = json_decode(file_get_contents($this->baseurl . "search/movie?api_key=" . $this->apikey . "&query=" . urlencode($moviename)));
        if ($reply->total_results == 0) {
            // no results found
            // todo maybe parse first pictures somehow
            return null;
        } else {
            return $reply->results[0];
        }
    }

    /**
     * query all available genres from tmdb
     *
     * @return array of all available genres
     */
    public function getAllGenres()
    {
        $reply = json_decode(file_get_contents($this->baseurl . "genre/movie/list?api_key=" . $this->apikey));
        return $reply->genres;
    }
}

$temp = new TMDBMovie();
$temp->searchMovie("007 - Ein quantum Trost");

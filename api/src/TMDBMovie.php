<?php

/**
 * Class TMDBMovie
 * class to handle all interactions with the tmdb api
 */
class TMDBMovie {
    public $picturebase = "https://image.tmdb.org/t/p/w500";
    private $apikey = "9fd90530b11447f5646f8e6fb4733fb4";
    private $baseurl = "https://api.themoviedb.org/3/";

    /**
     * search for a specific movie
     *
     * @param string $moviename moviename
     * @return object movie object or null if not found
     */
    public function searchMovie(string $moviename, string $year = null) {
        $reply = json_decode(file_get_contents($this->baseurl . "search/movie?api_key=" . $this->apikey . "&query=" . urlencode($moviename)));
        if ($reply->total_results == 0) {
            // no results found
            return null;
        } elseif ($year != null) {
            // if year is defined check year
            $regex = '/[0-9]{4}?/'; // matches year of string

            for ($i = 0; $i < count($reply->results); $i++) {
                $releasedate = $reply->results[$i]->release_date;

                preg_match($regex, $releasedate, $matches);
                if (count($matches) > 0) {
                    $curryear = $matches[0];
                    if ($curryear == $year)
                        return $reply->results[$i];
                }
            }
        } else {
            return $reply->results[0];
        }
    }

    /**
     * query all available genres from tmdb
     *
     * @return array of all available genres
     */
    public function getAllGenres() {
        $reply = json_decode(file_get_contents($this->baseurl . "genre/movie/list?api_key=" . $this->apikey));
        return $reply->genres;
    }
}

<?php

class TMDBMovie
{
    private $apikey = "9fd90530b11447f5646f8e6fb4733fb4";
    private $baseurl = "https://api.themoviedb.org/3/";
    public $picturebase = "https://image.tmdb.org/t/p/w500";

    public function searchMovie($moviename)
    {
        $reply = json_decode(file_get_contents($this->baseurl . "search/movie?api_key=" . $this->apikey . "&query=" . urlencode($moviename)));
        if ($reply->total_results == 0) {
            // no results found
            // todo maybe parse first pictures somehow
            return null;
        } else {
            return $reply->results[0];

//            $image_base64 = base64_encode(file_get_contents($this->posterbase . $reply->results[0]->poster_path));
//            $image = 'data:image/jpeg;base64,' . $image_base64;
//            // Insert record
//            $conn = Database::getInstance()->getConnection();
//            $query = "insert into Movie(name,url,poster) values('" . pathinfo($i)['filename'] . "','/data/$i','" . $image . "')";
//            if ($conn->query($query) === TRUE) {
//                echo('{"data":"successfully created entry"}');
//            } else {
//                echo('{"data":"' . $conn->error . '"}');
//            }
        }
    }
}

$temp = new TMDBMovie();
$temp->searchMovie("007 - Ein quantum Trost");

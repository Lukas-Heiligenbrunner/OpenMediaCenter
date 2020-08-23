<?php
require_once './src/Database.php';
require_once './src/TMDBMovie.php';
require_once './src/SSettings.php';
require_once './src/VideoParser.php';

// allow UTF8 characters
setlocale(LC_ALL, 'en_US.UTF-8');

$vp = new VideoParser();
$vp->writeLog("starting extraction!\n");

$sett = new SSettings();

// load video path from settings
$scandir = "../" . $sett->getVideoPath();
$vp->extractVideos($scandir);

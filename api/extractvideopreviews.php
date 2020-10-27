<?php
require_once __DIR__ . '/src/Database.php';
require_once __DIR__ . '/src/TMDBMovie.php';
require_once __DIR__ . '/src/SSettings.php';
require_once __DIR__ . '/src/VideoParser.php';

// allow UTF8 characters
setlocale(LC_ALL, 'en_US.UTF-8');
set_time_limit(3600);

$vp = new VideoParser();
$vp->writeLog("starting extraction!!\n");

$sett = new SSettings();

// load video path from settings
$scandir = __DIR__ . "/../" . $sett->getVideoPath();
$vp->extractVideos($scandir);

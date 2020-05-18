<?php
$arr = scandir("../videos/prn/");

foreach ($arr as $elem) {
    shell_exec("ffmpeg -ss 00:04:00 -i \"../videos/prn/$elem\" -vframes 1 -q:v 2 \"$elem.jpg\"");
}

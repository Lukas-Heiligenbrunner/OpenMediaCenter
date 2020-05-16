<?php

$arr = scandir("../videos/prn/");
echo(json_encode($arr));

if (isset($_POST['action'])) {

}

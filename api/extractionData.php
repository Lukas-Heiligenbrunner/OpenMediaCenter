<?php
$return = new stdClass();
if (file_exists("/tmp/output.log")) {
    $out = file_get_contents("/tmp/output.log");
    // clear log file
    file_put_contents("/tmp/output.log", "");
    $return->message = $out;
    $return->contentAvailable = true;

    if (substr($out, -strlen("-42")) == "-42") {
        unlink("/tmp/output.log");
    }
} else {
    $return->contentAvailable = false;
}


echo json_encode($return);

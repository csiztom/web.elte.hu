<?php
  $request_body = file_get_contents("php://input");
  $myfile = fopen("resources/names.json", "w") or die("Unable to open file!");
  fwrite($myfile, $request_body);
  fclose($myfile);
?>
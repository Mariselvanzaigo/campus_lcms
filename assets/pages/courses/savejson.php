<?php
$updatedData = $_POST['newData'];
$oldData = file_get_contents('data.js');
$jsonData = json_decode($oldData, true); // decode the JSON into an associative array

if($jsonData) {
  foreach($jsonData as $v) {
    $v = str_replace('class=\"active\"', '', $v);
  }
}

$id = count($jsonData) + 1;
$updatedData = preg_replace( "/\r|\n/", "", $updatedData);
$jsonData[] = array(
  "id" => $id,
  "date" => date("Y-m-d h:m A", time()),
  "nav" => "<div class=\"trackItems\" data-id=\"".$id."\"><div><p><b>rev:</b> ".date("Y-m-d h:m A", time())." - User A".$id."</p></div></div>",
  "content" => $updatedData
);
file_put_contents('data.js', json_encode($jsonData, true));

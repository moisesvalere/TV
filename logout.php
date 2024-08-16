<?php
session_start();
session_destroy();
header("Location: error.php");
exit();
?>

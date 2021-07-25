<?php
    class CalendarIO {
        protected $filepath;

        public function __construct($filename) {
            if (!is_readable($filename) || !is_writable($filename)) {
                throw new Exception("Data source ${filename} is invalid.");
            }
            $this->filepath = realpath($filename);
        }
        public function load() {
            $file_content = file_get_contents($this->filepath);
            return json_decode($file_content) ?: [];
        }
        public function save($data) {
            $json_content = json_encode($data, JSON_PRETTY_PRINT);
            file_put_contents($this->filepath, $json_content);
        }
    }
    class Calendar {
        protected $contents;
        protected $io;

        public function __construct($io) {
            $this->io = CalendarIO($io);
            $this->contents = (array)$this->io->load();
        }

        public function __destruct() {
            $this->io->save($this->contents);
        }
    }
    function verify_post(...$inputs) {
        foreach ($inputs as $input) {
            if (!isset($_POST[$input])) {
                return FALSE;
            }
            if (empty($_POST[$input])) {
                return FALSE;
            }
        }
        return TRUE;
    }
    if (verify_post('name', 'start', 'end')) {
        if (!strtotime($_POST['start'])) {
            echo 'bad date format';
            return;
        }
        if (!strtotime($_POST['end'])) {
            echo 'bad date format';
            return;
        }
        $name = $_POST["name"];
        $start = $_POST["start"];
        $end = $_POST["end"];
        $movieStorage->add([
            "name" => $name,
            "start" => $start,
            "end" => $end
        ]);
    } else {
        print "please fill out";
    }
?>
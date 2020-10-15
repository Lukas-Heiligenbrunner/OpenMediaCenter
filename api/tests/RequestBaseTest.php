<?php

use PHPUnit\Framework\TestCase;

set_include_path("../");
require_once "src/handlers/RequestBase.php";

class RequestBaseTest extends TestCase {
    public function testCanBeCreatedFromValidEmailAddress() {
        $tst = $this->getMockForAbstractClass(RequestBase::class);

        $func = function (){

        };

        $tst->addActionHandler("test", $func);
        $_POST['action'] = "test";
        $tst->handleAction();

        $this->lengthDeterminator->expects($this->once())
            ->method('func');
    }
}

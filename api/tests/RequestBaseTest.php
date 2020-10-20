<?php

use PHPUnit\Framework\TestCase;

set_include_path("api/");
require_once "src/handlers/RequestBase.php";

$value = -1;

class TestHandler extends RequestBase {

    function initHandlers() {
        $this->addActionHandler("testaction", function (){
            $value = 5;
        });
    }
}

class RequestBaseTest extends TestCase {
    public function testIsDerieved() {
        $handler = new TestHandler();
        $this->assertInstanceOf(RequestBase::class, $handler);
    }

    public function testHandle(){
        $handler = new TestHandler();
        $existingObjectMock = Mockery::mock($handler)->shouldAllowMockingProtectedMethods();
//
//        $existingObjectMock->allows()->find(123)->andReturns(new Book());

//        echo json_encode($existingObjectMock->conn);
//        $testMe = $this->getMock("a", array("c"));
//        $testMe->expects($this->once())->method("c")->will($this->returnValue(123123));

//        $existingObjectMock->set
//        $_POST['action'] = "testaction";
        //$handler->handleAction();

        $this->assertInstanceOf(RequestBase::class, $handler);
    }

//    public function testCanBeCreatedFromValidEmailAddress() {
//        $tst = $this->getMockForAbstractClass(RequestBase::class);
//
//        $func = function () {
//
//        };
//
//
////        $existingObjectMock = Mockery::mock($existingObject);
////        $existingObjectMock->shouldReceive('someAction')->andReturn('foobar');
//
//        $tst->addActionHandler("test", $func);
//        $_POST['action'] = "test";
//        $tst->handleAction();
//
//        $this->lengthDeterminator->expects($this->once())
//            ->method('func');
//    }
}

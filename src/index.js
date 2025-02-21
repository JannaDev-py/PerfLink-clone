import { innerTestCase, setTestCaseValuesByDelete } from './components/test-case/test-case.js';

const $btnAddTestCase = document.querySelector('#add-test-case');

$btnAddTestCase.addEventListener('click', ()=>{    
    const $testCase = innerTestCase();  //call the function inside a variable to get the current test case created
    const $containerTestCase = document.querySelector('.test-cases-container');
    const $btnDeleteTestCase = $testCase.querySelector('.right-svg'); //get delete button of the current test case

    //add the event listener here because we have the current test case created and we dont neef get all delete buttons just the one that just created
    $btnDeleteTestCase.addEventListener('click', ()=>{
        $containerTestCase.removeChild($testCase);
        //always that a test case is created or deleted we need to reset the test case values(index, datavalue)
        setTestCaseValuesByDelete();
    });
});
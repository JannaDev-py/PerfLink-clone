import { innerTestCase, setTestCaseValuesByDelete } from './components/test-case/test-case.js';

const $btnAddTestCase = document.querySelector('#add-test-case');

$btnAddTestCase.addEventListener('click', ()=>{    
    const $testCase = innerTestCase();    
    const $containerTestCase = document.querySelector('.test-cases-container');
    const $btnDeleteTestCase = $testCase.querySelector('.right-svg');
    
    $btnDeleteTestCase.addEventListener('click', ()=>{
        $containerTestCase.removeChild($testCase);
        setTestCaseValuesByDelete();
    });
});
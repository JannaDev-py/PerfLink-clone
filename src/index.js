import { innerTestCase, setTestCaseValuesByDelete } from './components/test-case/test-case.js';
import { setGraph } from './components/graph-side/graph-side.js';

const $btnAddTestCase = document.querySelector('#add-test-case');

$btnAddTestCase.addEventListener('click', ()=>{    
    const $testCase = innerTestCase();  //call the function inside a variable to get the current test case created
    const $containerTestCase = document.querySelector('.test-cases-container');
    const $btnDeleteTestCase = $testCase.querySelector('.delete-svg'); //get delete button of the current test case
    const $copySvg = $testCase.querySelector('.copy-container');
    const notChekedCopySvg = $copySvg.innerHTML; //get default svg

    $copySvg.addEventListener('click', ()=>{
        navigator.clipboard.writeText($testCase.querySelector('textarea').value); //copy the text wuth clipboard.writeText

        $copySvg.innerHTML = 
            `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>`;
        setTimeout(()=>{$copySvg.innerHTML = notChekedCopySvg}, 2000);
    });

    //add the event listener here because we have the current test case created and we dont neef get all delete buttons just the one that just created
    $btnDeleteTestCase.addEventListener('click', ()=>{
        $containerTestCase.removeChild($testCase);
        //always that a test case is created or deleted we need to reset the test case values(index, datavalue)
        setTestCaseValuesByDelete();
        setGraph(); //call the function to set the graph evrytime a test case is deleted
    });

    setGraph(); //call the function to set the graph evrytime a test case is created
});

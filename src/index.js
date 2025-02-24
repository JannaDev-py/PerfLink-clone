import { innerTestCase, setTestCaseValuesByDelete } from './components/test-case/test-case.js';
import { setGraph, setGraphValues } from './components/graph-side/graph-side.js';

const $btnAddTestCase = document.querySelector('#add-test-case');
const $btnRunTestCases = document.getElementById('run-test');

const worker = new Worker('../public/worker.js'); //create a worker to run the test cases

function runTestCases(){
    const globalCode = document.querySelector('#global-textarea').textContent;
    const testCasesCode = document.querySelectorAll('.test-case-textarea');

    let codeToWorker = [];
    
    //put the codes on an array to later can use .sort()
    testCasesCode.forEach(testCaseCode=>{
        codeToWorker.push(testCaseCode.value);
    })

    worker.postMessage({codeToWorker, globalCode});

    const { resolve, promise } = Promise.withResolvers() //use a prommise beacuase the time of each code is a second 
    worker.onmessage = event => { resolve(event.data) }
    return promise //return the promise
}

function addEventsToTestCases($testCase){
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
        setGraph(); //call the function to set the graph everytime a test case is deleted
    });
}

$btnRunTestCases.addEventListener('click', ()=>{
    const $testCaseOps = document.querySelectorAll('.test-case .ops');
    $testCaseOps.forEach(testCaseOp => testCaseOp.innerHTML = 
        '<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24px" height="15px"><circle cx="4" cy="12" r="3"><animate id="spinner_qFRN" begin="0;spinner_OcgL.end+0.25s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="12" cy="12" r="3"><animate begin="spinner_qFRN.begin+0.1s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="20" cy="12" r="3"><animate id="spinner_OcgL" begin="spinner_qFRN.begin+0.2s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle></svg>');

    runTestCases().then(result=>{
        setGraphValues(result);
    })
});

$btnAddTestCase.addEventListener('click', ()=>{    
    const $testCase = innerTestCase();  //call the function inside a variable to get the current test case created
    addEventsToTestCases($testCase); //call the function to add the events to the test case created
    setGraph(); //call the function to set the graph everytime a test case is created
});

//on init we need to set the graph and run the test cases
document.addEventListener(`DOMContentLoaded`, ()=>{
    const $testCaseOps = document.querySelectorAll('.test-case .ops');  
    $testCaseOps.forEach(testCaseOp => testCaseOp.innerHTML = 
        '<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24px" height="15px"><circle cx="4" cy="12" r="3"><animate id="spinner_qFRN" begin="0;spinner_OcgL.end+0.25s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="12" cy="12" r="3"><animate begin="spinner_qFRN.begin+0.1s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="20" cy="12" r="3"><animate id="spinner_OcgL" begin="spinner_qFRN.begin+0.2s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle></svg>');
    
    setGraph();
    runTestCases().then(result => setGraphValues(result));
    document.querySelectorAll('.test-case').forEach(testCase => addEventsToTestCases(testCase)); //select all test cases that exists on the page add start
});
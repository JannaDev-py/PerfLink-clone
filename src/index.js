import { innerTestCase, setTestCaseValuesByDelete } from './components/test-case/test-case.js';
import { setGraph, setGraphValues } from './components/graph-side/graph-side.js';

const $btnAddTestCase = document.querySelector('#add-test-case');
const $btnRunTestCases = document.getElementById('run-test');

function runTestCases(code){
    const worker = new Worker('../public/worker.js'); //create a worker for each test case
    const globalCode = document.querySelector('#global-textarea .highlighted-code').textContent;
    
    worker.postMessage({code, globalCode});    

    const { resolve, promise } = Promise.withResolvers() //use a prommise because the time of each code is a second 
    worker.onmessage = event => { 
        resolve(event.data) 
        worker.terminate();
    }
    return promise
}

function addEventsToTestCases($testCase){
    const $containerTestCase = document.querySelector('.test-cases-container');
    const $btnDeleteTestCase = $testCase.querySelector('.delete-svg'); //get delete button of the current test case
    const $copySvg = $testCase.querySelector('.copy-container');
    const notChekedCopySvg = $copySvg.innerHTML; //get default svg

    $copySvg.addEventListener('click', ()=>{
        navigator.clipboard.writeText($testCase.querySelector('.code .highlighted-code').textContent); //copy the text wuth clipboard.writeText

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

//make a functionn to UX reset
function executeTestCasesUX(){
    const $testCaseOps = document.querySelectorAll('.test-case .ops');

    $testCaseOps.forEach(testCaseOp => testCaseOp.innerHTML = 
        '<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24px" height="15px"><circle cx="4" cy="12" r="3"><animate id="spinner_qFRN" begin="0;spinner_OcgL.end+0.25s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="12" cy="12" r="3"><animate begin="spinner_qFRN.begin+0.1s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="20" cy="12" r="3"><animate id="spinner_OcgL" begin="spinner_qFRN.begin+0.2s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle></svg>');
    
    //reset the height of the line percentage before that be overwritten by the new values
    const $rectSVG = document.querySelectorAll('.graph-svg .line-percentage');
    $rectSVG.forEach(rect => rect.style.height = '0');
    
    //get every code of the test cases and run the funciton runTestCases for each test case code and add the result to the array
    const testCasesCode = document.querySelectorAll('.test-case-textarea .highlighted-code');
    let resultsTestCases = [];
    
    //become node list to array
    const testCasesArray = Array.from(testCasesCode);

    //make an array of promises
    const promises = testCasesArray.map((testCaseCode, index) => {
        return runTestCases(testCaseCode.textContent)
            .then(result => {
                const ops = result.ops;
                resultsTestCases.push({ index, ops });
            });
    });
    
    //when all promises are resolved we can use resultsTestCases to set the graph
    Promise.all(promises)
        .then(() => {
            setGraphValues(resultsTestCases);
        })
        .catch(error => {
            console.error('Ocurrió un error:', error);
        });
}


$btnAddTestCase.addEventListener('click', ()=>{    
    const $testCase = innerTestCase();  //call the function inside a variable to get the current test case created
    addEventsToTestCases($testCase); //call the function to add the events to the test case created
    updateCodeHighlight($testCase.querySelector('.code'));
    setGraph(); //call the function to set the graph everytime a test case is created
});

$btnRunTestCases.addEventListener('click', ()=>{
    executeTestCasesUX();
    $btnRunTestCases.classList.remove('run-test-animation');
});

//on init we need to set the graph and run the test cases
document.addEventListener(`DOMContentLoaded`, ()=>{
    updateCodeHighlight(document.querySelector("#global-textarea"));
    document.querySelectorAll('.test-case').forEach(testCase => {
        addEventsToTestCases(testCase);
        updateCodeHighlight(testCase.querySelector('.code'));
    }); //select all test cases that exists on the page add start
    executeTestCasesUX();
    setGraph();
});

//if control + enter is pressed run test cases
document.addEventListener("keydown", (e)=>{
    if(e.ctrlKey && e.key === "Enter"){
        executeTestCasesUX();
    }
})
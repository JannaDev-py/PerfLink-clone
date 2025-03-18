import { innerTestCase, setTestCaseValuesByDelete } from './components/test-case/test-case.js';
import { setGraph, setGraphValues, setHistory } from './components/graph-side/graph-side.js';
import { createNewUrl, saveDataIndexedDB, getDataIndexedDB } from './app.js';

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
        '<svg fill="var(--text-color)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24px" height="15px"><circle cx="4" cy="12" r="3"><animate id="spinner_qFRN" begin="0;spinner_OcgL.end+0.25s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="12" cy="12" r="3"><animate begin="spinner_qFRN.begin+0.1s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="20" cy="12" r="3"><animate id="spinner_OcgL" begin="spinner_qFRN.begin+0.2s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle></svg>');
    
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

function handleHistoryModal(){
    const historyCounter = Number(localStorage.getItem('historyButtonCounter'));
    const $historyModal = document.querySelector('.history-modal');

    if(historyCounter%2 == 0){
        $historyModal.classList.add("history-open");
        $historyModal.removeAttribute("inert");
        localStorage.setItem('historyButtonCounter', 0);
        const $historyModalUl = $historyModal.querySelector('ul');
        $historyModalUl.innerHTML = '';
        setHistory();
    }else{
        $historyModal.classList.remove("history-open")
        $historyModal.setAttribute("inert", "");
    }
}

function handleTerminalModal(){
    const $terminalModal = document.querySelector('.terminal-modal');
    const terminalModalCounter = Number(localStorage.getItem('terminalModalCounter'));

    if(terminalModalCounter%2 == 0){
        $terminalModal.classList.add("terminal-open");
        $terminalModal.removeAttribute("inert");

        //remove welcome message with temporary counter to can reset it when the page is reloaded
        if(sessionStorage.getItem('terminalWelcomeCounter') !== null){
            sessionStorage.setItem('terminalWelcomeCounter', Number(sessionStorage.getItem('terminalWelcomeCounter')) + 1);
            if(sessionStorage.getItem('terminalWelcomeCounter') && sessionStorage.getItem('terminalWelcomeCounter') == 2){
                if($terminalModal.querySelector('.welcome-message')){
                    sessionStorage.removeItem('terminalWelcomeCounter');
                    $terminalModal.removeChild($terminalModal.querySelector('.welcome-message'));
                }
            }    
        }
    }else{
        $terminalModal.classList.remove("terminal-open")
        $terminalModal.setAttribute("inert", "");
    }
}

const $btnSaveOnThisUrl = document.querySelector('.save-url');
$btnSaveOnThisUrl.addEventListener('click', ()=>{
    const currentSvg = $btnSaveOnThisUrl.innerHTML;
    $btnSaveOnThisUrl.innerHTML = 
        `<svg width="20" height="20" viewBox="0 0 10 16" aria-hidden="true" stroke="currentColor"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg> `;

    const globalCode = document.querySelector('#global-textarea .highlighted-code').innerText;
    const testCasesCode = document.querySelectorAll('.test-case-textarea .highlighted-code');

    const currentPage = (location.href.split('?')[1]) ? Number(location.href.split('?')[1]) : 1;
    const nextDataBaseVersion = Number(localStorage.getItem('dataBaseVersion')) + 1;
    localStorage.setItem('dataBaseVersion', nextDataBaseVersion);

    saveDataIndexedDB(globalCode, testCasesCode, nextDataBaseVersion, currentPage).then(()=>{
        $btnSaveOnThisUrl.innerHTML = currentSvg;
        setHistory();
    })
});

const $btnOpenWindow = document.querySelector('.save-url-open-window');
$btnOpenWindow.addEventListener('click', ()=>{
    localStorage.setItem('dataBaseVersion', Number(localStorage.getItem('dataBaseVersion')) + 1);
    localStorage.setItem('pageCount', Number(localStorage.getItem('pageCount')) + 1);
    window.open(createNewUrl(Number(localStorage.getItem('pageCount'))), "_blank");
    handleHistoryModal();
    history.back();
});

const $btnAddTestCase = document.querySelector('#add-test-case');
$btnAddTestCase.addEventListener('click', ()=>{    
    const $testCase = innerTestCase();  //call the function inside a variable to get the current test case created
    addEventsToTestCases($testCase); //call the function to add the events to the test case created
    updateCodeHighlight($testCase.querySelector('.code'));
    setGraph(); //call the function to set the graph everytime a test case is created
});

const $btnRunTestCases = document.getElementById('run-test');
$btnRunTestCases.addEventListener('click', ()=>{
    executeTestCasesUX();
    $btnRunTestCases.classList.remove('run-test-animation');
});

const $historyButton = document.getElementById('history-button');
$historyButton.addEventListener('click', ()=>{
    localStorage.setItem('historyButtonCounter', Number(localStorage.getItem('historyButtonCounter')) + 1);
    handleHistoryModal();
});

const $historyInputSearch = document.getElementById('search-archive');
$historyInputSearch.addEventListener('input', (e)=>{
    const $historyModalUl = document.querySelector('.history-modal nav ul');
    const $li = $historyModalUl.querySelectorAll('li');
    const searchInputValue = e.target.value;
    const liTextContentArray = Array.from($li).map(li => (li.querySelector('a').textContent.toLowerCase()).includes(searchInputValue));

    liTextContentArray.forEach((liTextContent, index) => {
        if(!liTextContent){
            $li[index].style.display = 'none';
        }else{
            $li[index].style.display = `flex`;
        }
    });
    if(searchInputValue === ''){
        setHistory();
    }
})

const $terminalButton = document.getElementById('terminal-button');
$terminalButton.addEventListener('click', ()=>{
    localStorage.setItem('terminalModalCounter', Number(localStorage.getItem('terminalModalCounter')) + 1);
    handleTerminalModal()
});

//on init we need to set the graph and run the test cases
document.addEventListener(`DOMContentLoaded`, ()=>{
    const codeExecute = ()=>{
        updateCodeHighlight(document.querySelector("#global-textarea"));
        document.querySelectorAll('.test-case').forEach(testCase => {
            addEventsToTestCases(testCase);
            updateCodeHighlight(testCase.querySelector('.code'));
        }); //select all test cases that exists on the page at start
        executeTestCasesUX();
        setGraph();
        handleHistoryModal();
        handleTerminalModal();
    }

    if(localStorage.getItem('dataBaseVersion') === null){
        localStorage.setItem('dataBaseVersion', 1);
    }
    if(localStorage.getItem('pageCount') === null){
        localStorage.setItem('pageCount', 1);
    }
    if(localStorage.getItem('historyButtonCounter') === null){
        localStorage.setItem('historyButtonCounter', 1);
    }
    if(localStorage.getItem('terminalModalCounter') === null){
        localStorage.setItem('terminalModalCounter', 1);
    }
    if(sessionStorage.getItem('terminalWelcomeCounter') === null){
        sessionStorage.setItem('terminalWelcomeCounter', 0);
    }

    let currentPage = (location.href.split('?')[1]) ? Number(location.href.split('?')[1]) : 1;
    const nextDataBaseVersion = Number(localStorage.getItem('dataBaseVersion')) + 1;
    localStorage.setItem('dataBaseVersion', nextDataBaseVersion);

    getDataIndexedDB(nextDataBaseVersion, currentPage).then(data=>{
        if(data === null){ 
            codeExecute();
        }
        else{
            //we will modified the test cases before run it and set the graph
            const testCaseCodeNode = document.querySelectorAll(".test-case .code");
            const dataCodeTestCaseLength = data.codeTestCaseStorage.length;

            if(testCaseCodeNode.length < dataCodeTestCaseLength){
                //add test cases if there are more data storage than test cases
                for(let i = 0; i < (dataCodeTestCaseLength - testCaseCodeNode.length); i++){
                    const $testCase = innerTestCase();  
                    addEventsToTestCases($testCase); 
                    updateCodeHighlight($testCase.querySelector('.code'));
                    setGraph(); 
                }

            }else if(dataCodeTestCaseLength < testCaseCodeNode.length){
                //delete test cases if there are more test cases than data storage
                for (let i = (testCaseCodeNode.length - dataCodeTestCaseLength) - 2; i >= 0; i--) {
                    const nodeToRemove = document.querySelectorAll('.test-case')[i];
                    const $containerTestCase = document.querySelector('.test-cases-container');
                    if($containerTestCase.contains(nodeToRemove)){
                        $containerTestCase.removeChild(nodeToRemove);
                        setTestCaseValuesByDelete();
                        setGraph(); 
                    }
                }
                
                //delete final test case using just querySelector, because if there just one test case querySelectorAll dont returns a node 
                const $containerTestCase = document.querySelector('.test-cases-container');
                $containerTestCase.removeChild(document.querySelector('.test-case'));
                setTestCaseValuesByDelete();
                setGraph();
            }
            
            //call the node again beacuase it will be modifier than the testCaseCodeNode called at start
            const testCaseCodeNodeUpdate = document.querySelectorAll(".test-case .code");
            //set storage values
            document.querySelector("#global-textarea").innerHTML = data.globalCodeStorage;
            testCaseCodeNodeUpdate.forEach((code , index) => {
                code.innerHTML = data.codeTestCaseStorage[index];
            });
            
            //reset container test cases
            const $containerTestCase = document.querySelector('.test-cases-container');
            $containerTestCase.innerHTML = $containerTestCase.innerHTML;
            codeExecute();
        }
    })
});

//if control + enter is pressed run test cases
document.addEventListener("keydown", (e)=>{
    if(e.ctrlKey && e.key === "Enter"){
        executeTestCasesUX();
    }
})
//set the graph for new test cases
export function setGraph(){
    //get the compenents
    const $graphSvg = document.querySelector('.graph-svg');
    const $numbersMainContainer = document.querySelector('.numbers');
    const $containersTestCase = document.querySelectorAll('.test-case');
    
    const distanceBetweenNumbers = (300 / ($containersTestCase.length + 1));

    $graphSvg.innerHTML = ""; //reset the graph
    $numbersMainContainer.innerHTML = ""; //reset the numbers

    for(let i = 1; i < $containersTestCase.length + 1; i++){ //start at 1 per can multiply by i
        //point 0,0 on a svg is the right bottom corner and the svg order the elements from the x-position element, so if we add them just with distanceBetweenNumbers its added at start, cause x-value goes increment by distanceBetweenNumbers
        //conclusion: the svg order the element from the x-position element, thats why 300 - position
        const codeHTMLNewLine = `
            <rect x="${300 - ((distanceBetweenNumbers * i) + 2.5)}" y="0" width="5" height="300" fill="black"></rect>    
            <rect class="line-percentage" x="${300 - ((distanceBetweenNumbers * i) + 2.5)}" y="0" width="5" height="0" fill="green"></rect>`; //basic code to new line on svg graph 
        $graphSvg.innerHTML += codeHTMLNewLine;
    
        const numbersCodeNumbersGraph = //add number and percentage for each test case added
            `<div class="number-container"> 
                <span>${i}</span>
                <span class="percentage">0%</span>
            </div>`;
        
        $numbersMainContainer.innerHTML += numbersCodeNumbersGraph;
    }
}

//set the graph for the test cases that already exists with them values
export function setGraphValues(data){
    const maxValue = Math.max(...data.map(result => result.ops));
    let color = `#000`;

    data.forEach(resultToSingleTestCase => {
        const ops = resultToSingleTestCase.ops;
        const indexTestCase = resultToSingleTestCase.index;
        
        const $linePercentage = document.querySelectorAll(".line-percentage")[indexTestCase]; //get the last line percentage
        const $percentageOnContainer = document.querySelectorAll('.number-container')[indexTestCase].querySelector('.percentage'); //get the percentage on the container
        const $testCaseOps = document.querySelectorAll('.test-case .ops')[indexTestCase];
        
        const heightLinePercentage = (ops / maxValue) * 300; //get the height of the line percentage
        $linePercentage.style.height = heightLinePercentage;
        const percentageOnContainer = Math.round((ops / maxValue) * 100); 

        if(percentageOnContainer <= 100 && percentageOnContainer > 90) color = `#00ff00`;
        else if(percentageOnContainer < 91 && percentageOnContainer > 80) color = `#66ff00`;
        else if(percentageOnContainer < 81 && percentageOnContainer > 70) color = `#ccff00`;
        else if(percentageOnContainer < 71 && percentageOnContainer > 60) color = `#ffff00`;
        else if(percentageOnContainer < 61 && percentageOnContainer > 50) color = `#ffcc00`;
        else if(percentageOnContainer < 51 && percentageOnContainer > 40) color = `#ff9900`;
        else if(percentageOnContainer < 41 && percentageOnContainer > 30) color = `#ff8000`;
        else if(percentageOnContainer < 31 && percentageOnContainer > 10) color = `#ff6600`;
        else if(percentageOnContainer < 21 && percentageOnContainer > 10) color = `#ff3300`;
        else if(percentageOnContainer < 11 && percentageOnContainer > 0) color = `#ff0000`;

        $linePercentage.style.fill = color;

        $percentageOnContainer.textContent = `${percentageOnContainer}%`; //set the percentage on the container

        if(isNaN(ops)) {
            $testCaseOps.textContent = `error`;
            $testCaseOps.style.color = 'red';
            addTerminalMessage(`Error: ${ops}`, 'red');
        } 
        else{
            $testCaseOps.textContent = `${ops.toLocaleString('en-US')} ops/s`;  //.toLocaleString() to format the number
            $testCaseOps.style.color = 'var(--text-color)';
        }
    });
}

export function setHistory(){
    const historyStorage = localStorage.getItem('pageCount');
    const $historyModal = document.querySelector('.history-modal');
    const $historyModalUl = $historyModal.querySelector('ul');
    let fragment = document.createDocumentFragment();
    $historyModalUl.innerHTML = '';

    if(historyStorage !== null){
        const href = location.href.split("?")[0];
        
        const IDBrequest = window.indexedDB.open("PerfLink", Number(localStorage.getItem('dataBaseVersion')));
        IDBrequest.onsuccess = function (event) {
            const db = event.target.result;
            let archiveNames = db.objectStoreNames;
            db.close();

            for(const archiveName of archiveNames){
                const li = document.createElement('li');

                li.innerHTML += `
                <a href="${href}?${archiveName.split("-")[1]}">${archiveName.charAt(0).toUpperCase() + archiveName.slice(1)}</a>
                <button delete-archive aria-label="delete archive" title="delete archive">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-database-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3" /><path d="M4 6v6c0 1.657 3.582 3 8 3c.537 0 1.062 -.02 1.57 -.058" /><path d="M20 13.5v-7.5" /><path d="M4 12v6c0 1.657 3.582 3 8 3c.384 0 .762 -.01 1.132 -.03" /><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" /></svg>
                </button>`;    
                
                const button = li.querySelector('button');
                button.addEventListener("click", ()=>{
                    $historyModalUl.removeChild(li);
    
                    localStorage.setItem('dataBaseVersion', (Number(localStorage.getItem('dataBaseVersion')) + 1));
                    localStorage.setItem('pageCount', Number(localStorage.getItem('pageCount')) - 1);
                    if(Number(localStorage.getItem('pageCount')) === 0){
                        localStorage.setItem('pageCount', 1);
                    }
    
                    const indexedDB = window.indexedDB.open("PerfLink", Number(localStorage.getItem('dataBaseVersion')));
                    indexedDB.onupgradeneeded = (event) => {
                        const db = event.target.result;
                    
                        if (db.objectStoreNames.contains(archiveName)) {
                            db.deleteObjectStore(archiveName);
                        }
                    };
    
                    indexedDB.onsuccess = (event) => {
                        const db = event.target.result;
                        db.close();
                    };
    
                    localStorage.setItem('dataBaseVersion', (Number(localStorage.getItem('dataBaseVersion')) + 1));
                })
                fragment.appendChild(li);
            }
            $historyModalUl.appendChild(fragment);
        }
    }
}

function addTerminalMessage(message, color){
    const $terminalModal = document.querySelector('.terminal-modal');
    const outputElement = document.createElement('output');
    outputElement.innerHTML += message.trim();
    $terminalModal.appendChild(outputElement);
    outputElement.style.color = color;
}
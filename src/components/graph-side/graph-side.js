export function setGraph(){
    //get the compenents
    const $graphSvg = document.querySelector('.graph-svg');
    const $numbersMainContainer = document.querySelector('.numbers');
    const $containersTestCase = document.querySelectorAll('.test-case');
    const root = document.querySelector(':root').style;
    
    const distanceBetweenNumbers = (300 / ($containersTestCase.length + 1));
    root.setProperty('--gap-graph-side-numbers', `${distanceBetweenNumbers - 5}px`);

    $graphSvg.innerHTML = ""; //reset the graph
    $numbersMainContainer.innerHTML = ""; //reset the numbers

    for(let i = 1; i < $containersTestCase.length + 1; i++){ //start at 1 per can multiply by i
        //point 0,0 on a svg is the right bottom corner and the svg order the elements from the x-position element, so if we add then just with distanceBetweenNumbers its added at start, cause x-value goes increment by distanceBetweenNumbers
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

export function setGraphValues(data){
    const maxValue = Math.max(...data.map(result => result.ops));

    data.forEach(resultToSingleTestCase => {
        const ops = resultToSingleTestCase.ops;
        const indexTestCase = resultToSingleTestCase.index;
        
        const $linePercentage = document.querySelectorAll(".line-percentage")[indexTestCase]; //get the last line percentage
        const $percentageOnContainer = document.querySelectorAll('.number-container')[indexTestCase].querySelector('.percentage'); //get the percentage on the container
        const $testCaseOps = document.querySelectorAll('.test-case .ops')[indexTestCase];
        
        const heightLinePercentage = (ops / maxValue) * 300; //get the height of the line percentage
        $linePercentage.setAttribute('height', heightLinePercentage);

        $percentageOnContainer.textContent = `${Math.round((ops / maxValue) * 100)}%`; //set the percentage on the container
        $testCaseOps.textContent = `${ops} ops/s`; //set the ops on the label
    });
}
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

        if(ops === "error") {
            $testCaseOps.textContent = `${ops}`;
            $testCaseOps.style.color = 'red';
        } 
        else{
            $testCaseOps.textContent = `${ops.toLocaleString('en-US')} ops/s`;  //.toLocaleString() to format the number
            $testCaseOps.style.color = 'var(--text-color)';
        }
    });
}

export function setHistory(){
}
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

        const codeHTMLNewLine = `
            <rect x="${(distanceBetweenNumbers * i) - 2.5}" y="0" width="5" height="300" fill="black"></rect>    
            <rect class="line-percentage" x="${(distanceBetweenNumbers * i) - 2.5}" y="0" width="5" height="100" fill="green"></rect>`; //basic code to new line on svg graph    }
        
        $graphSvg.innerHTML += codeHTMLNewLine;
    
        const numbersCodeNumbersGraph =
            `<div class="number-container">
                <span>${i}</span>
                <span>0%</span>
            </div>`;
        
        $numbersMainContainer.innerHTML += numbersCodeNumbersGraph;
    }
}
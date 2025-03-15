// this function is used to create a test case
export function createTestCase() {
    const $testCase = document.createElement('DIV');

    $testCase.classList.add('test-case');
    $testCase.setAttribute('data-value', 1);

    $testCase.innerHTML = `
        <header>
            <div class="left">
                <p class="test-case-number">1</p>
                <label for="test-case-textarea-1" class="test-case-label">Test Case</label>
            </div>
            <div class="right">
                <p class="ops">
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24px" height="15px"><circle cx="4" cy="12" r="3"><animate id="spinner_qFRN" begin="0;spinner_OcgL.end+0.25s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="12" cy="12" r="3"><animate begin="spinner_qFRN.begin+0.1s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle><circle cx="20" cy="12" r="3"><animate id="spinner_OcgL" begin="spinner_qFRN.begin+0.2s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33"/></circle></svg>
                </p>
                <button class="copy-container" title="copy test case text" aria-label="copy test case text">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                        <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"></path>
                    <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"></path>
                    </svg>
                </button>
                <button class="delete-container" title="delete test case" aria-label="delete test case">
                    <svg class="delete-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                        <path d="M7 4l10 16"></path>
                        <path d="M17 4l-10 16"></path>
                    </svg>    
                </button>
            </div>
        </header>
        <output aria-label="textarea-test-case" id="test-case-textarea-1" class="code test-case-textarea" contenteditable="true" role="textbox"></output>`
        return $testCase;
}

//we dont call the createTestCase function here because we want control when the test case is added
export function innerTestCase() {
    const $containerTestCase = document.querySelector('.test-cases-container');
    $containerTestCase.appendChild(createTestCase());
    return setTestCaseValuesByDelete();
}

//this function reset all index, of the test cases and set the value of the test case
export function setTestCaseValuesByDelete(){
    const $containersTestCase = document.querySelectorAll('.test-case');

    $containersTestCase.forEach((singleContainerTestCase, index)=>{
        singleContainerTestCase.setAttribute('data-value', index + 1);
        singleContainerTestCase.querySelector('.test-case-number').innerText = index + 1;
        singleContainerTestCase.querySelector('label').setAttribute('for', `test-case-textarea-${index + 1}`); 
        singleContainerTestCase.querySelector('.code').setAttribute('id', `test-case-textarea-${index + 1}`); //change id to dont duplicate ids
    });

    //return the last test case
    return $containersTestCase[$containersTestCase.length - 1];
}
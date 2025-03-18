const keywords = [
    "abstract", "arguments", "await", "boolean", "break", "byte", "case", 
    "catch", "char", "class", "const", "continue", "debugger", "default", 
    "delete", "do", "double", "else", "enum", "eval", "export", "extends", 
    "false", "final", "finally", "float", "for", "function", "goto", "if", 
    "implements", "import", "in", "instanceof", "int", "interface", "let", 
    "long", "native", "new", "null", "package", "private", "protected", 
    "public", "return", "short", "static", "super", "switch", "synchronized", 
    "this", "throw", "throws", "transient", "true", "try", "typeof", "var", 
    "void", "volatile", "while", "with", "yield", "constructor", "Array", 
    "Date", "eval", "function", "hasOwnProperty", "Infinity", "isFinite", 
    "isNaN", "isPrototypeOf", "length", "Math", "NaN", "Number", 
    "Object", "prototype", "String", "toString", "undefined", "valueOf"
];


document.addEventListener("DOMContentLoaded", ()=>{ updateCodeHighlight()});

function updateCodeHighlight(el){
    if(el){
        if(el.getAttribute("contenteditable")){
            //if user put contenteditable on the code, then we need make the content highlighted editable
            //then we need to make a div with the content of the element and highlight it
            //if dont a br, the html element will be empty and the code content will not be selected then no highlighted code will be shown
            const br = document.createElement("br");
            
            if(el.innerHTML == "") {
                el.appendChild(br);
            }

            el.appendChild(document.createElement("DIV"));

            const div = el.querySelector("div");
            div.innerHTML = el.innerHTML;
            div.innerHTML = setHighlight(div.innerHTML.replace(/<div><\/div>/g, "")); //to get br or white space too
            div.classList.add("highlighted-code");
            div.setAttribute("contenteditable", "false");
            const highlightCodeDiv = el.querySelector(".highlighted-code"); 

            //what is being editable is the element that has the contenteditable attribute and we get that content constantly to put it highlighted on the div that show the code, because it works with a div that be behind the element and the principal element it is in front but with content color transparent, per shows only the div with the highlighted code
            const getContentHighlightedWithoutHighlightedDiv = (el)=>{
                //search for the content execept the highlighted-code class this we can search divs with br too
                const contentRegex = /((?:[^<]|<(?!\/?div\b[^>]*\bclass\s*=\s*["'].*?\bhighlighted-code\b.*?["'][^>]*\bcontenteditable\b[^>]*>))*)/
                const contentWithoutEditableDiv = el.innerHTML.match(contentRegex)[0];  
                const contentHighlighted = setHighlight(contentWithoutEditableDiv);
                return contentHighlighted;
            }

            el.addEventListener("input", ()=>{
                const contentRegex = /((?:[^<]|<(?!\/?div\b[^>]*\bclass\s*=\s*["'].*?\bhighlighted-code\b.*?["'][^>]*\bcontenteditable\b[^>]*>))*)/
                const contentWithoutEditableDiv = el.innerHTML.match(contentRegex)[0];  
                
                //we cant live the element empty, becuase it wont be nothing to work with the highlighted code
                if(el.innerHTML == "") el.insertBefore(highlightCodeDiv, el.lastChild);
                if(contentWithoutEditableDiv == "") el.insertBefore(br, el.firstChild);

                highlightCodeDiv.innerHTML = getContentHighlightedWithoutHighlightedDiv(el);
            }) 

            el.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
                    const br = document.createElement("br");
                    range.insertNode(br);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    //event input dont detect enter key
                    div.innerHTML = getContentHighlightedWithoutHighlightedDiv(el);
            }})   

        }else {
            el.innerHTML = setHighlight(el.innerHTML);
            el.style.color = "var(--based-color-text)";
        }
    };
}

function setHighlight(el){
    const symbolRegex = /(?<!<[^>]*)(?<!&nbsp)[;=+\-{}\[\]\(\)$\.>]|(&gt;)|(&lt;)|<(?!span\b|\/span\b|br\b)/g;
    // symbols "><" there no like that in the code are &gt; and &lt;
    const stringRegex = /["'`](.*?)["'`]/g;
    const commentRegex = /(\/\/.*?<br>)|(\/\/.*\s)|(\/\*[\s\S]*?\*\/)/g;

    //get all codes and highlight them
    const stringHTMLCodeHighlight = simpleHighlight(el, stringRegex, "string");
    const keywordHTMLCodeHighlight = keywordHighlight(stringHTMLCodeHighlight);
    const methodHTMLCodeHighlight = methodHighlight(keywordHTMLCodeHighlight);
    const symbolHTMLCodeHighlight = simpleHighlight(methodHTMLCodeHighlight, symbolRegex, "symbol");
    const commentHTMLCodeHighlight = simpleHighlight(symbolHTMLCodeHighlight, commentRegex, "comment");
    return commentHTMLCodeHighlight;
}

//make functions that highlight the code by sections, per can search for the changes on each section
function keywordHighlight(code){
    let codeHTML = code;
    for(const keyword of keywords){
        const regexKeyword = new RegExp(`(?<!<[^>]*)\\b${keyword}\\b(?!([^<]*>))`, "g");
        if(codeHTML.includes(keyword)){
            codeHTML = codeHTML.replace(regexKeyword, `<span class="highlight-keyword">${keyword}</span>`);
        }
    }

    return codeHTML;
}

function methodHighlight(code){
    const methodRegex = /\.\w+\(/g; //returns "console.log("
    const matchMethod = code.match(methodRegex);
    let codeHTML = code;

        if(matchMethod){
            for(const matchMethodsArray of matchMethod){
                const matchMethodWithoutParenthesis = matchMethodsArray.replace(/[(]/g, ""); //take off parenthesis
                const matchMethodSecondWord = matchMethodWithoutParenthesis.split(".")[1];
                const dinamicMethodRegex = new RegExp(`\\b${matchMethodSecondWord}\\b`, "g");
                codeHTML = codeHTML.replace(dinamicMethodRegex, `<span class="highlight-method">${matchMethodSecondWord}</span>`);
            }
        }

    return codeHTML;
}

function simpleHighlight(code, regex, highlightName){
    let codeHTML = code;
    
    codeHTML = codeHTML.replace(regex, match => `<span class="highlight-${highlightName}">${match}</span>`);

    return codeHTML
}
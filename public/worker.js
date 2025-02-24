self.addEventListener('message', (e)=>{
    const {codeToWorker, globalCode} = e.data;
    console.log(e.data)
    let resultsTestCases = [];

    codeToWorker.forEach((code, index)=>{
        try{
            const result = () =>{
                let end = Date.now() + 1000;
                let ops = 0;

                while(Date.now() < end){
                    eval(`
                        ${globalCode};
                        ${code};
                    `)
                    ops++;
                }
                return {index, ops};
            }
            resultsTestCases.push(result());
        }catch(e){
            console.log(e);
        }
    })

    self.postMessage(resultsTestCases);
});
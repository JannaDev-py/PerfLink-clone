onmessage = async (e) => {
    const { codeToWorker, globalCode } = e.data;
    let resultsTestCases = [];
    let result;

    for (const [index, code] of codeToWorker.entries()) {
        try {
            result = await eval(`(async () => {
                let end = Date.now() + 1000;
                let ops = 0;
                ${globalCode};

                while (Date.now() < end) {
                    ${code};
                    ops++;
                }
                return { index, ops };
            })()`);
            resultsTestCases.push(result);
        } catch (e) {
            resultsTestCases.push({ index, ops: `error` });
        }
    }

    self.postMessage(resultsTestCases);
}

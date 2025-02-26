onmessage = async (e) => {
    const { code, globalCode } = e.data;
    let result = 0;

    try {
        result = await eval(`(async () => {
            let end = Date.now() + 100;
            let ops = 0;
            ${globalCode};

            while (Date.now() < end) {
                ${code};
                ops++;
            }
            ops = ops * 10;
            return { ops };
        })()`);

        self.postMessage(result);
    } catch (e) {
        self.postMessage({ops: `error`});
        console.error(e);
    }
}

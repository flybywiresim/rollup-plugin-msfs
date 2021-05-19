/*
 * MIT License
 *
 * Copyright (c) 2021 FlyByWire Simulations
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

const OUTPUT_DIR_ROOT = '/Pages/VCockpit/Instruments/';

const fs = require('fs');
const { paramCase } = require('change-case');
const [html, js] = require('./templates.js');

const trim = (text) => `${text.trimStart().trimEnd()}\n`;

module.exports = ({ name, jsBundle = 'bundle.js', cssBundle = 'bundle.css', instrumentDir = name, elementName, config, imports = [], outputDir }) => ({
    name: 'msfs',
    writeBundle(_config, bundle) {
        const { code: jsCode } = bundle[jsBundle];
        const { source: cssCode } = bundle[cssBundle];

        if (config.isInteractive === undefined) {
            this.warn({ message: 'config.isInteractive not provided, defaulting to false.' });
            config.isInteractive = false;
        }

        const relativeOutputDirStart = outputDir.indexOf(OUTPUT_DIR_ROOT);

        if (relativeOutputDirStart === -1) {
            this.error({ message: `outputDir must contain '${OUTPUT_DIR_ROOT}'` });
        }

        const relativeOutputDir = outputDir.substring(relativeOutputDirStart);
        const finalOutputDir = `${relativeOutputDir}/${instrumentDir}`;

        const processedHtml = html(name, finalOutputDir, imports, cssCode, jsCode);
        const processedJs = js(name, config.isInteractive, elementName || paramCase(name));

        // Write output
        fs.mkdirSync(`${outputDir}/${instrumentDir}`, { recursive: true });
        fs.writeFileSync(`${outputDir}/${instrumentDir}/template.html`, trim(processedHtml));
        fs.writeFileSync(`${outputDir}/${instrumentDir}/template.js`, trim(processedJs));
    },
});

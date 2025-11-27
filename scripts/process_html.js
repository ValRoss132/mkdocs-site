const fs = require('fs')
const path = require('path')
const { glob } = require('glob')
const { minify } = require('html-minifier-terser')
const Typograf = require('typograf')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const tp = new Typograf({ locale: ['ru', 'en-US'] })

const minifyOptions = {
	collapseWhitespace: true,
	removeComments: true,
	minifyJS: true,
	minifyCSS: true,
}

async function processFiles() {
	const files = await glob('site/**/*.html')

	for (const file of files) {
		console.log(`Processing: ${file}`)
		let content = fs.readFileSync(file, 'utf8')

		const dom = new JSDOM(content)
		const doc = dom.window.document

		const contentBlock = doc.querySelector('.content')
		if (contentBlock) {
			contentBlock.innerHTML = tp.execute(contentBlock.innerHTML)
		}

		content = dom.serialize()

		const minified = await minify(content, minifyOptions)

		fs.writeFileSync(file, minified)
	}
	console.log('HTML processing (Typography + Minification) complete.')
}

processFiles().catch((err) => console.error(err))

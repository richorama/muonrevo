build:
	@echo Lint
	@eslint . --ext .js --ext .jsx
	@echo Test
	@mocha
	@echo Build
	@browserify -t babelify index.jsx --outfile ./dist/muonrevo.js
	@echo Compress
	@uglifyjs ./dist/muonrevo.js  --output ./dist/muonrevo.min.js --compress warnings=false
	@toaster "Annotate" "make successful"
	@wc -c ./dist/muonrevo.js
	@wc -c ./dist/muonrevo.min.js
	@echo Done

run: build
	@static

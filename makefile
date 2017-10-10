build:
	@echo Lint
	@eslint . --ext .js --ext .jsx
	@echo Test
	@mocha
	@echo Build
	@browserify  -t babelify index.jsx  -g [ envify --NODE_ENV production ] -g uglifyify  | uglifyjs --compress warnings=false --mangle > ./dist/muonrevo.min.js
	@wc -c ./dist/muonrevo.min.js
	@echo Done

run: build
	@static
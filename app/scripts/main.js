// Global Time Functions

var start = 0,
	end = 0,
	time = 0,
	index = 0;

// Basic Example Spawn function --> New procces on a worker thread

var p = new Parallel('forwards');
 
// Spawn a remote job (we'll see more on how to use then later) // The argument is the function
p.spawn(function (data) {
	data = data.split('').reverse().join('');
 
  return data;
}).then(function (data) {
	console.log('Example 1');
	console.log(data); // logs sdrawrof
});

var serialCount = function() {
	// Basic Example 2 --> Serial
	start = new Date().getTime();
	// It last 51 seconds
	while (++index < 1000000 * 1000000) {}
	end = new Date().getTime();
	time = (end - start)/1000;
	console.log('Example 2 --> Standard Time');
	console.log('Time : ' + time.toString() + ' ms');
};
// Basic Example 2 --> Spawn function
var slowSquare = function (n) {
	var i = 0;
	while (++i < n * n) {}
	return i;
};

var ff = function(n) {
	console.log('Example 2 --> Parallel Time');
	end = new Date().getTime();
	time = (end - start)/1000;
	console.log('Time : ' + time.toString() + ' s');
	start = end = time = 0;
	//serialCount();
};
// Create a job
var p2 = new Parallel(100000);

start = new Date().getTime();
// Spawn our slow function
//p2.spawn(slowSquare).then(ff);


// Basic Example 3 --> Map function
log = function () { 
	console.log(arguments); 
	end = new Date().getTime();
	time = (end - start)/1000;
	console.log("Example Fibonacci")
	console.log('Time : ' + time.toString() + ' s');
	start = end = time = 0;
	fibSerial();
   };
 
// Cannot use anonimous function, we need to create and name them appropiately
function fib(n) {
  return n < 2 ? 1 : fib(n - 1) + fib(n - 2);
}

start = end = time = 0;

// Last with greater numbers
var p4 = new Parallel([40, 41, 42]);
start = new Date().getTime();
p4.map(fib).then(log);

// Serial fibonacci
function fibSerial() {
	start = end = time = 0;
	start = new Date().getTime();
	fib(40);fib(41);fib(42);
	end = new Date().getTime();
	time = (end - start)/1000;
	console.log("Example serial")
	console.log('Time : ' + time.toString() + ' s');
	start = end = time = 0;
}

// Using require & reduce
// Use underscore's range function to generate the series 0..49
var p5 = new Parallel(_.range(50));
 
function add(d) { return d[0] + d[1]; }
function factorial(n) { return n < 2 ? 1 : n * factorial(n - 1); }
function log() { console.log(arguments); }


// Hace falta el require porque estamos usando una función anónima que crea un contexto diferente
p5.require(factorial)
 
// No termino de comprender qué hace esto
p5.map(function (n) { return Math.pow(10, n) / factorial(n); }).reduce(add).then(log);

//p5.map(function (n, factorial) { return Math.pow(10, n) / factorial(n); }).reduce(add).then(log);

// Require example

var wontWork = function (n) { return n * n; };
 
function worksGreat(n) { return n * n };
 
var r = new Parallel(3).require(wontWork).spawn(function (a) { return 2 * wontWork(a); }, 3);  // throws an error
 
var r = new Parallel(3).require(wontWork).spawn(function (a) { return 2 * worksGreat(a); }, 3);

var r = new Parallel(3).require(worksGreat).spawn(function (a) { console.log(2 * worksGreat(a));return 2 * worksGreat(a); }, 3); // returns 18
 
//var r = new Parallel(3).require({ fn: wontWork, name: 'wontWork' }).spawn(function (a) { return 2 * wontWork(a); }, 3); // returns 18

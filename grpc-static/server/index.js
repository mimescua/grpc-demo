var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')
var calc = require('../server/protos/calculator_pb')
var calc_service = require('../server/protos/calculator_grpc_pb')

var grpc = require('grpc')

function greet(call, callback) {
    var greeting = new greets.GreetResponse()

    greeting.setResult(
        "Hello " + call.request.getGreeting().getFirstName() + ' ' + call.request.getGreeting().getLastName()
    )

    callback(null, greeting)
}
function greetManyTimes(call, callback) {
    var firstName = call.request.getGreeting().getFirstName()

    let count = 0, intervalID = setInterval(function () {
        var greetManyTimesResponse = new greets.GreetManyTimesResponse()
        greetManyTimesResponse.setResult(firstName)

        // setup streaming
        call.write(greetManyTimesResponse)
        if (++count > 9) {
            clearInterval(intervalID)
            call.end() // we have sent all messages!
        }
    }, 1000)
}
function sum(call, callback) {
    var sum_response = new calc.SumResponse()

    sum_response.setSumResult(
        call.request.getAddendOne() + call.request.getAddendTwo()
    )

    callback(null, sum_response)
}
//primeFactor -
function primeNumberDecomposition(call, callback) {
    var number = call.request.getNumber();
    var divisor = 2;

    console.log("Received number: ", number);

    while (number > 1) {
        if (number % divisor === 0) {
            var primeNumberDecompositionResponse = new calc.PrimeNumberDecompositionResponse();

            primeNumberDecompositionResponse.setPrimeFactor(divisor);

            number = number / divisor;

            //write the message using call.write()
            call.write(primeNumberDecompositionResponse);
        } else {
            divisor++;
            console.log("Divisor has increased to ", divisor);
        }
    }

    call.end(); // all messages sent! we are done
}

function main() {
    var server = new grpc.Server()
    server.addService(service.GreetServiceService, {greet: greet, greetManyTimes: greetManyTimes})
    server.addService(calc_service.CalculatorServiceService, { sum: sum, primeNumberDecomposition: primeNumberDecomposition })

    server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure())
    server.start()

    console.log('Server running on port 50051')
}
main()
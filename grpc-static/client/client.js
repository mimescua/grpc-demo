var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')
var calc = require('../server/protos/calculator_pb')
var calc_service = require('../server/protos/calculator_grpc_pb')

var grpc = require('grpc')

function callGreetings() {
    var client = new service.GreetServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    )

    // create our request
    var request = new greets.GreetRequest()

    // create a protocol buffer greeting message
    var greeting = new greets.Greeting()
    greeting.setFirstName("Tobey")
    greeting.setLastName("Maguire 2")

    // set the Greeting to our request
    request.setGreeting(greeting)

    client.greet(request, (error, response) => {
        if (!error) {
            console.log("GreeetingResponse: ", response.getResult());
        }
        else {
            console.error(error);
        }
    })
}
function callGreetManyTimes() {
    var client = new service.GreetServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    )

    //create request
    var request = new greets.GreetManyTimesRequest()
    var greeting = new greets.Greeting()
    greeting.setFirstName('Michael')
    greeting.setLastName('Jackson')

    request.setGreeting(greeting)

    var call = client.greetManyTimes(request, () => { })

    call.on('data', (response) => {
        console.log('Client Streaming Response: ', response.getResult());
    })

    call.on('status', (status) => {
        console.log(status.details);
    })

    call.on('error', (error) => {
        console.error(error.details);
    })

    call.on('end', () => {
        console.log('Streaming ended!');
    })

}

function callSum() {
    var client = new calc_service.CalculatorServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    )

    var sum_request = new calc.SumRequest()

    sum_request.setAddendOne(10)
    sum_request.setAddendTwo(15)

    client.sum(sum_request, (error, response) => {
        if (!error) {
            console.log(sum_request.getAddendOne() + " + " + sum_request.getAddendTwo() + " = " + response.getSumResult());
        }
        else {
            console.error(error);
        }
    })
}
function callPrimeNumberDecomposition() {
    var client = new calc_service.CalculatorServiceClient(
        "localhost:50051",
        grpc.credentials.createInsecure()
    );

    var request = new calc.PrimeNumberDecompositionRequest();

    var number = 567890

    request.setNumber(number);

    var call = client.primeNumberDecomposition(request, () => { });

    call.on("data", response => {
        console.log("Prime Factors Found: ", response.getPrimeFactor());
    });

    call.on("error", error => {
        console.error(error);
    });

    call.on("status", status => {
        console.log(status);
    });

    call.on("end", () => {
        console.log("Streaming Ended!");
    });
}

function main() {
    //console.log('Hello from client')
    //callGreetings()
    //callGreetManyTimes()
    //callSum()
    callPrimeNumberDecomposition()
}
main()
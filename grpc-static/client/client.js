var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')
var summing = require('../server/protos/sum_pb')
var sum_service = require('../server/protos/sum_grpc_pb')
var grpc = require('grpc')

function callGreetings(){
    var client = new service.GreetServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    )

    // create our request
    var request =  new greets.GreetRequest()

    // create a protocol buffer greeting message
    var greeting = new greets.Greeting()
    greeting.setFirstName("Tobey")
    greeting.setLastName("Maguire 2")

    // set the Greeting to our request
    request.setGreeting(greeting)

    client.greet(request, (error, response) => {
        if(!error){
            console.log("GreeetingResponse: ", response.getResult());
        }
        else {
            console.error(error);
        }
    })
}

function callSum(){
    var client = new sum_service.SumServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    )

    var sum_request =  new summing.SumRequest()
    
    sum_request.setAddendOne(10)
    sum_request.setAddendTwo(15)

    client.sum(sum_request, (error, response) => {
        if(!error){
            console.log(sum_request.getAddendOne() + " + " + sum_request.getAddendTwo() + " = " + response.getSumResult());
        }
        else {
            console.error(error);
        }
    })
}

function main(){
    console.log('Hello from client')
    callGreetings()
    callSum()
}
main()
var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')
var summing = require('../server/protos/sum_pb')
var sum_service = require('../server/protos/sum_grpc_pb')

var grpc = require('grpc')

function greet(call, callback){
    var greeting = new greets.GreetResponse()

    greeting.setResult(
        "Hello " + call.request.getGreeting().getFirstName() + ' ' + call.request.getGreeting().getLastName()
    )

    callback(null, greeting)
}
function sum(call, callback){
    var sum_response = new summing.SumResponse()

    sum_response.setSumResult(
        call.request.getAddendOne() + call.request.getAddendTwo()
    )

    callback(null, sum_response)
}

function main() {
    var server = new grpc.Server()
    server.addService(service.GreetServiceService, {greet: greet})
    server.addService(sum_service.SumServiceService, {sum: sum})

    server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure())
    server.start()

    console.log('Server running on port 50051')
}
main()
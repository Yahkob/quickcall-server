// to connect voice calls, we are relying on the Plivo API and its Nodejs library
// for more details: https://github.com/plivo/plivo-examples-node

var plivo = require('plivo');

// this is required to make requests to plivo
// the auth pair is tied to the user's account and remaining $ credit
// so plivo will handle the payment instead of us
var initializePlivo = function(req) {
    var credentials = {
        authId: req.body.authId || req.query.authId,
        authToken: req.body.authToken || req.query.authToken
    };
    return plivo.RestAPI(credentials);
};

// calling the app user's number (src)
// when a call is connected, plivo will make a GET request to answer_url (callback)
// expecting an xml instruction to call the app user's friend (dst)
// the from property in params obj is where you set the callerID
// check https://www.plivo.com/docs/api/call/
exports.callSrcNum = function(req, res) {
    var params = {
        from: req.body.src,
        to: req.body.src,
        answer_url: "quickcallserver.azurewebsites.net/xml-response?dst=" + req.body.dst
    };
    var p = initializePlivo(req);
    p.make_call(params, function(status, response) {
        res.send(status, response);
    });
};

// this will generate an xml doc which tells plivo to call the app user's friend (dst)
// check https://www.plivo.com/docs/xml/
exports.callDstNum = function(req, res) {
    var r = new plivo.Response();
    var dialElement = r.addDial();
    dialElement.addNumber(req.body.dst);
    res.send(200, r.toXML());
};

// this is needed to fetch our user account details from Plivo
// check https://www.plivo.com/docs/api/account/
exports.getAccountDetails = function(req, res) {
    var p = initializePlivo(req);
    p.get_account({}, function(status, response) {
        res.send(status, response);
    });
};


// future roadmap if you were to add an SMS functionality
// exports.sendSMS = function(req, res){
//     var params = {};
// };

// exports.receive = function(req, res){
//     var params = {};
// };

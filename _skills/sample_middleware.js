module.exports = function(controller) {

     controller.middleware.receive.use(function(bot, message, next) {
    
    console.log(message.callback_id);
         // do something...
         console.log('RCVD:', message);
         next();
    
     });
    
    
     controller.middleware.send.use(function(bot, message, next) {
    
    console.log(message.callback_id);
         // do something...
         console.log('SEND:', message);
         next();
    
     });

}

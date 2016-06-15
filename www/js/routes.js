angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('principal', {
    url: '/principal',
     cache: false,
    templateUrl: 'templates/principal.html',
    controller: 'principalCtrl'
  })

  .state('registro', {
    url: '/registro:TipoCadastro1:TipoCadastro2:TipoCadastro3:version:ContinuaRegistro',
    templateUrl: 'templates/registro.html',
    controller: 'registroCtrl'
  })

  .state('endereco', {
    url: '/endereco:cep',
    templateUrl: 'templates/endereco.html',
    controller: 'enderecoCtrl'
  })

  .state('consultar', {
    url: '/consultar:version',
     cache: false,
    templateUrl: 'templates/consultar.html',
    controller: 'consultarCtrl'
  })

  .state('sucesso', {
    url: '/sucesso:mensagem',
     cache: false,
    templateUrl: 'templates/sucesso.html',
    controller: 'sucessoCtrl'
  })

  .state('sincronizar', {
    url: '/sincronizar',
    cache: false,
    templateUrl: 'templates/sincronizar.html',
    controller: 'principalCtrl'
  })

   .state('termos', {
    url: '/termos',
    templateUrl: 'templates/termos.html',
    controller: 'termosCtrl'
  })

$urlRouterProvider.otherwise('/principal')

  

});
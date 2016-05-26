angular.module('app.controllers', [])
  
.controller('principalCtrl', function($scope,$state) {

    $scope.registro  = {
    	tipo1: 0,
    	tipo2: 0,
    	tipo3: 0
    }
 
    $scope.goRegistro = function(){
		    $state.go('registro', {TipoCadastro1: $scope.registro.tipo1,TipoCadastro2: $scope.registro.tipo2,TipoCadastro3: $scope.registro.tipo3});
	}   
    $scope.goConsultar = function(){
            $state.go('consultar');
    }  
 
   
})
   
.controller('registroCtrl', function($scope,$stateParams,$state, $http,registroService) {

	$scope.rand = Math.floor((Math.random() * 999999999999) + 1);

      $scope.registro = {
        id : $scope.rand,
        tipo1: $stateParams.TipoCadastro1,
        tipo2: $stateParams.TipoCadastro2,
        tipo3: $stateParams.TipoCadastro3,
        nome: '',
        email : '',
        cpf : '',
        ip: '',
        cep: '',
        data_nascimento: '',
        ddd: '',
        celular: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
    };  


    $.ajax({
              type: "GET",
              dataType: 'json',
              url: "http://ipv4.myexternalip.com/json",
              success: function( data ) {

                        $scope.$apply(function () {
                        $scope.registro.ip = data.ip;
                });
                }
    });
  
  $scope.ContinuaRegistro = function(form) {
        registroService.setRegistro($scope.registro);
        $state.go('endereco', {cep: $scope.registro.cep});
  };  


})
   
.controller('enderecoCtrl', function($scope,$stateParams,$state, $http,registroService,  $ionicLoading,$ionicPopup) {

    $scope.registro = registroService.getRegistro();

      $scope.showAlert = function(title,msg) {
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: msg
           });
    };


    $scope.BuscaCEP = function(form) {
        $ionicLoading.show({
          template: 'Aguarde...'
        });
           $.ajax({
              type: "GET",
              dataType: 'json',
              url: "https://viacep.com.br/ws/"+$scope.registro.cep+"/json/",
               statusCode: {
                400: function(msg) { $scope.showAlert('CEP inválido','Confira o número digitado.'); $ionicLoading.hide(); } // Bad Request
                ,404: function(msg) { $scope.showAlert('CEP inválido','Confira o número digitado.'); $ionicLoading.hide() } // Not Found
              },
                success: function( data ) {
                        $scope.$apply(function () {
                        $scope.registro.endereco = data.logradouro;
                        $scope.registro.numero = '';
                        $scope.registro.numero = data.numero;
                        $scope.registro.complemento = '';
                        $scope.registro.bairro = data.bairro;
                        $scope.registro.cidade = data.localidade;
                        $scope.registro.uf = data.uf;
                        $ionicLoading.hide()
                });
                }
            });
      };
  $scope.getFormattedDate = function(date) {
      var year = date.getFullYear();
      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;
      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      return year + '-' + month + '-' + day;
    }
  $scope.ToCommaJson = function(json){
       return res = $.map(json,function(data){ return data;});
    }
    $scope.efetuaRegistro = function(form) {
        $ionicLoading.show({
          template: 'Aguarde...'
        });
         $.ajax({
            type: "POST",
            data: {
                'tipo[0]': $scope.registro.tipo1,
                'tipo[1]': $scope.registro.tipo2,
                'tipo[2]': $scope.registro.tipo3,
                nome: $scope.registro.nome,
                email : $scope.registro.email,
                cpf : $scope.registro.cpf,
                ip: $scope.registro.ip,
                cep: $scope.registro.cep,
                data_nascimento:  $scope.getFormattedDate($scope.registro.data_nascimento),
                celular_ddd: $scope.registro.ddd,
                celular_numero: $scope.registro.celular,
                endereco: $scope.registro.endereco,
                numero: $scope.registro.numero,
                complemento: $scope.registro.complemento,
                bairro: $scope.registro.bairro,
                cidade: $scope.registro.cidade,
                uf: $scope.registro.uf,
            },
            dataType: 'json',
            url: "http://www.hunchway.com.br/api/client",
            statusCode: {
                400: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $ionicLoading.hide() },
                503: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $ionicLoading.hide() },
                500: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $ionicLoading.hide() },
                404: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $ionicLoading.hide() },
                412: function(msg) { var msg = JSON.parse(msg.responseText); $scope.showAlert('Falha na operação',$scope.ToCommaJson(msg)); $ionicLoading.hide(); },
              },
            success: function( data ) {
                $state.go('sucesso');
                $ionicLoading.hide()
                
            }
        });
    }

    $scope.BuscaCEP();
})
   
.controller('consultarCtrl', function($scope,$stateParams,$state, $http, $ionicLoading, $ionicPopup) {

     $scope.showAlert = function(title,msg) {
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: msg
           });
    };


    $scope.rand = Math.floor((Math.random() * 999999999999) + 1);

    $scope.registro = {
        email : '',
        cpf : '',
        ip: '',
    };  

    $scope.resultado = 'vazio';

    $scope.ToCommaJson = function(json){
       return res = $.map(json,function(data){ return data;});
    }

    $scope.consultarCadastro = function(form) {
          $ionicLoading.show({
          template: 'Consultando...'
        });

         $.ajax({
              type: "GET",
              dataType: 'json',
              url: "http://ipv4.myexternalip.com/json",
              success: function( data ) {
                        $scope.$apply(function () {
                        $scope.registro.ip = data.ip;
                        });
                        $.ajax({
                            type: "POST",
                            data: {
                                email : $scope.registro.email,
                                cpf : $scope.registro.cpf,
                                ip: $scope.registro.ip
                            },
                            dataType: 'json',
                            url: "http://www.hunchway.com.br/api/login",
                            statusCode: {
                                400: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $ionicLoading.hide() },
                                503: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $ionicLoading.hide() },
                                500: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $ionicLoading.hide() },
                                404: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $ionicLoading.hide() },
                                412: function(msg) {  var msg = JSON.parse(msg.responseText); $scope.showAlert('Falha na operação',$scope.ToCommaJson(msg)); $ionicLoading.hide(); }
                              },
                            success: function( data ) {
                                $ionicLoading.hide();
                                if(data.sucesso_login){
                                    $state.go('sucesso', {mensagem: data.sucesso_login.mensagem});
                                }
                            }
                        });
                },
            error: function(data){

            }
        });

        $http.post("http://www.hunchway.com.br/api/login", {
            'email': $scope.registro.email,
            'cpf': $scope.registro.cpf,
            'ip': $scope.registro.ip
        }).then(function(response){
            $scope.resultado = JSON.stringify(response);
            $scope.goConsultar = function(){
                    $state.go('sucesso');
            }  
        }, function(response){
            $scope.resultado = JSON.stringify(response);
        });
    };  

     $scope.goHome = function(){
            $state.go('principal');
    }  
})
   
.controller('sucessoCtrl', function($scope, $stateParams, $state) {
    $scope.mensagem = $stateParams.mensagem;
})
 
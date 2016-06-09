angular.module('app.controllers', [])
  
.controller('principalCtrl', function($scope,$state,  $ionicPopup, $ionicActionSheet,  $timeout) {
localStorage.removeItem('ContinuaRegistro');
  $scope.CloseApp = function(){
      if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
      }
  }

 $scope.AtualizaOffline = function(id,res){
        $scope.registros_offline_local = localStorage.getItem('registros');
        $scope.registros_offline = JSON.parse($scope.registros_offline_local);

      if(res=='excluir'){
          delete $scope.registros_offline[id];
          localStorage.setItem('registros', JSON.stringify($scope.registros_offline));
           $scope.registros_offline_local = localStorage.getItem('registros');
        $scope.registros_offline = JSON.parse($scope.registros_offline_local);
      } 
      registroService.setRegistro($scope.registro);
    }
   // Triggered on a button click, or some other target
 $scope.show = function(reg_id) {
   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Sincronizar' }
     ],
     destructiveText: 'EXCLUIR',
     cancelText: 'CANCELAR',
     cancel: function() {
          return false;
        },
     buttonClicked: function(index) {
       localStorage.setItem('ContinuaRegistro',reg_id);
        $state.go('registro');
       return true;
     },
     destructiveButtonClicked: function(index) {
       $scope.AtualizaOffline(reg_id,'excluir');
        
       $('#'+reg_id).fadeOut(500, function(){
         hideSheet();

       });
     }
   });

   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 5000);

 };

    $scope.registros_offline_local = localStorage.getItem('registros');
    if($scope.registros_offline_local){
     $scope.registros_offline = JSON.parse($scope.registros_offline_local );
    }
    
      if(!$scope.registros_offline){
          localStorage.setItem('registros','{}');   
      }


   $scope.showAlert = function(title,msg) {
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: msg
           });
    };

      document.addEventListener("offline", onOffline, false);
      function onOffline() {
         $scope.showAlert('Sem conexão com a internet', ' Você poderá sincronizar seus dados posteriormente quando houver conexão disponível.');
      }

   

    $scope.registro  = {
    	tipo1: 0,
    	tipo2: 0,
    	tipo3: 0
    }
    $scope.prosseguir = false;
    $scope.check = function(){

      if(($scope.registro.tipo1) || ($scope.registro.tipo2) || ($scope.registro.tipo3)) {
        $scope.prosseguir = 1;
      } else {
        $scope.prosseguir = 0;
      }
    }
 
    $scope.goRegistro = function(){
        if($scope.prosseguir){
		      $state.go('registro', {TipoCadastro1: $scope.registro.tipo1,TipoCadastro2: $scope.registro.tipo2,TipoCadastro3: $scope.registro.tipo3});
        } else {
          $scope.showAlert('Erro','Selecione um ou mais tipos de cadastro'); 
        }
	}   

    $scope.goConsultar = function(){
            $state.go('consultar');
    }  
 
   
})
   
.controller('registroCtrl', function($scope,$stateParams,$state, $http,registroService) {
  if(localStorage.getItem('ContinuaRegistro')){

      $scope.registros_offline_local = localStorage.getItem('registros');
      $scope.registros_offline = JSON.parse($scope.registros_offline_local );
      $scope.registro_continuar = localStorage.getItem('ContinuaRegistro');
      $scope.registro = $scope.registros_offline[$scope.registro_continuar];

  } else {
	$scope.rand = Math.floor((Math.random() * 999999999999) + 1);

      $scope.registro = {
        id : $scope.rand,
        tipo1: $stateParams.TipoCadastro1,
        tipo2: $stateParams.TipoCadastro2,
        tipo3: $stateParams.TipoCadastro3,
        nome: '',
        email : '',
        cpf : '',
        ip: '192.168.0.1',
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
  }


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
         $ionicLoading.hide();
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: msg
           },
           $('#end_numero').trigger('focus')
           );
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
                400: function(msg) { $scope.showAlert('CEP não encontrado','Confira o cep ou preencha manualmente o endereço.'); $ionicLoading.hide(); } // Bad Request
                ,404: function(msg) { $scope.showAlert('CEP não encontrado','Confira o cep ou preencha manualmente o endereço.'); $ionicLoading.hide(); } // Not Found
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
                },
                error: function( data ) {
                     $scope.showAlert('CEP não encontrado','Confira o cep ou preencha manualmente o endereço.'); $ionicLoading.hide()
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
       var res = $.map(json,function(data){ return data.toString().replace(',', '<br/>'); });
       return res;
    }



    $scope.GuardaOffline = function(){
       $scope.registros_offline_local = localStorage.getItem('registros');
    if(!$scope.registros_offline_local){
     $scope.registros_offline = {};
    } else {
      $scope.registros_offline = JSON.parse($scope.registros_offline_local );
    }
     
        $scope.registros_offline[$scope.registro.id] = $scope.registro;
        localStorage.setItem('registros', JSON.stringify($scope.registros_offline));
        $state.go('sincronizar');
        registroService.setRegistro($scope.registro);
        $ionicLoading.hide();
    }
    $scope.AtualizaOffline = function(id,res){
        $scope.registros_offline_local = localStorage.getItem('registros');
        $scope.registros_offline = JSON.parse($scope.registros_offline_local);

      if(res=='excluir'){
          delete $scope.registros_offline[id];
          localStorage.setItem('registros', JSON.stringify($scope.registros_offline));

      } 
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
                data_nascimento:  $scope.registro.data_nascimento,
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
                400: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $scope.GuardaOffline(); },
                503: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $scope.GuardaOffline(); },
                500: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $scope.GuardaOffline(); },
                404: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente');  $scope.GuardaOffline(); },
                412: function(msg) {  var msg = JSON.parse(msg.responseText); $scope.showAlert('Falha na operação',$scope.ToCommaJson(msg));  $scope.GuardaOffline(); }
              },
            success: function( data ) {
                $scope.registros_offline_local = localStorage.getItem('registros');
                if($scope.registros_offline_local){
                    $scope.AtualizaOffline($scope.registro.id,'excluir');
                }
                $ionicLoading.hide();
                $scope.registro = {
                      id : '',
                      tipo1: $stateParams.TipoCadastro1,
                      tipo2: $stateParams.TipoCadastro2,
                      tipo3: $stateParams.TipoCadastro3,
                      nome: '',
                      email : '',
                      cpf : '',
                      ip: '192.168.0.1',
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
                 $state.go('sucesso', {mensagem: data.cadastro_sucesso.mensagem});
                 registroService.setRegistro($scope.registro);

                
            },
            timeout: 10000,
            error: function(jqXHR, textStatus, errorThrown) {
              if(textStatus=='timeout'){
                $scope.showAlert('Tempo excedido','Esgotado o tempo limite, tente novamente mais tarde.');  $scope.GuardaOffline();
              } else {
                $scope.showAlert('Sem conexão','Os dados serão armazenados e poderão ser sincronizados quando houver conexão');  $scope.GuardaOffline();
              }
            }

        });
    }
    if(!$scope.registro.endereco){
      $scope.BuscaCEP();
    }
})
   
.controller('consultarCtrl', function($scope,$stateParams,$state, $http, $ionicLoading, $ionicPopup) {

     $scope.showAlert = function(title,msg) {
      $ionicLoading.hide()
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: msg
           });
    };

    document.addEventListener("offline", onOffline, false);
      function onOffline() {
         $scope.showAlert('Sem conexão com a internet', 'A consulta só está disponível quando há conexão com a internet.');
         $scope.desativado = true;
    }

    $scope.rand = Math.floor((Math.random() * 999999999999) + 1);

    $scope.registro = {
        email : '',
        cpf : '',
        ip: '',
    };  

    $scope.resultado = 'vazio';

    $scope.ToCommaJson = function(json){
       var res = $.map(json,function(data){ return data.toString().replace(',', '<br/>'); });
       return res;
    }

    $scope.consultarCadastro = function(form) {

      document.addEventListener("offline", onOffline, false);
      function onOffline() {
         $scope.showAlert('Sem conexão com a internet', 'A consulta só está disponível quando há conexão com a internet.');
         $scope.desativado = true;
         $state.go('principal');
      }
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
                                400: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente'); },
                                503: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente'); },
                                500: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente'); },
                                404: function(msg) { $scope.showAlert('Falha na conexao','Tente novamente'); },
                                412: function(msg) {  var msg = JSON.parse(msg.responseText); $scope.showAlert('Falha na operação',$scope.ToCommaJson(msg)); }
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
                 onOffline();

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

.controller('termosCtrl', function($scope, $stateParams, $state,$http,$ionicLoading) {
     $ionicLoading.show({
          template: 'Carregando...'
        });

    $.ajax({
              type: "GET",
              dataType: 'json',
              url: "http://www.hunchway.com.br/api/termos",
              success: function( data ) {
                $ionicLoading.hide()
                        $scope.$apply(function () {
                        $scope.mensagem = data.termos;
              });
              },
              error: function(data){
                $ionicLoading.hide()
                  $scope.$apply(function () {
                        $scope.mensagem = "Falha na conexão.";
              });
              }

    
})
})
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives','ui.mask','ionic-datepicker'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    navigator.splashscreen.hide();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if (!localStorage.getItem('shortcut')) {
    window.plugins.Shortcut.CreateShortcut("Hunch Way", successfunc, failfunc);
    localStorage.setItem('shortcut', true);
    function successfunc(){
      alert('Atalho adicionado a tela inicial')
    }
    function failfunc(){
       alert('Falha ao criar atalho. Adicione manualmente.')
    }
}

    document.addEventListener('focusout', function(e) {window.scrollTo(0, 0)});
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  
  });
}).config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'OK',
      todayLabel: 'Hoje',
      closeLabel: 'Fechar',
      mondayFirst: false,
      weeksList: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthsList: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      templateType: 'popup',
      showTodayButton: false,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })
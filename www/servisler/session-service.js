app.factory('Session', function() {
    var Session = {
        data : {
            girisYapildi : false,
            kullanici : {}
        },
        kullaniciEkle : function (kullanici){
            Session.data.kullanici = kullanici;
            console.log(Session.data.kullanici);
        },
        girisYap : function (){
            Session.data.girisYapildi = true;
        },
        cikisYap : function (){
            Session.data.girisYapildi = false;
            Session.data.kullanici = null;
        }
    };
    return Session;
});
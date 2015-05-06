var name;

window.fbAsyncInit = function() {
  FB.init({
    appId      : '907409189299120',
    xfbml      : true,
    version    : 'v2.2'
  });
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  if (response.status === 'connected') {
    console.log("success");
  } else if (response.status === 'not_authorized') {
    document.getElementById('message').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    document.getElementById('message').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}

function getName() {
  FB.api('me/', function(response) {
    name = response.first_name;

  });
}